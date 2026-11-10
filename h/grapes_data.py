# Grape fact sheets for the "Vitigni" section and the matching game.
# Fields: k name, c colour (w/b), u unit, syn synonyms, bud/rip (E/M/L), a acidity, t tannin, b body
# cl climate & vineyard, ar aromas, wm styles & winemaking, tip exam tip, sig short aroma signature (game),
# tr short distinctive trait (game), reg region keys (must be map item keys)
G = []
def g(k, c, u, syn, bud, rip, a, t, b, cl, ar, wm, tip, sig, tr, reg):
    G.append(dict(k=k, c=c, u=u, syn=syn, bud=bud, rip=rip, a=a, t=t, b=b, cl=cl, ar=ar, wm=wm, tip=tip, sig=sig, tr=tr, reg=reg))

UNITS = [
 ("u1", ["Bianchi internazionali", "Blancs internationaux", "International whites"]),
 ("u2", ["Rossi internazionali", "Rouges internationaux", "International reds"]),
 ("u3", ["Francia: le altre uve", "France : les autres cépages", "France: the other grapes"]),
 ("u4", ["Italia", "Italie", "Italy"]),
 ("u5", ["Spagna e Portogallo", "Espagne et Portugal", "Spain & Portugal"]),
 ("u6", ["Germania, Austria, Ungheria, Grecia", "Allemagne, Autriche, Hongrie, Grèce", "Germany, Austria, Hungary, Greece"]),
 ("u7", ["Nuovo Mondo", "Nouveau Monde", "New World"]),
]

# ---------------- u1 international whites ----------------
g("Chardonnay", "w", "u1", [], "E", "E", "M/H", "", "M/F",
  ["Germoglia presto (rischio gelate primaverili) e matura presto: si adatta a quasi ogni clima, da Chablis alle zone calde.", "Débourre tôt (gelées de printemps) et mûrit tôt : s'adapte à presque tous les climats, de Chablis aux zones chaudes.", "Buds early (spring-frost risk) and ripens early: adapts to almost any climate, from Chablis to warm regions."],
  ["Poco aromatico: clima fresco mela verde, agrumi, pietra focaia; moderato pesca, melone; caldo ananas, banana, mango.", "Peu aromatique : climat frais pomme verte, agrumes, pierre à fusil ; modéré pêche, melon ; chaud ananas, banane, mangue.", "Neutral: cool climate green apple, citrus, wet stone; moderate peach, melon; warm pineapple, banana, mango."],
  ["Una «tela bianca» per il produttore: fermentazione e affinamento in barrique, malolattica (burro), bâtonnage sulle fecce; base dei grandi spumanti.", "Une « toile blanche » pour le vinificateur : fermentation et élevage en barrique, malolactique (beurre), bâtonnage sur lies ; base des grands effervescents.", "A blank canvas for the winemaker: barrel fermentation and ageing, malolactic (butter), lees stirring; a base for top sparkling wines."],
  ["Lo stile lo decidono clima e cantina più che il vitigno: Chablis (acciaio, acidità alta) vs Meursault (legno, fecce) vs Nuovo Mondo caldo.", "Le style dépend du climat et de la cave plus que du cépage : Chablis (inox, acidité haute) vs Meursault (bois, lies) vs Nouveau Monde chaud.", "Climate and winemaking shape it more than the grape: Chablis (steel, high acid) vs Meursault (oak, lees) vs warm New World."],
  ["Mela, agrumi, burro e nocciola", "Pomme, agrumes, beurre et noisette", "Apple, citrus, butter and hazelnut"],
  ["Neutro, «tela bianca», ama barrique e malolattica", "Neutre, « toile blanche », aime barrique et malo", "Neutral blank canvas, loves oak and malolactic"],
  ["Burgundy", "Chablis", "Champagne", "Meursault", "Sonoma Coast", "Adelaide Hills", "Margaret River", "Limarí Valley"])
g("Sauvignon Blanc", "w", "u1", [], "", "E", "H", "", "L/M",
  ["Matura presto: ideale nei climi freschi che conservano freschezza e aromi; vigoroso, se poco maturo diventa troppo erbaceo.", "Mûrit tôt : idéal en climat frais qui garde fraîcheur et arômes ; vigoureux, trop herbacé s'il manque de maturité.", "Early ripening: best in cool climates that keep freshness and aroma; vigorous, and too herbaceous if under-ripe."],
  ["Molto aromatico: erba, asparago, mela verde, sambuco, uva spina; al sole pompelmo e frutto della passione.", "Très aromatique : herbe, asperge, pomme verte, sureau, groseille à maquereau ; au soleil pamplemousse et fruit de la passion.", "Highly aromatic: grass, asparagus, green apple, elderflower, gooseberry; with sun grapefruit and passion fruit."],
  ["Di solito acciaio, fresco, senza malolattica, da bere giovane; a Pessac-Léognan fermentato in legno e tagliato con il Sémillon.", "Généralement en inox, frais, sans malo, à boire jeune ; à Pessac-Léognan fermenté en fût et assemblé au Sémillon.", "Usually steel-fermented, fresh, no malolactic, drunk young; in Pessac-Léognan barrel-fermented and blended with Semillon."],
  ["Sancerre/Pouilly-Fumé = eleganza e pietra bagnata; Marlborough = frutto esplosivo grazie alla luce intensa.", "Sancerre/Pouilly-Fumé = élégance et pierre mouillée ; Marlborough = fruit explosif grâce à la lumière intense.", "Sancerre/Pouilly-Fumé = restraint and wet pebbles; Marlborough = explosive fruit from intense sunlight."],
  ["Uva spina, sambuco, asparago", "Groseille à maquereau, sureau, asperge", "Gooseberry, elderflower, asparagus"],
  ["Aromatico, acidità alta, da bere giovane", "Aromatique, acidité haute, à boire jeune", "Aromatic, high acid, drink young"],
  ["Sancerre", "Pouilly-Fumé", "Touraine", "Marlborough", "Casablanca Valley", "Elgin", "Südsteiermark", "Pessac-Léognan"])
g("Riesling", "w", "u1", [], "L", "L", "H", "", "L/M",
  ["Resiste agli inverni freddi e germoglia tardi (evita le gelate): perfetto nei climi freschi; in pianta accumula zucchero senza perdere acidità.", "Résiste aux hivers froids et débourre tard (évite les gelées) : parfait en climat frais ; sur pied il gagne du sucre sans perdre son acidité.", "Hardy in cold winters and buds late (avoids frost): ideal for cool climates; on the vine it gains sugar without losing acidity."],
  ["Molto aromatico: fresco mela verde e fiori; più caldo agrumi e pesca; con l'età miele, toast e idrocarburo (petrolio).", "Très aromatique : frais pomme verte et fleurs ; plus chaud agrumes et pêche ; avec l'âge miel, pain grillé et hydrocarbure (pétrole).", "Highly aromatic: cool green apple and blossom; warmer citrus and peach; with age honey, toast and kerosene."],
  ["Quasi mai legno nuovo né taglio: dal secco al dolcissimo (Spätlese, Auslese, BA, TBA, Eiswein), muffa nobile possibile; grande longevità.", "Presque jamais de bois neuf ni d'assemblage : du sec au liquoreux (Spätlese, Auslese, BA, TBA, Eiswein), pourriture noble possible ; grande longévité.", "Almost never new oak or blended: from dry to lusciously sweet (Spätlese, Auslese, BA, TBA, Eiswein), noble rot possible; very long-lived."],
  ["L'acidità alta bilancia lo zucchero: Mosella leggera e floreale, Alsazia piena e secca, Clare/Eden Valley lime e toast.", "L'acidité haute équilibre le sucre : Moselle légère et florale, Alsace ample et sèche, Clare/Eden Valley citron vert et toast.", "High acidity balances sugar: Mosel light and floral, Alsace full and dry, Clare/Eden Valley lime and toast."],
  ["Fiori, lime, petrolio con l'età", "Fleurs, citron vert, pétrole avec l'âge", "Blossom, lime, kerosene with age"],
  ["Acidità altissima, dal secco al TBA, mai in legno nuovo", "Acidité très haute, du sec au TBA, jamais de bois neuf", "Searing acidity, dry to TBA, never new oak"],
  ["Mosel", "Rheingau", "Pfalz", "Alsace", "Wachau", "Clare Valley", "Eden Valley", "Finger Lakes"])
g("Sémillon", "w", "u1", ["Semillon"], "", "M", "M/H", "", "M/F",
  ["Buccia sottile, molto sensibile alla muffa nobile; ama climi con nebbie mattutine e pomeriggi soleggiati (Sauternes).", "Peau fine, très sensible à la pourriture noble ; aime les brumes matinales suivies d'après-midi ensoleillés (Sauternes).", "Thin-skinned and very prone to noble rot; loves misty mornings and sunny afternoons (Sauternes)."],
  ["Poco aromatico da giovane: limone, erba; con botrite albicocca, miele, marmellata; il Semillon di Hunter invecchiato sa di toast e miele.", "Peu aromatique jeune : citron, herbe ; avec botrytis abricot, miel, marmelade ; le Semillon du Hunter vieilli évoque toast et miel.", "Quiet when young: lemon, grass; with botrytis apricot, honey, marmalade; aged Hunter Semillon shows toast and honey."],
  ["Taglio con il Sauvignon Blanc (Bordeaux secchi e dolci); Hunter Valley: raccolto presto, alcol basso, acciaio, enorme longevità.", "Assemblé au Sauvignon Blanc (Bordeaux secs et liquoreux) ; Hunter Valley : vendangé tôt, alcool bas, inox, très grande garde.", "Blended with Sauvignon Blanc (dry and sweet Bordeaux); Hunter Valley: picked early, low alcohol, steel, huge ageing potential."],
  ["Due icone: Sauternes botritizzato e Hunter Semillon leggero che diventa tostato senza vedere legno.", "Deux icônes : Sauternes botrytisé et Hunter Semillon léger qui devient grillé sans voir de bois.", "Two icons: botrytised Sauternes and light Hunter Semillon that turns toasty without oak."],
  ["Miele, albicocca, marmellata (botrite)", "Miel, abricot, marmelade (botrytis)", "Honey, apricot, marmalade (botrytis)"],
  ["Buccia sottile, ama la muffa nobile", "Peau fine, aime la pourriture noble", "Thin skin, loves noble rot"],
  ["Sauternes", "Barsac", "Graves", "Hunter Valley", "Margaret River", "Monbazillac"])
g("Chenin Blanc", "w", "u1", ["Steen"], "E", "L", "H", "", "M",
  ["Germoglia presto e matura tardi: nella Loira serve un autunno lungo; maturazione irregolare, a volte più passaggi di raccolta.", "Débourre tôt et mûrit tard : en Loire il faut un automne long ; maturité irrégulière, parfois plusieurs tries.", "Buds early and ripens late: in the Loire it needs a long autumn; uneven ripening, sometimes several passes (tries)."],
  ["Mela verde, limone, note vegetali; più maturo mela cotta, pesca; con botrite miele e albicocca; con l'età cera e miele.", "Pomme verte, citron, notes végétales ; plus mûr pomme cuite, pêche ; avec botrytis miel et abricot ; avec l'âge cire et miel.", "Green apple, lemon, vegetal notes; riper baked apple, peach; with botrytis honey and apricot; with age wax and honey."],
  ["Versatile: secco, demi-sec, dolce botritizzato (Layon, Quarts de Chaume), spumante (Vouvray, Saumur); in Sudafrica tanto volume e vecchie viti.", "Polyvalent : sec, demi-sec, liquoreux botrytisé (Layon, Quarts de Chaume), effervescent (Vouvray, Saumur) ; en Afrique du Sud volume et vieilles vignes.", "Versatile: dry, off-dry, botrytised sweet (Layon, Quarts de Chaume), sparkling (Vouvray, Saumur); South Africa has volume and old vines."],
  ["Vouvray può essere di tutti i livelli di dolcezza: guarda l'etichetta (sec, demi-sec, moelleux).", "Vouvray peut avoir tous les niveaux de sucre : regarde l'étiquette (sec, demi-sec, moelleux).", "Vouvray can be any sweetness: check the label (sec, demi-sec, moelleux)."],
  ["Mela cotta, cera, miele", "Pomme cuite, cire, miel", "Baked apple, wax, honey"],
  ["Dal secco al dolce e spumante, acidità alta", "Du sec au liquoreux et effervescent, acidité haute", "Dry to sweet and sparkling, high acid"],
  ["Vouvray", "Savennières", "Coteaux du Layon", "Quarts de Chaume", "Montlouis-sur-Loire", "Swartland", "Stellenbosch"])
