# -*- coding: utf-8 -*-
"""The 11 site languages added after the first 19 (Nordic, Finnish, Romanian, Hungarian, Central European):
sv da no fi ro hu is cs sk hr sl. One place for their codes and the short interface strings that every builder
needs (language names, buttons, labels); the builders merge these into their own tables with `merge()`.

Norwegian: the folder is /no/ (the country/macrolanguage code people recognise in a URL) and the content is Bokmål,
so <html lang="nb"> and hreflang="nb" (the precise code); every page that lists the Norwegian version also lists it
under hreflang="no", so a browser or a search engine that only knows the macrolanguage code (Accept-Language: no)
still matches it. Both codes are valid ISO 639-1 codes for hreflang; both point to the same URL, which is allowed.

A language is published page by page: a page exists only when its translation is complete (see TRANSLATE.md); the
hreflang clusters, switchers and sitemaps are generated from the pages that exist, so a language that has only its
home lists only its home."""

LANGS = ['sv', 'da', 'no', 'fi', 'ro', 'hu', 'is', 'cs', 'sk', 'hr', 'sl']
HREF = {'no': 'nb'}                 # <html lang> / hreflang when it differs from the folder
ALSO = {'no': ['no']}               # extra hreflang codes for the same URL
SAME = {'no': 'nb', 'nb': 'no'}     # equivalent codes, for the checks (folder no ↔ lang nb)

LNAME = {'sv': 'Svenska', 'da': 'Dansk', 'no': 'Norsk', 'fi': 'Suomi', 'ro': 'Română', 'hu': 'Magyar', 'is': 'Íslenska',
         'cs': 'Čeština', 'sk': 'Slovenčina', 'hr': 'Hrvatski', 'sl': 'Slovenščina'}
OGLOC = {'sv': 'sv_SE', 'da': 'da_DK', 'no': 'nb_NO', 'fi': 'fi_FI', 'ro': 'ro_RO', 'hu': 'hu_HU', 'is': 'is_IS',
         'cs': 'cs_CZ', 'sk': 'sk_SK', 'hr': 'hr_HR', 'sl': 'sl_SI'}
START = {'sv': 'Börja gratis', 'da': 'Kom i gang gratis', 'no': 'Kom i gang gratis', 'fi': 'Aloita ilmaiseksi', 'ro': 'Începe gratuit',
         'hu': 'Kezdd el ingyen', 'is': 'Byrjaðu frítt', 'cs': 'Začni zdarma', 'sk': 'Začni zadarmo', 'hr': 'Započni besplatno', 'sl': 'Začni brezplačno'}
UPDATED = {'sv': 'Uppdaterad', 'da': 'Opdateret', 'no': 'Oppdatert', 'fi': 'Päivitetty', 'ro': 'Actualizat', 'hu': 'Frissítve', 'is': 'Uppfært',
           'cs': 'Aktualizováno', 'sk': 'Aktualizované', 'hr': 'Ažurirano', 'sl': 'Posodobljeno'}
LANGNAV = {'sv': 'Språk', 'da': 'Sprog', 'no': 'Språk', 'fi': 'Kieli', 'ro': 'Limbă', 'hu': 'Nyelv', 'is': 'Tungumál', 'cs': 'Jazyk', 'sk': 'Jazyk',
           'hr': 'Jezik', 'sl': 'Jezik'}

