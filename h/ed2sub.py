# Global text updates for the new (French) edition, applied to the whole built page.
import re

R = [
 # ---------- Rioja Baja -> Rioja Oriental ----------
 (r"Rioja Baja \(Oriental\)", "Rioja Oriental"),
 (r"Rioja della Baja", "Rioja Oriental"),
 (r"Rioja de la Baja", "Rioja Oriental"),
 (r"(?<!ex )(?<!ex-)(?<!formerly )Rioja Baja(?! si chiama| s'appelle| is now)", "Rioja Oriental"),
 (r"(?<=\[\"w\",\")Rioja Oriental", "Rioja Oriental"),
 # ---------- Côtes du Rhône Villages example ----------
 (r"Côtes du Rhône Villages Cairanne", "Côtes du Rhône Villages Séguret"),
 (r"\((es\.|e\.g\.|ex\.) Cairanne\)", r"(\1 Séguret)"),
 (r"Cairanne e Rasteau", "Séguret e Sablet"),
 (r"Cairanne et Rasteau", "Séguret et Sablet"),
 (r"Cairanne and Rasteau", "Séguret and Sablet"),
 (r"Séguret e Sablet sono villaggi a est", "Séguret e Sablet sono villaggi Côtes du Rhône Villages a est"),
 (r"Séguret et Sablet sont des villages à l'est", "Séguret et Sablet sont des villages Côtes du Rhône Villages à l'est"),
 (r"Séguret and Sablet are eastern villages", "Séguret and Sablet are eastern Côtes du Rhône Villages"),
 # ---------- Tavel / Lirac ----------
 (r" e sono più famosi per i rosati\.", ": Tavel fa solo rosato, mentre Lirac è nota soprattutto per rossi e bianchi."),
 (r" et sont surtout célèbres pour leurs rosés\.", " : Tavel ne fait que du rosé, Lirac est surtout connue pour ses rouges et blancs."),
 (r" and are most famous for rosé\.", ": Tavel makes only rosé, while Lirac is best known for its reds and whites."),
 (r" e sono famosi soprattutto per i rosati, fatti", "; Tavel è famoso per i rosati (Lirac oggi soprattutto per rossi e bianchi), fatti"),
 (r", célèbres surtout pour leurs rosés, surtout de", " ; Tavel est célèbre pour ses rosés (Lirac surtout pour ses rouges et blancs), surtout de"),
 (r" and are most famous for rosé, made mainly", "; Tavel is famous for rosé (Lirac now mainly for reds and whites), made mainly"),
 (r" e sono famosi per i rosati, fatti soprattutto", "; Tavel è famoso per i rosati (Lirac soprattutto per rossi e bianchi), fatti soprattutto"),
 (r" et sont célèbres pour leurs rosés, surtout de", " ; Tavel est célèbre pour ses rosés (Lirac surtout pour ses rouges et blancs), surtout de"),
 (r" and are famous for rosé, mainly Grenache", "; Tavel is famous for rosé (Lirac mainly for reds and whites), mainly Grenache"),
 # ---------- Argentina ----------
 (r"(esportati sono (?:generalmente )?etichettati(?: come)?) Famatina", r"\1 «La Rioja Argentina»"),
 (r"(exportés sont (?:en général )?étiquetés) Famatina", r"\1 « La Rioja Argentina »"),
 (r"(exported wines are generally labelled|exports are usually labelled) Famatina", r"\1 'La Rioja Argentina'"),
 (r"La Rioja: terza area, Famatina e Torrontés", "La Rioja: terza area, export come «La Rioja Argentina», Torrontés"),
 (r"La Rioja : troisième zone, vallée de Famatina et Torrontés", "La Rioja : troisième zone, export en « La Rioja Argentina », torrontés"),
 (r"La Rioja: third area, Famatina and Torrontés", "La Rioja: third area, exported as 'La Rioja Argentina', Torrontés"),
 # ---------- Australia Riesling ----------
 (r"Tasmania e Frankland River \(Western Australia\) fanno Riesling meno agrumati e più floreali", "Great Southern (Western Australia) e Tasmania fanno Riesling puri, meno agrumati, con note minerali"),
 (r"la Tasmanie et Frankland River \(Australie-Occidentale\) font des rieslings moins citronnés et plus floraux", "Great Southern (Australie-Occidentale) et la Tasmanie font des rieslings purs, moins citronnés, aux notes minérales"),
 (r"Tasmania and Frankland River \(Western Australia\) give less citrusy, more floral wines", "Great Southern (Western Australia) and Tasmania give pure, less citrusy wines with mineral notes"),
 (r"la Tasmania e la sottoregione di Frankland River in Australia Occidentale stanno costruendo una reputazione per Riesling meno agrumati e più floreali", "Great Southern in Australia Occidentale e la Tasmania hanno una reputazione per Riesling puri, meno agrumati, con note minerali"),
 (r"la Tasmanie et la sous-région de Frankland River en Australie-Occidentale se font un nom avec des rieslings moins citronnés et plus floraux", "Great Southern en Australie-Occidentale et la Tasmanie sont réputées pour des rieslings purs, moins citronnés, aux notes minérales"),
 (r"Tasmania and the Frankland River sub-region of Western Australia are developing reputations for less citrusy, more floral Rieslings", "Great Southern in Western Australia and Tasmania are known for pure, less citrusy Rieslings with mineral notes"),
 (r"Riesling floreale", "Riesling puro e minerale"),
 (r"rieslings floraux", "rieslings purs et minéraux"),
 (r"floral Riesling", "pure, mineral Riesling"),
 (r"Tasmania, Frankland River less citrusy", "Great Southern, Tasmania less citrusy, mineral"),
 # ---------- Bordeaux vintage example (ch05) ----------
 (r"nel 2007 la regione fu fresca, nuvolosa e piovosa per gran parte di agosto, mentre nel 2003 ebbe temperature molto alte e condizioni quasi di siccità", "il 2013 fu fresco e umido, mentre il 2015 fu caldo e secco"),
 (r"en 2007, la région fut fraîche, nuageuse et pluvieuse presque tout août, tandis qu'en 2003 elle connut de très fortes chaleurs et une quasi-sécheresse", "2013 fut frais et humide, tandis que 2015 fut chaud et sec"),
 (r"in 2007 it was cool, cloudy and wet through most of August, while 2003 brought very high temperatures and near drought", "2013 was cool and wet, while 2015 was hot and dry"),
 (r"a Bordeaux il 2007 fu fresco e piovoso in agosto, il 2003 caldissimo e quasi siccitoso", "a Bordeaux il 2013 fu fresco e umido, il 2015 caldo e secco"),
 (r"à Bordeaux, 2007 fut frais et humide en août, 2003 caniculaire et quasi sec", "à Bordeaux, 2013 fut frais et humide, 2015 chaud et sec"),
 (r"Bordeaux 2007 was cool and wet in August, 2003 very hot and near drought", "Bordeaux 2013 was cool and wet, 2015 hot and dry"),
 (r"il 2007 fu fresco, nuvoloso e piovoso ad agosto, il 2003 caldissimo e quasi siccitoso", "il 2013 fu fresco e umido, il 2015 caldo e secco"),
 (r"2007 fut frais, nuageux et pluvieux en août, 2003 très chaud et presque sec", "2013 fut frais et humide, 2015 chaud et sec"),
 (r"2007 was cool, cloudy and wet in August, while 2003 was very hot with near-drought", "2013 was cool and wet, while 2015 was hot and dry"),
 (r"\"Bordeaux 2007\"", "\"Bordeaux 2013\""),
 (r"\"Bordeaux 2003\"", "\"Bordeaux 2015\""),
 # ---------- Port vintages (ch44) ----------
 (r"con accordo generale su 2000, 2003, 2007 e 2011", "mentre 2011 e 2016 sono stati dichiarati dalla grande maggioranza (meno consenso per il 2015)"),
 (r"avec un consensus sur 2000, 2003, 2007 et 2011", "alors que 2011 et 2016 ont été déclarés par la grande majorité (moins de consensus pour 2015)"),
 (r"with general agreement on 2000, 2003, 2007 and 2011", "while 2011 and 2016 were declared by the great majority (less consensus for 2015)"),
 (r"Ci fu invece accordo generale per dichiarare il 2000, il 2003, il 2007 e il 2011\.", "La nuova edizione cita il 2011 e il 2016, dichiarati dalla grande maggioranza dei produttori, e il 2015, con meno consenso."),
 (r"Il y a en revanche eu accord général pour déclarer 2000, 2003, 2007 et 2011\.", "La nouvelle édition cite 2011 et 2016, déclarés par la grande majorité des producteurs, et 2015, avec moins de consensus."),
 (r"There was general agreement, however, that 2000, 2003, 2007 and 2011 should be declared\.", "The new edition cites 2011 and 2016, declared by the great majority of producers, and 2015, with less consensus."),
 (r"mentre c'era accordo generale per 2000, 2003, 2007 e 2011", "mentre il 2011 e il 2016 sono stati dichiarati dalla grande maggioranza"),
 (r"alors que 2000, 2003, 2007 et 2011 ont fait l'unanimité", "alors que 2011 et 2016 ont été déclarés par la grande majorité"),
 (r"while 2000, 2003, 2007 and 2011 were generally agreed", "while 2011 and 2016 were declared by the great majority"),
 (r"ci fu accordo generale su 2000, 2003, 2007 e 2011", "il 2011 e il 2016 sono stati dichiarati dalla grande maggioranza"),
 (r"il y eut consensus sur 2000, 2003, 2007 et 2011", "2011 et 2016 ont été déclarés par la grande majorité"),
 (r"there was general agreement on 2000, 2003, 2007 and 2011", "2011 and 2016 were declared by the great majority"),
 (r"2000 · 2003 · 2007 · 2011", "2011 · 2016"),
 # ---------- Cru Bourgeois (ch13) ----------
 (r"Oggi il cru bourgeois viene assegnato solo ai vini di un'annata specifica, non allo château, e quindi i vini di ogni nuova annata devono essere presentati ogni anno per ottenere la classificazione\.", "Nella nuova edizione è una classificazione su tre livelli (Cru Bourgeois, Cru Bourgeois Supérieur e, la più prestigiosa, Cru Bourgeois Exceptionnel), rivista ogni cinque anni."),
 (r"Aujourd'hui, le cru bourgeois n'est attribué qu'aux vins d'un millésime précis, non au château : les vins de chaque nouveau millésime doivent donc être présentés chaque année\.", "Dans la nouvelle édition, c'est un classement à trois niveaux (cru bourgeois, cru bourgeois supérieur et, le plus prestigieux, cru bourgeois exceptionnel), révisé tous les cinq ans."),
 (r"Currently cru bourgeois is awarded only to wines of a specific vintage, not to the château, so each new vintage must be submitted yearly\.", "In the new edition it is a three-tier classification (Cru Bourgeois, Cru Bourgeois Supérieur and, the most prestigious, Cru Bourgeois Exceptionnel), revised every five years."),
 (r"il cru bourgeois oggi si assegna al vino di una singola annata, quindi va richiesto ogni anno", "il Cru Bourgeois ha tre livelli ed è rivisto ogni cinque anni"),
 (r"le cru bourgeois est aujourd'hui attribué au vin d'un millésime, donc à redemander chaque année", "le cru bourgeois a trois niveaux et est révisé tous les cinq ans"),
 (r"cru bourgeois is now awarded to a single vintage's wine, so it is resubmitted yearly", "Cru Bourgeois has three tiers and is revised every five years"),
 (r"Cru Bourgeois for other Médoc châteaux, now awarded to a specific vintage[^;\"]*", "Cru Bourgeois for other Médoc châteaux: three tiers (Cru Bourgeois, Supérieur, Exceptionnel), revised every five years"),
 (r"Solo il Cru Bourgeois annuale, condiviso con il Médoc, senza gradi interni né revisioni", "Solo il Cru Bourgeois, condiviso con il Médoc, senza gradi interni né revisioni"),
 (r"Seulement le Cru Bourgeois annuel, partagé avec le Médoc, sans rangs ni révisions", "Seulement le Cru Bourgeois, partagé avec le Médoc, sans rangs ni révisions"),
 (r"Only the annual Cru Bourgeois, shared with the Médoc, with no internal ranks or revisions", "Only Cru Bourgeois, shared with the Médoc, with no internal ranks or revisions"),
 (r"Sì: usa la classificazione annuale dei Cru Bourgeois", "Sì: usa la classificazione dei Cru Bourgeois"),
 (r"Oui : il utilise le classement annuel des Crus Bourgeois", "Oui : il utilise le classement des Crus Bourgeois"),
 (r"Yes: it uses the annual Cru Bourgeois classification", "Yes: it uses the Cru Bourgeois classification"),
 # ---------- Asti pressure (ch41) ----------
 (r"(7 ?% vol(?:\.)? e |7 ?% vol et |7% abv and |7% e |7 % et |7% and |la pression |pressione a |a ~7% e |vers 7 % et |~7% and |~7% abv, )5[-–]6 (atmosfere|atmosphères|atmospheres|atm)", r"\g<1>4-5 \2"),
 (r"≈ 7% · 5–6 atm", "≈ 7% · 4–5 atm"),
 # ---------- Sherry spirit (ch43) ----------
 (r"(?:alcol neutro (?:a|al) |alcool neutre à |eau-de-vie neutre à |alcool à |alcol al )96( ?%)(?= ?:| :| \(| e dopo| après| la forza| la force|\"|,|\.|;| ;)", None),
 (r"96( ?% (?:abv )?neutral spirit)", None),
 (r"96( ?%,? (?:come per lo Sherry|comme pour le Sherry|as for Sherry))", None),
 (r"96( ?% e 3,5% sono| ?% et 3,5 % sont|% and 3\.5% describe)", None),
 (r"(fT\(162,40,\")96%", None),
 # ---------- DOCG (ch26) ----------
 (r"adds two requirements on top of all DOC rules: the wine must be bottled in the production area and pass a Ministry of Agriculture tasting\.", "has stricter rules than DOC and the wine must in most cases be bottled in its production area."),
 (r"DOCG adds to DOC bottling in the production area and a Ministry tasting\.", "DOCG: stricter rules than DOC and, in most cases, bottling in the production area."),
 (r"DOCG \(all DOC requirements \+ bottled in production area \+ Ministry of Agriculture tasting\)", "DOCG (stricter rules, mostly bottled in production area)"),
 # ---------- Cap Classique (ch42) ----------
 (r"In Sudafrica la Cap Classique Producers Association raccomanda almeno 12 mesi, ma per usare il termine ne bastano nove\.", "In Sudafrica tutti i Cap Classique devono restare almeno 12 mesi sui lieviti."),
 (r"En Afrique du Sud, l'association Cap Classique recommande au moins 12 mois, mais neuf suffisent pour utiliser le terme\.", "En Afrique du Sud, tous les Cap Classique doivent rester au moins 12 mois sur lies."),
 (r"In South Africa the Cap Classique Producers Association recommends at least 12 months, but nine suffice to use the term\.", "In South Africa all Cap Classique must spend at least 12 months on lees."),
 (r"La Cap Classique Producers Association raccomanda ai soci almeno 12 mesi sui lieviti, ma non serve essere soci per usare il termine: gli altri devono affinare solo nove mesi\.", "Nuova edizione: in etichetta si scrive «Cap Classique» («méthode Cap Classique» indica il procedimento) e tutti devono affinare almeno 12 mesi sui lieviti; la Cap Classique Producers Association promuove la qualità."),
 (r"La Cap Classique Producers Association recommande à ses membres au moins 12 mois sur lies, mais il n'est pas nécessaire d'en être membre pour utiliser le terme : les autres doivent vieillir seulement neuf mois\.", "Nouvelle édition : l'étiquette porte « Cap Classique » (« méthode Cap Classique » désigne le procédé) et tous doivent vieillir au moins 12 mois sur lies ; la Cap Classique Producers Association promeut la qualité."),
 (r"The Cap Classique Producers Association recommends members age on lees for at least 12 months, but membership is not needed to use the term: non-members need only nine months\.", "New edition: labels say 'Cap Classique' ('méthode Cap Classique' names the process) and all must age at least 12 months on lees; the Cap Classique Producers Association promotes quality."),
 (r"Molti produttori premium appartengono alla Cap Classique Producers Association, che raccomanda almeno 12 mesi sui lieviti; non serve esserne membri per usare il termine, e i non membri devono affinare solo nove mesi\.", "Tutti i Cap Classique devono restare almeno 12 mesi sui lieviti; la Cap Classique Producers Association promuove e migliora la qualità."),
 (r"Beaucoup de producteurs haut de gamme appartiennent à la Cap Classique Producers Association, qui recommande au moins 12 mois sur lies ; il n'est pas nécessaire d'en être membre pour utiliser le terme, et les non-membres ne doivent vieillir que neuf mois\.", "Tous les Cap Classique doivent rester au moins 12 mois sur lies ; la Cap Classique Producers Association promeut et améliore la qualité."),
 (r"Many premium producers belong to the Cap Classique Producers Association, which recommends at least 12 months on lees; membership is not needed to use the term, and non-members need only nine months\.", "All Cap Classique must spend at least 12 months on lees; the Cap Classique Producers Association promotes and improves quality."),
 (r"Cap Classique 9 months \(association recommends 12\)", "Cap Classique 12 months"),
 (r"vintage min 36 months \(no extra lees requirement\)", "vintage min 36 months (at least 12 on lees)"),
 # ---------- Fortified Muscat (ch45) ----------
 (r"fortificare anche a 2% vol", "fortificare già all'1-2% vol"),
 (r"mutage dès 2 % vol", "mutage dès 1 à 2 % vol"),
 (r"la fortificazione può arrivare già a 2% vol", "la fortificazione può arrivare già all'1-2% vol"),
 (r"le mutage peut intervenir dès 2 % vol", "le mutage peut intervenir dès 1 à 2 % vol"),
 (r"fortification may come as early as 2% abv", "fortification may come as early as 1-2% abv"),
 (r"la fortificazione può avvenire quando la fermentazione ha raggiunto solo il 2% vol", "la fortificazione può avvenire quando la fermentazione ha raggiunto solo l'1-2% vol"),
 (r"fortification may occur when fermentation has reached only 2% abv", "fortification may occur when fermentation has reached only 1-2% abv"),
 (r"fortification as early as 2% abv", "fortification as early as 1-2% abv"),
 # ---------- Szamorodni ageing (ch24) ----------
 (r"Ils doivent vieillir au moins un an en fût et avoir deux ans à la sortie\.", "Ils doivent vieillir au moins six mois en fût et ne sortir qu'à partir de janvier de la deuxième année."),
 (r"They must age at least a year in cask and be two years old at release\.", "They must age at least six months in cask and cannot be released before January of the second year."),
 (r"Almeno un anno in botte e due d'età, in botti scolme con un velo simile al flor", "Almeno sei mesi in botte, uscita da gennaio del 2° anno, in botti scolme con un velo simile al flor"),
 (r"Au moins un an en fût et deux ans d'âge, en fûts en vidange avec un voile", "Au moins six mois en fût, sortie dès janvier de la 2e année, en fûts en vidange avec un voile"),
 (r"Wines must be aged in cask for at least a year and be two years old before release, and most age longer\.", "Wines must spend at least six months in cask and cannot be released before January of the second year after harvest; most age longer."),
 (r"Devono passare almeno un anno in botte ed essere vecchi di due anni prima della vendita\.", "Devono passare almeno sei mesi in botte e non possono uscire prima di gennaio del secondo anno."),
 (r"Ils doivent passer au moins un an en fût et avoir deux ans avant la vente\.", "Ils doivent passer au moins six mois en fût et ne peuvent sortir avant janvier de la deuxième année."),
 (r"They need at least one year in cask and two years before release\.", "They need at least six months in cask and cannot be released before January of the second year."),
 (r"dry aged at least one year in cask, two years old before release", "dry aged at least six months in cask, release not before January of the second year"),
 # ---------- Provence rosé (ch21) ----------
 (r"molto pallidi, leggeri e secchi, con sapori delicati di pompelmo e frutti rossi", "molto pallidi, secchi, di corpo da leggero a medio, con delicati frutti rossi"),
 (r"très pâles, légers et secs, aux saveurs délicates de pamplemousse et (?:de )?fruits rouges", "très pâles, secs, au corps léger à moyen, aux délicates saveurs de fruits rouges"),
 (r"very pale, light(?:-bodied)? and dry,? with delicate grapefruit and red fruit", "very pale, dry, light to medium-bodied, with delicate red fruit"),
 # ---------- Pinot family (ch04) ----------
 (r"Pinot Gris = mutazione del Pinot Noir", "Pinot Gris = mutazione di un antico Pinot"),
 (r"pinot gris = mutation du pinot noir", "pinot gris = mutation d'un ancien pinot"),
 (r"Pinot Gris = Pinot Noir mutation", "Pinot Gris = mutation of an ancient Pinot"),
 # ---------- Germany labels (ch22) ----------
 (r"però anche vini di qualità inferiore da molti vigneti vicini possono essere etichettati nello stesso modo \(es\. Piesporter Michelsberg\)\.", "prima della legge del 2021 anche vini di qualità inferiore da molti vigneti vicini potevano essere etichettati nello stesso modo (es. Piesporter Michelsberg); oggi i vini di villaggio riportano solo il nome del villaggio (es. Piesport) e i vini di vigneto villaggio + vigneto (es. Piesporter Goldtröpfchen)."),
 (r"mais des vins moins bons issus de nombreux vignobles voisins peuvent être étiquetés de la même façon \(Piesporter Michelsberg\)\.", "avant la loi de 2021, des vins moins bons issus de nombreux vignobles voisins pouvaient être étiquetés de la même façon (Piesporter Michelsberg) ; aujourd'hui, un vin de village porte seulement le nom du village (Piesport) et un vin de vignoble village + vignoble (Piesporter Goldtröpfchen)."),
 # ---------- more: Asti pressure, Sherry neutral spirit, Austria ----------
 (r"(7 ?% ?(?:vol\.?|abv)?[^.\"]{0,45}?)5[-–]6( ?(?:atmosfere|atmosphères|atmospheres|atm))", r"\g<1>4-5\2"),
 (r"(7 ?% ?(?:vol\.?|abv)?[^.\"]{0,45}?)cinque-sei atmosfere", r"\g<1>quattro-cinque atmosfere"),
 (r"(7 ?% ?(?:vol\.?|abv)?[^.\"]{0,45}?)cinq à six atmosphères", r"\g<1>quatre à cinq atmosphères"),
 (r"(7 ?% ?(?:vol\.?|abv)?[^.\"]{0,45}?)five to six atmospheres", r"\g<1>four to five atmospheres"),
 (r"((?:alcol neutro (?:a|al)|alcool neutre à|eau-de-vie neutre à) )96", r"\g<1>95"),
 (r"Bordeaux 2003 vs 2007", "Bordeaux 2013 vs 2015"),
 (r"DAC \(dal 2003;", "DAC (dal 2002;"),
 (r"DAC \(depuis 2003 ;", "DAC (depuis 2002 ;"),
 (r"DAC appellations \(since 2003;", "DAC appellations (since 2002;"),
 (r"\(Auslese, Beerenauslese, Ausbruch, Eiswein, Trockenbeerenauslese\)", "(Auslese, Beerenauslese, Eiswein, Strohwein, Trockenbeerenauslese)"),
 (r"Ci sono due Prädikate in più: Ausbruch, una classificazione tra Beerenauslese \(BA\) e Trockenbeerenauslese \(TBA\), e Strohwein o Schilfwein,", "C'è un Prädikat in più, lo Strohwein o Schilfwein (l'Ausbruch è oggi la DAC Ruster Ausbruch),"),
 (r"Il existe deux Prädikate de plus : Ausbruch, entre Beerenauslese \(BA\) et Trockenbeerenauslese \(TBA\), et Strohwein ou Schilfwein,", "Il existe un Prädikat de plus, le Strohwein ou Schilfwein (l'Ausbruch est aujourd'hui la DAC Ruster Ausbruch),"),
 (r"There are two extra Prädikate: Ausbruch, between Beerenauslese \(BA\) and Trockenbeerenauslese \(TBA\), and Strohwein or Schilfwein,", "There is one extra Prädikat, Strohwein or Schilfwein (Ausbruch is now Ruster Ausbruch DAC),"),
 (r"e ci sono due Prädikate in più: Ausbruch, tra Beerenauslese e Trockenbeerenauslese, e Strohwein o Schilfwein,", "e c'è un Prädikat in più, lo Strohwein o Schilfwein (l'Ausbruch è oggi la DAC Ruster Ausbruch),"),
 (r"avec deux Prädikate supplémentaires : Ausbruch, entre Beerenauslese et Trockenbeerenauslese, et Strohwein ou Schilfwein,", "avec un Prädikat supplémentaire, le Strohwein ou Schilfwein (l'Ausbruch est devenu la DAC Ruster Ausbruch),"),
 (r"with two extra Prädikate: Ausbruch, between Beerenauslese and Trockenbeerenauslese, and Strohwein or Schilfwein,", "with one extra Prädikat, Strohwein or Schilfwein (Ausbruch is now Ruster Ausbruch DAC),"),
 (r"plus Ausbruch \(between BA and TBA\) and Strohwein/Schilfwein", "plus Strohwein/Schilfwein (Ausbruch now Ruster Ausbruch DAC)"),
 (r"Ausbruch e Strohwein sono Prädikate dolci", "lo Strohwein è un Prädikat dolce (l'Ausbruch è oggi una DAC)"),
 (r"Ausbruch et Strohwein des Prädikate doux", "le Strohwein un Prädikat doux (l'Ausbruch est désormais une DAC)"),
 (r"Ausbruch and Strohwein are sweet Prädikate", "Strohwein is a sweet Prädikat (Ausbruch is now a DAC)"),
 (r"Per il Qualitätswein sono designati i quattro stati e sette aree minori: si possono usare 35 varietà e qualsiasi stile\.", "Nuova edizione: il Qualitätswein può venire da una regione generica (i quattro stati) o da una regione specifica (DAC o no); fuori dalle DAC si possono usare 40 vitigni autorizzati in qualsiasi stile."),
 (r"Pour le Qualitätswein, les quatre États et sept zones sont désignés : 35 cépages, tout style\.", "Nouvelle édition : le Qualitätswein peut venir d'une région générique (les quatre États) ou d'une région spécifique (DAC ou non) ; hors DAC, 40 cépages autorisés, tout style."),
 (r"Qualitätswein covers the four states and seven smaller areas: 35 varieties, any style\.", "New edition: Qualitätswein may come from a generic region (the four states) or a specific region (DAC or not); outside DACs, 40 permitted varieties in any style."),
 (r"Qualitätswein from 35 varieties in any style", "Qualitätswein from generic regions (four states) or specific regions (mostly DAC); outside DACs 40 varieties in any style"),
]

def _sherry(m):
    return m.group(0).replace('96', '95')

def apply(s):
    n = 0
    for pat, rep in R:
        if rep is None:
            s, k = re.subn(pat, _sherry, s)
        else:
            s, k = re.subn(pat, rep, s)
        n += k
    return s, n
