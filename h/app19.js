/* ---------- v101: progress read from the cloud arrives frozen (read-only) — always work on copies so answers, fixed mistakes, chats and maps really update ---------- */
const dcl19=x=>x==null?x:JSON.parse(JSON.stringify(x));
{ const _m19=merge; merge=function(a,b){ return dcl19(_m19(dcl19(a),dcl19(b))); }; }
{ const _r19=record; record=function(id){ try{
    if(Object.isFrozen(P)) P=dcl19(P);
    if(Object.isFrozen(P.q)) P.q=Object.assign({},P.q);
    if(Object.isFrozen(P.e)) P.e=Object.assign({},P.e);
    if(Object.isFrozen(P.s)) P.s=P.s.slice();
    if(P.q[id]&&Object.isFrozen(P.q[id])) P.q[id]=P.q[id].slice();
    if(P.e[id]&&Object.isFrozen(P.e[id])) P.e[id]=Object.assign({},P.e[id]);
  }catch(e){} return _r19.apply(this,arguments); }; }