# core and spirits pages (tools/seo_core/build.py, tools/seo_sp/build.py):
# home, faq, more spirits guides, start Spirits 1, open the app, start free, updated, in short, show the answer, answer, why
UI = {
 'sv': ('Start', 'Vanliga frågor', 'Fler guider om sprit', 'Börja med Spirits nivå 1 gratis', 'Öppna appen', 'Börja gratis', 'Uppdaterad', 'Kort sagt', 'Visa svaret', 'Svar:', 'Varför:'),
 'da': ('Forside', 'Ofte stillede spørgsmål', 'Flere guides om spiritus', 'Start Spirits niveau 1 gratis', 'Åbn appen', 'Kom i gang gratis', 'Opdateret', 'Kort fortalt', 'Vis svaret', 'Svar:', 'Hvorfor:'),
 'no': ('Forside', 'Ofte stilte spørsmål', 'Flere guider om brennevin', 'Start Spirits nivå 1 gratis', 'Åpne appen', 'Kom i gang gratis', 'Oppdatert', 'Kort fortalt', 'Vis svaret', 'Svar:', 'Hvorfor:'),
 'fi': ('Etusivu', 'Usein kysytyt kysymykset', 'Lisää oppaita väkevistä', 'Aloita Spirits-taso 1 ilmaiseksi', 'Avaa sovellus', 'Aloita ilmaiseksi', 'Päivitetty', 'Lyhyesti', 'Näytä vastaus', 'Vastaus:', 'Miksi:'),
 'ro': ('Acasă', 'Întrebări frecvente', 'Mai multe ghiduri despre distilate', 'Începe gratuit Spirits Nivelul 1', 'Deschide aplicația', 'Începe gratuit', 'Actualizat', 'Pe scurt', 'Arată răspunsul', 'Răspuns:', 'De ce:'),
 'hu': ('Főoldal', 'Gyakori kérdések', 'További útmutatók a párlatokról', 'Kezdd el ingyen a Spirits 1. szintet', 'Az alkalmazás megnyitása', 'Kezdd el ingyen', 'Frissítve', 'Röviden', 'Mutasd a választ', 'Válasz:', 'Miért:'),
 'is': ('Forsíða', 'Algengar spurningar', 'Fleiri leiðarvísar um sterkt áfengi', 'Byrjaðu frítt á Spirits stigi 1', 'Opna appið', 'Byrjaðu frítt', 'Uppfært', 'Í stuttu máli', 'Sýna svarið', 'Svar:', 'Af hverju:'),
 'cs': ('Domů', 'Časté dotazy', 'Další průvodci destiláty', 'Začni Spirits úroveň 1 zdarma', 'Otevřít aplikaci', 'Začni zdarma', 'Aktualizováno', 'Ve zkratce', 'Zobrazit odpověď', 'Odpověď:', 'Proč:'),
 'sk': ('Domov', 'Časté otázky', 'Ďalší sprievodcovia destilátmi', 'Začni Spirits úroveň 1 zadarmo', 'Otvoriť aplikáciu', 'Začni zadarmo', 'Aktualizované', 'V skratke', 'Zobraziť odpoveď', 'Odpoveď:', 'Prečo:'),
 'hr': ('Početna', 'Česta pitanja', 'Još vodiča o žestokim pićima', 'Započni Spirits razinu 1 besplatno', 'Otvori aplikaciju', 'Započni besplatno', 'Ažurirano', 'Ukratko', 'Prikaži odgovor', 'Odgovor:', 'Zašto:'),
 'sl': ('Domov', 'Pogosta vprašanja', 'Več vodnikov o žganih pijačah', 'Začni Spirits stopnjo 1 brezplačno', 'Odpri aplikacijo', 'Začni brezplačno', 'Posodobljeno', 'Na kratko', 'Pokaži odgovor', 'Odgovor:', 'Zakaj:'),
}
MORE = {'sv': 'Fler verktyg för din WSET-förberedelse', 'da': 'Flere værktøjer til din WSET-forberedelse', 'no': 'Flere verktøy for WSET-forberedelsene',
        'fi': 'Lisää työkaluja WSET-kokeeseen valmistautumiseen', 'ro': 'Mai multe instrumente pentru pregătirea WSET', 'hu': 'További eszközök a WSET-felkészüléshez',
        'is': 'Fleiri verkfæri til að undirbúa WSET-prófið', 'cs': 'Další nástroje k přípravě na WSET', 'sk': 'Ďalšie nástroje na prípravu na WSET',
        'hr': 'Još alata za pripremu za WSET', 'sl': 'Več orodij za pripravo na WSET'}

