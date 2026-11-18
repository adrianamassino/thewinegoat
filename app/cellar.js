/* The Wine Goat — "My wines": tasted-wine archive.
   Label photo (on-device text reading → name / producer / vintage suggestions), glass photo
   (on-device colour reading → WSET colour + intensity), type, grape, region, structure, quality, notes.
   Everything stays on this device (IndexedDB); photos are resized before saving. */
(function(){
"use strict";
const W = window;
const TX = {
 it:{cel:"I miei vini",celD:"Fotografa etichetta e calice: archivio dei vini degustati",celKick:"Diario di degustazione",celTitle:"I miei vini",celIntro:"Fotografa l'etichetta e il vino nel calice: la app legge il testo dell'etichetta e il colore del vino, tu completi la scheda.",
  add:"Aggiungi un vino",label:"Etichetta",glass:"Vino nel calice",takeL:"📷 Fotografa l'etichetta",takeG:"🍷 Fotografa il calice",retake:"Rifai",reading:"Leggo l'etichetta…",readFail:"Non sono riuscito a leggere il testo: scrivilo tu.",sugg:"Tocca per usare il testo letto:",
  tapWine:"Tocca il vino nella foto per misurare il colore",colour:"Colore",intens:"Intensità",name:"Nome del vino",prod:"Produttore",vint:"Annata",type:"Tipologia",grape:"Vitigno/i",region:"Regione / Paese",
  t_white:"Bianco",t_rose:"Rosato",t_red:"Rosso",t_spark:"Spumante",t_sweet:"Dolce",t_fort:"Fortificato",
  struct:"Caratteristiche",sw:"Dolcezza",ac:"Acidità",tan:"Tannino",alc:"Alcol",body:"Corpo",fin:"Finale",nose:"Naso (aromi)",pal:"Bocca (sapori)",qual:"Qualità",
  q_poor:"Scarsa",q_acc:"Accettabile",q_good:"Buona",q_vg:"Molto buona",q_out:"Eccellente",notes:"Note personali",rate:"Il mio voto",when:"Data",save:"Salva nel diario",saved:"Vino salvato ✓",del:"Elimina",delQ:"Eliminare questo vino?",edit:"Modifica",back:"‹ I miei vini",
  empty:"Ancora nessun vino. Fotografa la prossima etichetta che assaggi!",search:"Cerca per nome, vitigno, regione…",all:"Tutti",n:"vini",n1:"vino",local:"Le foto restano su questo dispositivo.",need:"Inserisci almeno il nome del vino.",
  lo:"bassa",ml:"medio-bassa",me:"media",mh:"medio-alta",hi:"alta",sh:"corto",lg:"lungo",li:"leggero",fu:"pieno",dr:"secco",od:"abboccato",swt:"dolce",
  c_lemongreen:"giallo verdolino",c_lemon:"giallo paglierino",c_gold:"dorato",c_amber:"ambrato",c_pink:"rosa",c_salmon:"salmone",c_orange:"buccia di cipolla",c_purple:"porpora",c_ruby:"rubino",c_garnet:"granato",c_tawny:"aranciato (tawny)",c_brown:"marrone",
  i_pale:"pallido",i_medium:"medio",i_deep:"intenso",colAuto:"Colore letto dalla foto:"},
 fr:{cel:"Mes vins",celD:"Photographiez étiquette et verre : votre carnet de dégustation",celKick:"Carnet de dégustation",celTitle:"Mes vins",celIntro:"Photographiez l'étiquette et le vin dans le verre : l'app lit le texte de l'étiquette et la couleur du vin, vous complétez la fiche.",
  add:"Ajouter un vin",label:"Étiquette",glass:"Vin dans le verre",takeL:"📷 Photographier l'étiquette",takeG:"🍷 Photographier le verre",retake:"Reprendre",reading:"Lecture de l'étiquette…",readFail:"Texte illisible : saisissez-le vous-même.",sugg:"Touchez pour utiliser le texte lu :",
  tapWine:"Touchez le vin sur la photo pour mesurer la couleur",colour:"Couleur",intens:"Intensité",name:"Nom du vin",prod:"Producteur",vint:"Millésime",type:"Type",grape:"Cépage(s)",region:"Région / Pays",
  t_white:"Blanc",t_rose:"Rosé",t_red:"Rouge",t_spark:"Effervescent",t_sweet:"Doux",t_fort:"Muté",
  struct:"Caractéristiques",sw:"Sucre",ac:"Acidité",tan:"Tanins",alc:"Alcool",body:"Corps",fin:"Finale",nose:"Nez (arômes)",pal:"Bouche (saveurs)",qual:"Qualité",
  q_poor:"Médiocre",q_acc:"Acceptable",q_good:"Bon",q_vg:"Très bon",q_out:"Excellent",notes:"Notes personnelles",rate:"Ma note",when:"Date",save:"Enregistrer",saved:"Vin enregistré ✓",del:"Supprimer",delQ:"Supprimer ce vin ?",edit:"Modifier",back:"‹ Mes vins",
  empty:"Aucun vin pour l'instant. Photographiez la prochaine étiquette que vous dégustez !",search:"Rechercher par nom, cépage, région…",all:"Tous",n:"vins",n1:"vin",local:"Les photos restent sur cet appareil.",need:"Saisissez au moins le nom du vin.",
  lo:"faible",ml:"moyen-faible",me:"moyen",mh:"moyen-élevé",hi:"élevé",sh:"courte",lg:"longue",li:"léger",fu:"corsé",dr:"sec",od:"demi-sec",swt:"doux",
  c_lemongreen:"citron-vert",c_lemon:"citron",c_gold:"or",c_amber:"ambre",c_pink:"rose",c_salmon:"saumon",c_orange:"orangé",c_purple:"pourpre",c_ruby:"rubis",c_garnet:"grenat",c_tawny:"tuilé",c_brown:"brun",
  i_pale:"pâle",i_medium:"moyenne",i_deep:"profonde",colAuto:"Couleur lue sur la photo :"},
 en:{cel:"My wines",celD:"Snap the label and the glass: your tasted-wine archive",celKick:"Tasting diary",celTitle:"My wines",celIntro:"Photograph the label and the wine in the glass: the app reads the label text and the wine's colour, you complete the card.",
  add:"Add a wine",label:"Label",glass:"Wine in the glass",takeL:"📷 Photograph the label",takeG:"🍷 Photograph the glass",retake:"Retake",reading:"Reading the label…",readFail:"Couldn't read the text: type it in.",sugg:"Tap to use the text found:",
  tapWine:"Tap the wine in the photo to measure its colour",colour:"Colour",intens:"Intensity",name:"Wine name",prod:"Producer",vint:"Vintage",type:"Type",grape:"Grape(s)",region:"Region / Country",
  t_white:"White",t_rose:"Rosé",t_red:"Red",t_spark:"Sparkling",t_sweet:"Sweet",t_fort:"Fortified",
  struct:"Characteristics",sw:"Sweetness",ac:"Acidity",tan:"Tannin",alc:"Alcohol",body:"Body",fin:"Finish",nose:"Nose (aromas)",pal:"Palate (flavours)",qual:"Quality",
  q_poor:"Poor",q_acc:"Acceptable",q_good:"Good",q_vg:"Very good",q_out:"Outstanding",notes:"Personal notes",rate:"My rating",when:"Date",save:"Save to my diary",saved:"Wine saved ✓",del:"Delete",delQ:"Delete this wine?",edit:"Edit",back:"‹ My wines",
  empty:"No wines yet. Photograph the next label you taste!",search:"Search by name, grape, region…",all:"All",n:"wines",n1:"wine",local:"Photos stay on this device.",need:"Enter at least the wine name.",
  lo:"low",ml:"medium(-)",me:"medium",mh:"medium(+)",hi:"high",sh:"short",lg:"long",li:"light",fu:"full",dr:"dry",od:"off-dry",swt:"sweet",
  c_lemongreen:"lemon-green",c_lemon:"lemon",c_gold:"gold",c_amber:"amber",c_pink:"pink",c_salmon:"salmon",c_orange:"orange",c_purple:"purple",c_ruby:"ruby",c_garnet:"garnet",c_tawny:"tawny",c_brown:"brown",
  i_pale:"pale",i_medium:"medium",i_deep:"deep",colAuto:"Colour read from the photo:"},
};
TX.es={cel:"Mis vinos",celD:"Fotografía etiqueta y copa: tu archivo de vinos catados",celKick:"Diario de cata",celTitle:"Mis vinos",celIntro:"Fotografía la etiqueta y el vino en la copa: la app lee el texto de la etiqueta y el color del vino, y tú completas la ficha.",
  add:"Añadir un vino",label:"Etiqueta",glass:"Vino en la copa",takeL:"📷 Fotografiar la etiqueta",takeG:"🍷 Fotografiar la copa",retake:"Repetir",reading:"Leyendo la etiqueta…",readFail:"No pude leer el texto: escríbelo tú.",sugg:"Toca para usar el texto leído:",
  tapWine:"Toca el vino en la foto para medir el color",colour:"Color",intens:"Intensidad",name:"Nombre del vino",prod:"Bodega",vint:"Añada",type:"Tipo",grape:"Uva(s)",region:"Región / País",
  t_white:"Blanco",t_rose:"Rosado",t_red:"Tinto",t_spark:"Espumoso",t_sweet:"Dulce",t_fort:"Generoso",
  struct:"Características",sw:"Dulzor",ac:"Acidez",tan:"Tanino",alc:"Alcohol",body:"Cuerpo",fin:"Final",nose:"Nariz (aromas)",pal:"Boca (sabores)",qual:"Calidad",
  q_poor:"Pobre",q_acc:"Aceptable",q_good:"Buena",q_vg:"Muy buena",q_out:"Excelente",notes:"Notas personales",rate:"Mi nota",when:"Fecha",save:"Guardar en el diario",saved:"Vino guardado ✓",del:"Eliminar",delQ:"¿Eliminar este vino?",edit:"Editar",back:"‹ Mis vinos",
  empty:"Todavía no hay vinos. ¡Fotografía la próxima etiqueta que pruebes!",search:"Busca por nombre, uva, región…",all:"Todos",n:"vinos",n1:"vino",local:"Las fotos se quedan en este dispositivo.",need:"Escribe al menos el nombre del vino.",
  lo:"baja",ml:"media(-)",me:"media",mh:"media(+)",hi:"alta",sh:"corto",lg:"largo",li:"ligero",fu:"con cuerpo",dr:"seco",od:"semiseco",swt:"dulce",
  c_lemongreen:"limón verdoso",c_lemon:"limón",c_gold:"dorado",c_amber:"ámbar",c_pink:"rosa",c_salmon:"salmón",c_orange:"anaranjado",c_purple:"púrpura",c_ruby:"rubí",c_garnet:"granate",c_tawny:"teja",c_brown:"marrón",
  i_pale:"pálido",i_medium:"medio",i_deep:"profundo",colAuto:"Color leído en la foto:"};
TX["es-ar"]=Object.assign({},TX.es,{celD:"Sacale foto a la etiqueta y a la copa: tu archivo de vinos catados",celIntro:"Sacale una foto a la etiqueta y al vino en la copa: la app lee el texto de la etiqueta y el color del vino, y vos completás la ficha.",
  add:"Agregar un vino",readFail:"No pude leer el texto: escribilo vos.",sugg:"Tocá para usar el texto leído:",tapWine:"Tocá el vino en la foto para medir el color",
  empty:"Todavía no hay vinos. ¡Sacale una foto a la próxima etiqueta que pruebes!",search:"Buscá por nombre, uva, región…",need:"Escribí al menos el nombre del vino.",retake:"Sacar otra"});
/* Spirits courses: the same diary, worded for spirits */
const SPM=(()=>{ try{ return typeof L2!=="undefined"&&L2&&L2.track==="spirits"; }catch(e){ return false; } })();
if(SPM){
 Object.assign(TX.it,{cel:"I miei distillati",celD:"Fotografa etichetta e bicchiere: archivio dei distillati degustati",celTitle:"I miei distillati",celIntro:"Fotografa l'etichetta e il distillato nel bicchiere: la app legge il testo dell'etichetta e il colore, tu completi la scheda.",
  add:"Aggiungi un distillato",glass:"Distillato nel bicchiere",takeG:"🥃 Fotografa il bicchiere",tapWine:"Tocca il distillato nella foto per misurare il colore",name:"Nome del distillato",prod:"Distilleria / Produttore",vint:"Età / Annata",grape:"Materia prima",type:"Categoria",
  t_white:"Whisky",t_rose:"Brandy",t_red:"Rum / Cachaça",t_spark:"Tequila / Mezcal",t_sweet:"Vodka / Gin",t_fort:"Liquore / Altro",saved:"Distillato salvato ✓",delQ:"Eliminare questo distillato?",back:"‹ I miei distillati",
  empty:"Ancora nessun distillato. Fotografa la prossima etichetta che assaggi!",search:"Cerca per nome, categoria, regione…",n:"distillati",n1:"distillato",need:"Inserisci almeno il nome del distillato."});
 Object.assign(TX.fr,{cel:"Mes spiritueux",celD:"Photographiez étiquette et verre : votre carnet de spiritueux dégustés",celTitle:"Mes spiritueux",celIntro:"Photographiez l'étiquette et le spiritueux dans le verre : l'app lit le texte de l'étiquette et la couleur, vous complétez la fiche.",
  add:"Ajouter un spiritueux",glass:"Spiritueux dans le verre",takeG:"🥃 Photographier le verre",tapWine:"Touchez le spiritueux sur la photo pour mesurer la couleur",name:"Nom du spiritueux",prod:"Distillerie / Producteur",vint:"Âge / Millésime",grape:"Matière première",type:"Catégorie",
  t_white:"Whisky",t_rose:"Brandy",t_red:"Rhum / Cachaça",t_spark:"Tequila / Mezcal",t_sweet:"Vodka / Gin",t_fort:"Liqueur / Autre",saved:"Spiritueux enregistré ✓",delQ:"Supprimer ce spiritueux ?",back:"‹ Mes spiritueux",
  empty:"Aucun spiritueux pour l'instant. Photographiez la prochaine étiquette que vous dégustez !",search:"Rechercher par nom, catégorie, région…",n:"spiritueux",n1:"spiritueux",need:"Saisissez au moins le nom du spiritueux."});
 Object.assign(TX.en,{cel:"My spirits",celD:"Snap the label and the glass: your tasted-spirits archive",celTitle:"My spirits",celIntro:"Photograph the label and the spirit in the glass: the app reads the label text and the colour, you complete the card.",
  add:"Add a spirit",glass:"Spirit in the glass",takeG:"🥃 Photograph the glass",tapWine:"Tap the spirit in the photo to measure its colour",name:"Spirit name",prod:"Distillery / Producer",vint:"Age / Vintage",grape:"Raw material",type:"Category",
  t_white:"Whisky",t_rose:"Brandy",t_red:"Rum / Cachaça",t_spark:"Tequila / Mezcal",t_sweet:"Vodka / Gin",t_fort:"Liqueur / Other",saved:"Spirit saved ✓",delQ:"Delete this spirit?",back:"‹ My spirits",
  empty:"No spirits yet. Photograph the next label you taste!",search:"Search by name, category, region…",n:"spirits",n1:"spirit",need:"Enter at least the spirit name."});
 const esS={cel:"Mis destilados",celD:"Fotografía etiqueta y copa: tu archivo de destilados catados",celTitle:"Mis destilados",celIntro:"Fotografía la etiqueta y el destilado en la copa: la app lee el texto de la etiqueta y el color, y tú completas la ficha.",
  add:"Añadir un destilado",glass:"Destilado en la copa",takeG:"🥃 Fotografiar la copa",tapWine:"Toca el destilado en la foto para medir el color",name:"Nombre del destilado",prod:"Destilería / Productor",vint:"Edad / Añada",grape:"Materia prima",type:"Categoría",
  t_white:"Whisky",t_rose:"Brandy",t_red:"Ron / Cachaça",t_spark:"Tequila / Mezcal",t_sweet:"Vodka / Ginebra",t_fort:"Licor / Otro",saved:"Destilado guardado ✓",delQ:"¿Eliminar este destilado?",back:"‹ Mis destilados",
  empty:"Todavía no hay destilados. ¡Fotografía la próxima etiqueta que pruebes!",search:"Busca por nombre, categoría, región…",n:"destilados",n1:"destilado",need:"Escribe al menos el nombre del destilado."};
 Object.assign(TX.es,esS);
 Object.assign(TX["es-ar"],esS,{celD:"Sacale foto a la etiqueta y al vaso: tu archivo de destilados catados",celIntro:"Sacale una foto a la etiqueta y al destilado en el vaso: la app lee el texto de la etiqueta y el color, y vos completás la ficha.",
  tapWine:"Tocá el destilado en la foto para medir el color",empty:"Todavía no hay destilados. ¡Sacale una foto a la próxima etiqueta que pruebes!",search:"Buscá por nombre, categoría, región…",need:"Escribí al menos el nombre del destilado.",t_sweet:"Vodka / Gin"});
}
const lg=()=>{ let l="en"; try{ l=localStorage.getItem("wset3-lang")||(typeof lang!=="undefined"?lang:"en"); }catch(e){} return TX[l]?l:"en"; };
const x=k=>(TX[lg()][k]!=null?TX[lg()][k]:TX.en[k]);
const es=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const TX2={
 it:{found:"Riconosciuto",srch:"🔎 Cerca vino, denominazione o vitigno",srchH:"Es. Barolo, Rioja, Sancerre, Malbec…",prof:"Profilo gustativo",aro:"Note aromatiche",food:"Abbinamenti",serve:"Servizio",drink:"Da bere",style:"Lo stile",grapes:"Vitigni",country:"Paese",reg:"Regione",temp:"Temperatura",now:"pronto ora",until:"fino al",b:["Leggero","Strutturato"],t:["Vellutato","Tannico"],s:["Secco","Dolce"],a:["Morbido","Acido"],
  sty:(c,reg,gr,b,a,t,sw,aro)=>`${c} ${sw}${reg?" da "+reg:""}${gr?", a base di "+gr:""}: corpo ${b}, acidità ${a}${t?", tannino "+t:""}.${aro?" Aromi di "+aro+".":""}`,
  col:{r:"Rosso",w:"Bianco",p:"Rosato",s:"Spumante",d:"Vino dolce",f:"Vino fortificato"},age:{gran:"Gran Riserva / Gran Reserva",ris:"Riserva / Reserva",cri:"Crianza"},dos:{nature:"Brut nature",xbrut:"Extra brut",brut:"Brut",xdry:"Extra dry"},cru:{gc:"Grand Cru",pc:"Premier Cru"},bio:"Biologico",abv:"Alcol",scanAgain:"Scansiona un'altra etichetta",view:"Scheda"},
 fr:{found:"Reconnu",srch:"🔎 Rechercher un vin, une appellation ou un cépage",srchH:"Ex. Barolo, Rioja, Sancerre, Malbec…",prof:"Profil gustatif",aro:"Arômes",food:"Accords",serve:"Service",drink:"À boire",style:"Le style",grapes:"Cépages",country:"Pays",reg:"Région",temp:"Température",now:"prêt maintenant",until:"jusqu'en",b:["Léger","Puissant"],t:["Soyeux","Tannique"],s:["Sec","Doux"],a:["Souple","Vif"],
  sty:(c,reg,gr,b,a,t,sw,aro)=>`${c} ${sw}${reg?" de "+reg:""}${gr?", à base de "+gr:""} : corps ${b}, acidité ${a}${t?", tanins "+t:""}.${aro?" Arômes de "+aro+".":""}`,
  col:{r:"Rouge",w:"Blanc",p:"Rosé",s:"Effervescent",d:"Vin doux",f:"Vin muté"},age:{gran:"Gran Riserva / Gran Reserva",ris:"Riserva / Reserva",cri:"Crianza"},dos:{nature:"Brut nature",xbrut:"Extra brut",brut:"Brut",xdry:"Extra dry"},cru:{gc:"Grand Cru",pc:"Premier Cru"},bio:"Bio",abv:"Alcool",scanAgain:"Scanner une autre étiquette",view:"Fiche"},
 en:{found:"Recognised",srch:"🔎 Search a wine, appellation or grape",srchH:"E.g. Barolo, Rioja, Sancerre, Malbec…",prof:"Taste profile",aro:"Aromas",food:"Food pairing",serve:"Serving",drink:"Drink",style:"The style",grapes:"Grapes",country:"Country",reg:"Region",temp:"Temperature",now:"ready now",until:"until",b:["Light","Bold"],t:["Smooth","Tannic"],s:["Dry","Sweet"],a:["Soft","Acidic"],
  sty:(c,reg,gr,b,a,t,sw,aro)=>`${c} ${sw}${reg?" from "+reg:""}${gr?", made from "+gr:""}: ${b} body, ${a} acidity${t?", "+t+" tannin":""}.${aro?" Aromas of "+aro+".":""}`,
  col:{r:"Red",w:"White",p:"Rosé",s:"Sparkling",d:"Sweet wine",f:"Fortified wine"},age:{gran:"Gran Riserva / Gran Reserva",ris:"Riserva / Reserva",cri:"Crianza"},dos:{nature:"Brut nature",xbrut:"Extra brut",brut:"Brut",xdry:"Extra dry"},cru:{gc:"Grand Cru",pc:"Premier Cru"},bio:"Organic",abv:"Alcohol",scanAgain:"Scan another label",view:"Card"},
 es:{found:"Reconocido",srch:"🔎 Busca un vino, denominación o uva",srchH:"Ej. Barolo, Rioja, Sancerre, Malbec…",prof:"Perfil de sabor",aro:"Aromas",food:"Maridaje",serve:"Servicio",drink:"Beber",style:"El estilo",grapes:"Uvas",country:"País",reg:"Región",temp:"Temperatura",now:"listo ahora",until:"hasta",b:["Ligero","Potente"],t:["Suave","Tánico"],s:["Seco","Dulce"],a:["Suave","Ácido"],
  sty:(c,reg,gr,b,a,t,sw,aro)=>`${c} ${sw}${reg?" de "+reg:""}${gr?", elaborado con "+gr:""}: cuerpo ${b}, acidez ${a}${t?", tanino "+t:""}.${aro?" Aromas de "+aro+".":""}`,
  col:{r:"Tinto",w:"Blanco",p:"Rosado",s:"Espumoso",d:"Vino dulce",f:"Vino generoso"},age:{gran:"Gran Reserva",ris:"Reserva",cri:"Crianza"},dos:{nature:"Brut nature",xbrut:"Extra brut",brut:"Brut",xdry:"Extra dry"},cru:{gc:"Grand Cru",pc:"Premier Cru"},bio:"Ecológico",abv:"Alcohol",scanAgain:"Escanear otra etiqueta",view:"Ficha"}};
Object.assign(TX2.it,{bw:["leggero","medio-leggero","medio","medio-pieno","pieno"],aw:["bassa","medio-bassa","media","medio-alta","alta"],tw:["basso","medio-basso","medio","medio-alto","alto"]});
Object.assign(TX2.fr,{bw:["léger","moyen-léger","moyen","moyen-corsé","corsé"],aw:["faible","moyenne(-)","moyenne","moyenne(+)","élevée"],tw:["faibles","moyens(-)","moyens","moyens(+)","élevés"]});
Object.assign(TX2.en,{bw:["light","medium(-)","medium","medium(+)","full"],aw:["low","medium(-)","medium","medium(+)","high"],tw:["low","medium(-)","medium","medium(+)","high"]});
Object.assign(TX2.es,{bw:["ligero","medio(-)","medio","medio(+)","pleno"],aw:["baja","media(-)","media","media(+)","alta"],tw:["bajo","medio(-)","medio","medio(+)","alto"]});
const RGW={it:{"Right Bank":"riva destra","Left Bank":"riva sinistra","Burgundy":"Borgogna","Loire":"Loira","Northern Rhône":"Rodano settentrionale","Southern Rhône":"Rodano meridionale","Alsace":"Alsazia","Provence":"Provenza","South-West France":"Sud-Ovest della Francia","France":"Francia","Piedmont":"Piemonte","Tuscany":"Toscana","Sicily":"Sicilia","Sardinia":"Sardegna","Lombardy":"Lombardia","North-East Italy":"Nord-Est Italia","Catalonia":"Catalogna","Spain":"Spagna","Jerez":"Jerez","Germany":"Germania","Austria":"Austria","Macedonia (Greece)":"Macedonia (Grecia)","South Australia":"Australia Meridionale","Cool-climate Australia":"Australia a clima fresco","New South Wales":"Nuovo Galles del Sud","New Zealand":"Nuova Zelanda","Coastal Chile":"Cile costiero","Central Valley":"Valle Centrale","Western Cape":"Capo Occidentale","Portugal":"Portogallo"},
 fr:{"Right Bank":"rive droite","Left Bank":"rive gauche","Burgundy":"Bourgogne","Northern Rhône":"Rhône septentrional","Southern Rhône":"Rhône méridional","South-West France":"Sud-Ouest","Piedmont":"Piémont","Tuscany":"Toscane","Sicily":"Sicile","Sardinia":"Sardaigne","Lombardy":"Lombardie","North-East Italy":"Nord-Est de l'Italie","Catalonia":"Catalogne","Spain":"Espagne","Germany":"Allemagne","Austria":"Autriche","Macedonia (Greece)":"Macédoine (Grèce)","South Australia":"Australie-Méridionale","Cool-climate Australia":"Australie fraîche","New South Wales":"Nouvelle-Galles du Sud","New Zealand":"Nouvelle-Zélande","Coastal Chile":"Chili côtier","Central Valley":"Vallée centrale","Western Cape":"Cap-Occidental"},
 es:{"Right Bank":"margen derecha","Left Bank":"margen izquierda","Bordeaux":"Burdeos","Burgundy":"Borgoña","Loire":"Loira","Northern Rhône":"Ródano norte","Southern Rhône":"Ródano sur","Alsace":"Alsacia","Provence":"Provenza","South-West France":"Suroeste de Francia","France":"Francia","Piedmont":"Piamonte","Tuscany":"Toscana","Sicily":"Sicilia","Sardinia":"Cerdeña","Lombardy":"Lombardía","North-East Italy":"Noreste de Italia","Catalonia":"Cataluña","Spain":"España","Germany":"Alemania","Macedonia (Greece)":"Macedonia (Grecia)","South Australia":"Australia Meridional","Cool-climate Australia":"Australia de clima fresco","New South Wales":"Nueva Gales del Sur","New Zealand":"Nueva Zelanda","Coastal Chile":"Chile costero","Central Valley":"Valle Central","Western Cape":"Cabo Occidental","Mosel":"Mosela","Douro":"Duero"}};
const regL=r=>{ const m=RGW[LL()]; if(!m||!r) return r||""; return String(r).split(/( · | \/ )/).map(p=>m[p]||p).join(""); };
TX2["es-ar"]=Object.assign({},TX2.es,{srch:"🔎 Buscá un vino, denominación o uva"});
if(SPM){ TX2.it.srch="🔎 Cerca distillato o categoria"; TX2.it.srchH="Es. Cognac VSOP, Bourbon, Tequila reposado…"; TX2.fr.srch="🔎 Rechercher un spiritueux ou une catégorie"; TX2.fr.srchH="Ex. Cognac VSOP, Bourbon, Tequila reposado…"; TX2.en.srch="🔎 Search a spirit or category"; TX2.en.srchH="E.g. Cognac VSOP, Bourbon, Tequila reposado…"; TX2.es.srch="🔎 Busca un destilado o categoría"; TX2.es.srchH="Ej. Cognac VSOP, Bourbon, Tequila reposado…"; TX2["es-ar"].srch="🔎 Buscá un destilado o categoría"; TX2["es-ar"].srchH=TX2.es.srchH; }
const y=k=>{ const l=lg(); return (TX2[l]||TX2.en)[k]; };
const LGI=()=>({it:1,fr:2,en:3,es:4,"es-ar":4})[lg()]||3;
const LL=()=>({it:"it",fr:"fr",en:"en",es:"es","es-ar":"es"})[lg()]||"en";
const DBX=()=>W.TWG_WINEDB;
const COL2TYPE={r:"red",w:"white",p:"rose",s:"spark",d:"sweet",f:"fort"};
const aroL=c=>{ const D=DBX(); return D?(D.L.aroma[LL()][c]||c):c; };
const foodL=c=>{ const D=DBX(); return D?(D.L.food[LL()][c]||c):c; };
const ctry=c=>{ const D=DBX(); const r=D&&D.L.country[c]; return r?[r[0],r[LGI()]]:["",""]; };
function applyDB(e,raw){ if(!e||!CUR) return; const D=DBX();
  CUR.db={name:e.name,c:e.c,region:e.region,col:e.col,grapes:(e.foundGrapes&&e.foundGrapes.length?e.foundGrapes:e.grapes),prof:e.prof,aro:e.aro,food:e.food,t:e.t,y:e.y,k:e.k};
  if(!CUR.region&&e.k==="a") CUR.region=[regL(e.region),ctry(e.c)[1]].filter(Boolean).join(", ");
  if(!CUR.grape) CUR.grape=CUR.db.grapes.join(", ");
  if(!SPM&&(!CUR.type||["white","rose","red"].includes(CUR.type))) CUR.type=COL2TYPE[e.col]||CUR.type;
  const [b,t,a,sw]=e.prof; CUR.s=CUR.s||{};
  if(!CUR.s.body) CUR.s.body=SC.body[b-1]; if(!CUR.s.ac) CUR.s.ac=SC.ac[a-1]; if(!CUR.s.tan&&e.col!=="w"&&e.col!=="s") CUR.s.tan=SC.tan[t-1]; if(!CUR.s.sw) CUR.s.sw=sw<=1?"dr":sw===2?"od":sw===3?"me":"swt";
  if(!CUR.nose) CUR.nose=e.aro.map(aroL).join(", ");
  if(raw&&D){ CUR.ex=D.extras(raw); } }
function styleText(w){ const d=w.db; if(!d) return ""; const [b,t,a,sw]=d.prof; const lv=["lo","ml","me","mh","hi"], bv=["li","ml","me","mh","fu"];
  const swt=sw<=1?x("dr"):sw===2?x("od"):sw>=4?x("swt"):""; const reg=d.k==="a"?[regL(d.region),ctry(d.c)[1]].filter(Boolean).join(", "):"";
  const aro=d.aro.slice(0,3).map(aroL).join(", ");
  return y("sty")(y("col")[d.col]||"",reg,d.grapes.join(", "),y("bw")[b-1],y("aw")[a-1],(d.col==="r"||d.col==="f")&&t>1?y("tw")[t-1]:"",swt,aro).replace(/\s+/g," ").replace(" :"," :"); }
function bar(lbl,v){ return `<div class="vv-bar"><span>${es(lbl[0])}</span><i><b style="left:${((v-1)/4)*100}%"></b></i><span>${es(lbl[1])}</span></div>`; }
function profOf(w){ if(w.db) return w.db.prof; const m={li:1,ml:2,me:3,mh:4,fu:5,lo:1,hi:5,dr:1,od:2,swt:5}; const s=w.s||{}; if(!s.body&&!s.ac&&!s.tan&&!s.sw) return null; return [m[s.body]||3,m[s.tan]||1,m[s.ac]||3,m[s.sw]||1]; }
function viewHTML(){ const w=CUR, d=w.db, c=d?ctry(d.c):["",""], pr=profOf(w), yr=parseInt(w.vint,10);
  const tags=[]; if(w.ex){ if(w.ex.cru) tags.push(y("cru")[w.ex.cru]); if(w.ex.age) tags.push(y("age")[w.ex.age]); if(w.ex.dos) tags.push(y("dos")[w.ex.dos]); if(w.ex.cl) tags.push("Classico"); if(w.ex.sup) tags.push("Superiore"); if(w.ex.bio) tags.push(y("bio")); if(w.ex.abv) tags.push(y("abv")+" "+w.ex.abv+"%"); }
  const drink=d&&d.y&&yr?(()=>{ const a=yr+d.y[0], b=yr+d.y[1], now=new Date().getFullYear(); return `${a}–${b}${now>=a&&now<=b?" · "+y("now"):""}`; })():"";
  return `<section class="view cellar vv">
   <button type="button" class="cl-back" data-cel="list">${es(x("back"))}</button>
   <div class="vv-hero">${w.label?`<img src="${w.label}" alt="">`:w.glass?`<img src="${w.glass}" alt="">`:`<span class="vv-ph">🍷</span>`}</div>
   <div class="vv-head"><p class="vv-prod">${es(w.prod||"")}</p><h1>${es(w.name)}${w.vint?` <span>${es(w.vint)}</span>`:""}</h1>
    <p class="vv-reg">${c[0]?c[0]+" ":""}${es(w.region||[d&&regL(d.region),c[1]].filter(Boolean).join(", "))}</p>
    <div class="vv-tags">${w.type?`<em class="cl-ty">${es(typeLbl(w.type))}</em>`:""}${tags.map(t=>`<em class="vv-tag">${es(t)}</em>`).join("")}${w.col?`<em class="vv-tag"><i class="cl-sw" style="--c:${w.col.hex}"></i> ${es(x("c_"+w.col.term))}</em>`:""}</div>
    ${w.rate?`<p class="vv-rate">${"★".repeat(w.rate)}<span>${"★".repeat(5-w.rate)}</span></p>`:""}</div>
   ${d?`<div class="vv-card"><h2>${es(y("style"))}</h2><p>${es(styleText(w))}</p></div>`:""}
   ${pr?`<div class="vv-card"><h2>${es(y("prof"))}</h2>${bar(y("b"),pr[0])}${(w.type==="red"||w.type==="fort"||(d&&d.col==="r"))?bar(y("t"),pr[1]):""}${bar(y("s"),pr[3])}${bar(y("a"),pr[2])}</div>`:""}
   ${d&&d.aro.length?`<div class="vv-card"><h2>${es(y("aro"))}</h2><div class="vv-chips">${d.aro.map(a=>`<span>${es(aroL(a))}</span>`).join("")}</div></div>`:""}
   ${d&&d.food.length?`<div class="vv-card"><h2>${es(y("food"))}</h2><div class="vv-chips food">${d.food.map(f=>`<span>${es(foodL(f))}</span>`).join("")}</div></div>`:""}
   <div class="vv-card vv-facts">
    ${w.grape?`<div><small>${es(y("grapes"))}</small><b>${es(w.grape)}</b></div>`:""}
    ${d&&d.t?`<div><small>${es(y("temp"))}</small><b>${es(DBX().L.temp[d.t])}</b></div>`:""}
    ${drink?`<div><small>${es(y("drink"))}</small><b>${es(drink)}</b></div>`:""}
    ${w.q?`<div><small>${es(x("qual"))}</small><b>${es(x("q_"+w.q))}</b></div>`:""}
   </div>
   ${w.pal||w.notes?`<div class="vv-card">${w.pal?`<h2>${es(x("pal"))}</h2><p>${es(w.pal)}</p>`:""}${w.notes?`<h2>${es(x("notes"))}</h2><p>${es(w.notes)}</p>`:""}</div>`:""}
   <div class="cl-act"><button type="button" class="btn primary" data-cel="edit">${es(x("edit"))}</button><button type="button" class="btn ghost cl-del" data-cel="del">${es(x("del"))}</button></div>
  </section>`; }
let SQ="";
function searchBox(){ const D=DBX(); const res=D&&SQ?D.search(SQ):[];
  return `<div class="vv-srch"><label class="cl-in"><span>${es(y("srch"))}</span><input id="cl-db" placeholder="${es(y("srchH"))}" value="${es(SQ)}" autocomplete="off"></label>
   ${res.length?`<div class="vv-res">${res.map((e,i)=>`<button type="button" data-cel="pick" data-i="${i}"><b>${es(e.name)}</b><span>${e.c?ctry(e.c)[0]+" ":""}${es([regL(e.region),e.grapes.join(", ")].filter(Boolean).join(" · "))}</span></button>`).join("")}</div>`:""}</div>`; }

/* ---------- storage (IndexedDB, with in-memory fallback) ---------- */
let DBP=null; const MEM=new Map();
function db(){ if(DBP) return DBP; DBP=new Promise(res=>{ try{ const r=indexedDB.open("twg-cellar",1); r.onupgradeneeded=()=>r.result.createObjectStore("wines",{keyPath:"id"}); r.onsuccess=()=>res(r.result); r.onerror=()=>res(null); }catch(e){ res(null); } }); return DBP; }
async function all(){ const d=await db(); if(!d) return [...MEM.values()]; return new Promise(res=>{ const q=d.transaction("wines").objectStore("wines").getAll(); q.onsuccess=()=>res(q.result||[]); q.onerror=()=>res([]); }); }
async function put(w){ const d=await db(); if(!d){ MEM.set(w.id,w); return; } return new Promise(res=>{ const tx=d.transaction("wines","readwrite"); tx.objectStore("wines").put(w); tx.oncomplete=res; tx.onerror=res; }); }
async function del(id){ const d=await db(); if(!d){ MEM.delete(id); return; } return new Promise(res=>{ const tx=d.transaction("wines","readwrite"); tx.objectStore("wines").delete(id); tx.oncomplete=res; tx.onerror=res; }); }

/* ---------- images ---------- */
function fileToImg(f){ return new Promise((res,rej)=>{ const u=URL.createObjectURL(f); const im=new Image(); im.onload=()=>res(im); im.onerror=rej; im.src=u; }); }
async function shrink(f,max){ const im=await fileToImg(f); const s=Math.min(1,max/Math.max(im.width,im.height)); const c=document.createElement("canvas"); c.width=Math.round(im.width*s); c.height=Math.round(im.height*s); c.getContext("2d").drawImage(im,0,0,c.width,c.height); return c.toDataURL("image/jpeg",.82); }

/* ---------- colour reading ---------- */
function rgb2hsl(r,g,b){ r/=255; g/=255; b/=255; const mx=Math.max(r,g,b), mn=Math.min(r,g,b); let h=0,s=0; const l=(mx+mn)/2; if(mx!==mn){ const d=mx-mn; s=l>.5?d/(2-mx-mn):d/(mx+mn); h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4; h*=60; } return [h,s,l]; }
function classify(r,g,b){ const [h,s,l]=rgb2hsl(r,g,b); const redish=h>=300||h<35;
  let fam, term, inten;
  if(redish&&l<.42&&s>.18){ fam="red"; term=h>=300&&h<345?"purple":(h>=345||h<8)?"ruby":h<20?"garnet":l>.22?"tawny":"garnet"; inten=l<.17?"deep":l<.3?"medium":"pale"; }
  else if(redish&&s>.2){ fam="rose"; term=(h>=320||h<6)?"pink":h<18?"salmon":"orange"; inten=l>.78?"pale":l>.62?"medium":"deep"; }
  else { fam="white"; term=h>=65&&s<.6?"lemongreen":h>=48?"lemon":h>=38?"gold":(l<.5?"brown":"amber"); inten=(l>.82||s<.18)?"pale":l>.62?"medium":"deep"; }
  return {fam,term,inten,hex:"#"+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,"0")).join("")}; }
