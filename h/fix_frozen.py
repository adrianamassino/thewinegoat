s=open('wset3.html').read()
a="const r=snap.data();"; b="const r=dcl19(snap.data());"
c="snap.docs.forEach(d=>{const x=d.data();"; d="snap.docs.forEach(d=>{const x=dcl19(d.data());"
assert s.count(a)==1 and s.count(c)==1, (s.count(a),s.count(c))
s=s.replace(a,b).replace(c,d)
open('wset3.html','w').write(s); print("frozen fix ok")