# guide directory (tools/seo_tech/internal_links.py): heading, then the categories in CATS order; and the schools link
GUIDEDIR = {
 'sv': ['Alla WSET-guider', 'WSET nivå 1', 'WSET nivå 2', 'WSET nivå 3', 'WSET Diploma', 'Övningsfrågor', 'Provexamen', 'Studieguider', 'Så klarar du WSET-proven', 'WSET Spirits', 'WSET-skolor och kursanordnare', 'Fler guider'],
 'da': ['Alle WSET-guides', 'WSET niveau 1', 'WSET niveau 2', 'WSET niveau 3', 'WSET Diploma', 'Øvelsesspørgsmål', 'Prøveeksaminer', 'Studieguides', 'Sådan består du WSET-eksamenerne', 'WSET Spirits', 'WSET-skoler og udbydere', 'Flere guides'],
 'no': ['Alle WSET-guider', 'WSET nivå 1', 'WSET nivå 2', 'WSET nivå 3', 'WSET Diploma', 'Øvingsspørsmål', 'Prøveeksamener', 'Studieguider', 'Slik består du WSET-eksamenene', 'WSET Spirits', 'WSET-skoler og kurstilbydere', 'Flere guider'],
 'fi': ['Kaikki WSET-oppaat', 'WSET-taso 1', 'WSET-taso 2', 'WSET-taso 3', 'WSET Diploma', 'Harjoituskysymykset', 'Harjoituskokeet', 'Opiskeluoppaat', 'Näin läpäiset WSET-kokeet', 'WSET Spirits', 'WSET-koulut ja kouluttajat', 'Lisää oppaita'],
 'ro': ['Toate ghidurile WSET', 'WSET Nivelul 1', 'WSET Nivelul 2', 'WSET Nivelul 3', 'WSET Diploma', 'Întrebări de exersare', 'Simulări de examen', 'Ghiduri de studiu', 'Cum treci examenele WSET', 'WSET Spirits', 'Școli și furnizori WSET', 'Mai multe ghiduri'],
 'hu': ['Az összes WSET-útmutató', 'WSET 1. szint', 'WSET 2. szint', 'WSET 3. szint', 'WSET Diploma', 'Gyakorlókérdések', 'Próbavizsgák', 'Tanulási útmutatók', 'Így teheted le a WSET-vizsgákat', 'WSET Spirits', 'WSET-iskolák és képzőhelyek', 'További útmutatók'],
 'is': ['Allir WSET-leiðarvísar', 'WSET stig 1', 'WSET stig 2', 'WSET stig 3', 'WSET Diploma', 'Æfingaspurningar', 'Æfingapróf', 'Námsleiðarvísar', 'Svona nærðu WSET-prófunum', 'WSET Spirits', 'WSET-skólar og námskeiðshaldarar', 'Fleiri leiðarvísar'],
 'cs': ['Všichni průvodci WSET', 'WSET úroveň 1', 'WSET úroveň 2', 'WSET úroveň 3', 'WSET Diploma', 'Cvičné otázky', 'Cvičné testy', 'Studijní průvodci', 'Jak složit zkoušky WSET', 'WSET Spirits', 'Školy a poskytovatelé WSET', 'Další průvodci'],
 'sk': ['Všetci sprievodcovia WSET', 'WSET úroveň 1', 'WSET úroveň 2', 'WSET úroveň 3', 'WSET Diploma', 'Cvičné otázky', 'Cvičné testy', 'Študijní sprievodcovia', 'Ako zložiť skúšky WSET', 'WSET Spirits', 'Školy a poskytovatelia WSET', 'Ďalší sprievodcovia'],
 'hr': ['Svi WSET vodiči', 'WSET razina 1', 'WSET razina 2', 'WSET razina 3', 'WSET Diploma', 'Pitanja za vježbu', 'Probni ispiti', 'Vodiči za učenje', 'Kako položiti WSET ispite', 'WSET Spirits', 'WSET škole i pružatelji', 'Još vodiča'],
 'sl': ['Vsi vodniki WSET', 'WSET stopnja 1', 'WSET stopnja 2', 'WSET stopnja 3', 'WSET Diploma', 'Vprašanja za vajo', 'Poskusni izpiti', 'Učni vodniki', 'Kako opraviti izpite WSET', 'WSET Spirits', 'Šole in ponudniki WSET', 'Več vodnikov'],
}
SCHOOL_LABEL = {'sv': 'För vinskolor', 'da': 'For vinskoler', 'no': 'For vinskoler', 'fi': 'Viinikouluille', 'ro': 'Pentru școli', 'hu': 'Iskoláknak',
                'is': 'Fyrir skóla', 'cs': 'Pro školy', 'sk': 'Pre školy', 'hr': 'Za škole', 'sl': 'Za šole'}