g("Pinot Gris", "w", "u1", ["Pinot Grigio", "Grauburgunder"], "", "E", "L/M", "", "L/F",
  ["Mutazione a buccia rosata del Pinot Noir; matura presto, rese alte in pianura.", "Mutation à peau rosée du Pinot Noir ; mûrit tôt, rendements élevés en plaine.", "A pink-skinned mutation of Pinot Noir; ripens early, high yields on the plains."],
  ["Pinot Grigio: neutro, pera, mela, leggero. Pinot Gris d'Alsazia: pesca, miele, zenzero, corpo pieno.", "Pinot Grigio : neutre, poire, pomme, léger. Pinot Gris d'Alsace : pêche, miel, gingembre, corps ample.", "Pinot Grigio: neutral, pear, apple, light. Alsace Pinot Gris: peach, honey, ginger, full body."],
  ["Due stili: italiano leggero e fresco (acciaio, rese alte) e alsaziano pieno, untuoso, spesso con un po' di zucchero e in vendemmia tardiva.", "Deux styles : italien léger et frais (inox, rendements élevés) et alsacien ample, onctueux, souvent un peu sucré et en vendanges tardives.", "Two styles: light, crisp Italian (steel, high yields) and full, oily Alsace, often off-dry and in late-harvest versions."],
  ["Stesso vitigno, nome diverso = stile diverso: «Grigio» leggero, «Gris» ricco.", "Même cépage, nom différent = style différent : « Grigio » léger, « Gris » riche.", "Same grape, different name = different style: 'Grigio' light, 'Gris' rich."],
  ["Pera, pesca, zenzero, miele", "Poire, pêche, gingembre, miel", "Pear, peach, ginger, honey"],
  ["Buccia rosata: Grigio leggero, Gris pieno", "Peau rosée : Grigio léger, Gris ample", "Pink skin: light Grigio, rich Gris"],
  ["Alsace", "Alto Adige", "Friuli Grave", "Willamette Valley", "Baden"])
g("Gewurztraminer", "w", "u1", ["Gewürztraminer", "Traminer"], "E", "E", "L", "", "F",
  ["Germoglia presto (gelate) e matura presto; serve calore per sviluppare gli aromi, ma perde acidità in fretta.", "Débourre tôt (gelées) et mûrit tôt ; il faut de la chaleur pour les arômes, mais il perd vite son acidité.", "Buds and ripens early (frost risk); needs warmth for aroma but loses acidity quickly."],
  ["Il più aromatico: rosa, litchi, zenzero, cannella, spezie dolci; buccia rosata, colore dorato intenso.", "Le plus aromatique : rose, litchi, gingembre, cannelle, épices douces ; peau rosée, couleur dorée intense.", "The most aromatic: rose, lychee, ginger, cinnamon, sweet spice; pink skin, deep golden colour."],
  ["Acidità bassa, alcol alto, corpo pieno, spesso un po' di zucchero; in Alsazia anche VT e SGN.", "Acidité basse, alcool élevé, corps ample, souvent un peu de sucre ; en Alsace aussi VT et SGN.", "Low acid, high alcohol, full body, often off-dry; in Alsace also VT and SGN."],
  ["Unico vitigno nobile d'Alsazia con acidità bassa: lo riconosci da litchi e rosa.", "Seul cépage noble d'Alsace à acidité basse : on le reconnaît au litchi et à la rose.", "The only noble Alsace grape with low acidity: spot it by lychee and rose."],
  ["Litchi, rosa, zenzero", "Litchi, rose, gingembre", "Lychee, rose, ginger"],
  ["Aromatico, acidità bassa, alcol alto", "Aromatique, acidité basse, alcool élevé", "Aromatic, low acid, high alcohol"],
  ["Alsace", "Alto Adige", "Pfalz"])
g("Viognier", "w", "u1", [], "", "M", "L/M", "", "F",
  ["Serve calore per sviluppare gli aromi, ma se matura troppo perde freschezza: finestra di raccolta stretta; rese basse e irregolari.", "Il faut de la chaleur pour ses arômes, mais trop mûr il perd sa fraîcheur : fenêtre de vendange étroite ; rendements faibles et irréguliers.", "Needs warmth for aroma but loses freshness if over-ripe: a narrow picking window; low, irregular yields."],
  ["Albicocca, pesca, fiori bianchi (caprifoglio), a volte spezie.", "Abricot, pêche, fleurs blanches (chèvrefeuille), parfois épices.", "Apricot, peach, white flowers (honeysuckle), sometimes spice."],
  ["Bianco pieno e untuoso, a volte barrique usata; nella Côte-Rôtie si co-fermenta (fino al 20%) con la Syrah per fissare il colore e profumare.", "Blanc ample et onctueux, parfois en fût usagé ; en Côte-Rôtie co-fermenté (jusqu'à 20 %) avec la Syrah pour fixer la couleur et parfumer.", "Full, oily white, sometimes in used oak; in Côte-Rôtie co-fermented (up to 20%) with Syrah to fix colour and add perfume."],
  ["Condrieu e Château-Grillet: 100% Viognier, Rodano settentrionale.", "Condrieu et Château-Grillet : 100 % Viognier, Rhône septentrional.", "Condrieu and Château-Grillet: 100% Viognier, northern Rhône."],
  ["Albicocca, caprifoglio", "Abricot, chèvrefeuille", "Apricot, honeysuckle"],
  ["Pieno, untuoso, co-fermentato con la Syrah", "Ample, onctueux, co-fermenté avec la Syrah", "Full and oily, co-fermented with Syrah"],
  ["Condrieu", "Château-Grillet", "Côte Rôtie", "Languedoc"])
g("Muscat", "w", "u1", ["Moscato", "Moscatel", "Muscat Blanc à Petits Grains", "Zibibbo"], "", "M", "L/M", "", "L/F",
  ["Famiglia di varietà; il Muscat Blanc à Petits Grains è la più fine. Coltivato dal Piemonte fresco al Rutherglen caldo.", "Famille de variétés ; le Muscat Blanc à Petits Grains est la plus fine. Cultivé du Piémont frais au Rutherglen chaud.", "A family of varieties; Muscat Blanc à Petits Grains is the finest. Grown from cool Piedmont to hot Rutherglen."],
  ["Il vino che «sa di uva»: uva fresca, fiori d'arancio, rosa; nei fortificati invecchiati uvetta, caramello, caffè.", "Le vin qui « sent le raisin » : raisin frais, fleur d'oranger, rose ; dans les mutés vieillis raisin sec, caramel, café.", "The wine that tastes of grapes: fresh grape, orange blossom, rose; in aged fortified wines raisin, toffee, coffee."],
  ["Asti/Moscato d'Asti: dolci, leggeri, frizzanti (metodo Asti); VDN del sud della Francia (Beaumes-de-Venise); Rutherglen Muscat ossidativo.", "Asti/Moscato d'Asti : doux, légers, pétillants (méthode Asti) ; VDN du sud de la France (Beaumes-de-Venise) ; Rutherglen Muscat oxydatif.", "Asti/Moscato d'Asti: sweet, light, sparkling (Asti method); southern French VDNs (Beaumes-de-Venise); oxidative Rutherglen Muscat."],
  ["Asti: dolce, circa 7% vol., nessuna nota autolitica; una sola fermentazione fermata col freddo (metodo Asti).", "Asti : doux, environ 7 % vol., aucune note autolytique ; une seule fermentation arrêtée par le froid (méthode Asti).", "Asti: sweet, about 7% abv, no autolytic notes; a single fermentation stopped by chilling (Asti method)."],
  ["Uva fresca, fiori d'arancio", "Raisin frais, fleur d'oranger", "Fresh grape, orange blossom"],
  ["Sa d'uva: dolce frizzante o fortificato", "Goût de raisin : doux pétillant ou muté", "Tastes of grapes: sweet fizz or fortified"],
  ["Asti", "Muscat de Beaumes-de-Venise", "Rutherglen", "Alsace", "Pantelleria", "Málaga & Sierras de Málaga"])

# ---------------- u2 international reds ----------------
g("Cabernet Sauvignon", "b", "u2", [], "L", "L", "H", "H", "M/F",
  ["Germoglia e matura tardi: serve un clima moderato o caldo e suoli caldi (ghiaie del Médoc); buccia spessa, acini piccoli.", "Débourre et mûrit tard : il faut un climat modéré ou chaud et des sols chauds (graves du Médoc) ; peau épaisse, petites baies.", "Buds and ripens late: needs a moderate or warm climate and warm soils (Médoc gravel); thick skins, small berries."],
  ["Ribes nero, mora, cedro, menta/eucalipto, foglia verde se poco maturo; con il legno vaniglia e cioccolato; con l'età tabacco e sottobosco.", "Cassis, mûre, cèdre, menthe/eucalyptus, poivron s'il manque de maturité ; avec le bois vanille et chocolat ; avec l'âge tabac et sous-bois.", "Blackcurrant, blackberry, cedar, mint/eucalyptus, green pepper if under-ripe; with oak vanilla and chocolate; with age tobacco and forest floor."],
  ["Colore intenso, tannino e acidità alti: affinamento in barrique nuove; spesso tagliato con Merlot (rive gauche) per arrotondarlo; lungo invecchiamento.", "Couleur intense, tanin et acidité élevés : élevage en barriques neuves ; souvent assemblé au Merlot (rive gauche) pour l'arrondir ; longue garde.", "Deep colour, high tannin and acidity: aged in new barriques; often blended with Merlot (Left Bank) to soften it; long ageing."],
  ["Rive gauche (Médoc, Graves) = Cabernet dominante; rive droite = Merlot.", "Rive gauche (Médoc, Graves) = Cabernet dominant ; rive droite = Merlot.", "Left Bank (Médoc, Graves) = Cabernet-led; Right Bank = Merlot."],
  ["Ribes nero, cedro, menta", "Cassis, cèdre, menthe", "Blackcurrant, cedar, mint"],
  ["Buccia spessa, tardivo, tannino alto", "Peau épaisse, tardif, tanin élevé", "Thick skin, late, high tannin"],
  ["Pauillac", "Margaux", "Saint-Estèphe", "Napa Valley", "Coonawarra", "Margaret River", "Maipo Valley", "Bolgheri"])
