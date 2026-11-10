import re,json,sys
s=open('wset3.html').read()
B=json.loads(re.search(r'const BANK = (\[.*?\]);\n',s,re.S).group(1).replace('<\\/','</'))
P=open('book.txt').read().split('\f')
lo,hi=int(sys.argv[1]),int(sys.argv[2])
for pg in range(lo,hi+1):
    t=re.sub(r'\n{2,}','\n',P[pg+8])
    print(f'===== PAGE {pg}\n{t}')
    print('--- existing questions:')
    for b in B:
        if b['p']==pg: print(' *', b['q'][2], '=>', b['o'][0][2])
