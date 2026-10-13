# Before/after groin close-up sheet for the crotch-smooth change.
# python3 compare-sheet.py <closeups_dir with before/ after/> <out.png> [font.ttc]
import sys,os
from PIL import Image,ImageDraw,ImageFont
D,OUT=sys.argv[1],sys.argv[2];FONT=sys.argv[3] if len(sys.argv)>3 else '/workspace/work/pw/fonts/NotoSansCJK-Regular.ttc'
frames=[76,136,190,196];views=[('cam','视频机位'),('front0','骨盆正前方'),('gap30','两腿之间·偏前 30°'),('gap0','两腿之间(裆部正对)')]
straddle={76:'102.6°',136:'83.3°',190:'100.8°',196:'102.5°'}
T=300;LW=150;HH=56;GAP=10
f1=ImageFont.truetype(FONT,26);f2=ImageFont.truetype(FONT,20);f3=ImageFont.truetype(FONT,30)
W=LW+len(views)*T;H=70+HH+len(frames)*(2*T+GAP)
im=Image.new('RGB',(W,H),'#101114');d=ImageDraw.Draw(im)
d.text((16,16),'裆部平滑：改前 / 改后（同一帧、同一机位、同一光照，动作数据不变）',font=f3,fill='#f2f2f2')
for j,(k,lab) in enumerate(views):d.text((LW+j*T+12,70+12),lab,font=f2,fill='#cfcfcf')
y=70+HH
for f in frames:
  for r,(sub,lab,col) in enumerate([('before','改前','#d98c6a'),('after','改后','#7fd3a0')]):
    for j,(k,_) in enumerate(views):
      p=os.path.join(D,sub,f'{k}-{f:04d}.png');im.paste(Image.open(p).convert('RGB').resize((T,T),Image.LANCZOS),(LW+j*T,y+r*T))
    d.text((14,y+r*T+T//2-40),f'第 {f} 帧',font=f2,fill='#9a9a9a');d.text((14,y+r*T+T//2-12),lab,font=f1,fill=col)
    if r==0:d.text((14,y+T//2+22),'劈腿 '+straddle[f],font=f2,fill='#9a9a9a')
  d.line([(0,y+2*T+GAP//2),(W,y+2*T+GAP//2)],fill='#2a2b30',width=2);y+=2*T+GAP
im.save(OUT);print(OUT,im.size)