g("Merlot", "b", "u2", [], "E", "E", "M", "M", "M/F",
  ["Germoglia e matura prima del Cabernet: ama suoli freschi d'argilla (Pomerol); sensibile alla colatura e alla siccità.", "Débourre et mûrit avant le Cabernet : aime les sols frais argileux (Pomerol) ; sensible à la coulure et à la sécheresse.", "Buds and ripens earlier than Cabernet: likes cool clay soils (Pomerol); prone to coulure and drought stress."],
  ["Fragola e prugna rossa (stile fresco) o prugna, mora, cioccolato (stile maturo); con l'età cuoio e funghi.", "Fraise et prune rouge (style frais) ou prune, mûre, chocolat (style mûr) ; avec l'âge cuir et champignon.", "Strawberry and red plum (fresh style) or plum, blackberry, chocolate (ripe style); with age leather and mushroom."],
  ["Tannino più morbido e corpo più carnoso del Cabernet; a Bordeaux base della rive droite; vini semplici e fruttati in volume.", "Tanin plus souple et chair plus ronde que le Cabernet ; à Bordeaux base de la rive droite ; vins simples et fruités en volume.", "Softer tannin and fleshier than Cabernet; the Right Bank base in Bordeaux; simple fruity wines in volume."],
  ["Il Merlot è il vitigno più piantato di Bordeaux.", "Le Merlot est le cépage le plus planté de Bordeaux.", "Merlot is Bordeaux's most planted grape."],
  ["Prugna, fragola, cioccolato", "Prune, fraise, chocolat", "Plum, strawberry, chocolate"],
  ["Morbido e carnoso, ama l'argilla fresca", "Souple et charnu, aime l'argile fraîche", "Soft and plush, loves cool clay"],
  ["Pomerol", "Saint-Émilion", "Fronsac", "Hawke's Bay", "Washington", "Pays d'Oc IGP"])
g("Cabernet Franc", "b", "u2", [], "", "M", "M/H", "M", "L/M",
  ["Matura prima del Cabernet Sauvignon: va bene in climi più freschi (Loira) e sui suoli freschi della rive droite.", "Mûrit avant le Cabernet Sauvignon : convient aux climats plus frais (Loire) et aux sols frais de la rive droite.", "Ripens before Cabernet Sauvignon: suits cooler climates (Loire) and the cool soils of the Right Bank."],
  ["Lampone, fragola, ribes rosso, violetta, foglia/peperone verde (soprattutto in Loira).", "Framboise, fraise, groseille, violette, notes végétales/poivron (surtout en Loire).", "Raspberry, strawberry, redcurrant, violet, leafy/green pepper notes (especially in the Loire)."],
  ["Loira: rossi leggeri e fruttati da bere freschi, o più strutturati e longevi; a Bordeaux complemento (Cheval Blanc).", "Loire : rouges légers et fruités à servir frais, ou plus structurés et de garde ; à Bordeaux complément (Cheval Blanc).", "Loire: light, fruity reds served cool, or more structured age-worthy ones; in Bordeaux a blending partner (Cheval Blanc)."],
  ["Chinon, Bourgueil, Saumur-Champigny = Cabernet Franc.", "Chinon, Bourgueil, Saumur-Champigny = Cabernet Franc.", "Chinon, Bourgueil, Saumur-Champigny = Cabernet Franc."],
  ["Lampone, violetta, foglia verde", "Framboise, violette, feuille verte", "Raspberry, violet, leafy"],
  ["Rosso leggero della Loira, note vegetali", "Rouge léger de Loire, notes végétales", "Light Loire red, leafy notes"],
  ["Chinon", "Bourgueil", "Saumur-Champigny", "Saint-Émilion"])
g("Pinot Noir", "b", "u2", ["Spätburgunder", "Pinot Nero"], "E", "E", "H", "L/M", "L/M",
  ["Germoglia e matura presto: climi freschi o moderati; buccia sottile, sensibile a muffa grigia, gelate e caldo eccessivo; molti cloni.", "Débourre et mûrit tôt : climats frais ou modérés ; peau fine, sensible à la pourriture grise, aux gelées et à l'excès de chaleur ; nombreux clones.", "Buds and ripens early: cool or moderate climates; thin skin, prone to grey rot, frost and excess heat; many clones."],
  ["Fragola, lampone, ciliegia rossa; più caldo ciliegia nera e prugna; con l'età funghi, sottobosco, selvaggina.", "Fraise, framboise, cerise rouge ; plus chaud cerise noire et prune ; avec l'âge champignon, sous-bois, gibier.", "Strawberry, raspberry, red cherry; warmer black cherry and plum; with age mushroom, forest floor, game."],
  ["Colore pallido, tannino morbido; grappoli interi o diraspati, macerazione a freddo, barrique (nuove per i migliori); quasi mai tagliato; base dello Champagne.", "Couleur pâle, tanin souple ; vendanges entières ou éraflées, macération à froid, barrique (neuve pour les meilleurs) ; rarement assemblé ; base du Champagne.", "Pale colour, soft tannin; whole bunches or destemmed, cold soak, barriques (new for the best); rarely blended; a Champagne base."],
  ["Troppo caldo = frutto cotto e niente eleganza: lo trovi nei climi freschi (Borgogna, Central Otago, Willamette).", "Trop chaud = fruit cuit et pas d'élégance : on le trouve en climat frais (Bourgogne, Central Otago, Willamette).", "Too hot = jammy and no elegance: look for cool climates (Burgundy, Central Otago, Willamette)."],
  ["Fragola, ciliegia rossa, sottobosco", "Fraise, cerise rouge, sous-bois", "Strawberry, red cherry, forest floor"],
  ["Buccia sottile, colore pallido, clima fresco", "Peau fine, couleur pâle, climat frais", "Thin skin, pale colour, cool climate"],
  ["Côte de Nuits", "Côte de Beaune", "Champagne", "Central Otago", "Martinborough", "Willamette Valley", "Russian River Valley", "Yarra Valley"])
g("Syrah", "b", "u2", ["Shiraz"], "", "M", "M/H", "M/H", "M/F",
  ["Ha bisogno di calore ma non troppo: al nord del Rodano sui pendii ripidi esposti a sud; in Australia anche in climi caldi.", "A besoin de chaleur sans excès : au nord du Rhône sur des coteaux escarpés exposés au sud ; en Australie aussi en climat chaud.", "Needs warmth but not excess: in the northern Rhône on steep south-facing slopes; in Australia also in hot climates."],
  ["Fresco: mora, violetta, pepe nero, note erbacee. Caldo (Shiraz): frutta nera matura, cioccolato, liquirizia, spezie dolci.", "Frais : mûre, violette, poivre noir, notes herbacées. Chaud (Shiraz) : fruits noirs mûrs, chocolat, réglisse, épices douces.", "Cool: blackberry, violet, black pepper, herbal notes. Warm (Shiraz): ripe black fruit, chocolate, liquorice, sweet spice."],
  ["Colore profondo, tannino maturo; Rodano: legno vecchio e grande, a volte con Viognier; Barossa: rovere americano, stile ricco; anche spumante rosso.", "Couleur profonde, tanin mûr ; Rhône : vieux grands foudres, parfois avec Viognier ; Barossa : chêne américain, style riche ; aussi effervescent rouge.", "Deep colour, ripe tannin; Rhône: old large oak, sometimes with Viognier; Barossa: American oak, rich style; also sparkling red."],
  ["«Syrah» in etichetta spesso indica uno stile più fresco e pepato; «Shiraz» uno più ricco e maturo.", "« Syrah » sur l'étiquette indique souvent un style plus frais et poivré ; « Shiraz » un style plus riche et mûr.", "'Syrah' on a label often signals a cooler, peppery style; 'Shiraz' a richer, riper one."],
  ["Pepe nero, mora, violetta", "Poivre noir, mûre, violette", "Black pepper, blackberry, violet"],
  ["Colore profondo, pepe nero, nord del Rodano", "Couleur profonde, poivre noir, Rhône nord", "Deep colour, black pepper, northern Rhône"],
  ["Hermitage", "Côte Rôtie", "Cornas", "Crozes-Hermitage", "Barossa Valley", "McLaren Vale", "Hawke's Bay", "Elqui Valley"])
g("Grenache", "b", "u2", ["Garnacha", "Cannonau"], "E", "L", "L/M", "L/M", "F",
  ["Germoglia presto e matura tardi: serve un clima caldo e secco; resiste a siccità e vento (alberello); vecchie viti preziose.", "Débourre tôt et mûrit tard : climat chaud et sec ; résiste à la sécheresse et au vent (gobelet) ; vieilles vignes précieuses.", "Buds early and ripens late: needs a hot, dry climate; resists drought and wind (bush vines); prized old vines."],
  ["Fragola, lampone, ciliegia rossa matura, pepe bianco, erbe secche (garrigue); con l'età toffee e cuoio.", "Fraise, framboise, cerise rouge mûre, poivre blanc, herbes sèches (garrigue) ; avec l'âge caramel et cuir.", "Strawberry, raspberry, ripe red cherry, white pepper, dried herbs (garrigue); with age toffee and leather."],
  ["Accumula molto zucchero: alcol alto, colore chiaro, tannino morbido; spesso tagliato (GSM) con Syrah e Mourvèdre; rosati (Tavel, Navarra); VDN (Banyuls, Maury).", "Accumule beaucoup de sucre : alcool élevé, couleur claire, tanin souple ; souvent assemblé (GSM) avec Syrah et Mourvèdre ; rosés (Tavel, Navarra) ; VDN (Banyuls, Maury).", "Builds high sugar: high alcohol, pale colour, soft tannin; often blended (GSM) with Syrah and Mourvèdre; rosés (Tavel, Navarra); VDNs (Banyuls, Maury)."],
  ["Châteauneuf-du-Pape: Grenache dominante, fino a 13 uve ammesse.", "Châteauneuf-du-Pape : Grenache dominant, jusqu'à 13 cépages admis.", "Châteauneuf-du-Pape: Grenache-led, with up to 13 permitted grapes."],
  ["Fragola matura, pepe bianco, garrigue", "Fraise mûre, poivre blanc, garrigue", "Ripe strawberry, white pepper, garrigue"],
  ["Alcol alto, colore chiaro, ama il caldo secco", "Alcool élevé, couleur claire, aime le chaud sec", "High alcohol, pale colour, loves dry heat"],
  ["Châteauneuf-du-Pape", "Gigondas", "Tavel", "Priorat", "Navarra", "Barossa Valley", "McLaren Vale", "Sardinia"])

# ---------------- u3 France: other grapes ----------------
g("Mourvèdre", "b", "u3", ["Monastrell", "Mataro"], "L", "L", "M", "H", "F",
  ["Germoglia e matura molto tardi: serve molto calore e acqua nel suolo; ama la vicinanza del mare (Bandol).", "Débourre et mûrit très tard : il faut beaucoup de chaleur et d'eau dans le sol ; aime la proximité de la mer (Bandol).", "Buds and ripens very late: needs lots of heat and soil water; likes sea proximity (Bandol)."],
  ["Mora, more di gelso, note selvatiche/animali, carne, erbe; con l'età cuoio.", "Mûre, fruits noirs sauvages, notes animales/viande, herbes ; avec l'âge cuir.", "Blackberry, wild dark fruit, gamey/meaty notes, herbs; with age leather."],
  ["Colore profondo, tannino alto: dà struttura nei tagli GSM; Bandol (almeno 50% in rosso, lungo legno); Monastrell in Spagna (Jumilla, Yecla).", "Couleur profonde, tanin élevé : structure dans les assemblages GSM ; Bandol (au moins 50 % en rouge, long élevage) ; Monastrell en Espagne (Jumilla, Yecla).", "Deep colour, high tannin: adds structure to GSM blends; Bandol (at least 50% in reds, long oak); Monastrell in Spain (Jumilla, Yecla)."],
  ["La «M» di GSM; in Spagna si chiama Monastrell, in Australia Mataro.", "Le « M » de GSM ; en Espagne Monastrell, en Australie Mataro.", "The 'M' in GSM; called Monastrell in Spain, Mataro in Australia."],
  ["Mora selvatica, carne, selvaggina", "Mûre sauvage, viande, gibier", "Wild blackberry, meaty, gamey"],
  ["Tardivissimo, tannino alto, ama il mare", "Très tardif, tanin élevé, aime la mer", "Very late, high tannin, likes the sea"],
  ["Bandol", "Jumilla", "Yecla", "Valencia", "Barossa Valley"])