# level series block (tools/lvseries.py)
LV_HEAD = {'sv': 'De kompletta guiderna, nivå för nivå', 'da': 'De komplette guides, niveau for niveau', 'no': 'De komplette guidene, nivå for nivå',
           'fi': 'Kattavat oppaat taso tasolta', 'ro': 'Ghidurile complete, nivel cu nivel', 'hu': 'A teljes útmutatók szintről szintre',
           'is': 'Ítarlegu leiðarvísarnir, stig fyrir stig', 'cs': 'Kompletní průvodci úroveň po úrovni', 'sk': 'Kompletní sprievodcovia úroveň po úrovni',
           'hr': 'Cjeloviti vodiči, razinu po razinu', 'sl': 'Celoviti vodniki, stopnjo za stopnjo'}
LV_N = {'sv': 'Nivå {n}', 'da': 'Niveau {n}', 'no': 'Nivå {n}', 'fi': 'Taso {n}', 'ro': 'Nivelul {n}', 'hu': '{n}. szint', 'is': 'Stig {n}',
        'cs': 'Úroveň {n}', 'sk': 'Úroveň {n}', 'hr': 'Razina {n}', 'sl': 'Stopnja {n}'}

# footer links (tools/geo/sitewide.py) and photo captions (tools/seo_tech/place_photos.py)
ABOUT = {'sv': 'Om oss', 'da': 'Om os', 'no': 'Om oss', 'fi': 'Tietoa meistä', 'ro': 'Despre noi', 'hu': 'Rólunk', 'is': 'Um okkur',
         'cs': 'O nás', 'sk': 'O nás', 'hr': 'O nama', 'sl': 'O nas'}
PH_LABEL = {'sv': 'Fotokrediter', 'da': 'Fotokreditering', 'no': 'Fotokreditering', 'fi': 'Kuvien tekijät', 'ro': 'Credite foto', 'hu': 'Fotók forrása',
            'is': 'Höfundar mynda', 'cs': 'Autoři fotografií', 'sk': 'Autori fotografií', 'hr': 'Autori fotografija', 'sl': 'Avtorji fotografij'}
PHOTO = {'sv': 'Foto', 'da': 'Foto', 'no': 'Foto', 'fi': 'Kuva', 'ro': 'Foto', 'hu': 'Fotó', 'is': 'Mynd', 'cs': 'Foto', 'sk': 'Foto',
         'hr': 'Fotografija', 'sl': 'Fotografija'}
PARTNER = {'sv': 'Partnerprogram', 'da': 'Partnerprogram', 'no': 'Partnerprogram', 'fi': 'Kumppaniohjelma', 'ro': 'Program de parteneriat',
           'hu': 'Partnerprogram', 'is': 'Samstarfsverkefni', 'cs': 'Partnerský program', 'sk': 'Partnerský program', 'hr': 'Partnerski program',
           'sl': 'Partnerski program'}

