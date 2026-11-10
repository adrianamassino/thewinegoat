import json,re
DROP={"643092b","dac96f9","5c2898d","5f7fb00"}
s=open('wset3.html').read()
i=s.index('const BANK = ['); j=s.index('\n',i)
line=s[i:j]; arr=line[len('const BANK = '):].rstrip().rstrip(';')
B=json.loads(arr); n=len(B); B=[b for b in B if b['id'] not in DROP]
s=s[:i]+'const BANK = '+json.dumps(B,ensure_ascii=False,separators=(',',':'))+';'+s[j:]
open('wset3.html','w').write(s); print("dropped",n-len(B))
