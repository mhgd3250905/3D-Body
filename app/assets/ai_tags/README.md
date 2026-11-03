# Coach QA AI action tags (unreviewed draft)

`actions.json` is an ID-keyed map of the 249 original Pose-Hub tag JSON objects at commit `5d17c24af859d905dbbdee4b1d623b99881ac618`, branch `codex/ai-action-tags`, [Draft PR #26](https://github.com/mhgd3250905/3D-Pose-Hub/pull/26). It is passed to SDK `CoachQaAgent(aiTags: ...)`.

Every source object keeps its original fields and `status: ai-draft`. These labels have not been reviewed or approved by a human; this import does not establish safety, exercise QA or production-release approval. No source tag value was edited, inferred or regenerated. JSON formatting was normalized only to combine objects into the ID-keyed map.

`provenance.json` records the fixed source and SHA-256 of every original file, the combined asset hash, and scope coverage. The Flare authorization list remains 211 IDs: 209 have matching tags; `h-sleeper-stretch` and `scapular-C` have no tag in this snapshot and use the SDK catalog fallback. Other imported IDs cannot expand Flare's authorized scope.

Original source files are retained in the ignored local read-only export under `output/qa070-20261104/tags-source/`. The working Pose-Hub repository and upstream branch were not changed.