g("Carignan", "b", "u3", ["Cariñena", "Carignano"], "L", "L", "H", "H", "M/F",
  ["Germoglia e matura tardi; vigoroso e produttivo, sensibile all'oidio; al meglio da vecchie viti ad alberello a rese basse.", "Débourre et mûrit tard ; vigoureux et productif, sensible à l'oïdium ; au mieux sur vieilles vignes en gobelet à faibles rendements.", "Buds and ripens late; vigorous and productive, prone to powdery mildew; best from old, low-yielding bush vines."],
  ["Frutta rossa e nera, note speziate e rustiche; con macerazione carbonica più morbido e fruttato.", "Fruits rouges et noirs, notes épicées et rustiques ; en macération carbonique plus souple et fruité.", "Red and black fruit, spicy, rustic notes; with carbonic maceration softer and fruitier."],
  ["Acidità e tannino alti, colore intenso: spesso in taglio (Corbières, Fitou, Priorat); a volte macerazione carbonica per ammorbidirlo.", "Acidité et tanin élevés, couleur intense : souvent en assemblage (Corbières, Fitou, Priorat) ; parfois en macération carbonique pour l'assouplir.", "High acid and tannin, deep colour: often blended (Corbières, Fitou, Priorat); sometimes carbonic maceration to soften it."],
  ["Il Cile (Maule) valorizza le vecchie viti di Carignan non irrigate.", "Le Chili (Maule) valorise les vieilles vignes de Carignan non irriguées.", "Chile (Maule) champions old, dry-farmed Carignan vines."],
  ["Frutta nera rustica, spezie", "Fruits noirs rustiques, épices", "Rustic black fruit, spice"],
  ["Acidità e tannino alti, vecchie viti", "Acidité et tanin élevés, vieilles vignes", "High acid and tannin, old vines"],
  ["Corbières", "Fitou", "Minervois", "Priorat", "Cariñena", "Maule Valley"])
g("Gamay", "b", "u3", [], "E", "E", "H", "L", "L/M",
  ["Germoglia presto (gelate) e matura presto; ama i graniti dei cru del Beaujolais settentrionale.", "Débourre tôt (gelées) et mûrit tôt ; aime les granites des crus du nord du Beaujolais.", "Buds and ripens early (frost risk); thrives on the granite of the northern Beaujolais crus."],
  ["Lampone, ciliegia rossa, fragola; con macerazione carbonica banana, chewing-gum, kirsch; nei cru più strutturati note di frutta nera.", "Framboise, cerise rouge, fraise ; en macération carbonique banane, chewing-gum, kirsch ; dans les crus plus structurés fruits noirs.", "Raspberry, red cherry, strawberry; with carbonic maceration banana, bubblegum, kirsch; structured crus show darker fruit."],
  ["Colore viola, tannino basso, acidità alta; macerazione carbonica o semicarbonica; Beaujolais Nouveau; cru come Morgon e Moulin-à-Vent invecchiano.", "Couleur violacée, tanin bas, acidité haute ; macération carbonique ou semi-carbonique ; Beaujolais nouveau ; crus comme Morgon et Moulin-à-Vent vieillissent.", "Purple colour, low tannin, high acidity; carbonic or semi-carbonic maceration; Beaujolais Nouveau; crus like Morgon and Moulin-à-Vent can age."],
  ["Dieci cru del Beaujolais: in etichetta compare solo il nome del cru (Fleurie, Morgon…).", "Dix crus du Beaujolais : l'étiquette ne porte que le nom du cru (Fleurie, Morgon…).", "Ten Beaujolais crus: the label shows only the cru name (Fleurie, Morgon…)."],
  ["Lampone, banana, chewing-gum", "Framboise, banane, chewing-gum", "Raspberry, banana, bubblegum"],
  ["Macerazione carbonica, tannino basso", "Macération carbonique, tanin bas", "Carbonic maceration, low tannin"],
  ["Beaujolais", "Morgon", "Fleurie", "Moulin-à-Vent", "Brouilly", "Beaujolais Villages"])
g("Melon Blanc", "w", "u3", ["Melon de Bourgogne"], "", "E", "H", "", "L",
  ["Resiste al freddo e matura presto: adatto al clima marittimo fresco del Pays Nantais, vicino all'Atlantico.", "Résiste au froid et mûrit tôt : adapté au climat maritime frais du Pays nantais, près de l'Atlantique.", "Frost-hardy and early ripening: suited to the cool maritime Pays Nantais by the Atlantic."],
  ["Neutro: mela verde, limone, note saline; con sur lie lievito e pane.", "Neutre : pomme verte, citron, notes salines ; sur lie levure et pain.", "Neutral: green apple, lemon, saline notes; sur lie adds yeast and bread."],
  ["Muscadet: secco, leggero, acciaio; «sur lie» = imbottigliato dopo l'inverno sulle fecce fini, più corpo e a volte leggero frizzante.", "Muscadet : sec, léger, inox ; « sur lie » = mis en bouteille après l'hiver sur lies fines, plus de corps et parfois un léger perlant.", "Muscadet: dry, light, steel; 'sur lie' = bottled after winter on fine lees, more body and sometimes a light spritz."],
  ["Muscadet Sèvre et Maine è la zona più grande e qualitativa.", "Muscadet Sèvre et Maine est la zone la plus vaste et qualitative.", "Muscadet Sèvre et Maine is the largest, finest zone."],
  ["Mela verde, limone, sale, lievito", "Pomme verte, citron, sel, levure", "Green apple, lemon, saline, yeast"],
  ["Leggero e neutro, affinato «sur lie»", "Léger et neutre, élevé « sur lie »", "Light and neutral, aged 'sur lie'"],
  ["Muscadet Sèvre et Maine", "Muscadet", "Nantais"])
g("Tannat", "b", "u3", [], "", "L", "H", "H", "F",
  ["Matura tardi, ha bisogno di calore; coltivato nel Sud-Ovest francese ai piedi dei Pirenei.", "Mûrit tard, a besoin de chaleur ; cultivé dans le Sud-Ouest au pied des Pyrénées.", "Late ripening and needs warmth; grown in South West France near the Pyrenees."],
  ["Mora, prugna, spezie; con il legno note tostate.", "Mûre, prune, épices ; avec le bois notes grillées.", "Blackberry, plum, spice; with oak toasty notes."],
  ["Tannino altissimo: si usa la micro-ossigenazione e un lungo affinamento in legno per ammorbidirlo.", "Tanin très élevé : on utilise la micro-oxygénation et un long élevage en bois pour l'assouplir.", "Very high tannin: micro-oxygenation and long oak ageing are used to soften it."],
  ["Madiran = Tannat; la micro-ossigenazione è nata qui.", "Madiran = Tannat ; la micro-oxygénation est née ici.", "Madiran = Tannat; micro-oxygenation was developed here."],
  ["Mora, prugna, tannino ruvido", "Mûre, prune, tanin rugueux", "Blackberry, plum, gripping tannin"],
  ["Tannino altissimo, micro-ossigenazione", "Tanin très élevé, micro-oxygénation", "Massive tannin, micro-oxygenation"],
  ["Madiran", "Irouléguy"])

# ---------------- u4 Italy ----------------
g("Nebbiolo", "b", "u4", ["Spanna", "Chiavennasca"], "E", "L", "H", "H", "M/F",
  ["Germoglia presto e matura molto tardi (raccolta a ottobre, tra le nebbie): serve la migliore esposizione a sud sulle colline delle Langhe.", "Débourre tôt et mûrit très tard (vendange en octobre, dans les brouillards) : il faut les meilleures expositions sud des collines des Langhe.", "Buds early and ripens very late (October harvest, in the fog): needs the best south-facing Langhe hillsides."],
  ["Rosa, violetta, ciliegia rossa, lampone, erbe; con l'età catrame, tartufo, cuoio, frutta secca.", "Rose, violette, cerise rouge, framboise, herbes ; avec l'âge goudron, truffe, cuir, fruits secs.", "Rose, violet, red cherry, raspberry, herbs; with age tar, truffle, leather, dried fruit."],
  ["Colore chiaro che vira presto all'aranciato, ma tannino e acidità altissimi; tradizione: botti grandi; moderno: barrique; lungo affinamento obbligatorio.", "Couleur claire qui tuile vite, mais tanin et acidité très élevés ; tradition : grands foudres ; moderne : barrique ; long vieillissement obligatoire.", "Pale colour that soon turns orange, yet very high tannin and acidity; traditional large casks or modern barriques; long mandatory ageing."],
  ["Barolo: almeno 38 mesi (18 in legno); Barbaresco: 26 mesi (9 in legno).", "Barolo : au moins 38 mois (18 en bois) ; Barbaresco : 26 mois (9 en bois).", "Barolo: at least 38 months (18 in wood); Barbaresco: 26 months (9 in wood)."],
  ["Rosa, catrame, ciliegia", "Rose, goudron, cerise", "Roses, tar, cherry"],
  ["Colore chiaro ma tannino e acidità altissimi", "Couleur claire mais tanin et acidité très élevés", "Pale colour but huge tannin and acid"],
  ["Barolo", "Barbaresco", "Roero", "Gattinara", "Ghemme"])
g("Sangiovese", "b", "u4", ["Brunello", "Prugnolo Gentile", "Morellino"], "E", "L", "H", "M/H", "M/F",
  ["Germoglia presto e matura tardi: ama le colline calde ma ventilate della Toscana; molti cloni (Brunello a Montalcino).", "Débourre tôt et mûrit tard : aime les collines chaudes et ventilées de Toscane ; nombreux clones (Brunello à Montalcino).", "Buds early, ripens late: likes warm but airy Tuscan hillsides; many clones (Brunello at Montalcino)."],
  ["Ciliegia rossa, prugna, erbe secche, pomodoro/foglia di tè; con l'età cuoio, terra, carne.", "Cerise rouge, prune, herbes sèches, tomate/feuille de thé ; avec l'âge cuir, terre, viande.", "Red cherry, plum, dried herbs, tomato leaf/tea; with age leather, earth, meat."],
  ["Acidità e tannino alti, colore medio; botti grandi o barrique; da solo o con Canaiolo, Cabernet, Merlot (Supertuscan).", "Acidité et tanin élevés, couleur moyenne ; grands foudres ou barriques ; seul ou avec Canaiolo, Cabernet, Merlot (Supertoscans).", "High acid and tannin, medium colour; large casks or barriques; alone or with Canaiolo, Cabernet, Merlot (Super Tuscans)."],
  ["Brunello di Montalcino: 100% Sangiovese, uscita dopo 5 anni (2 in legno).", "Brunello di Montalcino : 100 % Sangiovese, mise en marché après 5 ans (2 en bois).", "Brunello di Montalcino: 100% Sangiovese, released after 5 years (2 in wood)."],
  ["Ciliegia acidula, erbe secche, pomodoro", "Cerise acidulée, herbes sèches, tomate", "Sour cherry, dried herbs, tomato leaf"],
  ["Acidità alta, il rosso della Toscana", "Acidité haute, le rouge de Toscane", "High acid, Tuscany's red"],
  ["Chianti Classico", "Brunello di Montalcino", "Vino Nobile di Montepulciano", "Morellino di Scansano", "Carmignano", "Torgiano"])
