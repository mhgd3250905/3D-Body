"""Independent standard ZIPs below the Drive connector's 100 MiB upload limit.

Copies the completed green batch; never changes media or the original full ZIP.
Each ZIP has its own dimension-specific offline gallery and actual file hashes.
"""
from pathlib import Path
import hashlib
import json
import shutil
import zipfile

repo = Path(__file__).resolve().parents[3]
source = repo / 'output/app51-greenscreen-20261014'
output = repo / 'output/app51-greenscreen-drive-20261014'
assert source.is_dir() and not output.exists(), 'Use a new packaging directory'
output.mkdir()
original = json.loads((source/'package-manifest.json').read_text(encoding='utf-8'))
delivery = json.loads((source/'delivery-manifest.json').read_text(encoding='utf-8'))
assert len(delivery['actions']) == 51

def sha(p):
    with p.open('rb') as f:
        return hashlib.file_digest(f, 'sha256').hexdigest()

receipts = []
for key, dimension, omitted in [('master',1080,'mobile'),('mobile',720,'master')]:
    name = f'App51-Greenscreen-{dimension}-20261014'
    target = output/name
    target.mkdir()
    for entry in original['files']:
        rel = entry['path']
        if rel.startswith('media/'+omitted+'/') or rel in ['index.html','README.md','delivery-manifest.json']:
            continue
        src, dst = source/rel, target/rel
        assert sha(src) == entry['sha256'], ('Original batch drift',rel)
        dst.parent.mkdir(parents=True,exist_ok=True)
        shutil.copyfile(src,dst)
    catalog = json.loads(json.dumps(delivery))
    for item in catalog['actions']:
        item['media'] = {k:v for k,v in item['media'].items() if k != omitted}
    catalog['packagingVariant'] = {'dimension':dimension,'sourceBatch':'app51-greenscreen-20261014','independentOfflinePlayback':True,'sourceFullZipPreserved':True}
    (target/'delivery-manifest.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    html=(source/'index.html').read_text(encoding='utf-8')
    html=html.replace("v.src=a.mobile",f"v.src=a.{key}")
    nav="[['master','下载1080高清'],['mobile','下载720便携']]"
    replacement="[['master','下载1080高清']]" if key=='master' else "[['mobile','下载720便携']]"
    assert nav in html
    html=html.replace(nav,replacement)
    html=html.replace('1080高清版与720便携版均为MP4',f'本包为{dimension}版MP4')
    html=html.replace('App51 · 独立绿幕素材',f'App51 · {dimension}绿幕素材')
    (target/'index.html').write_text(html,encoding='utf-8')
    text=f'# {dimension} 独立绿幕素材包\n\n本包只含51个{dimension}视频和51张封面，可独立解压并打开index.html。视频字节与完整批次一致。原完整120,280,962字节ZIP保留，因上传接口单文件100MiB上限另制两个标准ZIP。另一尺寸在同次备份目录的另一个包中，当前包清单只列实际包含的媒体。\n\n'
    text+=(source/'README.md').read_text(encoding='utf-8')
    (target/'README.md').write_text(text,encoding='utf-8')
    files=[{'path':p.relative_to(target).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p)} for p in sorted(target.rglob('*')) if p.is_file()]
    (target/'SHA256SUMS.txt').write_text(''.join(f"{f['sha256']}  {f['path']}\n" for f in files),encoding='utf-8')
    (target/'package-manifest.json').write_text(json.dumps({'dimension':dimension,'videos':51,'sourceFullPackageManifestSha256':sha(source/'package-manifest.json'),'mediaUnchanged':True,'files':files},indent=2)+'\n',encoding='utf-8')
    archive=output/(name+'.zip')
    with zipfile.ZipFile(archive,'x',zipfile.ZIP_DEFLATED,compresslevel=1) as z:
        for p in sorted(target.rglob('*')):
            if p.is_file():z.write(p,Path(name)/p.relative_to(target))
    assert archive.stat().st_size < 104857600
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        for item in catalog['actions']:
            for media in item['media'].values():
                data=z.read(name+'/'+media['path'])
                assert hashlib.sha256(data).hexdigest()==media['sha256']
    receipts.append({'dimension':dimension,'path':str(archive),'bytes':archive.stat().st_size,'sha256':sha(archive),'md5':hashlib.md5(archive.read_bytes()).hexdigest(),'videos':51,'zipIntegrity':'pass','allIncludedMediaSha256':'pass'})
    print(json.dumps(receipts[-1]),flush=True)
(output/'upload-package-receipts.json').write_text(json.dumps(receipts,indent=2)+'\n',encoding='utf-8')