# conversion buttons in the guides (tools/seo_tech/cta.py). Reader addressed with the informal "you", without
# gendered forms (ro/cs/sk/hr/sl/is: no adjectives or past participles that agree with the reader).
CTA = {
 'sv': {'test': 'Gör testet', 'start': 'Börja gratis', 'signup': 'Registrera dig nu',
        'a': 'Hur redo är du? Kolla din nivå med ett snabbt test.',
        'b': 'Omsätt det du just har läst i praktiken: frågor med förklaringar, i din egen takt.',
        'c': 'Redo att sätta igång? Skapa ditt konto och följ en studieplan som utgår från ditt provdatum.',
        'unit': 'Välj din modul', 'd': 'Välj den Diploma-modul du förbereder dig för och plugga den med lektioner, frågor och skriftliga svar.'},
 'da': {'test': 'Tag testen', 'start': 'Kom i gang gratis', 'signup': 'Opret dig nu',
        'a': 'Hvor klar er du? Tjek dit niveau med en hurtig test.',
        'b': 'Omsæt det, du lige har læst, til praksis: spørgsmål med forklaringer i dit eget tempo.',
        'c': 'Klar til at gå i gang? Opret din konto, og følg en studieplan, der er lagt efter din eksamensdato.',
        'unit': 'Vælg dit modul', 'd': 'Vælg det Diploma-modul, du forbereder dig til, og læs op på det med lektioner, spørgsmål og skriftlige svar.'},
 'no': {'test': 'Ta testen', 'start': 'Kom i gang gratis', 'signup': 'Registrer deg nå',
        'a': 'Hvor klar er du? Sjekk nivået ditt med en rask test.',
        'b': 'Gjør det du nettopp har lest, om til praksis: spørsmål med forklaringer, i ditt eget tempo.',
        'c': 'Klar til å begynne? Opprett en konto og følg en studieplan som er lagt opp etter eksamensdatoen din.',
        'unit': 'Velg modul', 'd': 'Velg Diploma-modulen du forbereder deg til, og jobb med den gjennom leksjoner, spørsmål og skriftlige svar.'},
 'fi': {'test': 'Tee testi', 'start': 'Aloita ilmaiseksi', 'signup': 'Rekisteröidy nyt',
        'a': 'Kuinka valmis olet? Tarkista tasosi nopealla testillä.',
        'b': 'Vie juuri lukemasi käytäntöön: kysymyksiä selityksineen omaan tahtiisi.',
        'c': 'Valmis aloittamaan? Luo tili ja seuraa opiskelusuunnitelmaa, joka rakentuu koepäiväsi ympärille.',
        'unit': 'Valitse moduuli', 'd': 'Valitse Diploma-moduuli, johon valmistaudut, ja opiskele sitä oppituntien, kysymysten ja kirjallisten vastausten avulla.'},
 'ro': {'test': 'Fă testul', 'start': 'Începe gratuit', 'signup': 'Înscrie-te acum',
        'a': 'Unde te afli cu pregătirea? Verifică-ți nivelul cu un test rapid.',
        'b': 'Pune în practică ce tocmai ai citit: întrebări cu explicații, în ritmul tău.',
        'c': 'Gata de start? Creează-ți contul și urmează un plan de studiu construit în jurul datei examenului tău.',
        'unit': 'Alege modulul', 'd': 'Alege modulul Diploma pentru care te pregătești și studiază-l cu lecții, întrebări și răspunsuri scrise.'},
 'hu': {'test': 'Indítsd a tesztet', 'start': 'Kezdd el ingyen', 'signup': 'Regisztrálj most',
        'a': 'Mennyire állsz készen? Nézd meg a szintedet egy gyors teszttel.',
        'b': 'Gyakorold, amit most olvastál: kérdések magyarázattal, a saját tempódban.',
        'c': 'Kezdhetjük? Hozd létre a fiókodat, és kövesd a vizsgád dátumához igazított tanulási tervet.',
        'unit': 'Válaszd ki a modult', 'd': 'Válaszd ki a Diploma-modult, amelyre készülsz, és tanuld leckékkel, kérdésekkel és írásbeli válaszokkal.'},
 'is': {'test': 'Taktu prófið', 'start': 'Byrjaðu frítt', 'signup': 'Skráðu þig núna',
        'a': 'Hvar stendurðu? Kannaðu stöðuna með stuttu prófi.',
        'b': 'Æfðu það sem þú varst að lesa: spurningar með útskýringum, á þínum hraða.',
        'c': 'Til í að byrja? Stofnaðu aðgang og fylgdu námsáætlun sem miðast við prófdaginn þinn.',
        'unit': 'Veldu eininguna', 'd': 'Veldu Diploma-eininguna sem þú ert að undirbúa og lærðu hana með kennslustundum, spurningum og skriflegum svörum.'},
 'cs': {'test': 'Udělej test', 'start': 'Začni zdarma', 'signup': 'Zaregistruj se',
        'a': 'Jak na tom jsi? Ověř si svou úroveň krátkým testem.',
        'b': 'Procvič si to, co je výše: otázky s vysvětlením, vlastním tempem.',
        'c': 'Můžeme začít? Vytvoř si účet a postupuj podle studijního plánu sestaveného podle data tvé zkoušky.',
        'unit': 'Vyber si modul', 'd': 'Vyber si modul Diploma, na který se připravuješ, a studuj ho pomocí lekcí, otázek a písemných odpovědí.'},
 'sk': {'test': 'Urob si test', 'start': 'Začni zadarmo', 'signup': 'Zaregistruj sa',
        'a': 'Ako na tom si? Over si svoju úroveň krátkym testom.',
        'b': 'Precvič si to, čo je vyššie: otázky s vysvetlením, vlastným tempom.',
        'c': 'Môžeme začať? Vytvor si účet a postupuj podľa študijného plánu zostaveného podľa dátumu tvojej skúšky.',
        'unit': 'Vyber si modul', 'd': 'Vyber si modul Diploma, na ktorý sa pripravuješ, a študuj ho pomocou lekcií, otázok a písomných odpovedí.'},
 'hr': {'test': 'Riješi test', 'start': 'Započni besplatno', 'signup': 'Registriraj se',
        'a': 'Gdje si trenutačno? Provjeri svoju razinu kratkim testom.',
        'b': 'Pretvori pročitano u praksu: pitanja s objašnjenjima, svojim tempom.',
        'c': 'Možemo li početi? Otvori račun i prati plan učenja prilagođen datumu svojeg ispita.',
        'unit': 'Odaberi modul', 'd': 'Odaberi Diploma modul za koji se pripremaš i uči ga uz lekcije, pitanja i pisane odgovore.'},
 'sl': {'test': 'Reši test', 'start': 'Začni brezplačno', 'signup': 'Registriraj se',
        'a': 'Kje si zdaj? Preveri svojo raven s kratkim testom.',
        'b': 'Prebrano preizkusi v praksi: vprašanja z razlagami, v svojem tempu.',
        'c': 'Začnemo? Ustvari račun in sledi učnemu načrtu, prilagojenemu datumu tvojega izpita.',
        'unit': 'Izberi modul', 'd': 'Izberi modul Diploma, na katerega se pripravljaš, in ga študiraj z lekcijami, vprašanji in pisnimi odgovori.'},
}
# "official" in these languages, for the banned-wording checks
BANNED = r'officiel|offisiell|virallinen|virallis|hivatalos|opinber|oficiáln|oficiáln|službeni|služben|uradn'


def merge(table, extra):
    """add the new languages to a builder's table (never overwrites an entry the builder already has)"""
    for k, v in extra.items():
        table.setdefault(k, v)
    return table