g("Barbera", "b", "u4", [], "", "M", "H", "L", "M",
  ["Matura prima del Nebbiolo: occupa i siti meno pregiati e meno ventilati delle colline piemontesi.", "Mûrit avant le Nebbiolo : occupe les sites moins prestigieux des collines piémontaises.", "Ripens before Nebbiolo: given the lesser sites on Piedmont's hills."],
  ["Ciliegia rossa e nera, prugna, a volte pepe nero; con barrique vaniglia e spezie.", "Cerise rouge et noire, prune, parfois poivre noir ; en barrique vanille et épices.", "Red and black cherry, plum, sometimes black pepper; with barriques vanilla and spice."],
  ["Colore profondo, acidità alta, tannino basso: dal semplice fruttato al serio, affinato in barrique (Nizza).", "Couleur profonde, acidité haute, tanin bas : du simple fruité au sérieux élevé en barrique (Nizza).", "Deep colour, high acidity, low tannin: from simple and fruity to serious barrique-aged wines (Nizza)."],
  ["L'opposto del Nebbiolo: colore scuro, tannino basso.", "L'opposé du Nebbiolo : couleur foncée, tanin bas.", "Nebbiolo's opposite: dark colour, low tannin."],
  ["Ciliegia nera, prugna, acidità vivace", "Cerise noire, prune, acidité vive", "Black cherry, plum, lively acidity"],
  ["Colore scuro, acidità alta, tannino basso", "Couleur foncée, acidité haute, tanin bas", "Dark colour, high acid, low tannin"],
  ["Barbera d'Asti", "Nizza", "Piemonte"])
g("Corvina", "b", "u4", ["Corvina Veronese"], "", "L", "H", "L/M", "L/M",
  ["Matura tardi; buccia spessa e acini resistenti: adatta all'appassimento delle uve in fruttaio.", "Mûrit tard ; peau épaisse et baies résistantes : adaptée au passerillage des raisins en fruttaio.", "Late ripening; thick skins and sturdy berries: well suited to drying grapes in lofts (appassimento)."],
  ["Ciliegia acidula, mandorla amara; nell'Amarone frutta cotta, uvetta, cioccolato, spezie.", "Cerise acidulée, amande amère ; dans l'Amarone fruits cuits, raisins secs, chocolat, épices.", "Sour cherry, bitter almond; in Amarone baked fruit, raisin, chocolate, spice."],
  ["Valpolicella leggera; Ripasso (ripassato sulle vinacce dell'Amarone); Amarone (secco, alcol alto) e Recioto (dolce) da uve appassite; tagliata con Rondinella.", "Valpolicella léger ; Ripasso (repassé sur les marcs d'Amarone) ; Amarone (sec, alcool élevé) et Recioto (doux) de raisins passerillés ; assemblé au Rondinella.", "Light Valpolicella; Ripasso (refermented on Amarone skins); Amarone (dry, high alcohol) and Recioto (sweet) from dried grapes; blended with Rondinella."],
  ["Amarone e Recioto: stesse uve appassite, l'Amarone fermenta a secco.", "Amarone et Recioto : mêmes raisins passerillés, l'Amarone fermente à sec.", "Amarone and Recioto: same dried grapes, Amarone fermented dry."],
  ["Ciliegia acidula, mandorla amara", "Cerise acidulée, amande amère", "Sour cherry, bitter almond"],
  ["Uve appassite: Amarone e Recioto", "Raisins passerillés : Amarone et Recioto", "Dried grapes: Amarone and Recioto"],
  ["Valpolicella Classico", "Valpolicella", "Bardolino"])
g("Aglianico", "b", "u4", [], "E", "L", "H", "H", "F",
  ["Germoglia presto e matura molto tardi (fino a novembre): cresce in quota su suoli vulcanici nel Sud.", "Débourre tôt et mûrit très tard (jusqu'en novembre) : cultivé en altitude sur sols volcaniques dans le Sud.", "Buds early and ripens very late (into November): grown at altitude on volcanic soils in the south."],
  ["Frutta nera, ciliegia, erbe, spezie; con l'età terra e cuoio.", "Fruits noirs, cerise, herbes, épices ; avec l'âge terre et cuir.", "Black fruit, cherry, herbs, spice; with age earth and leather."],
  ["Colore profondo, tannino e acidità alti: lungo affinamento; il «Barolo del Sud».", "Couleur profonde, tanin et acidité élevés : long vieillissement ; le « Barolo du Sud ».", "Deep colour, high tannin and acidity: long ageing; the 'Barolo of the South'."],
  ["Taurasi (Campania) e Aglianico del Vulture (Basilicata).", "Taurasi (Campanie) et Aglianico del Vulture (Basilicate).", "Taurasi (Campania) and Aglianico del Vulture (Basilicata)."],
  ["Frutta nera, terra vulcanica", "Fruits noirs, terre volcanique", "Black fruit, volcanic earth"],
  ["Il «Barolo del Sud», vulcanico", "Le « Barolo du Sud », volcanique", "The 'Barolo of the South', volcanic"],
  ["Taurasi", "Aglianico del Vulture", "Campania", "Basilicata"])
g("Montepulciano", "b", "u4", [], "", "L", "M", "M/H", "M/F",
  ["Matura tardi; coltivato soprattutto lungo l'Adriatico centrale (Abruzzo, Marche). Da non confondere con il borgo toscano.", "Mûrit tard ; cultivé surtout sur l'Adriatique central (Abruzzes, Marches). À ne pas confondre avec le village toscan.", "Late ripening; grown mainly along the central Adriatic (Abruzzo, Marche). Not to be confused with the Tuscan town."],
  ["Prugna, ciliegia nera, erbe, pepe.", "Prune, cerise noire, herbes, poivre.", "Plum, black cherry, herbs, pepper."],
  ["Colore intenso, tannino morbido e maturo: vini fruttati di buon valore, a volte da vecchie viti a pergola e barrique.", "Couleur intense, tanin souple et mûr : vins fruités au bon rapport qualité-prix, parfois vieilles vignes en pergola et barrique.", "Deep colour, ripe soft tannin: fruity, good-value wines, sometimes from old pergola vines and barriques."],
  ["Il Vino Nobile di Montepulciano è Sangiovese, non Montepulciano!", "Le Vino Nobile di Montepulciano est du Sangiovese, pas du Montepulciano !", "Vino Nobile di Montepulciano is Sangiovese, not Montepulciano!"],
  ["Prugna, ciliegia nera, erbe", "Prune, cerise noire, herbes", "Plum, black cherry, herbs"],
  ["Colore intenso, tannino morbido, Adriatico", "Couleur intense, tanin souple, Adriatique", "Deep colour, soft tannin, Adriatic"],
  ["Montepulciano d'Abruzzo", "Rosso Conero", "Abruzzo", "Molise"])
g("Nero d'Avola", "b", "u4", ["Calabrese"], "", "M", "M", "M", "M/F",
  ["Il vitigno nero principale della Sicilia: ama il caldo e regge la siccità.", "Le principal cépage noir de Sicile : aime la chaleur et supporte la sécheresse.", "Sicily's leading black grape: loves heat and copes with drought."],
  ["Prugna, ciliegia nera, mora, spezie.", "Prune, cerise noire, mûre, épices.", "Plum, black cherry, blackberry, spice."],
  ["Da rossi fruttati e morbidi a vini strutturati in barrique; nel Cerasuolo di Vittoria con il Frappato.", "Des rouges fruités et souples aux vins structurés en barrique ; dans le Cerasuolo di Vittoria avec le Frappato.", "From soft, fruity reds to structured barrique-aged wines; with Frappato in Cerasuolo di Vittoria."],
  ["Cerasuolo di Vittoria è l'unica DOCG della Sicilia.", "Cerasuolo di Vittoria est la seule DOCG de Sicile.", "Cerasuolo di Vittoria is Sicily's only DOCG."],
  ["Prugna, mora, spezie", "Prune, mûre, épices", "Plum, blackberry, spice"],
  ["Il rosso del caldo siciliano", "Le rouge de la chaleur sicilienne", "The red of hot Sicily"],
  ["Sicily", "Cerasuolo di Vittoria"])
g("Garganega", "w", "u4", [], "", "L", "M/H", "", "M",
  ["Matura tardi; vigorosa: le rese basse sulle colline vulcaniche del Soave Classico danno i vini migliori.", "Mûrit tard ; vigoureuse : les faibles rendements sur les collines volcaniques du Soave Classico donnent les meilleurs vins.", "Late ripening and vigorous: low yields on the volcanic Soave Classico hills give the best wines."],
  ["Mela, pera, pesca, fiori; con l'età mandorla e miele.", "Pomme, poire, pêche, fleurs ; avec l'âge amande et miel.", "Apple, pear, peach, blossom; with age almond and honey."],
  ["Soave: secco, di solito acciaio o botti grandi usate; Recioto di Soave dolce da uve appassite.", "Soave : sec, généralement inox ou grands foudres usagés ; Recioto di Soave doux de raisins passerillés.", "Soave: dry, usually steel or old large casks; sweet Recioto di Soave from dried grapes."],
  ["DOC Soave = tutta la zona; Soave Classico = colline storiche.", "DOC Soave = toute la zone ; Soave Classico = collines historiques.", "Soave DOC = the whole zone; Soave Classico = the historic hills."],
  ["Pera, mandorla, fiori", "Poire, amande, fleurs", "Pear, almond, blossom"],
  ["Il bianco del Soave, mandorla con l'età", "Le blanc du Soave, amande avec l'âge", "Soave's white, almond with age"],
  ["Soave Classico", "Soave", "Veneto"])
g("Verdicchio", "w", "u4", [], "", "M", "H", "", "M",
  ["Il bianco simbolo delle Marche: colline dell'interno, Jesi più vicina al mare, Matelica più alta e continentale.", "Le blanc emblématique des Marches : collines de l'intérieur, Jesi plus près de la mer, Matelica plus haute et continentale.", "The Marche's emblematic white: inland hills, Jesi nearer the sea, Matelica higher and more continental."],
  ["Mela, limone, fiori bianchi, finale di mandorla amara.", "Pomme, citron, fleurs blanches, finale d'amande amère.", "Apple, lemon, white flowers, a bitter-almond finish."],
  ["Secco, fresco, a volte affinato sulle fecce; può invecchiare bene.", "Sec, frais, parfois élevé sur lies ; peut bien vieillir.", "Dry and fresh, sometimes lees-aged; can age well."],
  ["Castelli di Jesi e Matelica: le due DOC del Verdicchio.", "Castelli di Jesi et Matelica : les deux DOC du Verdicchio.", "Castelli di Jesi and Matelica: Verdicchio's two DOCs."],
  ["Limone, mandorla amara", "Citron, amande amère", "Lemon, bitter almond"],
  ["Bianco delle Marche, finale amarognolo", "Blanc des Marches, finale amère", "Marche white, bitter finish"],
  ["Verdicchio dei Castelli di Jesi", "Verdicchio di Matelica", "Marche"])