function sampleAt(cv,px,py){ const c=cv.getContext("2d"), R=Math.max(6,Math.round(Math.min(cv.width,cv.height)*.04)); const d=c.getImageData(Math.max(0,px-R),Math.max(0,py-R),R*2,R*2).data; let r=0,g=0,b=0,n=0;
  for(let i=0;i<d.length;i+=4){ const mx=Math.max(d[i],d[i+1],d[i+2]); if(mx>245&&Math.min(d[i],d[i+1],d[i+2])>235) continue; r+=d[i]; g+=d[i+1]; b+=d[i+2]; n++; } if(!n) return null; return classify(r/n,g/n,b/n); }

/* ---------- label text reading (on device) ---------- */
let TP=null, TW=null; const OCR=new URL("vendor/ocr/",document.baseURI).href;
function loadTess(){ if(W.Tesseract) return Promise.resolve(W.Tesseract); if(TP) return TP; TP=new Promise((res,rej)=>{ const s=document.createElement("script"); s.src=OCR+"tesseract.min.js"; s.onload=()=>res(W.Tesseract); s.onerror=rej; document.head.appendChild(s); }); return TP; }
async function readLabel(dataUrl){
  const im=new Image(); im.src=dataUrl; await im.decode().catch(()=>{});
  let lines=[];
  try{ if("TextDetector" in W){ const det=new W.TextDetector(); const r=await det.detect(im); lines=r.map(z=>({t:z.rawValue,h:z.boundingBox.height})); } }catch(e){}
  if(!lines.length){ const T=await loadTess(); if(!TW) TW=await T.createWorker("eng",1,{workerPath:OCR+"worker.min.js",corePath:OCR,langPath:OCR.replace(/\/$/,""),gzip:true}); const r=await TW.recognize(dataUrl); lines=((r&&r.data&&r.data.lines)||[]).filter(z=>z.confidence>45).map(z=>({t:z.text,h:z.bbox.y1-z.bbox.y0})); }
  const clean=lines.map(z=>({t:z.t.replace(/[^\p{L}\p{N}' .&-]/gu," ").replace(/\s+/g," ").trim(),h:z.h})).filter(z=>/\p{L}{3}/u.test(z.t)&&z.t.length<=48);
  const seen=new Set(); const out=clean.sort((a,b)=>b.h-a.h).filter(z=>{ const k=z.t.toLowerCase(); if(seen.has(k)) return false; seen.add(k); return true; }).slice(0,8).map(z=>z.t);
  const yr=(lines.map(z=>z.t).join(" ").match(/\b(19[5-9]\d|20[0-4]\d)\b/)||[])[0]||"";
  const top=clean.length?Math.max(...clean.map(z=>z.h)):0; const big=clean.filter(z=>z.h>=top*.7).slice(0,3).map(z=>z.t);
  return {lines:out,year:yr,name:big.join(" "),raw:lines.map(z=>z.t).join(" ")}; }

/* ---------- state ---------- */
let LIST=[], CUR=null, MODE="list", Q="", F="", LOADED=false, MSG="";
const SC={sw:["dr","od","me","swt"],ac:["lo","ml","me","mh","hi"],tan:["lo","ml","me","mh","hi"],alc:["lo","me","hi"],body:["li","ml","me","mh","fu"],fin:["sh","ml","me","mh","lg"]};
const TYPES=["white","rose","red","spark","sweet","fort"], QUAL=["poor","acc","good","vg","out"];
const fresh=()=>({id:"w"+Date.now().toString(36)+Math.random().toString(36).slice(2,6),ts:Date.now(),date:new Date().toISOString().slice(0,10),name:"",prod:"",vint:"",type:"",grape:"",region:"",col:null,s:{},nose:"",pal:"",q:"",rate:0,notes:"",label:"",glass:"",ocr:null});
async function load(){ LIST=(await all()).sort((a,b)=>b.ts-a.ts); LOADED=true; }

/* ---------- views ---------- */
const typeLbl=k=>k?x("t_"+k):"";
function card(w){ const c=w.col; return `<button type="button" class="cl-item" data-cel="open" data-id="${w.id}">
  <span class="cl-th">${w.label?`<img src="${w.label}" alt="">`:w.glass?`<img src="${w.glass}" alt="">`:"🍷"}</span>
  <span class="cl-tx"><b>${es(w.name)}${w.vint?` <i>${es(w.vint)}</i>`:""}</b><span>${w.db&&w.db.c?ctry(w.db.c)[0]+" ":""}${es([w.prod,w.region].filter(Boolean).join(" · "))}</span>
  <span class="cl-tags">${w.type?`<em class="cl-ty t-${w.type}">${es(typeLbl(w.type))}</em>`:""}${c?`<em class="cl-sw" style="--c:${c.hex}"></em>${es(x("c_"+c.term))}`:""}${w.rate?` <span class="cl-st">${"★".repeat(w.rate)}</span>`:""}</span></span></button>`; }
function listHTML(){
  if(!LOADED){ load().then(()=>W.render&&W.render()); }
  const q=Q.toLowerCase(); const L=LIST.filter(w=>(!F||w.type===F)&&(!q||[w.name,w.prod,w.grape,w.region,w.notes].join(" ").toLowerCase().includes(q)));
  return `<section class="view cellar">
   <p class="cl-intro">${es(x("celIntro"))}</p>
   <button type="button" class="btn primary cl-add" data-cel="new">＋ ${es(x("add"))}</button>
   ${LIST.length?`<div class="cl-bar"><input type="search" id="cl-q" placeholder="${es(x("search"))}" value="${es(Q)}"><div class="cl-f">${["",...TYPES].map(k=>`<button type="button" data-cel="f" data-f="${k}" aria-pressed="${F===k}">${es(k?typeLbl(k):x("all"))}</button>`).join("")}</div></div>
   <p class="cl-count">${L.length} ${es(x(L.length===1?"n1":"n"))}</p><div class="cl-list">${L.map(card).join("")}</div>`:`<p class="cl-empty">${es(x("empty"))}</p>`}
   <p class="cl-local">🔒 ${es(x("local"))}</p></section>`; }
function scaleRow(k){ const v=CUR.s[k]||""; return `<div class="cl-sc"><span>${es(x(k))}</span><div>${SC[k].map(o=>`<button type="button" data-cel="sc" data-k="${k}" data-v="${o}" aria-pressed="${v===o}">${es(x(o))}</button>`).join("")}</div></div>`; }
function photo(kind){ const src=CUR[kind]; const isG=kind==="glass";
  return `<div class="cl-ph">
   <p class="cl-lab">${es(x(isG?"glass":"label"))}</p>
   ${src?`<div class="cl-pic ${isG?"cl-tap":""}">${isG?`<canvas id="cl-cv"></canvas>${CUR.col&&CUR.col.px!=null?`<i class="cl-dot" style="left:${CUR.col.px*100}%;top:${CUR.col.py*100}%"></i>`:""}`:`<img src="${src}" alt="">`}</div>
     ${isG?`<p class="cl-hint">${es(x("tapWine"))}</p>`:""}
     <label class="btn ghost sm">${es(x("retake"))}<input type="file" accept="image/*" capture="environment" data-cel-file="${kind}" hidden></label>`
   :`<label class="cl-shot">${es(x(isG?"takeG":"takeL"))}<input type="file" accept="image/*" capture="environment" data-cel-file="${kind}" hidden></label>`}
   ${!isG&&CUR.ocr?(CUR.ocr==="busy"?`<p class="cl-hint">⏳ ${es(x("reading"))}</p>`:CUR.ocr==="fail"?`<p class="cl-hint">${es(x("readFail"))}</p>`:CUR.ocr.lines&&CUR.ocr.lines.length?`<p class="cl-hint">${es(x("sugg"))}</p><div class="cl-chips">${CUR.ocr.lines.map((l,i)=>`<button type="button" data-cel="chip" data-i="${i}">${es(l)}</button>`).join("")}</div>`:`<p class="cl-hint">${es(x("readFail"))}</p>`):""}
   ${isG&&CUR.col?`<div class="cl-col"><i style="background:${CUR.col.hex}"></i><span>${es(x("colAuto"))}<b>${es(x("c_"+CUR.col.term))}</b> · ${es(x("i_"+CUR.col.inten))}</span></div>`:""}
  </div>`; }
function inp(k,lbl,type){ return `<label class="cl-in"><span>${es(x(lbl))}</span><input ${type?`type="${type}"`:""} data-cel-in="${k}" value="${es(CUR[k])}"></label>`; }
function area(k,lbl){ return `<label class="cl-in"><span>${es(x(lbl))}</span><textarea rows="2" data-cel-in="${k}">${es(CUR[k])}</textarea></label>`; }
function editHTML(){ const w=CUR;
  return `<section class="view cellar">
   <button type="button" class="cl-back" data-cel="list">${es(x("back"))}</button>
   <div class="cl-phs">${photo("label")}${photo("glass")}</div>
   <div class="cl-form">${CUR.db?`<p class="vv-found">✓ ${es(y("found"))}: <b>${es(CUR.db.name)}</b>${CUR.db.c?" "+ctry(CUR.db.c)[0]:""}</p>`:""}${searchBox()}
    ${inp("name","name")}${inp("prod","prod")}
    <div class="cl-2">${inp("vint","vint")}${inp("date","when","date")}</div>
    <div class="cl-in"><span>${es(x("type"))}</span><div class="cl-seg">${TYPES.map(k=>`<button type="button" data-cel="type" data-v="${k}" aria-pressed="${w.type===k}">${es(typeLbl(k))}</button>`).join("")}</div></div>
    ${inp("grape","grape")}${inp("region","region")}
    <h2>${es(x("struct"))}</h2>
    ${(SPM?["sw","alc","body","fin"]:["sw","ac",w.type==="white"||w.type==="spark"?null:"tan","alc","body","fin"]).filter(Boolean).map(scaleRow).join("")}
    ${area("nose","nose")}${area("pal","pal")}
    <div class="cl-in"><span>${es(x("qual"))}</span><div class="cl-seg">${QUAL.map(k=>`<button type="button" data-cel="q" data-v="${k}" aria-pressed="${w.q===k}">${es(x("q_"+k))}</button>`).join("")}</div></div>
    <div class="cl-in"><span>${es(x("rate"))}</span><div class="cl-stars">${[1,2,3,4,5].map(n=>`<button type="button" data-cel="rate" data-v="${n}" aria-pressed="${w.rate>=n}">★</button>`).join("")}</div></div>
    ${area("notes","notes")}
    ${MSG?`<p class="cl-msg">${es(MSG)}</p>`:""}
    <div class="cl-act"><button type="button" class="btn primary" data-cel="save">${es(x("save"))}</button>${LIST.some(z=>z.id===w.id)?`<button type="button" class="btn ghost cl-del" data-cel="del">${es(x("del"))}</button>`:""}</div>
   </div></section>`; }
W.renderCellar=function(){ return MODE==="edit"&&CUR?editHTML():MODE==="view"&&CUR?viewHTML():listHTML(); };
function after(){ if(MODE==="edit"&&CUR&&CUR.glass){ const cv=document.getElementById("cl-cv"); if(!cv) return; const im=new Image(); im.onload=()=>{ const s=Math.min(1,900/Math.max(im.width,im.height)); cv.width=Math.round(im.width*s); cv.height=Math.round(im.height*s); cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height); }; im.src=CUR.glass; } }
function rr(){ if(typeof W.render==="function") W.render(); }

/* hook into the app's render: draw the glass canvas after each render of this view */
const mo=new MutationObserver(()=>{ if(typeof view!=="undefined"&&view==="cellar") after(); });
mo.observe(document.getElementById("main"),{childList:true});

/* ---------- events ---------- */
document.addEventListener("click",async e=>{
  const b=e.target.closest&&e.target.closest("[data-cel]"); if(b){ const k=b.dataset.cel; e.preventDefault();
    if(k==="new"){ CUR=fresh(); MODE="edit"; MSG=""; SQ=""; rr(); return; }
    if(k==="open"){ const w=LIST.find(z=>z.id===b.dataset.id); if(w){ CUR=JSON.parse(JSON.stringify(w)); MODE="view"; MSG=""; rr(); window.scrollTo(0,0); } return; }
    if(k==="edit"){ MODE="edit"; SQ=""; rr(); return; }
    if(k==="pick"){ const D=DBX(); const e=D&&D.search(SQ)[+b.dataset.i]; if(e){ if(!CUR.name) CUR.name=e.name; applyDB(e,""); SQ=""; rr(); } return; }
    if(k==="list"){ MODE="list"; CUR=null; rr(); return; }
    if(k==="f"){ F=b.dataset.f; rr(); return; }
    if(k==="type"){ CUR.type=CUR.type===b.dataset.v?"":b.dataset.v; rr(); return; }
    if(k==="q"){ CUR.q=CUR.q===b.dataset.v?"":b.dataset.v; rr(); return; }
    if(k==="rate"){ const n=+b.dataset.v; CUR.rate=CUR.rate===n?0:n; rr(); return; }
    if(k==="sc"){ const kk=b.dataset.k; CUR.s[kk]=CUR.s[kk]===b.dataset.v?"":b.dataset.v; rr(); return; }
    if(k==="chip"){ const v=CUR.ocr.lines[+b.dataset.i]; if(!CUR.name) CUR.name=v; else if(!CUR.prod&&CUR.name!==v) CUR.prod=v; else CUR.name=v; rr(); return; }
    if(k==="save"){ if(!CUR.name.trim()){ MSG=x("need"); rr(); return; } const w=Object.assign({},CUR); if(w.ocr&&typeof w.ocr!=="object") w.ocr=null; w.ts=w.ts||Date.now(); await put(w); await load(); CUR=JSON.parse(JSON.stringify(w)); MODE="view"; MSG=""; rr(); window.scrollTo(0,0); toast(x("saved")); return; }
    if(k==="del"){ if(!confirmDel()) return; await del(CUR.id); await load(); MODE="list"; CUR=null; rr(); return; }
  }
  const cv=e.target.closest&&e.target.closest("#cl-cv"); if(cv&&CUR){ const r=cv.getBoundingClientRect(); const fx=(e.clientX-r.left)/r.width, fy=(e.clientY-r.top)/r.height; const c=sampleAt(cv,Math.round(fx*cv.width),Math.round(fy*cv.height)); if(c){ CUR.col=Object.assign(c,{px:fx,py:fy}); if(!SPM&&(!CUR.type||["white","rose","red"].includes(CUR.type))) CUR.type=c.fam; rr(); } }
});
let delArm=0; function confirmDel(){ const n=Date.now(); if(n-delArm<4000){ delArm=0; return true; } delArm=n; toast(x("delQ")+" ↻"); return false; }
function toast(s){ let d=document.getElementById("cl-toast"); if(!d){ d=document.createElement("div"); d.id="cl-toast"; document.body.appendChild(d); } d.textContent=s; d.classList.add("on"); clearTimeout(d._t); d._t=setTimeout(()=>d.classList.remove("on"),2400); }
document.addEventListener("input",e=>{ const el=e.target; if(el.id==="cl-db"){ SQ=el.value; const p=el.selectionStart; rr(); const n=document.getElementById("cl-db"); if(n){ n.focus(); try{n.setSelectionRange(p,p)}catch(_){} } return; } if(el.id==="cl-q"){ Q=el.value; const p=el.selectionStart; rr(); const n=document.getElementById("cl-q"); if(n){ n.focus(); try{n.setSelectionRange(p,p)}catch(_){} } return; }
  const k=el.dataset&&el.dataset.celIn; if(k&&CUR) CUR[k]=el.value; });
document.addEventListener("change",async e=>{ const el=e.target; const kind=el.dataset&&el.dataset.celFile; if(!kind||!CUR||!el.files||!el.files[0]) return;
  const f=el.files[0];
  if(kind==="label"){ CUR.label=await shrink(f,1100); CUR.ocr="busy"; rr();
    try{ const r=await readLabel(CUR.label); if(!CUR) return; CUR.ocr=r; if(r.year&&!CUR.vint) CUR.vint=r.year; try{ const D=DBX(); const m=D&&D.match(r.raw); if(m) applyDB(m,r.raw); else if(D) CUR.ex=D.extras(r.raw); }catch(_){} if(!CUR.name&&(r.name||r.lines[0])) CUR.name=r.name||r.lines[0]; }catch(err){ if(CUR) CUR.ocr="fail"; }
    rr(); }
  else { CUR.glass=await shrink(f,1000); CUR.col=null; rr();
    /* first guess: centre of the photo, where the wine usually is */
    setTimeout(()=>{ const cv=document.getElementById("cl-cv"); if(!cv||!CUR) return; const tryIt=()=>{ if(!cv.width||cv.width<10) return setTimeout(tryIt,80); const c=sampleAt(cv,Math.round(cv.width*.5),Math.round(cv.height*.55)); if(c){ CUR.col=Object.assign(c,{px:.5,py:.55}); if(!CUR.type&&!SPM) CUR.type=c.fam; rr(); } }; tryIt(); },60); }
});

/* ---------- register the view in the app ---------- */
try{ TABG.cellar="wine"; SUBV.cellar="wine"; SUBT.cellar="cel"; ["it","fr","en"].forEach(l=>{ T[l].cel=TX[l].cel; T[l].tr_cellar=TX[l].cel; T[l].trd_cellar=TX[l].celD; }); }catch(e){}
try{ ICO.cellar='<svg viewBox="0 0 48 48"><rect x="6" y="6" width="36" height="36" rx="10" fill="#7a1f3d"/><path d="M18 11h12l-1 9a5 5 0 0 1-10 0z" fill="#fff"/><path d="M24 25v8M19 35h10" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="33" cy="14" r="4" fill="#e9c46a"/></svg>'; }catch(e){}
const celCard=()=>`<button type="button" class="schome clhome" data-go="cellar"><span class="scic">${SPM?"🥃":"🍷"}</span><span><b>${es(x("cel"))}</b><small>${es(x("celD"))}</small></span><i>▸</i></button>`;
try{ const RW=W.renderWine; if(typeof RW==="function"){ W.renderWine=function(){ const h=RW.apply(this,arguments); return h.includes('class="rvpod2"')?h.replace('<button type="button" class="rvpod2"',celCard()+'<button type="button" class="rvpod2"'):h.replace(/(<\/header>)/,"$1"+celCard()); }; } }catch(e){}
try{ const RH=W.renderHome; if(typeof RH==="function"){ W.renderHome=function(){ const h=RH.apply(this,arguments); return h.includes('class="schome" data-go="school"')?h.replace('<button type="button" class="schome" data-go="school"',celCard()+'<button type="button" class="schome" data-go="school"'):h; }; } }catch(e){}
const st=document.createElement("style"); st.textContent=`
.cellar{max-width:760px;margin:0 auto}
.cl-kick{margin:0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--wine,#7a1f3d);font-weight:700}
.cellar h1{margin:4px 0 6px}.cl-intro{margin:0 0 14px;color:var(--muted,#5d6660);line-height:1.45}
.cl-add{width:100%;padding:14px;font-size:16px;margin-bottom:14px}
.cl-bar{display:flex;flex-direction:column;gap:8px;margin-bottom:8px}.cl-bar input{width:100%;padding:11px 14px;border-radius:12px;border:1px solid var(--line,#e5ddd3);background:var(--surface,#fff);color:inherit;font:inherit}
.cl-f,.cl-seg{display:flex;flex-wrap:wrap;gap:6px}.cl-f button,.cl-seg button,.cl-sc button,.cl-chips button{border:1px solid var(--line,#e5ddd3);background:var(--surface,#fff);color:inherit;border-radius:999px;padding:6px 12px;font:inherit;font-size:13.5px;cursor:pointer}
.cl-f button[aria-pressed=true],.cl-seg button[aria-pressed=true],.cl-sc button[aria-pressed=true]{background:var(--wine,#7a1f3d);border-color:var(--wine,#7a1f3d);color:#fff}
.cl-count{font-size:13px;color:var(--faint,#8a8f8b);margin:6px 0}
.cl-list{display:grid;gap:10px}.cl-item{display:flex;gap:12px;align-items:center;text-align:left;border:1px solid var(--line,#e5ddd3);background:var(--surface,#fff);border-radius:16px;padding:10px;cursor:pointer;color:inherit;font:inherit}
.cl-th{flex:0 0 64px;height:64px;border-radius:12px;overflow:hidden;background:var(--sunk,#f3eee8);display:grid;place-items:center;font-size:28px}.cl-th img{width:100%;height:100%;object-fit:cover}
.cl-tx{display:flex;flex-direction:column;gap:2px;min-width:0}.cl-tx b{font-size:15.5px}.cl-tx b i{font-style:normal;color:var(--muted,#5d6660);font-weight:500}.cl-tx>span{font-size:13px;color:var(--muted,#5d6660)}
.cl-tags{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.cl-ty{font-style:normal;font-size:11.5px;padding:2px 8px;border-radius:999px;background:var(--wine-s,#f6e3ea);color:var(--wine,#7a1f3d);font-weight:700}
.cl-sw{display:inline-block;width:14px;height:14px;border-radius:50%;background:var(--c);box-shadow:0 0 0 1px rgba(0,0,0,.15)}.cl-st{color:#d4a017;letter-spacing:1px}
.cl-empty{padding:30px 16px;text-align:center;border:1px dashed var(--line,#e5ddd3);border-radius:16px;color:var(--muted,#5d6660)}
.cl-local{font-size:12.5px;color:var(--faint,#8a8f8b);margin-top:14px}
.cl-back{border:0;background:none;color:var(--wine,#7a1f3d);font:inherit;font-weight:700;padding:4px 0 12px;cursor:pointer}
.cl-phs{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px}@media(max-width:560px){.cl-phs{grid-template-columns:1fr}}
.cl-ph{border:1px solid var(--line,#e5ddd3);border-radius:16px;padding:12px;background:var(--surface,#fff);display:flex;flex-direction:column;gap:8px}
.cl-lab{margin:0;font-weight:700}.cl-shot{display:grid;place-items:center;min-height:150px;border:2px dashed var(--line2,#d8cfc4);border-radius:14px;cursor:pointer;font-weight:700;color:var(--wine,#7a1f3d);text-align:center;padding:12px}
.cl-pic{position:relative;border-radius:12px;overflow:hidden;background:#000}.cl-pic img,.cl-pic canvas{display:block;width:100%;height:auto;max-height:340px;object-fit:contain}.cl-tap canvas{cursor:crosshair}
.cl-dot{position:absolute;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 0 2px rgba(0,0,0,.45);pointer-events:none}
.cl-hint{margin:0;font-size:13px;color:var(--muted,#5d6660)}.cl-chips{display:flex;flex-wrap:wrap;gap:6px}
.cl-col{display:flex;align-items:center;gap:10px;font-size:14px}.cl-col i{flex:0 0 34px;height:34px;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(255,255,255,.5),0 0 0 1px rgba(0,0,0,.2)}.cl-col b{margin-left:4px}
.cl-form{display:flex;flex-direction:column;gap:12px}.cl-form h2{margin:8px 0 0;font-size:18px}
.cl-in{display:flex;flex-direction:column;gap:6px}.cl-in>span{font-size:13px;font-weight:700;color:var(--muted,#5d6660)}
.cl-in input,.cl-in textarea{width:100%;padding:11px 13px;border-radius:12px;border:1px solid var(--line,#e5ddd3);background:var(--surface,#fff);color:inherit;font:inherit;box-sizing:border-box}
.cl-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.cl-sc{display:flex;flex-direction:column;gap:6px}.cl-sc>span{font-size:13px;font-weight:700;color:var(--muted,#5d6660)}.cl-sc>div{display:flex;flex-wrap:wrap;gap:6px}
.cl-stars button{border:0;background:none;font-size:30px;color:var(--line2,#d8cfc4);cursor:pointer;padding:0 2px}.cl-stars button[aria-pressed=true]{color:#d4a017}
.cl-act{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}.cl-act .primary{flex:1;padding:14px}.cl-del{color:var(--bad,#b3261e)}
.cl-msg{color:var(--bad,#b3261e);margin:0}
#cl-toast{position:fixed;left:50%;bottom:90px;transform:translate(-50%,20px);background:#2a2230;color:#fff;padding:10px 16px;border-radius:999px;font-size:14px;opacity:0;transition:.25s;z-index:9999;pointer-events:none}#cl-toast.on{opacity:1;transform:translate(-50%,0)}
.clhome{margin-bottom:12px}
.vv-found{margin:0;padding:10px 14px;border-radius:12px;background:var(--green-s,#e5f4e4);font-size:14px}
.vv-srch{display:flex;flex-direction:column;gap:6px}.vv-res{display:grid;gap:6px}.vv-res button{display:flex;flex-direction:column;gap:2px;text-align:left;border:1px solid var(--line,#e5ddd3);background:var(--surface,#fff);color:inherit;border-radius:12px;padding:9px 12px;font:inherit;cursor:pointer}.vv-res span{font-size:12.5px;color:var(--muted,#5d6660)}
.vv-hero{border-radius:20px;overflow:hidden;background:linear-gradient(160deg,#3a2232,#7a1f3d);display:grid;place-items:center;max-height:360px;margin-bottom:14px}.vv-hero img{width:100%;max-height:360px;object-fit:contain;display:block}.vv-ph{font-size:80px;padding:40px}
.vv-head h1{margin:2px 0 4px;font-size:26px;line-height:1.15}.vv-head h1 span{color:var(--muted,#5d6660);font-weight:500}.vv-prod{margin:0;font-weight:700;color:var(--wine,#7a1f3d);text-transform:uppercase;letter-spacing:.06em;font-size:12.5px}
.vv-reg{margin:0 0 8px;color:var(--muted,#5d6660)}.vv-tags{display:flex;flex-wrap:wrap;gap:6px}.vv-tag{font-style:normal;font-size:12px;padding:3px 9px;border-radius:999px;border:1px solid var(--line,#e5ddd3);display:inline-flex;align-items:center;gap:5px}
.vv-rate{font-size:24px;color:#d4a017;margin:8px 0 0;letter-spacing:2px}.vv-rate span{color:var(--line2,#d8cfc4)}
.vv-card{margin-top:14px;padding:16px;border-radius:18px;border:1px solid var(--line,#e5ddd3);background:var(--surface,#fff)}.vv-card h2{margin:0 0 10px;font-size:16px}.vv-card p{margin:0 0 6px;line-height:1.5}
.vv-bar{display:grid;grid-template-columns:84px 1fr 84px;align-items:center;gap:10px;margin:10px 0;font-size:13px}.vv-bar span:last-child{text-align:right}.vv-bar i{position:relative;height:8px;border-radius:99px;background:var(--sunk,#efe8e0)}.vv-bar b{position:absolute;top:50%;width:34px;height:12px;margin:-6px 0 0 -17px;border-radius:99px;background:var(--wine,#7a1f3d)}
.vv-chips{display:flex;flex-wrap:wrap;gap:8px}.vv-chips span{padding:6px 12px;border-radius:999px;background:var(--wine-s,#f6e3ea);font-size:13.5px}.vv-chips.food span{background:var(--sunk,#f3eee8)}
.vv-facts{display:grid;grid-template-columns:1fr 1fr;gap:12px}.vv-facts small{display:block;color:var(--muted,#5d6660);font-size:12px}.vv-facts b{font-size:15px}`;
document.head.appendChild(st);
})();

/* ---------- the scanner, front and centre: floating camera button + card at the top of Today ---------- */
(function(){
const SPM2=(()=>{ try{ return typeof L2!=="undefined"&&L2&&L2.track==="spirits"; }catch(e){ return false; } })();
const LB={it:["Scanner","Fotografa un'etichetta: riconosco "+(SPM2?"il distillato":"il vino")+" e lo salvo nel tuo diario",SPM2?"Scanner distillati":"Scanner vini"],
 fr:["Scanner","Photographiez une étiquette : je reconnais "+(SPM2?"le spiritueux":"le vin")+" et je l'enregistre dans votre carnet",SPM2?"Scanner spiritueux":"Scanner vins"],
 en:["Scan","Snap a label: I recognise the "+(SPM2?"spirit":"wine")+" and save it to your diary",SPM2?"Spirits scanner":"Wine scanner"],
 es:["Escáner","Fotografía una etiqueta: reconozco "+(SPM2?"el destilado":"el vino")+" y lo guardo en tu diario",SPM2?"Escáner de destilados":"Escáner de vinos"],
 "es-ar":["Escáner","Sacale foto a una etiqueta: reconozco "+(SPM2?"el destilado":"el vino")+" y lo guardo en tu diario",SPM2?"Escáner de destilados":"Escáner de vinos"]};
const lb=i=>{ let l="en"; try{ l=localStorage.getItem("wset3-lang")||"en"; }catch(e){} return (LB[l]||LB.en)[i]; };
const HIDE=new Set(["cellar","quiz","exam","film","pod","onb","welcome","login"]);
const CAM='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.6"/></svg>';
function openScan(){ try{ go("cellar"); }catch(e){ try{ window.go&&window.go("cellar"); }catch(_){} } setTimeout(()=>{ const b=document.querySelector('[data-cel="new"]'); if(b) b.click(); },120); }
let fab=null;
function sync(){ if(!fab){ fab=document.createElement("button"); fab.type="button"; fab.className="scanfab"; fab.addEventListener("click",openScan); document.body.appendChild(fab); }
  fab.innerHTML=CAM+"<span>"+lb(0)+"</span>"; fab.setAttribute("aria-label",lb(2));
  const v=(typeof view!=="undefined")?view:""; const busy=(typeof quiz!=="undefined"&&quiz)||document.querySelector(".ob,.onb,.quizview,.view.quiz,.view.exam");
  fab.hidden=HIDE.has(v)||!!busy;
  const m=document.getElementById("main"); if(m&&v==="home"&&!m.querySelector(".scanhero")){ const h=document.createElement("button"); h.type="button"; h.className="scanhero"; h.innerHTML='<span class="sh-ic">'+CAM+'</span><span class="sh-tx"><b>'+lb(2)+'</b><small>'+lb(1)+'</small></span><span class="sh-go">'+lb(0)+' ›</span>'; h.addEventListener("click",openScan);
    const sec=m.querySelector("section.view"); if(sec) sec.insertBefore(h,sec.firstChild); }
}
new MutationObserver(()=>{ clearTimeout(sync.t); sync.t=setTimeout(sync,30); }).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener("DOMContentLoaded",sync); setTimeout(sync,300);
const st=document.createElement("style"); st.textContent=`
.scanfab{position:fixed;right:16px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:60;display:flex;align-items:center;gap:8px;padding:12px 18px 12px 14px;border:0;border-radius:999px;background:linear-gradient(135deg,#8a1c3f,#5e1028);color:#fff;font:700 15px/1 inherit;box-shadow:0 8px 22px rgba(94,16,40,.38),0 0 0 4px rgba(255,255,255,.85);cursor:pointer;animation:scpulse 2.6s ease-in-out 3}
.scanfab[hidden]{display:none}.scanfab:active{transform:scale(.96)}
@keyframes scpulse{0%,100%{box-shadow:0 8px 22px rgba(94,16,40,.38),0 0 0 4px rgba(255,255,255,.85)}50%{box-shadow:0 8px 22px rgba(94,16,40,.38),0 0 0 10px rgba(138,28,63,.18)}}
@media (min-width:900px){.scanfab{bottom:28px;right:28px}}
.scanhero{display:flex;align-items:center;gap:14px;width:100%;margin:0 0 14px;padding:16px;border:0;border-radius:20px;text-align:left;cursor:pointer;color:#fff;background:radial-gradient(120% 140% at 0% 0%,#a32a52 0%,#6b1430 55%,#3f0a1c 100%);box-shadow:0 10px 26px rgba(94,16,40,.25)}
.scanhero .sh-ic{flex:0 0 52px;height:52px;border-radius:16px;display:grid;place-items:center;background:rgba(255,255,255,.16)}
.scanhero .sh-tx{flex:1;display:flex;flex-direction:column;gap:4px}.scanhero b{font-size:17px}.scanhero small{font-size:13px;opacity:.9;line-height:1.35}
.scanhero .sh-go{flex:0 0 auto;padding:8px 12px;border-radius:999px;background:#e9c46a;color:#3f0a1c;font-weight:800;font-size:13px}
html[dir=rtl] .scanfab{right:auto;left:16px}`;
document.head.appendChild(st);
})();
