"""Spagnolo di Spagna → spagnolo argentino (voseo e vocabolario rioplatense) per le frasi che lo richiedono.
Regole a parola intera; la maiuscola iniziale viene mantenuta. Le eccezioni manuali vanno in es-ar.json."""
import re
IMP={
# imperativi tú → vos (solo a inizio frase o dopo : ; . ! ?)
'practica':'practicá','elige':'elegí','toca':'tocá','escribe':'escribí','selecciona':'seleccioná','haz':'hacé','pulsa':'presioná',
'busca':'buscá','empieza':'empezá','sigue':'seguí','repasa':'repasá','juega':'jugá','encuentra':'encontrá','adivina':'adiviná',
'explora':'explorá','ponte':'ponete','explícame':'explicame','hazme':'haceme','resúmeme':'resumime','relaciónalo':'relacionalo',
'compárala':'comparala','compáralo':'comparalo','rellena':'completá','describe':'describí','compara':'compará','estudia':'estudiá',
'retoma':'retomá','escúchala':'escuchala','dicta':'dictá','empareja':'emparejá','ordena':'ordená','recoge':'juntá',
'revienta':'reventá','atrapa':'agarrá','entrena':'entrená','desliza':'deslizá','abre':'abrí','permite':'permití','rehaz':'rehacé',
'profundiza':'profundizá','mira':'mirá','recuerda':'recordá','piensa':'pensá','fíjate':'fijate',
'imagina':'imaginá','observa':'observá','vuelve':'volvé',
'inténtalo':'intentalo','elígela':'elegila','añade':'agregá','añádelo':'agregalo','activa':'activá','instala':'instalá','crea':'creá',
'consulta':'consultá','sube':'subí','guarda':'guardá','pega':'pegá','completa':'completá','responde':'respondé',
'gira':'girá','memoriza':'memorizá','calcula':'calculá','identifica':'identificá','explica':'explicá','nombra':'nombrá',
'indica':'indicá','justifica':'justificá','razona':'razoná','escoge':'elegí','apunta':'anotá','lee':'leé','asocia':'asociá','arrastra':'arrastrá',}
W={
# presente tú → vos
'tienes':'tenés','puedes':'podés','quieres':'querés','sabes':'sabés','sabías':'sabías','eres':'sos','llevas':'tenés','recibes':'recibís',
'descubres':'descubrís','aguantas':'aguantás','fallas':'fallás','dominas':'dominás',
'encuentras':'encontrás','tocas':'tocás','respondes':'respondés','vuelves':'volvés','repasas':'repasás','necesitas':'necesitás',
'estudias':'estudiás','escribes':'escribís','eliges':'elegís','sigues':'seguís','empiezas':'empezás','juegas':'jugás','aprendes':'aprendés',
'conoces':'conocés','usas':'usás','haces':'hacés','debes':'debés','vas':'vas','das':'das','ves':'ves','olvidas':'olvidás','prefieres':'preferís',
'piensas':'pensás','recuerdas':'recordás','entiendes':'entendés','consigues':'conseguís','pierdes':'perdés','te apetece':'tenés ganas de',
'verás':'vas a ver','tú':'vos',
# vocabolario
'móvil':'celular','ordenador':'computadora','intro':'Enter','mayús':'Shift','coger':'agarrar','zumo':'jugo','piscina':'pileta',
'conducir':'manejar','coche':'auto','gafas':'anteojos',
}
# passato prossimo → passato remoto (uso argentino)
PP={'has respondido':'respondiste','has dominado':'dominaste','has fallado':'fallaste','has hecho':'hiciste','has tocado':'tocaste',
'has acertado':'acertaste','has visto':'viste','has terminado':'terminaste','has completado':'completaste','has conseguido':'conseguiste',
'has guardado':'guardaste','has elegido':'elegiste','has escrito':'escribiste','has empezado':'empezaste','has aprendido':'aprendiste',
'has catado':'cataste','has superado':'superaste','has ganado':'ganaste','has perdido':'perdiste','has encontrado':'encontraste',
'has olvidado':'olvidaste','has repasado':'repasaste','has probado':'probaste','te ha enviado':'te mandó','vuelve a intentarlo':'volvé a intentarlo',
'inténtalo de nuevo':'intentalo de nuevo','inténtalo otra vez':'intentalo otra vez','inténtalo más tarde':'intentalo más tarde'}
def _case(src,dst): return dst[:1].upper()+dst[1:] if src[:1].isupper() else dst
def to_ar(s):
    o=s
    for a,b in PP.items(): s=re.sub(r'(?<![\wáéíóúñ])'+re.escape(a)+r'(?![\wáéíóúñ])',lambda m:_case(m.group(0),b),s,flags=re.I)
    def rep(m):
        w=m.group(0); b=W.get(w.lower())
        return _case(w,b) if b else w
    s=re.sub(r'(?:te apetece|[A-Za-zÁÉÍÓÚÑáéíóúñü]+)',rep,s)
    def imp(m):
        w=m.group(2); b=IMP.get(w.lower())
        return m.group(1)+(_case(w,b) if b else w)
    s=re.sub(r"(^|[.:;!?¡¿]\s*|\n| y )([A-Za-zÁÉÍÓÚÑáéíóúñü]+)",imp,s)
    return s if s!=o else None