g("Fiano", "w", "u4", [], "", "M", "M/H", "", "M/F",
  ["Coltivato in quota sulle colline della Campania, intorno ad Avellino.", "Cultivé en altitude sur les collines de Campanie, autour d'Avellino.", "Grown at altitude in the Campanian hills around Avellino."],
  ["Pesca, melone, frutta tropicale, fiori; con l'età miele e note tostate/nocciola.", "Pêche, melon, fruits tropicaux, fleurs ; avec l'âge miel et notes grillées/noisette.", "Peach, melon, tropical fruit, blossom; with age honey and toasty/nutty notes."],
  ["Bianco pieno e strutturato, a volte con un po' di legno; può invecchiare.", "Blanc ample et structuré, parfois un peu boisé ; peut vieillir.", "A full, textured white, sometimes lightly oaked; can age."],
  ["Fiano di Avellino e Greco di Tufo: le due DOCG bianche della Campania.", "Fiano di Avellino et Greco di Tufo : les deux DOCG blanches de Campanie.", "Fiano di Avellino and Greco di Tufo: Campania's two white DOCGs."],
  ["Pesca, melone, nocciola", "Pêche, melon, noisette", "Peach, melon, hazelnut"],
  ["Bianco pieno della Campania", "Blanc ample de Campanie", "Full-bodied Campanian white"],
  ["Fiano di Avellino", "Campania"])
g("Glera", "w", "u4", [], "", "M", "M/H", "", "L",
  ["Vigoroso e produttivo; i migliori vigneti sono sulle colline ripide tra Conegliano e Valdobbiadene.", "Vigoureux et productif ; les meilleures vignes sont sur les collines escarpées entre Conegliano et Valdobbiadene.", "Vigorous and productive; the best sites are the steep hills between Conegliano and Valdobbiadene."],
  ["Mela, pera, melone, fiori; delicato, non lievitoso.", "Pomme, poire, melon, fleurs ; délicat, sans notes de levure.", "Apple, pear, melon, blossom; delicate, not yeasty."],
  ["Prosecco: metodo Charmat (seconda fermentazione in autoclave) per conservare il frutto primario; spumante o frizzante.", "Prosecco : méthode Charmat (seconde fermentation en cuve close) pour garder le fruit primaire ; spumante ou frizzante.", "Prosecco: tank method (second fermentation in a sealed tank) to keep primary fruit; spumante or frizzante."],
  ["DOCG: Conegliano-Valdobbiadene e Asolo; DOC per il resto della zona.", "DOCG : Conegliano-Valdobbiadene et Asolo ; DOC pour le reste de la zone.", "DOCGs: Conegliano-Valdobbiadene and Asolo; DOC for the wider area."],
  ["Pera, mela, fiori, bollicina", "Poire, pomme, fleurs, bulles", "Pear, apple, blossom, bubbles"],
  ["Spumante con metodo Charmat", "Effervescent en cuve close", "Tank-method sparkling"],
  ["Prosecco Conegliano-Valdobbiadene", "Asolo Prosecco"])

# ---------------- u5 Spain & Portugal ----------------
g("Tempranillo", "b", "u5", ["Tinto Fino", "Tinta del País", "Tinta de Toro", "Cencibel", "Tinta Roriz", "Aragonez", "Ull de Llebre"], "E", "E", "L/M", "M/H", "M/F",
  ["Germoglia e matura presto (da «temprano»); buccia spessa: serve calore per il colore ma notti fresche per l'acidità (altitudine).", "Débourre et mûrit tôt (de « temprano ») ; peau épaisse : il faut de la chaleur pour la couleur mais des nuits fraîches pour l'acidité (altitude).", "Buds and ripens early (from 'temprano'); thick skin: needs heat for colour but cool nights for acidity (altitude)."],
  ["Fragola, ciliegia, prugna; con il rovere americano vaniglia, cocco; con l'età cuoio, tabacco, funghi.", "Fraise, cerise, prune ; avec le chêne américain vanille, coco ; avec l'âge cuir, tabac, champignon.", "Strawberry, cherry, plum; with American oak vanilla, coconut; with age leather, tobacco, mushroom."],
  ["Spesso tagliato con Garnacha, Graciano, Mazuelo; Rioja tradizionale: lungo legno americano (Reserva, Gran Reserva); Ribera e Toro più potenti.", "Souvent assemblé avec Garnacha, Graciano, Mazuelo ; Rioja traditionnel : long élevage en chêne américain (Reserva, Gran Reserva) ; Ribera et Toro plus puissants.", "Often blended with Garnacha, Graciano, Mazuelo; traditional Rioja: long American-oak ageing (Reserva, Gran Reserva); Ribera and Toro more powerful."],
  ["In Portogallo è Tinta Roriz (Douro) o Aragonez (Alentejo).", "Au Portugal c'est Tinta Roriz (Douro) ou Aragonez (Alentejo).", "In Portugal it is Tinta Roriz (Douro) or Aragonez (Alentejo)."],
  ["Fragola, vaniglia, cocco, cuoio", "Fraise, vanille, coco, cuir", "Strawberry, vanilla, coconut, leather"],
  ["Precoce, il rosso della Rioja", "Précoce, le rouge de la Rioja", "Early ripening, Rioja's red"],
  ["Rioja", "Ribera del Duero", "Toro", "Valdepeñas", "La Mancha", "Douro"])
g("Albariño", "w", "u5", ["Alvarinho"], "", "E", "H", "", "L/M",
  ["Buccia spessa, resiste alla muffa nel clima piovoso e atlantico della Galizia; spesso a pergola alta per l'aria.", "Peau épaisse, résiste à la pourriture dans le climat pluvieux atlantique de Galice ; souvent en pergola haute pour l'aération.", "Thick skins resist rot in Galicia's rainy Atlantic climate; often trained on high pergolas for airflow."],
  ["Pesca, pompelmo, limone, fiori; a volte note saline.", "Pêche, pamplemousse, citron, fleurs ; parfois notes salines.", "Peach, grapefruit, lemon, blossom; sometimes saline notes."],
  ["Secco, aromatico, acciaio; a volte un po' di malolattica o fecce; in Portogallo Alvarinho nel Vinho Verde (Monção e Melgaço).", "Sec, aromatique, inox ; parfois un peu de malo ou de lies ; au Portugal Alvarinho dans le Vinho Verde (Monção et Melgaço).", "Dry, aromatic, steel-fermented; sometimes some malolactic or lees; in Portugal, Alvarinho in Vinho Verde (Monção e Melgaço)."],
  ["Rías Baixas: il bianco atlantico della Spagna.", "Rías Baixas : le blanc atlantique de l'Espagne.", "Rías Baixas: Spain's Atlantic white."],
  ["Pesca, pompelmo, sale", "Pêche, pamplemousse, sel", "Peach, grapefruit, saline"],
  ["Bianco atlantico, buccia spessa contro la muffa", "Blanc atlantique, peau épaisse contre la pourriture", "Atlantic white, thick skin against rot"],
  ["Rías Baixas", "Vinho Verde"])
g("Palomino", "w", "u5", ["Palomino Fino", "Listán"], "", "M", "L", "", "L/M",
  ["Rese alte e affidabili sui suoli bianchi di albariza intorno a Jerez, che trattengono l'acqua d'inverno.", "Rendements élevés et réguliers sur les sols blancs d'albariza autour de Jerez, qui retiennent l'eau l'hiver.", "High, reliable yields on Jerez's white albariza soils, which store winter rain."],
  ["Neutro da giovane: il carattere viene dal flor (pane, mandorla) o dall'ossidazione (noce, caramello).", "Neutre jeune : le caractère vient du voile (pain, amande) ou de l'oxydation (noix, caramel).", "Neutral when young: character comes from flor (bread, almond) or oxidation (walnut, toffee)."],
  ["Base di quasi tutti gli Sherry: mosto fermentato a secco, fortificato e affinato in solera (Fino, Manzanilla, Amontillado, Oloroso).", "Base de presque tous les Xérès : fermenté à sec, muté et élevé en solera (Fino, Manzanilla, Amontillado, Oloroso).", "The base of nearly all Sherry: fermented dry, fortified and aged in solera (Fino, Manzanilla, Amontillado, Oloroso)."],
  ["Neutro e poco acido: perfetto per lo Sherry, dove contano flor e solera.", "Neutre et peu acide : parfait pour le Xérès, où comptent voile et solera.", "Neutral and low in acid: ideal for Sherry, where flor and solera matter."],
  ["Mandorla, pane, flor", "Amande, pain, voile", "Almond, bread, flor"],
  ["Neutro, base dello Sherry", "Neutre, base du Xérès", "Neutral Sherry base"],
  ["Jerez"])
g("Pedro Ximénez", "w", "u5", ["PX"], "", "M", "L", "", "F",
  ["Buccia sottile, appassisce facilmente al sole: in Andalusia si stende su stuoie (soleo) per concentrare gli zuccheri.", "Peau fine, passerille facilement au soleil : en Andalousie on l'étale sur des nattes (soleo) pour concentrer les sucres.", "Thin-skinned, it dries easily in the sun: in Andalucía grapes are laid on mats (soleo) to concentrate sugar."],
  ["Uvetta, fico secco, dattero, caffè, cioccolato, liquirizia.", "Raisin sec, figue sèche, datte, café, chocolat, réglisse.", "Raisin, dried fig, date, coffee, chocolate, liquorice."],
  ["PX dolcissimo e quasi nero, fortificato e invecchiato in solera; a Montilla-Moriles anche vini secchi non fortificati.", "PX très doux et presque noir, muté et vieilli en solera ; à Montilla-Moriles aussi des vins secs non mutés.", "Very sweet, almost black PX, fortified and solera-aged; in Montilla-Moriles also dry unfortified wines."],
  ["Montilla-Moriles raggiunge l'alcol naturalmente, spesso senza fortificare.", "Montilla-Moriles atteint son alcool naturellement, souvent sans mutage.", "Montilla-Moriles reaches its alcohol naturally, often without fortification."],
  ["Uvetta, fico, caffè", "Raisin sec, figue, café", "Raisin, fig, coffee"],
  ["Uve appassite al sole, dolcissimo", "Raisins séchés au soleil, très doux", "Sun-dried grapes, intensely sweet"],
  ["Montilla-Moriles", "Jerez", "Málaga & Sierras de Málaga"])
g("Touriga Nacional", "b", "u5", [], "", "M", "M/H", "H", "F",
  ["Acini piccoli, rese basse: regge il caldo dei terrazzamenti di scisto del Douro.", "Petites baies, faibles rendements : supporte la chaleur des terrasses de schiste du Douro.", "Small berries and low yields: copes with the heat of the Douro's schist terraces."],
  ["Mora, ribes nero, violetta, erbe, a volte bergamotto.", "Mûre, cassis, violette, herbes, parfois bergamote.", "Blackberry, blackcurrant, violet, herbs, sometimes bergamot."],
  ["Colore profondo, tannino alto, molto aromatico: la spina dorsale del Porto e dei grandi rossi secchi del Douro e del Dão.", "Couleur profonde, tanin élevé, très aromatique : la colonne vertébrale du Porto et des grands rouges secs du Douro et du Dão.", "Deep colour, high tannin, very aromatic: the backbone of Port and of top dry reds in the Douro and Dão."],
  ["Nel Porto si taglia con Touriga Franca, Tinta Roriz, Tinta Barroca, Tinto Cão.", "Dans le Porto on l'assemble avec Touriga Franca, Tinta Roriz, Tinta Barroca, Tinto Cão.", "In Port it is blended with Touriga Franca, Tinta Roriz, Tinta Barroca, Tinto Cão."],
  ["Violetta, mora, bergamotto", "Violette, mûre, bergamote", "Violet, blackberry, bergamot"],
  ["La spina dorsale del Porto", "La colonne vertébrale du Porto", "The backbone of Port"],
  ["Douro", "Dão", "Cima Corgo", "Douro Superior"])
