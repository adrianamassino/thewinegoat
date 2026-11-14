/* The Wine Goat — compact wine knowledge base used by "My wines" to recognise a label
   (appellations, regions, classic wines and grapes) and build a Vivino-style card:
   region, country, grapes, style, taste profile, aromas, food pairings, serving and ageing.
   Profile = [body, tannin, acidity, sweetness] on 1–5. Colour: r red, w white, p rosé, s sparkling, f fortified, d sweet.
   a = aroma codes, f = food codes, t = serving temp code, y = [drink from, to] years after vintage. */
window.TWG_WINEDB = (function(){
const A = (s) => s.split(" ");
const D = [
// ---------------- FRANCE
["Champagne",["champagne","blanc de blancs","blanc de noirs"],"FR","Champagne","s",["Chardonnay","Pinot Noir","Meunier"],[2,1,5,1],A("citrus apple brioche toast almond"),A("aperitif shellfish fish sushi cheese_soft"),"s",[0,10]],
["Crémant",["cremant"],"FR","France","s",["Chardonnay","Pinot Noir","Chenin Blanc"],[2,1,4,1],A("apple citrus brioche floral"),A("aperitif fish shellfish"),"s",[0,4]],
["Chablis",["chablis"],"FR","Burgundy","w",["Chardonnay"],[2,1,5,1],A("citrus apple mineral saline"),A("shellfish fish sushi cheese_soft"),"w",[1,10]],
["Meursault",["meursault"],"FR","Burgundy · Côte de Beaune","w",["Chardonnay"],[4,1,3,1],A("peach butter nuts vanilla toast"),A("fish chicken risotto cheese_soft"),"w",[3,15]],
["Puligny-Montrachet",["puligny","montrachet","chassagne"],"FR","Burgundy · Côte de Beaune","w",["Chardonnay"],[3,1,4,1],A("citrus peach mineral nuts toast"),A("fish shellfish chicken"),"w",[3,15]],
["Pouilly-Fuissé / Mâcon",["pouilly-fuisse","pouilly fuisse","macon","saint-veran","st-veran"],"FR","Burgundy · Mâconnais","w",["Chardonnay"],[3,1,3,1],A("apple peach citrus butter"),A("fish chicken cheese_soft"),"w",[1,6]],
["Bourgogne rouge",["bourgogne","gevrey","chambertin","vosne","nuits-saint-georges","nuits saint georges","volnay","pommard","beaune","chambolle","morey","clos de vougeot","corton","mercurey","givry"],"FR","Burgundy","r",["Pinot Noir"],[2,2,4,1],A("redfruit cherry strawberry earth mushroom"),A("chicken pork game mushrooms cheese_soft"),"rl",[3,15]],
["Beaujolais",["beaujolais","morgon","fleurie","moulin-a-vent","moulin a vent","brouilly","julienas","chiroubles"],"FR","Beaujolais","r",["Gamay"],[2,1,4,1],A("redfruit strawberry cherry floral"),A("cured_meats pork chicken cheese_soft"),"rl",[0,5]],
["Bordeaux (Médoc)",["medoc","pauillac","margaux","saint-julien","st-julien","saint-estephe","st-estephe","haut-medoc","graves","pessac"],"FR","Bordeaux · Left Bank","r",["Cabernet Sauvignon","Merlot","Cabernet Franc"],[4,4,4,1],A("blackcurrant blackfruit cedar tobacco vanilla"),A("lamb beef game cheese_hard"),"r",[5,25]],
["Bordeaux (Saint-Émilion, Pomerol)",["saint-emilion","st-emilion","saint emilion","pomerol","fronsac","castillon","lalande"],"FR","Bordeaux · Right Bank","r",["Merlot","Cabernet Franc"],[4,3,3,1],A("plum blackfruit cherry vanilla earth"),A("lamb beef game mushrooms"),"r",[4,20]],
["Bordeaux",["bordeaux","entre-deux-mers","entre deux mers"],"FR","Bordeaux","r",["Merlot","Cabernet Sauvignon"],[3,3,3,1],A("plum blackcurrant herbal"),A("beef lamb cheese_hard"),"r",[2,8]],
["Sauternes",["sauternes","barsac","monbazillac","loupiac"],"FR","Bordeaux","d",["Sémillon","Sauvignon Blanc"],[4,1,4,5],A("honey apricot dried citrus vanilla"),A("blue_cheese dessert foie_gras"),"d",[3,40]],
["Sancerre / Pouilly-Fumé",["sancerre","pouilly-fume","pouilly fume","menetou","quincy","reuilly"],"FR","Loire","w",["Sauvignon Blanc"],[2,1,5,1],A("citrus herbal mineral gooseberry"),A("goat_cheese fish shellfish salad"),"w",[0,5]],
["Vouvray / Savennières",["vouvray","savennieres","montlouis","anjou","saumur","coteaux du layon"],"FR","Loire","w",["Chenin Blanc"],[3,1,5,2],A("apple honey floral citrus"),A("pork chicken fish cheese_soft"),"w",[1,15]],
["Muscadet",["muscadet"],"FR","Loire","w",["Melon de Bourgogne"],[1,1,4,1],A("citrus apple saline"),A("shellfish fish"),"w",[0,4]],
["Chinon / Bourgueil",["chinon","bourgueil","saumur-champigny"],"FR","Loire","r",["Cabernet Franc"],[2,2,4,1],A("redfruit herbal pepper"),A("pork chicken cured_meats"),"rl",[1,8]],
["Alsace Riesling",["alsace riesling","riesling alsace"],"FR","Alsace","w",["Riesling"],[2,1,5,1],A("citrus peach floral mineral petrol"),A("fish pork spicy sushi"),"w",[1,15]],
["Alsace",["alsace","gewurztraminer","gewürztraminer","pinot gris alsace"],"FR","Alsace","w",["Gewürztraminer","Pinot Gris","Riesling"],[3,1,3,2],A("rose lychee spice peach"),A("spicy cheese_soft pork"),"w",[1,8]],
["Côte-Rôtie / Hermitage",["cote-rotie","cote rotie","hermitage","crozes","cornas","saint-joseph","st-joseph"],"FR","Northern Rhône","r",["Syrah"],[4,4,4,1],A("blackfruit pepper violet smoke"),A("lamb beef game bbq"),"r",[3,20]],
["Condrieu",["condrieu"],"FR","Northern Rhône","w",["Viognier"],[4,1,2,1],A("peach floral apricot"),A("chicken fish spicy"),"w",[0,4]],
["Châteauneuf-du-Pape",["chateauneuf","gigondas","vacqueyras","rasteau","lirac"],"FR","Southern Rhône","r",["Grenache","Syrah","Mourvèdre"],[5,3,3,1],A("redfruit plum spice herbal licorice"),A("lamb game beef bbq"),"r",[3,20]],
["Côtes du Rhône",["cotes du rhone","cotes-du-rhone","ventoux","luberon"],"FR","Southern Rhône","r",["Grenache","Syrah"],[3,2,3,1],A("redfruit spice herbal"),A("pizza pork bbq cured_meats"),"r",[1,6]],
["Provence rosé",["provence","bandol","cotes de provence","tavel"],"FR","Provence","p",["Grenache","Cinsault","Syrah"],[2,1,4,1],A("strawberry citrus herbal"),A("aperitif salad fish tapas"),"w",[0,3]],
["Languedoc",["languedoc","pays d'oc","pays d oc","minervois","corbieres","fitou","pic saint-loup","roussillon"],"FR","Languedoc-Roussillon","r",["Grenache","Syrah","Carignan"],[4,3,3,1],A("blackfruit spice herbal"),A("bbq lamb pizza"),"r",[1,8]],
["Cahors / Madiran",["cahors","madiran"],"FR","South-West France","r",["Malbec","Tannat"],[5,5,3,1],A("blackfruit plum spice"),A("beef game duck"),"r",[3,15]],
// ---------------- ITALY
["Barolo",["barolo"],"IT","Piedmont","r",["Nebbiolo"],[4,5,5,1],A("cherry rose tar licorice earth"),A("beef game truffle cheese_hard"),"r",[6,30]],
["Barbaresco",["barbaresco"],"IT","Piedmont","r",["Nebbiolo"],[4,5,5,1],A("cherry rose spice earth"),A("beef game mushrooms"),"r",[5,25]],
["Barbera",["barbera"],"IT","Piedmont","r",["Barbera"],[3,2,5,1],A("cherry plum spice"),A("pizza pasta cured_meats"),"r",[1,8]],
["Dolcetto",["dolcetto"],"IT","Piedmont","r",["Dolcetto"],[3,3,3,1],A("blackfruit almond"),A("pasta cured_meats"),"r",[0,4]],
["Moscato d'Asti",["moscato d'asti","moscato d asti","asti spumante","moscato"],"IT","Piedmont","s",["Moscato"],[1,1,3,4],A("peach floral grape"),A("dessert fruit aperitif"),"s",[0,2]],
["Gavi",["gavi","cortese"],"IT","Piedmont","w",["Cortese"],[2,1,4,1],A("citrus apple almond"),A("fish shellfish"),"w",[0,4]],
["Amarone",["amarone"],"IT","Veneto","r",["Corvina","Rondinella"],[5,4,3,2],A("dried cherry chocolate spice"),A("game beef cheese_hard"),"r",[5,25]],
["Valpolicella / Ripasso",["valpolicella","ripasso"],"IT","Veneto","r",["Corvina","Rondinella"],[3,2,4,1],A("cherry redfruit almond"),A("pasta pizza pork"),"rl",[1,8]],
["Soave",["soave"],"IT","Veneto","w",["Garganega"],[2,1,4,1],A("citrus almond floral"),A("fish risotto"),"w",[0,6]],
["Prosecco",["prosecco","valdobbiadene","conegliano"],"IT","Veneto","s",["Glera"],[1,1,4,2],A("apple pear floral"),A("aperitif tapas fish"),"s",[0,2]],
["Franciacorta",["franciacorta","trentodoc","trento doc"],"IT","Lombardy / Trentino","s",["Chardonnay","Pinot Noir"],[2,1,4,1],A("citrus brioche almond"),A("aperitif fish risotto"),"s",[0,8]],
["Pinot Grigio",["pinot grigio","delle venezie"],"IT","North-East Italy","w",["Pinot Grigio"],[1,1,3,1],A("apple citrus"),A("aperitif fish salad"),"w",[0,2]],
["Alto Adige / Friuli",["alto adige","sudtirol","friuli","collio","trentino"],"IT","North-East Italy","w",["Pinot Bianco","Sauvignon Blanc","Gewürztraminer"],[2,1,4,1],A("citrus apple floral mineral"),A("fish chicken cheese_soft"),"w",[0,6]],
["Chianti Classico",["chianti"],"IT","Tuscany","r",["Sangiovese"],[3,3,5,1],A("cherry redfruit herbal earth"),A("pasta pizza beef cheese_hard"),"r",[2,12]],
["Brunello di Montalcino",["brunello","montalcino"],"IT","Tuscany","r",["Sangiovese"],[4,4,5,1],A("cherry leather earth spice"),A("beef game cheese_hard"),"r",[5,25]],
["Vino Nobile di Montepulciano",["vino nobile","nobile di montepulciano"],"IT","Tuscany","r",["Sangiovese"],[3,3,4,1],A("cherry plum spice"),A("beef pasta"),"r",[3,12]],
["Bolgheri / Supertuscan",["bolgheri","sassicaia","ornellaia","toscana igt","supertuscan"],"IT","Tuscany","r",["Cabernet Sauvignon","Merlot"],[4,4,4,1],A("blackcurrant blackfruit vanilla herbal"),A("beef lamb game"),"r",[4,20]],
["Montepulciano d'Abruzzo",["montepulciano d'abruzzo","montepulciano d abruzzo","abruzzo"],"IT","Abruzzo","r",["Montepulciano"],[4,3,3,1],A("blackfruit plum spice"),A("pizza pasta bbq"),"r",[1,6]],
["Verdicchio",["verdicchio"],"IT","Marche","w",["Verdicchio"],[2,1,4,1],A("citrus almond herbal"),A("fish shellfish"),"w",[0,6]],
["Taurasi / Aglianico",["taurasi","aglianico"],"IT","Campania / Basilicata","r",["Aglianico"],[4,5,5,1],A("blackfruit cherry earth spice"),A("game beef"),"r",[5,20]],
["Fiano / Greco",["fiano","greco di tufo"],"IT","Campania","w",["Fiano","Greco"],[3,1,4,1],A("peach citrus nuts floral"),A("fish shellfish"),"w",[1,8]],
["Primitivo",["primitivo","manduria"],"IT","Puglia","r",["Primitivo"],[4,3,3,2],A("dried plum blackfruit spice"),A("bbq pizza"),"r",[1,6]],
["Nero d'Avola",["nero d'avola","nero d avola"],"IT","Sicily","r",["Nero d'Avola"],[3,3,3,1],A("blackfruit plum spice"),A("pizza pasta pork"),"r",[1,6]],
["Etna",["etna","nerello"],"IT","Sicily","r",["Nerello Mascalese"],[3,3,4,1],A("redfruit earth smoke herbal"),A("pork fish mushrooms"),"rl",[2,12]],
["Sagrantino",["sagrantino","montefalco"],"IT","Umbria","r",["Sagrantino"],[5,5,4,1],A("blackfruit spice earth"),A("game beef"),"r",[5,20]],
["Lambrusco",["lambrusco"],"IT","Emilia-Romagna","s",["Lambrusco"],[2,2,4,2],A("redfruit cherry floral"),A("cured_meats pizza pasta"),"s",[0,2]],
["Vermentino",["vermentino"],"IT","Sardinia / Tuscany","w",["Vermentino"],[2,1,4,1],A("citrus herbal saline"),A("fish shellfish"),"w",[0,3]],
// ---------------- SPAIN
["Rioja",["rioja"],"ES","Rioja","r",["Tempranillo","Garnacha"],[3,3,4,1],A("redfruit vanilla coconut leather"),A("lamb pork tapas cheese_hard"),"r",[2,20]],
["Ribera del Duero",["ribera del duero","vega sicilia","pesquera"],"ES","Castilla y León","r",["Tempranillo"],[4,4,4,1],A("blackfruit vanilla spice"),A("lamb beef"),"r",[3,20]],
["Toro",["toro"],"ES","Castilla y León","r",["Tinta de Toro"],[5,4,3,1],A("blackfruit spice vanilla"),A("beef game bbq"),"r",[3,15]],
["Priorat",["priorat","montsant"],"ES","Catalonia","r",["Garnacha","Cariñena"],[5,4,3,1],A("blackfruit mineral spice licorice"),A("lamb game"),"r",[4,20]],
["Rías Baixas (Albariño)",["rias baixas","albarino","albariño"],"ES","Galicia","w",["Albariño"],[2,1,5,1],A("citrus peach saline floral"),A("shellfish fish sushi"),"w",[0,4]],
["Rueda (Verdejo)",["rueda","verdejo"],"ES","Castilla y León","w",["Verdejo"],[2,1,4,1],A("citrus herbal almond"),A("fish salad tapas"),"w",[0,3]],
["Cava",["cava"],"ES","Penedès / Spain","s",["Macabeo","Xarel·lo","Parellada"],[2,1,4,1],A("citrus apple almond toast"),A("aperitif tapas fish"),"s",[0,5]],
["Bierzo (Mencía)",["bierzo","mencia","mencía","ribeira sacra"],"ES","North-West Spain","r",["Mencía"],[3,2,4,1],A("redfruit floral herbal"),A("pork chicken"),"rl",[1,8]],
["Navarra",["navarra"],"ES","Navarra","p",["Garnacha","Tempranillo"],[2,1,4,1],A("strawberry redfruit"),A("tapas salad"),"w",[0,3]],
["Jerez (Fino / Manzanilla)",["fino","manzanilla"],"ES","Jerez","f",["Palomino"],[2,1,3,1],A("almond saline yeast"),A("tapas nuts fish shellfish"),"w",[0,1]],
["Jerez (Amontillado / Oloroso)",["jerez","sherry","amontillado","oloroso","palo cortado"],"ES","Jerez","f",["Palomino"],[4,1,3,1],A("nuts caramel dried spice"),A("cheese_hard nuts cured_meats"),"rl",[0,10]],
["Pedro Ximénez",["pedro ximenez","pedro ximénez"," px "],"ES","Jerez / Montilla","d",["Pedro Ximénez"],[5,1,2,5],A("dried caramel coffee chocolate"),A("dessert blue_cheese chocolate"),"rl",[0,20]],
// ---------------- PORTUGAL
["Porto (Ruby / Vintage)",["porto","port ","vintage port","lbv","late bottled"],"PT","Douro","f",["Touriga Nacional","Touriga Franca"],[5,4,3,4],A("blackfruit plum chocolate spice"),A("blue_cheese chocolate dessert"),"rl",[2,30]],
["Porto Tawny",["tawny"],"PT","Douro","f",["Touriga Nacional","Touriga Franca"],[4,1,3,4],A("nuts caramel dried"),A("dessert nuts cheese_hard"),"rl",[0,10]],
["Douro",["douro"],"PT","Douro","r",["Touriga Nacional","Touriga Franca"],[4,4,3,1],A("blackfruit floral spice"),A("beef lamb"),"r",[2,12]],
["Vinho Verde",["vinho verde","alvarinho"],"PT","Minho","w",["Alvarinho","Loureiro"],[1,1,5,1],A("citrus apple floral"),A("fish shellfish salad"),"w",[0,2]],
["Alentejo / Dão / Bairrada",["alentejo","dao","bairrada"],"PT","Portugal","r",["Aragonez","Touriga Nacional","Baga"],[3,3,3,1],A("redfruit blackfruit spice"),A("pork beef"),"r",[1,10]],
["Madeira",["madeira"],"PT","Madeira","f",["Sercial","Verdelho","Bual","Malmsey"],[3,1,5,3],A("caramel nuts dried citrus"),A("dessert cheese_hard nuts"),"rl",[0,50]],
// ---------------- GERMANY, AUSTRIA, HUNGARY, GREECE
["Mosel Riesling",["mosel","moselle","saar","ruwer","piesport","bernkastel","wehlen"],"DE","Mosel","w",["Riesling"],[1,1,5,2],A("citrus apple peach floral petrol"),A("spicy fish pork sushi"),"w",[1,20]],
["Rheingau / Pfalz / Nahe",["rheingau","pfalz","nahe","rheinhessen","spatlese","kabinett","auslese","trocken","grosses gewachs"],"DE","Germany","w",["Riesling"],[2,1,5,2],A("citrus peach mineral"),A("pork fish spicy"),"w",[1,20]],
["Spätburgunder",["spatburgunder","spätburgunder","baden","ahr"],"DE","Germany","r",["Pinot Noir"],[2,2,4,1],A("redfruit cherry earth"),A("pork chicken mushrooms"),"rl",[2,10]],
["Grüner Veltliner",["gruner","grüner","veltliner","wachau","kamptal","kremstal"],"AT","Austria","w",["Grüner Veltliner"],[2,1,4,1],A("citrus apple pepper herbal"),A("salad veg fish pork"),"w",[0,10]],
["Blaufränkisch / Zweigelt",["blaufrankisch","blaufränkisch","zweigelt","burgenland"],"AT","Austria","r",["Blaufränkisch","Zweigelt"],[3,3,4,1],A("cherry blackfruit pepper"),A("pork game"),"r",[1,10]],
["Tokaji",["tokaji","tokaj","aszu","aszú","furmint"],"HU","Tokaj","d",["Furmint","Hárslevelű"],[4,1,5,5],A("honey apricot citrus dried"),A("blue_cheese dessert foie_gras"),"d",[3,40]],
["Santorini Assyrtiko",["santorini","assyrtiko"],"GR","Santorini","w",["Assyrtiko"],[2,1,5,1],A("citrus mineral saline smoke"),A("fish shellfish"),"w",[0,10]],
["Naoussa (Xinomavro)",["naoussa","xinomavro"],"GR","Macedonia (Greece)","r",["Xinomavro"],[3,4,5,1],A("cherry tomato olive spice"),A("lamb pork"),"r",[3,15]],
// ---------------- NEW WORLD
["Napa Valley Cabernet",["napa"],"US","California · Napa Valley","r",["Cabernet Sauvignon"],[5,4,3,1],A("blackcurrant blackfruit vanilla chocolate"),A("beef lamb bbq"),"r",[3,20]],
["Sonoma / California",["sonoma","russian river","carneros","california","paso robles","lodi"],"US","California","r",["Pinot Noir","Chardonnay","Zinfandel","Cabernet Sauvignon"],[4,3,3,1],A("redfruit blackfruit vanilla"),A("bbq beef chicken"),"r",[1,10]],
["Oregon Pinot Noir",["oregon","willamette"],"US","Oregon","r",["Pinot Noir"],[2,2,4,1],A("redfruit cherry earth"),A("salmon pork mushrooms"),"rl",[2,12]],
["Washington State",["washington","columbia valley","walla walla"],"US","Washington","r",["Cabernet Sauvignon","Merlot","Syrah"],[4,3,4,1],A("blackfruit cherry herbal"),A("beef lamb"),"r",[2,15]],
["Mendoza Malbec",["mendoza","uco","lujan de cuyo","luján de cuyo"],"AR","Mendoza","r",["Malbec"],[4,3,3,1],A("blackfruit plum violet vanilla"),A("beef bbq lamb"),"r",[1,12]],
["Salta (Torrontés)",["salta","cafayate","torrontes","torrontés"],"AR","Salta","w",["Torrontés"],[2,1,3,1],A("floral peach citrus"),A("spicy fish aperitif"),"w",[0,3]],
["Patagonia",["patagonia","rio negro","neuquen"],"AR","Patagonia","r",["Pinot Noir","Malbec"],[3,2,4,1],A("redfruit cherry herbal"),A("lamb pork"),"rl",[1,8]],
["Chile (Maipo, Colchagua)",["maipo","colchagua","cachapoal","rapel","maule","carmenere","carménère","aconcagua"],"CL","Central Valley","r",["Cabernet Sauvignon","Carmenère"],[4,3,3,1],A("blackcurrant blackfruit herbal pepper"),A("beef bbq lamb"),"r",[1,12]],
["Chile (Casablanca, Leyda)",["casablanca","leyda","san antonio","limari","limarí"],"CL","Coastal Chile","w",["Sauvignon Blanc","Chardonnay","Pinot Noir"],[2,1,5,1],A("citrus herbal tropical"),A("fish shellfish salad"),"w",[0,4]],
["Barossa Shiraz",["barossa","mclaren vale","mclaren"],"AU","South Australia","r",["Shiraz","Grenache"],[5,3,3,1],A("blackfruit chocolate spice eucalyptus vanilla"),A("bbq beef lamb"),"r",[2,15]],
["Coonawarra / Margaret River",["coonawarra","margaret river"],"AU","Australia","r",["Cabernet Sauvignon"],[4,4,4,1],A("blackcurrant mint cedar"),A("lamb beef"),"r",[3,20]],
["Clare / Eden Valley Riesling",["clare valley","eden valley"],"AU","South Australia","w",["Riesling"],[2,1,5,1],A("citrus lime petrol"),A("fish spicy sushi"),"w",[1,15]],
["Hunter Valley Semillon",["hunter valley","hunter"],"AU","New South Wales","w",["Sémillon"],[1,1,5,1],A("citrus herbal toast honey"),A("fish shellfish"),"w",[2,15]],
["Yarra / Tasmania / Adelaide Hills",["yarra","tasmania","adelaide hills","mornington"],"AU","Cool-climate Australia","w",["Chardonnay","Pinot Noir"],[3,1,4,1],A("citrus peach mineral"),A("fish chicken"),"w",[1,8]],
["Marlborough Sauvignon Blanc",["marlborough"],"NZ","Marlborough","w",["Sauvignon Blanc"],[2,1,5,1],A("gooseberry passionfruit herbal citrus"),A("goat_cheese salad fish shellfish"),"w",[0,3]],
["Central Otago Pinot Noir",["central otago","otago","martinborough"],"NZ","New Zealand","r",["Pinot Noir"],[3,2,4,1],A("cherry redfruit herbal spice"),A("lamb pork salmon"),"rl",[2,10]],
["Hawke's Bay",["hawke's bay","hawkes bay","gimblett"],"NZ","Hawke's Bay","r",["Merlot","Cabernet Sauvignon","Syrah"],[4,3,4,1],A("blackfruit pepper herbal"),A("lamb beef"),"r",[2,12]],
["Stellenbosch / Swartland",["stellenbosch","swartland","paarl","franschhoek","constantia","western cape","pinotage","elgin","walker bay"],"ZA","Western Cape","r",["Cabernet Sauvignon","Pinotage","Syrah","Chenin Blanc"],[4,3,3,1],A("blackfruit smoke spice"),A("bbq beef lamb"),"r",[2,15]],
];
/* grapes (fallback when no appellation is found) */
const G = [
["Cabernet Sauvignon","r",[4,5,4,1],A("blackcurrant herbal cedar vanilla"),A("beef lamb")],["Merlot","r",[3,3,3,1],A("plum cherry chocolate"),A("beef pork pasta")],
["Pinot Noir","r",[2,2,4,1],A("redfruit cherry earth"),A("chicken pork mushrooms")],["Syrah","r",[4,4,4,1],A("blackfruit pepper smoke"),A("lamb bbq")],["Shiraz","r",[5,3,3,1],A("blackfruit spice chocolate"),A("bbq beef")],
["Grenache","r",[4,2,3,1],A("redfruit spice"),A("bbq lamb")],["Garnacha","r",[4,2,3,1],A("redfruit spice"),A("bbq lamb")],["Tempranillo","r",[3,3,4,1],A("redfruit vanilla leather"),A("lamb tapas")],
["Sangiovese","r",[3,3,5,1],A("cherry herbal"),A("pasta pizza")],["Nebbiolo","r",[4,5,5,1],A("cherry rose licorice"),A("beef truffle")],["Malbec","r",[4,3,3,1],A("blackfruit plum violet"),A("beef bbq")],
["Zinfandel","r",[5,3,3,2],A("blackfruit dried spice"),A("bbq pizza")],["Carmenère","r",[4,3,3,1],A("blackfruit pepper herbal"),A("beef bbq")],["Pinotage","r",[4,3,3,1],A("blackfruit smoke"),A("bbq")],
["Cabernet Franc","r",[3,3,4,1],A("redfruit herbal pepper"),A("pork chicken")],["Gamay","r",[2,1,4,1],A("redfruit strawberry"),A("cured_meats chicken")],["Montepulciano","r",[4,3,3,1],A("blackfruit plum"),A("pizza pasta")],
["Chardonnay","w",[3,1,3,1],A("apple citrus butter vanilla"),A("fish chicken")],["Sauvignon Blanc","w",[2,1,5,1],A("citrus herbal gooseberry"),A("goat_cheese fish salad")],
["Riesling","w",[2,1,5,2],A("citrus peach floral petrol"),A("spicy fish pork")],["Chenin Blanc","w",[3,1,5,2],A("apple honey"),A("pork fish")],["Pinot Grigio","w",[1,1,3,1],A("apple citrus"),A("aperitif fish")],
["Pinot Gris","w",[3,1,3,2],A("peach spice honey"),A("pork spicy")],["Gewürztraminer","w",[3,1,2,2],A("rose lychee spice"),A("spicy cheese_soft")],["Viognier","w",[4,1,2,1],A("peach apricot floral"),A("chicken spicy")],
["Sémillon","w",[3,1,4,1],A("citrus honey toast"),A("fish")],["Albariño","w",[2,1,5,1],A("citrus peach saline"),A("shellfish")],["Grüner Veltliner","w",[2,1,4,1],A("citrus pepper"),A("salad veg")],
["Verdejo","w",[2,1,4,1],A("citrus herbal"),A("fish tapas")],["Torrontés","w",[2,1,3,1],A("floral peach"),A("spicy")],["Vermentino","w",[2,1,4,1],A("citrus herbal saline"),A("fish")],["Moscato","d",[1,1,3,4],A("peach grape floral"),A("dessert")],
];
const L = {
 aroma:{it:{citrus:"agrumi",apple:"mela",pear:"pera",peach:"pesca",apricot:"albicocca",tropical:"frutta tropicale",passionfruit:"frutto della passione",gooseberry:"uva spina",lychee:"litchi",grape:"uva",floral:"fiori",rose:"rosa",violet:"violetta",herbal:"erbe",mineral:"minerale",saline:"sapido",honey:"miele",butter:"burro",vanilla:"vaniglia",coconut:"cocco",toast:"tostato",brioche:"crosta di pane",yeast:"lievito",almond:"mandorla",nuts:"frutta secca",redfruit:"frutti rossi",cherry:"ciliegia",strawberry:"fragola",blackfruit:"frutti neri",blackcurrant:"cassis",plum:"prugna",dried:"frutta appassita",pepper:"pepe",spice:"spezie",licorice:"liquirizia",tar:"catrame",tobacco:"tabacco",cedar:"cedro",leather:"cuoio",earth:"terra",mushroom:"sottobosco",smoke:"affumicato",petrol:"idrocarburo",eucalyptus:"eucalipto",mint:"menta",olive:"oliva",tomato:"pomodoro",caramel:"caramello",coffee:"caffè",chocolate:"cioccolato"},
  fr:{citrus:"agrumes",apple:"pomme",pear:"poire",peach:"pêche",apricot:"abricot",tropical:"fruits tropicaux",passionfruit:"fruit de la passion",gooseberry:"groseille à maquereau",lychee:"litchi",grape:"raisin",floral:"fleurs",rose:"rose",violet:"violette",herbal:"herbes",mineral:"minéral",saline:"salin",honey:"miel",butter:"beurre",vanilla:"vanille",coconut:"noix de coco",toast:"grillé",brioche:"brioche",yeast:"levure",almond:"amande",nuts:"fruits secs",redfruit:"fruits rouges",cherry:"cerise",strawberry:"fraise",blackfruit:"fruits noirs",blackcurrant:"cassis",plum:"prune",dried:"fruits secs confits",pepper:"poivre",spice:"épices",licorice:"réglisse",tar:"goudron",tobacco:"tabac",cedar:"cèdre",leather:"cuir",earth:"terre",mushroom:"sous-bois",smoke:"fumé",petrol:"hydrocarbure",eucalyptus:"eucalyptus",mint:"menthe",olive:"olive",tomato:"tomate",caramel:"caramel",coffee:"café",chocolate:"chocolat"},
  en:{citrus:"citrus",apple:"apple",pear:"pear",peach:"peach",apricot:"apricot",tropical:"tropical fruit",passionfruit:"passion fruit",gooseberry:"gooseberry",lychee:"lychee",grape:"grape",floral:"floral",rose:"rose",violet:"violet",herbal:"herbs",mineral:"mineral",saline:"saline",honey:"honey",butter:"butter",vanilla:"vanilla",coconut:"coconut",toast:"toast",brioche:"brioche",yeast:"yeast",almond:"almond",nuts:"nuts",redfruit:"red fruit",cherry:"cherry",strawberry:"strawberry",blackfruit:"black fruit",blackcurrant:"blackcurrant",plum:"plum",dried:"dried fruit",pepper:"pepper",spice:"spice",licorice:"liquorice",tar:"tar",tobacco:"tobacco",cedar:"cedar",leather:"leather",earth:"earth",mushroom:"mushroom",smoke:"smoke",petrol:"petrol",eucalyptus:"eucalyptus",mint:"mint",olive:"olive",tomato:"tomato leaf",caramel:"caramel",coffee:"coffee",chocolate:"chocolate"},
  es:{citrus:"cítricos",apple:"manzana",pear:"pera",peach:"melocotón",apricot:"albaricoque",tropical:"fruta tropical",passionfruit:"maracuyá",gooseberry:"grosella",lychee:"lichi",grape:"uva",floral:"flores",rose:"rosa",violet:"violeta",herbal:"hierbas",mineral:"mineral",saline:"salino",honey:"miel",butter:"mantequilla",vanilla:"vainilla",coconut:"coco",toast:"tostado",brioche:"bollería",yeast:"levadura",almond:"almendra",nuts:"frutos secos",redfruit:"fruta roja",cherry:"cereza",strawberry:"fresa",blackfruit:"fruta negra",blackcurrant:"casis",plum:"ciruela",dried:"fruta pasa",pepper:"pimienta",spice:"especias",licorice:"regaliz",tar:"alquitrán",tobacco:"tabaco",cedar:"cedro",leather:"cuero",earth:"tierra",mushroom:"sotobosque",smoke:"ahumado",petrol:"hidrocarburo",eucalyptus:"eucalipto",mint:"menta",olive:"aceituna",tomato:"tomate",caramel:"caramelo",coffee:"café",chocolate:"chocolate"}},
 food:{it:{aperitif:"🥂 Aperitivo",shellfish:"🦐 Crostacei",fish:"🐟 Pesce",sushi:"🍣 Sushi",chicken:"🍗 Pollame",pork:"🥩 Maiale",beef:"🥩 Manzo",lamb:"🍖 Agnello",game:"🦌 Selvaggina",duck:"🦆 Anatra",pasta:"🍝 Pasta",pizza:"🍕 Pizza",risotto:"🍚 Risotto",cheese_soft:"🧀 Formaggi morbidi",goat_cheese:"🧀 Caprino",cheese_hard:"🧀 Formaggi stagionati",blue_cheese:"🧀 Erborinati",salad:"🥗 Insalate",veg:"🥦 Verdure",spicy:"🌶️ Piccante",bbq:"🔥 Barbecue",dessert:"🍰 Dolci",chocolate:"🍫 Cioccolato",cured_meats:"🥓 Salumi",mushrooms:"🍄 Funghi",truffle:"🍄 Tartufo",tapas:"🫒 Tapas",nuts:"🥜 Frutta secca",foie_gras:"Foie gras",fruit:"🍑 Frutta",salmon:"🐟 Salmone"},
  fr:{aperitif:"🥂 Apéritif",shellfish:"🦐 Crustacés",fish:"🐟 Poisson",sushi:"🍣 Sushi",chicken:"🍗 Volaille",pork:"🥩 Porc",beef:"🥩 Bœuf",lamb:"🍖 Agneau",game:"🦌 Gibier",duck:"🦆 Canard",pasta:"🍝 Pâtes",pizza:"🍕 Pizza",risotto:"🍚 Risotto",cheese_soft:"🧀 Fromages à pâte molle",goat_cheese:"🧀 Chèvre",cheese_hard:"🧀 Fromages affinés",blue_cheese:"🧀 Bleus",salad:"🥗 Salades",veg:"🥦 Légumes",spicy:"🌶️ Épicé",bbq:"🔥 Barbecue",dessert:"🍰 Desserts",chocolate:"🍫 Chocolat",cured_meats:"🥓 Charcuterie",mushrooms:"🍄 Champignons",truffle:"🍄 Truffe",tapas:"🫒 Tapas",nuts:"🥜 Fruits secs",foie_gras:"Foie gras",fruit:"🍑 Fruits",salmon:"🐟 Saumon"},
  en:{aperitif:"🥂 Aperitif",shellfish:"🦐 Shellfish",fish:"🐟 Fish",sushi:"🍣 Sushi",chicken:"🍗 Poultry",pork:"🥩 Pork",beef:"🥩 Beef",lamb:"🍖 Lamb",game:"🦌 Game",duck:"🦆 Duck",pasta:"🍝 Pasta",pizza:"🍕 Pizza",risotto:"🍚 Risotto",cheese_soft:"🧀 Soft cheese",goat_cheese:"🧀 Goat cheese",cheese_hard:"🧀 Aged cheese",blue_cheese:"🧀 Blue cheese",salad:"🥗 Salads",veg:"🥦 Vegetables",spicy:"🌶️ Spicy food",bbq:"🔥 Barbecue",dessert:"🍰 Desserts",chocolate:"🍫 Chocolate",cured_meats:"🥓 Cured meats",mushrooms:"🍄 Mushrooms",truffle:"🍄 Truffle",tapas:"🫒 Tapas",nuts:"🥜 Nuts",foie_gras:"Foie gras",fruit:"🍑 Fruit",salmon:"🐟 Salmon"},
  es:{aperitif:"🥂 Aperitivo",shellfish:"🦐 Marisco",fish:"🐟 Pescado",sushi:"🍣 Sushi",chicken:"🍗 Aves",pork:"🥩 Cerdo",beef:"🥩 Ternera",lamb:"🍖 Cordero",game:"🦌 Caza",duck:"🦆 Pato",pasta:"🍝 Pasta",pizza:"🍕 Pizza",risotto:"🍚 Arroces",cheese_soft:"🧀 Quesos blandos",goat_cheese:"🧀 Queso de cabra",cheese_hard:"🧀 Quesos curados",blue_cheese:"🧀 Quesos azules",salad:"🥗 Ensaladas",veg:"🥦 Verduras",spicy:"🌶️ Picante",bbq:"🔥 Asado",dessert:"🍰 Postres",chocolate:"🍫 Chocolate",cured_meats:"🥓 Embutidos",mushrooms:"🍄 Setas",truffle:"🍄 Trufa",tapas:"🫒 Tapas",nuts:"🥜 Frutos secos",foie_gras:"Foie gras",fruit:"🍑 Fruta",salmon:"🐟 Salmón"}},
 temp:{s:"6–8 °C",w:"8–12 °C",d:"6–10 °C",rl:"13–15 °C",r:"16–18 °C"},
 country:{FR:["🇫🇷","Francia","France","France","Francia"],IT:["🇮🇹","Italia","Italie","Italy","Italia"],ES:["🇪🇸","Spagna","Espagne","Spain","España"],PT:["🇵🇹","Portogallo","Portugal","Portugal","Portugal"],DE:["🇩🇪","Germania","Allemagne","Germany","Alemania"],AT:["🇦🇹","Austria","Autriche","Austria","Austria"],HU:["🇭🇺","Ungheria","Hongrie","Hungary","Hungría"],GR:["🇬🇷","Grecia","Grèce","Greece","Grecia"],US:["🇺🇸","Stati Uniti","États-Unis","USA","Estados Unidos"],AR:["🇦🇷","Argentina","Argentine","Argentina","Argentina"],CL:["🇨🇱","Cile","Chili","Chile","Chile"],AU:["🇦🇺","Australia","Australie","Australia","Australia"],NZ:["🇳🇿","Nuova Zelanda","Nouvelle-Zélande","New Zealand","Nueva Zelanda"],ZA:["🇿🇦","Sudafrica","Afrique du Sud","South Africa","Sudáfrica"]},
};
const norm = s => " " + String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[’`]/g,"'").replace(/[^a-z0-9' -]+/g," ").replace(/\s+/g," ") + " ";
const toObj = r => ({k:"a", name:r[0], kw:r[1], c:r[2], region:r[3], col:r[4], grapes:r[5], prof:r[6], aro:r[7], food:r[8], t:r[9], y:r[10]});
const gObj = g => ({k:"g", name:g[0], kw:[g[0]], c:"", region:"", col:g[1], grapes:[g[0]], prof:g[2], aro:g[3], food:g[4], t:g[1]==="r"?(g[2][0]<=2?"rl":"r"):g[1]==="d"?"d":"w", y:null});
const ALL = D.map(toObj), GR = G.map(gObj);
/* match: the longest keyword found wins; a grape is used when no appellation is found */
function match(text){
  const n = norm(text); let best=null, bl=0;
  for(const e of ALL) for(const k of e.kw){ const kk=norm(k).trim(); if(kk.length>bl && n.includes(" "+kk+" ")){ best=e; bl=kk.length; } }
  const grapes = GR.filter(g=>n.includes(" "+norm(g.name).trim()+" "));
  if(best) return Object.assign({}, best, {foundGrapes:grapes.map(g=>g.name)});
  if(grapes.length) return Object.assign({}, grapes[0], {foundGrapes:grapes.map(g=>g.name)});
  return null; }
function search(q){ const n=norm(q).trim(); if(n.length<2) return []; const out=[];
  for(const e of ALL.concat(GR)){ const hay=norm([e.name,e.region,...e.kw,...e.grapes].join(" ")); if(hay.includes(n)) out.push(e); if(out.length>=8) break; }
  return out; }
function extras(text){ const n=norm(text); const o={};
  if(/ (gran reserva|gran riserva) /.test(n)) o.age="gran"; else if(/ (riserva|reserva|reserve) /.test(n)) o.age="ris"; else if(/ crianza /.test(n)) o.age="cri";
  if(/ (brut nature|pas dose|zero dosage|dosage zero) /.test(n)) o.dos="nature"; else if(/ extra brut /.test(n)) o.dos="xbrut"; else if(/ brut /.test(n)) o.dos="brut"; else if(/ (extra dry|extra sec) /.test(n)) o.dos="xdry";
  if(/ (grand cru) /.test(n)) o.cru="gc"; else if(/ (premier cru|1er cru) /.test(n)) o.cru="pc";
  if(/ (classico) /.test(n)) o.cl=1; if(/ (superiore) /.test(n)) o.sup=1; if(/ (organic|biologico|bio |biologique|ecologico) /.test(n)) o.bio=1;
  const ab=(String(text||"").match(/(\d{1,2}(?:[.,]\d)?)\s?%\s?(?:vol|alc)/i)||[])[1]; if(ab) o.abv=ab.replace(",",".");
  return o; }
return {match, search, extras, L, all:ALL, grapes:GR};
})();
