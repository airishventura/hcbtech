import pathlib,hashlib,json,shutil
from PIL import Image
import argparse,zipfile,tempfile
parser=argparse.ArgumentParser(description="Import supplied HCBTECH assets without duplicate photos")
parser.add_argument('archive',type=pathlib.Path)
args=parser.parse_args()
root=pathlib.Path(__file__).resolve().parents[1]
temporary=tempfile.TemporaryDirectory()
unpack=pathlib.Path(temporary.name)
with zipfile.ZipFile(args.archive) as archive:
 for item in archive.infolist():
  if not (unpack/item.filename).resolve().is_relative_to(unpack.resolve()):
   raise ValueError('Unsafe archive path')
 archive.extractall(unpack)
source=unpack/'wa hcb' 
groups={'shell-peeler':[1,3,5,6,17,18,19,20,21,22,29,34,36,37,38,43,44,49],'coconut-grater':[2,8,23,24,28,31,35,39,40,41,42,45,46,47,48,50],'coconut-milk-press':[4,11,12,13,32,33],'rollers-and-parts':[25,26,27],'workshop':[7,9,10,30],'cabinet-unidentified':[14,15,16]}
manifest=[]
for group,nums in groups.items():
 for n in nums:
  files=sorted(source.glob(f'photo_{n}_*.jpg'));p=files[0];data=p.read_bytes();digest=hashlib.sha256(data).hexdigest()
  assert len(files)==2 and all(hashlib.sha256(f.read_bytes()).hexdigest()==digest for f in files)
  dest=root/f'assets/reference/{group}/photo-{n:02d}.jpg';dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)
  im=Image.open(p)
  manifest.append({'id':f'photo-{n:02d}','group':group,'classification':'visual-inference','exactModel':None,'path':str(dest.relative_to(root)),'sha256':digest,'width':im.width,'height':im.height,'sourceFiles':[f.name for f in files]})
for name,folder in [('logo_hcbtech.jpeg','brand'),('hcb_pricelist.jpeg','pricelist')]:
 dest=root/f'assets/reference/{folder}/{name}';dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(source/name,dest)
 manifest.append({'id':folder,'group':folder,'classification':'owner-supplied','path':str(dest.relative_to(root)),'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'sourceFiles':[name]})
(root/'assets/manifest.json').write_text(json.dumps({'sourceArchive':'wa hcb.zip','sourceFileCount':102,'uniqueFileCount':52,'duplicatePhotoCount':50,'assets':manifest},indent=2)+'\n')
# Web derivatives preserve full frame and aspect ratio. Unmodified JPEGs are above.
for n in [4,6,9,12,29,32,36,39,45,47]:
 p=next(source.glob(f'photo_{n}_*.jpg'));dest=root/f'public/images/products/photo-{n:02d}.webp';dest.parent.mkdir(parents=True,exist_ok=True);im=Image.open(p);im.save(dest,'WEBP',quality=82)
p=root/'public/brand/hcbtech.webp';Image.open(source/'logo_hcbtech.jpeg').save(p,'WEBP',quality=88)
temporary.cleanup()
print('Imported 52 unique assets; 50 duplicate photo copies excluded.')
