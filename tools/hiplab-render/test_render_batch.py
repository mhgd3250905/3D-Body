"""CPU-only regression tests for immutable batch manifests during prepare.

Run: python -m unittest discover -s tools/hiplab-render -p test_render_batch.py -v
All input/output fixtures live in temporary directories; no Node/GPU is used.
"""
from contextlib import redirect_stdout
import importlib.util
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

from PIL import Image


class PrepareManifestTest(unittest.TestCase):
    INITIAL_COMMIT = "1" * 40
    LATER_TOOLING_COMMIT = "2" * 40

    def setUp(self):
        temporary = tempfile.TemporaryDirectory(prefix="hiplab-prepare-test-")
        self.addCleanup(temporary.cleanup)
        self.directory = Path(temporary.name).resolve()
        self.repo = self.directory / "fake-repo"
        self.root = self.repo / "tools/drill-anim"
        self.app = self.directory / "fake-app"
        self.output = self.directory / "batch"
        self.spec = self.root / "specs/test-drill.js"
        self.spec.parent.mkdir(parents=True)
        self.spec.write_text("export default {id:'test-drill'};\n", encoding="utf-8")
        (self.root / "config.json").write_text("{}\n", encoding="utf-8")
        assets = self.app / "assets/hip"
        assets.mkdir(parents=True)
        Image.new("RGB", (4, 4), (40, 90, 150)).save(assets / "poster.png")
        (assets / "hip-content.json").write_text(json.dumps({"drills": [{
            "id": "test-drill", "media": {"status": "poster", "poster": "assets/hip/poster.png"}
        }]}), encoding="utf-8")
        module_spec = importlib.util.spec_from_file_location(
            "render_batch_under_test", Path(__file__).with_name("render_batch.py"))
        self.renderer = importlib.util.module_from_spec(module_spec)
        module_spec.loader.exec_module(self.renderer)
        self.manifest = self.output / "source-manifest.json"

    def prepare(self, *arguments, commit=INITIAL_COMMIT):
        argv = ["render_batch.py", "prepare", "--app", str(self.app), "--output", str(self.output), *arguments]
        with (patch.object(self.renderer, "ROOT", self.root),
              patch.object(self.renderer, "REPO", self.repo),
              patch.object(sys, "argv", argv),
              patch.object(self.renderer.subprocess, "check_output", return_value=commit + "\n") as git,
              patch.object(self.renderer.subprocess, "run", side_effect=AssertionError("prepare must not run external commands")),
              patch.object(self.renderer.subprocess, "Popen", side_effect=AssertionError("prepare must not start processes")),
              redirect_stdout(io.StringIO())):
            self.renderer.main()
            git.assert_called_once_with(["git", "rev-parse", "HEAD"], cwd=self.repo, text=True)

    def test_equivalent_manifest_keeps_exact_bytes_and_original_commit(self):
        self.prepare()
        manifest = json.loads(self.manifest.read_text(encoding="utf-8"))
        self.assertEqual(manifest["source_commit"], self.INITIAL_COMMIT)
        # Same JSON meaning, but different whitespace, key order and numeric
        # spelling. Re-serializing it would break a consumer's input SHA.
        manifest["pixel_ratio"] = 2.0
        preserved = (" \n" + json.dumps(manifest, indent="\t", sort_keys=True) + "\n\n").encode("utf-8")
        self.manifest.write_bytes(preserved)
        overlay_path = self.output / "specs/test-drill.js"
        overlay_before = overlay_path.read_bytes()

        self.prepare("--pr", "2", commit=self.LATER_TOOLING_COMMIT)

        self.assertEqual(self.manifest.read_bytes(), preserved)
        self.assertEqual(json.loads(self.manifest.read_bytes())["source_commit"], self.INITIAL_COMMIT)
        self.assertEqual(overlay_path.read_bytes(), overlay_before)
        self.assertTrue((self.output / "references/test-drill.png").is_file())
        # Also exercise argparse's integer default against the saved 2.0.
        self.prepare(commit=self.LATER_TOOLING_COMMIT)
        self.assertEqual(self.manifest.read_bytes(), preserved)

    def test_changed_source_requires_new_batch_and_preserves_manifest(self):
        self.prepare()
        preserved = self.manifest.read_bytes()
        self.spec.write_text("export default {id:'test-drill', changed:true};\n", encoding="utf-8")

        with self.assertRaisesRegex(RuntimeError, "Batch source/recipe changed.*new output directory"):
            self.prepare(commit=self.LATER_TOOLING_COMMIT)

        self.assertEqual(self.manifest.read_bytes(), preserved)

    def test_changed_pixel_ratio_requires_new_batch_and_preserves_manifest(self):
        self.prepare()
        preserved = self.manifest.read_bytes()

        with self.assertRaisesRegex(RuntimeError, "Batch source/recipe changed.*new output directory"):
            self.prepare("--pr", "1.4", commit=self.LATER_TOOLING_COMMIT)

        self.assertEqual(self.manifest.read_bytes(), preserved)


if __name__ == "__main__":
    unittest.main()
