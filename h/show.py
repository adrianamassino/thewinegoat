import re,json,sys
s=open('wset3.html').read()
B=json.loads(re.search(r'const BANK = (\[.*?\]);\n',s,re.S).group(1).replace('<\\/','</'))
pages=open('book.txt').read().split('\f')
p0,p1=int(sys.argv[1]),int(sys.argv[2])
mode=sys.argv[3] if len(sys.argv)>3 else 'both'
if mode in('both','book'):
  for p in range(p0,p1+1):
    t=pages[p+8]; t=re.sub(r'\n{2,}','\n',t)
    print('######## PAGE',p); print(t)
if mode in('both','q'):
  print('######## EXISTING QUESTIONS')
  for b in B:
    if p0<=b['p']<=p1: print(b['p'],b['c'],'H' if b.get('h') else '','|',b['q'][2],'=>',b['o'][0][2])