g("Mencía", "b", "u5", [], "", "E", "M/H", "M", "M",
  ["Coltivata nel nord-ovest della Spagna, su pendii di ardesia (Bierzo, Ribeira Sacra), spesso terrazzati.", "Cultivé dans le nord-ouest de l'Espagne, sur des pentes de schiste (Bierzo, Ribeira Sacra), souvent en terrasses.", "Grown in north-west Spain on slate slopes (Bierzo, Ribeira Sacra), often terraced."],
  ["Frutta rossa e nera, violetta, note erbacee e minerali.", "Fruits rouges et noirs, violette, notes herbacées et minérales.", "Red and black fruit, violet, herbaceous and mineral notes."],
  ["Rossi freschi e profumati, da giovani o affinati in legno; ricordano un Cabernet Franc.", "Rouges frais et parfumés, jeunes ou élevés en bois ; rappellent un Cabernet Franc.", "Fresh, perfumed reds, young or oak-aged; reminiscent of Cabernet Franc."],
  ["Bierzo: vecchie viti di Mencía sui pendii.", "Bierzo : vieilles vignes de Mencía sur les pentes.", "Bierzo: old Mencía vines on the slopes."],
  ["Violetta, frutti rossi, ardesia", "Violette, fruits rouges, schiste", "Violet, red fruit, slate"],
  ["Rosso fresco del nord-ovest spagnolo", "Rouge frais du nord-ouest espagnol", "Fresh red of north-west Spain"],
  ["Bierzo", "Ribeira Sacra", "Valdeorras"])

# ---------------- u6 Austria, Hungary, Greece ----------------
g("Grüner Veltliner", "w", "u6", [], "", "M", "M/H", "", "L/F",
  ["Il vitigno più piantato d'Austria; nella Wachau sui terrazzamenti sopra il Danubio, nel Weinviertel su loess.", "Le cépage le plus planté d'Autriche ; en Wachau sur les terrasses au-dessus du Danube, dans le Weinviertel sur lœss.", "Austria's most planted grape; in the Wachau on terraces above the Danube, in the Weinviertel on loess."],
  ["Mela verde, pompelmo, pesca, note erbacee e di pepe bianco.", "Pomme verte, pamplemousse, pêche, notes herbacées et de poivre blanc.", "Green apple, grapefruit, peach, herbaceous and white-pepper notes."],
  ["Dal leggero e fresco (Weinviertel DAC) al pieno e longevo (Smaragd della Wachau); di solito senza legno nuovo.", "Du léger et frais (Weinviertel DAC) à l'ample et de garde (Smaragd de la Wachau) ; généralement sans bois neuf.", "From light and fresh (Weinviertel DAC) to full and age-worthy (Wachau Smaragd); usually no new oak."],
  ["Wachau: Steinfeder, Federspiel, Smaragd = da leggero a pieno.", "Wachau : Steinfeder, Federspiel, Smaragd = du léger à l'ample.", "Wachau: Steinfeder, Federspiel, Smaragd = light to full."],
  ["Pepe bianco, mela verde, pompelmo", "Poivre blanc, pomme verte, pamplemousse", "White pepper, green apple, grapefruit"],
  ["Il bianco «pepato» dell'Austria", "Le blanc « poivré » de l'Autriche", "Austria's 'peppery' white"],
  ["Wachau", "Kremstal", "Kamptal", "Weinviertel", "Wagram", "Traisental"])
g("Blaufränkisch", "b", "u6", ["Lemberger", "Kékfrankos"], "E", "L", "H", "M/H", "M",
  ["Germoglia presto e matura tardi: serve il calore del Burgenland, attorno al lago di Neusiedl e nel Mittelburgenland.", "Débourre tôt et mûrit tard : il lui faut la chaleur du Burgenland, autour du lac de Neusiedl et dans le Mittelburgenland.", "Buds early and ripens late: needs Burgenland's warmth, around Lake Neusiedl and in Mittelburgenland."],
  ["Ciliegia nera, mora, pepe, spezie.", "Cerise noire, mûre, poivre, épices.", "Black cherry, blackberry, pepper, spice."],
  ["Colore profondo, acidità alta e tannino evidente; dal fruttato al serio in barrique; spesso in taglio.", "Couleur profonde, acidité haute et tanin marqué ; du fruité au sérieux en barrique ; souvent assemblé.", "Deep colour, high acidity and noticeable tannin; from fruity to serious barrique-aged; often blended."],
  ["Mittelburgenland DAC e Leithaberg DAC (rosso) = Blaufränkisch.", "Mittelburgenland DAC et Leithaberg DAC (rouge) = Blaufränkisch.", "Mittelburgenland DAC and Leithaberg DAC (red) = Blaufränkisch."],
  ["Ciliegia nera, pepe", "Cerise noire, poivre", "Black cherry, pepper"],
  ["Rosso speziato del Burgenland", "Rouge épicé du Burgenland", "Burgenland's spicy red"],
  ["Mittelburgenland", "Leithaberg", "Burgenland", "Württemberg"])
g("Zweigelt", "b", "u6", [], "", "E", "M/H", "L/M", "L/M",
  ["Incrocio austriaco (Blaufränkisch × St. Laurent): matura presto, produttivo, il nero più piantato d'Austria.", "Croisement autrichien (Blaufränkisch × St. Laurent) : mûrit tôt, productif, le noir le plus planté d'Autriche.", "An Austrian crossing (Blaufränkisch × St. Laurent): early ripening, productive, Austria's most planted black grape."],
  ["Ciliegia rossa, lampone, a volte pepe.", "Cerise rouge, framboise, parfois poivre.", "Red cherry, raspberry, sometimes pepper."],
  ["Di solito rossi leggeri e fruttati da bere giovani; anche rosati, tagli e vini dolci.", "Généralement des rouges légers et fruités à boire jeunes ; aussi rosés, assemblages et vins doux.", "Usually light, fruity reds for drinking young; also rosés, blends and sweet wines."],
  ["Carnuntum e Neusiedlersee: le sue zone tipiche.", "Carnuntum et Neusiedlersee : ses zones typiques.", "Carnuntum and Neusiedlersee: its classic areas."],
  ["Ciliegia rossa, lampone", "Cerise rouge, framboise", "Red cherry, raspberry"],
  ["Incrocio austriaco, rosso leggero", "Croisement autrichien, rouge léger", "Austrian crossing, light red"],
  ["Carnuntum", "Neusiedlersee"])
g("Furmint", "w", "u6", [], "E", "L", "H", "", "M/F",
  ["Germoglia presto e matura tardi; buccia sottile, molto sensibile alla muffa nobile grazie alle nebbie dei fiumi Bodrog e Tisza.", "Débourre tôt et mûrit tard ; peau fine, très sensible à la pourriture noble grâce aux brumes du Bodrog et de la Tisza.", "Buds early, ripens late; thin skin, very prone to noble rot thanks to mists from the Bodrog and Tisza rivers."],
  ["Mela, limone, pietra affumicata da secco; con la botrite albicocca, marmellata d'arancia, miele, zenzero.", "Pomme, citron, pierre fumée en sec ; avec le botrytis abricot, marmelade d'orange, miel, gingembre.", "Apple, lemon, smoky stone when dry; with botrytis apricot, orange marmalade, honey, ginger."],
  ["Acidità altissima: Tokaji Aszú (acini aszú in un vino base), Szamorodni, Eszencia; sempre più anche secco.", "Acidité très élevée : Tokaji Aszú (baies aszú dans un vin de base), Szamorodni, Eszencia ; de plus en plus aussi en sec.", "Searing acidity: Tokaji Aszú (aszú berries steeped in base wine), Szamorodni, Eszencia; increasingly dry too."],
  ["Aszú: minimo 120 g/l di zucchero residuo.", "Aszú : minimum 120 g/l de sucre résiduel.", "Aszú: at least 120 g/l residual sugar."],
  ["Marmellata d'arancia, albicocca, affumicato", "Marmelade d'orange, abricot, fumé", "Orange marmalade, apricot, smoky"],
  ["Acidità altissima, la base del Tokaji", "Acidité très élevée, la base du Tokaji", "Searing acid, the base of Tokaji"],
 ["Tokaj"])
g("Assyrtiko", "w", "u6", [], "", "M", "H", "", "M",
  ["Resiste a caldo, vento e siccità: a Santorini viti vecchissime a canestro (kouloura) su suoli vulcanici, senza fillossera.", "Résiste à la chaleur, au vent et à la sécheresse : à Santorin très vieilles vignes en panier (kouloura) sur sols volcaniques, sans phylloxéra.", "Withstands heat, wind and drought: on Santorini very old basket-trained vines (kouloura) on volcanic soils, phylloxera-free."],
  ["Limone, pompelmo, note minerali/fumé; con l'età miele e toast.", "Citron, pamplemousse, notes minérales/fumées ; avec l'âge miel et pain grillé.", "Lemon, grapefruit, mineral/smoky notes; with age honey and toast."],
  ["Mantiene un'acidità altissima anche al caldo: secco e longevo; Vinsanto dolce da uve appassite.", "Garde une acidité très élevée même au chaud : sec et de garde ; Vinsanto doux de raisins passerillés.", "Keeps searing acidity even in heat: dry and age-worthy; sweet Vinsanto from sun-dried grapes."],
  ["Santorini PDO = Assyrtiko dominante.", "Santorin AOP = Assyrtiko dominant.", "Santorini PDO = Assyrtiko-led."],
  ["Limone, vulcanico, sale", "Citron, volcanique, sel", "Lemon, volcanic, saline"],
  ["Acidità alta anche al caldo, Santorini", "Acidité haute même au chaud, Santorin", "High acid even in heat, Santorini"],
  ["Santorini", "Crete"])
g("Xinomavro", "b", "u6", [], "", "L", "H", "H", "M",
  ["Matura tardi; coltivato nel nord della Grecia (Macedonia), in climi più freschi.", "Mûrit tard ; cultivé dans le nord de la Grèce (Macédoine), en climat plus frais.", "Late ripening; grown in cooler northern Greece (Macedonia)."],
  ["Lampone, ciliegia, pomodoro, oliva, spezie; con l'età note terrose.", "Framboise, cerise, tomate, olive, épices ; avec l'âge notes terreuses.", "Raspberry, cherry, tomato, olive, spice; with age earthy notes."],
  ["Colore chiaro ma acidità e tannino alti: spesso paragonato al Nebbiolo; lungo affinamento.", "Couleur claire mais acidité et tanin élevés : souvent comparé au Nebbiolo ; longue garde.", "Pale colour yet high acidity and tannin: often compared to Nebbiolo; long ageing."],
  ["Naoussa PDO = 100% Xinomavro.", "Naoussa AOP = 100 % Xinomavro.", "Naoussa PDO = 100% Xinomavro."],
  ["Pomodoro, oliva, lampone", "Tomate, olive, framboise", "Tomato, olive, raspberry"],
  ["Il «Nebbiolo greco» di Naoussa", "Le « Nebbiolo grec » de Naoussa", "Naoussa's 'Greek Nebbiolo'"],
  ["Naoussa", "Macedonia"])
