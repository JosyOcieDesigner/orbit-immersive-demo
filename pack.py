# Pack frame WebPs into a few bundle files (bytes copied unchanged) + index.json with offsets.
# Bundle order follows the page's progressive load order (coarse pass first, then gaps).
import json, os, sys
src, out, count, per = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
order=[count-1]; seen={count-1}
for step in [32,16,8,4,2,1]:
    for i in range(0,count,step):
        if i not in seen: seen.add(i); order.append(i)
os.makedirs(out, exist_ok=True)
index={'count':count,'bundles':[],'frames':[None]*count}
for b in range(0,len(order),per):
    name=f'pack-{b//per:02d}.bin'; off=0
    with open(os.path.join(out,name),'wb') as fh:
        for i in order[b:b+per]:
            data=open(os.path.join(src,f'{i+1:03d}.webp'),'rb').read()
            fh.write(data); index['frames'][i]=[b//per,off,len(data)]; off+=len(data)
    index['bundles'].append(name)
json.dump(index,open(os.path.join(out,'index.json'),'w'),separators=(',',':'))
print(out,len(index['bundles']),'bundles')