g("Agiorgitiko", "b", "u6", ["Aghiorghitiko"], "", "M", "M", "M", "M/F",
  ["Coltivato nel Peloponneso: in quota a Nemea per conservare freschezza.", "Cultivé dans le Péloponnèse : en altitude à Némée pour garder la fraîcheur.", "Grown in the Peloponnese: at altitude in Nemea to keep freshness."],
  ["Frutta rossa e nera morbida, spezie dolci.", "Fruits rouges et noirs souples, épices douces.", "Soft red and black fruit, sweet spice."],
  ["Molto versatile: dal rosato al rosso fruttato al rosso serio in barrique.", "Très polyvalent : du rosé au rouge fruité jusqu'au rouge sérieux en barrique.", "Very versatile: from rosé to fruity red to serious barrique-aged red."],
  ["Nemea PDO = 100% Agiorgitiko.", "Némée AOP = 100 % Agiorgitiko.", "Nemea PDO = 100% Agiorgitiko."],
  ["Frutti rossi morbidi, spezie dolci", "Fruits rouges souples, épices douces", "Soft red fruit, sweet spice"],
  ["Rosso morbido e versatile di Nemea", "Rouge souple et polyvalent de Némée", "Nemea's soft, versatile red"],
  ["Nemea", "Peloponnese"])

# ---------------- u7 New World ----------------
g("Malbec", "b", "u7", ["Côt", "Auxerrois"], "", "M", "M/H", "M/H", "F",
  ["In Argentina trova sole e altitudine (Mendoza, fino a 1.500 m): escursione termica, colore e freschezza; in Francia a Cahors.", "En Argentine il trouve soleil et altitude (Mendoza, jusqu'à 1 500 m) : amplitude thermique, couleur et fraîcheur ; en France à Cahors.", "In Argentina it finds sun and altitude (Mendoza, up to 1,500 m): diurnal range, colour and freshness; in France at Cahors."],
  ["Mora, prugna, violetta; con il legno cioccolato, vaniglia, spezie.", "Mûre, prune, violette ; avec le bois chocolat, vanille, épices.", "Blackberry, plum, violet; with oak chocolate, vanilla, spice."],
  ["Colore profondo, tannino maturo e vellutato; dal fruttato giovane al serio in barrique; Cahors più austero e tannico.", "Couleur profonde, tanin mûr et velouté ; du fruité jeune au sérieux en barrique ; Cahors plus austère et tannique.", "Deep colour, ripe velvety tannin; from young and fruity to serious barrique-aged; Cahors more austere and tannic."],
  ["Valle de Uco: le vigne più alte di Mendoza, Malbec più freschi e profumati.", "Vallée de Uco : les vignes les plus hautes de Mendoza, Malbec plus frais et parfumés.", "Uco Valley: Mendoza's highest vineyards, fresher and more perfumed Malbec."],
  ["Prugna, mora, violetta", "Prune, mûre, violette", "Plum, blackberry, violet"],
  ["Ama altitudine e sole delle Ande", "Aime l'altitude et le soleil des Andes", "Loves Andean altitude and sun"],
  ["Mendoza", "Luján de Cuyo", "Uco Valley", "Cahors", "Salta"])
g("Carmenère", "b", "u7", [], "", "L", "M", "M", "M/F",
  ["Matura molto tardi: in Cile serve calore (Colchagua, Cachapoal); a lungo confuso con il Merlot.", "Mûrit très tard : au Chili il faut de la chaleur (Colchagua, Cachapoal) ; longtemps confondu avec le Merlot.", "Ripens very late: in Chile it needs warmth (Colchagua, Cachapoal); long mistaken for Merlot."],
  ["Mora, prugna, peperone verde/erbaceo se poco maturo, spezie, pepe.", "Mûre, prune, poivron vert/herbacé s'il manque de maturité, épices, poivre.", "Blackberry, plum, green pepper/herbaceous if under-ripe, spice, pepper."],
  ["Rossi pieni, morbidi, spesso in barrique; anche in taglio con il Cabernet.", "Rouges amples, souples, souvent en barrique ; aussi en assemblage avec le Cabernet.", "Full, soft reds, often barrique-aged; also blended with Cabernet."],
  ["Il vitigno simbolo del Cile, nato a Bordeaux.", "Le cépage emblématique du Chili, né à Bordeaux.", "Chile's signature grape, originally from Bordeaux."],
  ["Prugna, peperone verde, pepe", "Prune, poivron vert, poivre", "Plum, green pepper, black pepper"],
  ["Tardivo, ex «Merlot» del Cile", "Tardif, ancien « Merlot » chilien", "Late ripener, Chile's former 'Merlot'"],
  ["Colchagua Valley", "Cachapoal Valley", "Rapel Valley", "Central Valley"])
g("Pinotage", "b", "u7", [], "E", "E", "M", "M/H", "M/F",
  ["Incrocio sudafricano Pinot Noir × Cinsault (1925): germoglia e matura presto, spesso ad alberello.", "Croisement sud-africain Pinot Noir × Cinsault (1925) : débourre et mûrit tôt, souvent en gobelet.", "A South African crossing, Pinot Noir × Cinsault (1925): buds and ripens early, often bush-trained."],
  ["Mora, prugna, banana, note affumicate e terrose; con il legno caffè e cioccolato.", "Mûre, prune, banane, notes fumées et terreuses ; avec le bois café et chocolat.", "Blackberry, plum, banana, smoky and earthy notes; with oak coffee and chocolate."],
  ["Stili molto vari: fruttato e semplice, «coffee Pinotage» tostato, o serio da vecchie viti in barrique; anche in taglio (Cape Blend).", "Styles très variés : fruité et simple, « coffee Pinotage » torréfié, ou sérieux de vieilles vignes en barrique ; aussi en assemblage (Cape Blend).", "Very varied styles: fruity and simple, toasty 'coffee Pinotage', or serious old-vine barrique wines; also in blends (Cape Blend)."],
  ["Esiste solo in Sudafrica in quantità significative.", "N'existe en quantités notables qu'en Afrique du Sud.", "Only found in significant quantities in South Africa."],
  ["Mora, affumicato, caffè", "Mûre, fumé, café", "Blackberry, smoky, coffee"],
  ["Incrocio Pinot Noir × Cinsault", "Croisement Pinot Noir × Cinsault", "Pinot Noir × Cinsault crossing"],
  ["Stellenbosch", "Paarl", "Swartland"])
g("Zinfandel", "b", "u7", ["Primitivo"], "", "M", "M", "M", "F",
  ["Maturazione irregolare nello stesso grappolo (acini verdi e appassiti): serve calore; vecchie viti ad alberello in California.", "Maturité irrégulière dans la grappe (baies vertes et passerillées) : il faut de la chaleur ; vieilles vignes en gobelet en Californie.", "Uneven ripening within the bunch (green and raisined berries): needs heat; old bush vines in California."],
  ["Mora, lampone, frutta cotta, uvetta, spezie dolci.", "Mûre, framboise, fruits cuits, raisin sec, épices douces.", "Blackberry, raspberry, baked fruit, raisin, sweet spice."],
  ["Rossi pieni, alcol alto (anche 15–16%), spesso rovere americano; anche il rosato semidolce «White Zinfandel».", "Rouges amples, alcool élevé (jusqu'à 15–16 %), souvent chêne américain ; aussi le rosé demi-sec « White Zinfandel ».", "Full reds, high alcohol (up to 15–16%), often American oak; also the off-dry 'White Zinfandel' rosé."],
  ["Stessa varietà del Primitivo pugliese.", "Même variété que le Primitivo des Pouilles.", "The same variety as Puglia's Primitivo."],
  ["Frutta cotta, uvetta, spezie", "Fruits cuits, raisin sec, épices", "Jammy fruit, raisin, spice"],
  ["Maturazione irregolare, alcol altissimo", "Maturité irrégulière, alcool très élevé", "Uneven ripening, very high alcohol"],
  ["Dry Creek Valley", "Lodi", "Paso Robles", "Mendocino", "Primitivo di Manduria", "Puglia"])
g("Torrontés", "w", "u7", ["Torrontés Riojano"], "", "M", "M", "", "M",
  ["Ama altitudine e sole intenso: le vigne più alte del mondo nella valle di Cafayate (Salta), oltre 1.700 m.", "Aime l'altitude et le soleil intense : les vignes parmi les plus hautes du monde à Cafayate (Salta), au-delà de 1 700 m.", "Loves altitude and intense sun: some of the world's highest vineyards in Cafayate (Salta), above 1,700 m."],
  ["Molto aromatico: rosa, gelsomino, pesca, agrumi; ricorda il Moscato.", "Très aromatique : rose, jasmin, pêche, agrumes ; rappelle le Muscat.", "Highly aromatic: rose, jasmine, peach, citrus; reminiscent of Muscat."],
  ["Secco, aromatico, acciaio, da bere giovane; a volte leggermente amaro in finale.", "Sec, aromatique, inox, à boire jeune ; parfois une légère amertume en finale.", "Dry, aromatic, steel-fermented, drunk young; sometimes a slightly bitter finish."],
  ["Il bianco simbolo dell'Argentina, dal nord (Salta, La Rioja).", "Le blanc emblématique de l'Argentine, du nord (Salta, La Rioja).", "Argentina's signature white, from the north (Salta, La Rioja)."],
  ["Rosa, gelsomino, pesca", "Rose, jasmin, pêche", "Rose, jasmine, peach"],
  ["Bianco aromatico d'alta quota", "Blanc aromatique d'altitude", "Aromatic high-altitude white"],
  ["Cafayate", "Salta", "La Rioja", "Famatina"])

# ---------------- v53: all the other grapes of the book + comparison-table fields ----------------
import os as _os, json as _json
_H = _os.path.dirname(_os.path.abspath(__file__))
_KEYS = set(_json.load(open('/tmp/mapkeys.json'))) if _os.path.exists('/tmp/mapkeys.json') else None
def _tri(s):
    p = [x.strip() for x in s.split(' ~ ')]; assert len(p) == 3, s; return p
def _cap(s): return s[:1].upper() + s[1:]
for _f in ('grapes_more1.txt', 'grapes_more2.txt'):
    for _ln in open(_os.path.join(_H, 'rip', _f), encoding='utf-8'):
        _ln = _ln.strip()
        if not _ln or _ln.startswith('#'): continue
        _p = _ln.split('|'); assert len(_p) == 15, (_p[0], len(_p))
        k, c, u, syn, bud, rip, a, t, b, y, ag, h, wm, tr, reg = _p
        y, ag, h, wm, tr = map(_tri, (y, ag, h, wm, tr))
        sig = [_cap(', '.join(x.split(', ')[:3])) for x in y]
        lab = (['Da giovane: ', 'Jeune : ', 'Young: '], ['Con l\'età: ', 'Avec l\'âge : ', 'With age: '])
        ar = [lab[0][i] + y[i] + '. ' + lab[1][i] + ag[i] + '.' for i in range(3)]
        regs = [r for r in reg.split(',') if r and (_KEYS is None or r in _KEYS)]
        g(k, c, u, [s for s in syn.split(',') if s], bud, rip, a, t if c == 'b' else '', b,
          [_cap(x) + '.' for x in h], ar, [_cap(x) + '.' for x in wm], ['', '', ''], sig, tr, regs)
        G[-1]['x'] = dict(y=y, a=ag, h=h)
import rip_grapes as _RG
for _g in G:
    if _g['k'] == 'Carignan' and 'Mazuelo' not in _g['syn']: _g['syn'].append('Mazuelo')
    if _g['k'] == 'Trebbiano': pass
    _x = _RG.X.get(_g['k'])
    if _x:
        if not _g['bud'] and _x.get('bud'): _g['bud'] = _x['bud']
        _g['x'] = dict(y=list(_x['y']), a=list(_x['a']), h=list(_x['h']))
