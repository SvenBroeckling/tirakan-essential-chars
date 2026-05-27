export type MarkRule = {
  name: string;
  benefit?: string;
  vulnerability?: string;
  facet?: string;
  skills?: string;
};

export const ancestryRules = [
  {
    "name": "Al Bah JiRa",
    "benefit": "Erhalte +10 auf Anrufungen des Glaubens und formale Ritualführung.",
    "vulnerability": "Wenn du einen geschworenen Ritus oder ein Tabu brichst, kostet dich das sofort 1 Omen (oder +1 Bürde bei 0 Omen).",
    "skills": "Orientierung, Wildnisleben (Wüste)"
  },
  {
    "name": "Asgoran",
    "benefit": "Erhalte +10 auf Proben mit Geschick oder Geist, die mit Wasser, Schiffen oder Küsten zu tun haben.",
    "vulnerability": "In engem Inlandsgelände (enge Gassen, tiefe Höhlen) erhältst du -10 auf Bewegungsproben bei Verfolgung oder Flucht.",
    "skills": "Schiffahrt, Schwimmen"
  },
  {
    "name": "Die Stämme der Barbaren",
    "benefit": "Erhalte +10 auf Proben zu Überleben, Fährtensuche, Kampf unter widrigen Bedingungen und dem Einschätzen fremder Bedrohungen.",
    "vulnerability": "Jahrelanger Kampf und Stammesdenken nähren tiefes Misstrauen. Erhalte -10 auf die erste soziale Probe gegenüber fremden Kulturen oder unbekannten Autoritäten.",
    "skills": "Wildnisleben (Wald, Steppe oder Gebirge), Pflanzenkunde (Wald, Steppe oder Gebirge), Tierkunde (Wald, Steppe oder Gebirge)"
  },
  {
    "name": "Gas'Danir",
    "benefit": "Erhalte +10 auf Heimlichkeit, Infiltration und maritime Bewegung auf kurze Distanz.",
    "vulnerability": "In langen offenen Schlagabtauschen erhältst du -10 auf den zweiten und jeden weiteren Nahkampfaustausch derselben Szene.",
    "skills": "Schiffahrt, Schwimmen"
  },
  {
    "name": "Gasdaria",
    "benefit": "Erhalte +10 auf Verwaltung, Logistik und disziplinierte Koordination auf Distanz.",
    "vulnerability": "Wenn Pläne unerwartet zusammenbrechen, erhältst du -10 auf die erste Improvisationsprobe.",
    "skills": "Etikette (Gasdaria)"
  },
  {
    "name": "Meridian",
    "benefit": "Erhalte +10 auf Proben zu Politik, Recht und historischen Präzedenzfällen.",
    "vulnerability": "Unter plötzlichem körperlichem Druck (Überfall, Verfolgung) erhältst du -10 auf die erste schnelle Handlungsprobe.",
    "skills": "Mythen und Legenden (Felsenmeer)"
  },
  {
    "name": "Nur'Tuk",
    "benefit": "Erhalte +10 auf Standhaftigkeitsproben gegen Einschüchterung und Panikdruck.",
    "vulnerability": "In Situationen, die Geduld und Feinheit verlangen, erhältst du -10 auf die erste Täuschungs- oder Intrigenprobe.",
    "skills": "Material bearbeiten (Leder oder Stoff), Reiten (Pferde), Dressur (beliebige Tierart)"
  },
  {
    "name": "Hadewald",
    "benefit": "Erhalte +10 auf Reitreisen, Tierführung und improvisierte Feldreparaturen.",
    "vulnerability": "In höfischen Etiketteszenen erhältst du -10 auf strenge Protokollproben, sofern dir kein anderer SC hilft.",
    "skills": "Material bearbeiten (Holz), Klettern"
  },
  {
    "name": "Toran",
    "benefit": "Einmal pro Szene erhält eine soziale Probe +10, wenn sie Schulden, Rang oder Politik betrifft.",
    "vulnerability": "Verweigerst du eine direkte Herausforderung durch einen Rivalen, kostet dich das 1 Omen (oder +1 Bürde bei 0 Omen).",
    "skills": "Religionskunde (Mittelland), Staatskunst (Toran)"
  },
  {
    "name": "Quitaron",
    "benefit": "Erhalte +10 auf Überleben, Reiten und Ausdauerproben in der Wildnis.",
    "vulnerability": "In dichten Stadtvierteln erhältst du -10 auf Orientierung, sofern dich kein ortskundiger Führer begleitet.",
    "skills": "Wildnisleben (Wald, Steppe oder Gebirge), Pflanzenkunde (Wald, Steppe oder Gebirge), Tierkunde (Wald, Steppe oder Gebirge)"
  },
  {
    "name": "Yadosien",
    "benefit": "Erhalte +10 auf Proben zu Kunst, Etikette, Diplomatie und dem Erkennen kultureller oder religiöser Zusammenhänge.",
    "vulnerability": "Gegen fanatischen Glauben, verbotene Kulte oder verstörende Offenbarungen erhältst du -10 auf die erste Probe zum Widerstehen von Angst, Zweifel oder geistiger Verunsicherung.",
    "skills": "Dichtkunst, Musizieren (beliebiges Instrument), Singen"
  },
  {
    "name": "Yavon",
    "benefit": "Erhalte +10 auf Befehls-, Verhandlungs- und gesellschaftliche Proben im Zusammenhang mit Herrschaft.",
    "vulnerability": "Wird deine Autorität öffentlich untergraben, erhältst du in diesem Konflikt -10 auf die erste Reaktionsprobe.",
    "skills": "Überzeugen, Staatskunst (Yavon)"
  },
  {
    "name": "Ancatir",
    "benefit": "Erhalte +10 auf Heimlichkeit und Proben zur Vorbereitung von Fernangriffen aus der Deckung.",
    "vulnerability": "Wirst du ohne Vorbereitung in direkten Nahkampf gezwungen, erhält dein erster Nahkampfangriff in jeder Szene -10.",
    "skills": "Diplomatie, Tarnen, Verhandeln, Verstecken"
  },
  {
    "name": "Atiarel",
    "benefit": "Erhalte +10 auf arkane Analyse mit Geist und das Lesen von Ritualen.",
    "vulnerability": "Bei einer katastrophal misslungenen Magieprobe markierst du zusätzlich zum Üblichen +1 Bürde.",
    "skills": "Magietheorie (beliebiges Gebiet), Kriegskunst, Etikette (Atiarel)"
  },
  {
    "name": "Silkanda",
    "benefit": "Erhalte +10 auf gesellschaftliche Eleganz mit Erscheinung und diplomatische Erstkontakte.",
    "vulnerability": "Wirst du persönlich beleidigt oder entehrt, erhältst du -10 auf Proben zum Lösen oder Rückzug, bis du reagierst.",
    "skills": "Wildnisleben (Wald), Orientierung, Pflanzenkunde (Wald), Tierkunde (Wald)"
  },
  {
    "name": "Anscharon",
    "skills": "Magietheorie (beliebiges Gebiet), Kriegskunst, Etikette (Atiarel)"
  },
  {
    "name": "Fraxut",
    "benefit": "Bei schwachem Licht oder in Dunkelheit erhältst du +10 auf Wahrnehmungs- und Verfolgungsproben.",
    "vulnerability": "In hellem offenem Tageslicht erhältst du -10 auf Heimlichkeit, sofern du nicht zusätzliche Zeit für Deckungsvorbereitung aufwendest.",
    "skills": "Bergbau, Gesteinskunde, Orientierung"
  },
  {
    "name": "Xordai",
    "benefit": "Erhalte +10 auf Bergbau, Steinmetzarbeit und Orientierung unter Tage.",
    "vulnerability": "In tiefer Wildnis ohne Straßen oder Steinmarken erhältst du -10 auf Fernorientierung.",
    "skills": "Bergbau, Gesteinskunde, Braukunst, Mechanik"
  },
  {
    "name": "Morgalas",
    "skills": "Bergbau, Gesteinskunde, Braukunst, Mechanik"
  },
  {
    "name": "Katora",
    "benefit": "In Dunkelheit erhältst du +10 auf Wahrnehmungsproben und Nahkampfproben.",
    "vulnerability": "In hartem direktem Licht erhältst du in jeder Szene -10 auf die erste Präzisionsprobe.",
    "skills": "Zechen, Braukunst"
  },
  {
    "name": "Kroto'Chim",
    "benefit": "Erhalte +10 auf Menschenkenntnis mit Instinkt und Proben zum Umgang mit Tieren.",
    "vulnerability": "In stark urbanen oder künstlichen Umgebungen erhältst du -10 auf Orientierung nach natürlichen Zeichen.",
    "skills": "Wildnisleben (Steppe), Kriegskunst"
  },
  {
    "name": "O'Grut",
    "benefit": "Erhalte +10 auf Täuschungsproben und soziale Irreführung, wenn Identität oder Absicht verschleiert sind.",
    "vulnerability": "Wirst du öffentlich direkt herausgefordert, erhältst du -10 auf die erste unmittelbare soziale Abwehrprobe, bis du klar Stellung beziehst.",
    "skills": "Ausdauer, Zechen"
  },
  {
    "name": "Asch-Ta-Khi",
    "benefit": "Erhalte +10 auf Täuschungsproben und soziale Irreführung, wenn Identität oder Absicht verschleiert sind.",
    "vulnerability": "Wirst du öffentlich direkt herausgefordert, erhältst du -10 auf die erste unmittelbare soziale Abwehrprobe, bis du klar Stellung beziehst.",
    "skills": "Ausdauer, Zechen"
  },
  {
    "name": "Dunkelgoblins",
    "skills": "Ausdauer, Zechen"
  },
  {
    "name": "Duigosz",
    "benefit": "Erhalte +10 auf Proben für Handwerk, Reparatur oder den Betrieb von Maschinen.",
    "vulnerability": "Improvisierst du ohne geeignetes Werkzeug, sinkt der Effekt um eine Stufe (stark zu normal zu begrenzt).",
    "skills": "Zwei beliebige Konstruktions-/Wissensfertigkeiten"
  },
  {
    "name": "Gnome",
    "benefit": "Erhalte +10 auf Proben für Handwerk, Reparatur oder den Betrieb von Maschinen.",
    "vulnerability": "Improvisierst du ohne geeignetes Werkzeug, sinkt der Effekt um eine Stufe (stark zu normal zu begrenzt).",
    "skills": "Zwei beliebige Konstruktions-/Wissensfertigkeiten"
  },
  {
    "name": "Gorben",
    "benefit": "Erhalte +10 auf Proben für Handwerk, Reparatur oder den Betrieb von Maschinen.",
    "vulnerability": "Improvisierst du ohne geeignetes Werkzeug, sinkt der Effekt um eine Stufe (stark zu normal zu begrenzt).",
    "skills": "Zwei beliebige Konstruktions-/Wissensfertigkeiten"
  },
  {
    "name": "Doldagor",
    "benefit": "Einmal pro Szene gilt vertikale Bewegung für dich als trivial, und du erhältst +10 auf Proben zur Positionierung in der Höhe.",
    "vulnerability": "Nach einem misslungenen Manöver mit hoher Beweglichkeit erleidest du eine zusätzliche geringe Konsequenz (Aufprall, Bloßstellung oder Desorientierung).",
    "skills": "Altertumskunde"
  },
  {
    "name": "Flügler",
    "benefit": "Erhalte +10 auf Proben zum Ausweichen oder Umpositionieren in offenem Raum und ignoriere einmal pro Szene ein geringes Bewegungshemmnis.",
    "vulnerability": "Bist du gefesselt oder eingeschlossen, beginnst du in dieser Szene mit -10 auf die erste Fluchtprobe.",
    "skills": "Schwafeln, Ausdauer"
  },
  {
    "name": "Echsen"
  },
  {
    "name": "Minotauren"
  }
] satisfies MarkRule[];

export const pathRules = [
  {
    "name": "Krieger",
    "benefit": "Erhalte +10 auf den ersten Angriff mit einer Nahkampfwaffe in jeder Kampfrunde.",
    "vulnerability": "In Szenen, die Geduld, Zurückhaltung oder feine soziale Deeskalation verlangen, erhältst du -10 auf die erste passende Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du trotz Unterzahl eine Linie hältst.",
    "skills": "Blind kämpfen, Dauerlauf, Etikette, Reiten, Waffenkunde, Verhandeln, Ausdauer, Kriegskunde"
  },
  {
    "name": "Gelehrter",
    "benefit": "Erhalte +10 auf Geschichte, Mythen und Proben zur Zusammenführung von Erkenntnissen.",
    "vulnerability": "Bei plötzlicher Gewalt erhältst du in dem Konflikt -10 auf die erste Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du eine seltene Quelle oder Randnotiz richtig einordnest.",
    "skills": "Altertumskunde (Gebiet), Astrologie, Giftkunde, Kartenkunde, Kryptographie, Magiekunde, Mythen und Legenden (Region), Lehren/Erklären, Pflanzenkunde (Gebiet), Rechtskunde (Volk), Rechnen, Religionskunde (Religion), Schreiben, Schwafeln, Tierkunde (Region)"
  },
  {
    "name": "Abenteurer",
    "benefit": "Einmal pro Szene ignorierst du ein geringes Hindernis der Fortbewegung und erhältst +10 auf Proben zu Erkundung oder Orientierung.",
    "vulnerability": "Bist du übermüdet (wenig Vorräte oder keine Rast), erhälst du nach einer misslungenen Probe bei Gefahr +1 Bürde.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du ohne Karte einen gangbaren Ausweg findest.",
    "skills": "Abrollen, Ausdauer, Dauerlauf, Improvisieren, Klettern, Lügen, Orientierung, Schätzen, Schauspielerei, Schleichen, Tauschhandel, Verhandeln, Verstecken, Wetterkunde, Wildnisleben"
  },
  {
    "name": "Barde",
    "benefit": "Erhalte +10 auf Auftritte, soziale Einflussnahme und Szenen, in denen du Moral stärkst.",
    "vulnerability": "Wirst du öffentlich verspottet oder diskreditiert, erhältst du danach -10 auf die erste soziale Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du mit einem Lied, Gedicht oder Spott die Stimmung kippst.",
    "skills": "Altertumskunde (Gebiet), Betören, Dichtkunst, Etikette (Gebiet), Improvisieren, Lügen, Musizieren (Instrumentenart), Mythen und Legenden (Gebiet), Schauspielerei, Schreiben, Schwafeln, Singen"
  },
  {
    "name": "Dieb",
    "benefit": "Erhalte +10 auf heimliches Eindringen, Schlossöffnung und Proben auf Fingerfertigkeit.",
    "vulnerability": "Nach einer misslungenen Heimlichkeitsprobe erhältst du in derselben Szene -10 auf deine nächste soziale Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du unbemerkt eine kleine Sache verschwinden oder auftauchen lässt.",
    "skills": "Betteln, Dauerlauf, Klettern, Lügen, Mechanik, Schätzen, Schauspielerei, Schleichen, Schlösser knacken, Springen, Stehlen, Tarnen, Überzeugen"
  },
  {
    "name": "Händler",
    "benefit": "Erhalte +10 auf Feilschen, Wertschätzung und Proben auf das Wissen um Handelsnetzwerke.",
    "vulnerability": "Wenn eine Verhandlung unvermittelt in offene Drohung, Beleidigung oder Gewalt kippt, erhältst du -10 auf deine erste Reaktionsprobe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du aus Höflichkeit und Nutzen einen Handel doch noch rettest.",
    "skills": "Buchführung, Diplomatie, Etikette (Gebiet), Lügen, Psychologie (Volk), Rechnen, Schätzen, Schreiben, Schwafeln, Tauschhandel, Überzeugen, Verhandeln"
  },
  {
    "name": "Mechanikus",
    "benefit": "Erhalte +10 auf Proben die Schätzen, Rechnen oder Baumeisterei enthalten.",
    "vulnerability": "Durch ständiges Grübeln oder Bewerten der Welt in einem technischen Sinn erhälst du -10 auf alle Proben, die Kommunikation enthalten.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du einen Mechanismus rasch verstehst oder umgehst.",
    "skills": "Baumeister (Bauart), Buchführung, Fluggeräte (Art), Improvisieren, Mechanik, Metallurgie, Rechnen, Schreiben, Zeichnen"
  },
  {
    "name": "Seefahrer",
    "benefit": "Erhalte +10 auf Seefahrt, Schiffskunde und Navigationsproben auf See.",
    "vulnerability": "Bei Überlandreisen durch Berge oder Wüste erhältst du an jedem Tag -10 auf die erste Orientierungsprobe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du in Sturm, Nebel oder Nacht die Richtung hältst.",
    "skills": "Akrobatik, Balancieren, Bootsbau, Fesseln, Lügen, Orientierung, Schiffahrt, Schwimmen, Wetterkunde"
  },
  {
    "name": "Pirat",
    "benefit": "Erhalte +10 auf Proben, wenn du ein Schiff unter Druck manövrierst, Beute witterst oder ein eingeschüchtertes Gegenüber zur schnellen Aufgabe drängst.",
    "vulnerability": "In Szenen, die strenge Disziplin, höfische Unterordnung oder saubere Befehlsketten verlangen, erhältst du -10 auf die erste passende Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du Schrecken, Ruf oder blanke Dreistigkeit als Waffe einsetzt.",
    "skills": "Akrobatik, Balancieren, Bootsbau, Fesseln, Lügen, Orientierung, Schiffahrt, Schwimmen, Wetterkunde"
  },
  {
    "name": "Söldner",
    "benefit": "Erhalte +10 bei Vertragsverhandlungen, Drohgebärden und praktischer Scharmützeltaktik.",
    "vulnerability": "Werden Bezahlung, Bedingungen oder Loyalität öffentlich infrage gestellt, erhältst du -10 auf die erste Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du eine Truppe unter Druck zusammenhältst.",
    "skills": "Ausdauer, Kriegskunst, Tarnen, Verhandeln, Verhören, Waffenkunde (Waffenart), Wildnisleben (Region), Wunden heilen, Zechen"
  },
  {
    "name": "Wegelagerer",
    "benefit": "Erhalte +10 beim Fallen stellen, wenn du aus dem Hinterhalt agierst oder dich im Verborgenen bewegst.",
    "vulnerability": "Bei allen sozialen Proben erhälst du -10, in gehobener Gesellschaft -20.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du einen Überfallplatz oder Fluchtkorridor vorbereitest.",
    "skills": "Ausdauer, Beschatten, Fallen stellen/erkennen, Fesseln, Orientierung, Schleichen, Springen, Spurenlesen, Tarnen, Verkleiden, Verstecken, Wetterkunde, Wildnisleben (Region)"
  },
  {
    "name": "Meuchler",
    "benefit": "Erhalte +10 auf geplante Tötungsversuche und Proben zur Vorbereitung durch Zielstudium.",
    "vulnerability": "In langem offenem Kampf erhältst du ab der zweiten Runde -10 auf Angriffe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du eine Schwäche des Ziels nach ruhiger Beobachtung ausnutzt.",
    "skills": "Abrollen, Akrobatik, Balancieren, Dauerlauf, Fallen stellen/entschärfen, Klettern, Lügen, Tarnen, Verstecken, Waffenkunde (Waffenart), Beschatten, Schleichen"
  },
  {
    "name": "Gaukler",
    "benefit": "Erhalte +10 auf Proben die Darstellung, Täuschen oder auch Betören.",
    "vulnerability": "Du bist anfällig für Aberglauben, erhalte -10 auf alle Proben, die rationales Denken erfordern.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du mit Ablenkung eine heimliche Handlung deckst.",
    "skills": "Abrollen, Akrobatik, Balancieren, Bauchreden, Betören, Improvisieren, Jonglieren, Psychologie (Volk), Tanzen (Region), Schauspielerei, Werfen"
  },
  {
    "name": "Medikus",
    "benefit": "Erhalte +10 auf Proben auf Heilung, Erste Hilfe und Naturkunde.",
    "vulnerability": "Erhalte -10 auf alle Proben die seichte Kommunikation erfordern.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du aus Symptomen die wahre Gefahr erkennst.",
    "skills": "Alchimie, Anatomie, Giftkunde, Lehren/Erklären, Magiekunde, Pflanzenkunde, Psychologie, Krankheiten heilen, Wunden heilen"
  },
  {
    "name": "Jäger",
    "benefit": "Erhalte +10 auf Verfolgung, die Vorbereitung von Schüssen und das Lesen von Spuren in Wildnisszenen.",
    "vulnerability": "In höfischen oder juristischen Verhandlungsszenen erhältst du -10 auf die erste Einflussprobe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du Wind, Ruhe und Deckung für einen sauberen Schuss nutzt.",
    "skills": "Ausdauer, Bogen bauen, Dauerlauf, Dressur, Fallen stellen/entschärfen, Fischen, Giftkunde, Jagen, Material bearbeiten (Holz), Pflanzenkunde (Region), Spurenlesen, Wildnisleben, Wunden heilen"
  },
  {
    "name": "Spion",
    "benefit": "Erhalte +10 auf Proben, wenn du eine falsche Rolle spielst, unbemerkt Informationen sammelst oder heimlich Botschaften weitergibst.",
    "vulnerability": "Wirst du in einer Szene gezwungen, offen Farbe zu bekennen oder ohne Tarnung Stellung zu beziehen, erhältst du -10 auf die erste Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn eine glaubhafte Legende oder Uniform dir Türen öffnet.",
    "skills": "Abrollen, Akrobatik, Balancieren, Beschatten, Betteln, Blind kämpfen, Bogen bauen, Etikette, Fesseln, Giftkunde, Klettern, Orientierung, Psychologie, Religionskunde (Nijadi), Schleichen, Springen, Waffenkunde (Schwerter)"
  },
  {
    "name": "Soldat",
    "benefit": "Erhalte +10 auf koordinierte Kampfmanöver und Proben auf Schlachtfelddisziplin.",
    "vulnerability": "Bei direkten widersprüchlichen Befehlen oder Befehlszusammenbruch markierst du +1 Bürde oder erhältst in dieser Runde -10 auf Proben, die über deine Handlungsreihenfolge entscheiden.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du unter Beschuss Haltung und Ordnung bewahrst.",
    "skills": "Blind kämpfen, Dauerlauf, Etikette, Reiten, Waffenkunde, Verhandeln, Ausdauer, Kriegskunde"
  },
  {
    "name": "Schmied",
    "benefit": "Erhalte +10 auf Schmieden, Reparatur und Proben zur Beurteilung von Metall.",
    "vulnerability": "Ohne geeignetes Werkzeug oder Schmiede sinkt der Effekt bei Ausrüstungsreparaturen um eine Stufe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du einen Bruch, Grat oder verborgenen Fehler im Metall erkennst.",
    "skills": "Baumeister (Bauart), Buchführung, Fluggeräte (Art), Improvisieren, Mechanik, Metallurgie, Rechnen, Schreiben, Zeichnen"
  },
  {
    "name": "Boxer",
    "benefit": "Erhalte +20 auf unbewaffneten Nahkampf.",
    "vulnerability": "Gegen Reichweitenwaffen auf offenem Boden erhältst du in jeder Szene -10 auf die erste Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du einen Gegner in Griff, Ringkampf oder Clinch zwingst.",
    "skills": "Ausdauer, Blind kämpfen, Dauerlauf, Fischen, Jagen, Klettern, Reiten, Springen, Wildnisleben (Gebiet)"
  },
  {
    "name": "Schreiber",
    "benefit": "Erhalte +10 auf Aufzeichnungen, Schriften und Proben zur Bestimmung von Echtheit von Dokumenten.",
    "vulnerability": "Unter unmittelbarem Zeitdruck erhältst du in der Szene -10 auf die erste Schreib- oder Analyseprobe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du Fälschung, Rasur oder nachträgliche Ergänzung an einem Text erkennst.",
    "skills": "Altertumskunde (Gebiet), Astrologie, Giftkunde, Kartenkunde, Kryptographie, Magiekunde, Mythen und Legenden (Region), Lehren/Erklären, Pflanzenkunde (Gebiet), Rechtskunde (Volk), Rechnen, Religionskunde (Religion), Schreiben, Schwafeln, Tierkunde (Region)"
  },
  {
    "name": "Bote",
    "benefit": "Erhalte +10 auf schnelle Reisen und Proben auf Bewegung unter Druck.",
    "vulnerability": "Bist du mit schwerer Ausrüstung beladen, erhältst du -10 auf Bewegungsproben.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du trotz Chaos eine Nachricht sicher zustellst.",
    "skills": "Abrollen, Ausdauer, Dauerlauf, Improvisieren, Klettern, Lügen, Orientierung, Schätzen, Schauspielerei, Schleichen, Tauschhandel, Verhandeln, Verstecken, Wetterkunde, Wildnisleben"
  },
  {
    "name": "Bestatter",
    "benefit": "Erhalte +10 auf Totenriten, Leichenumgang und ruhiges Handeln in Szenen des Todes.",
    "vulnerability": "Lebende Menschen misstrauen deinem Ton; in festlichen Situationen erhältst du -10 auf die erste charmante soziale Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du am Zustand eines Leichnams die Wahrheit des Todes liest.",
    "skills": "Alchimie, Anatomie, Giftkunde, Lehren/Erklären, Magiekunde, Pflanzenkunde, Psychologie, Krankheiten heilen, Wunden heilen"
  },
  {
    "name": "Ritter",
    "benefit": "Erhalte +10 auf Proben, wenn du offen Autorität ausübst, eine Linie hältst oder andere unter deinem Schutz sammelst.",
    "vulnerability": "In Szenen, die List, offene Unehre oder schmutzige Improvisation verlangen, erhältst du -10 auf die erste passende Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du durch Stand und Eid Schwankende wieder sammelst.",
    "skills": "Blind kämpfen, Dauerlauf, Etikette, Reiten, Waffenkunde, Verhandeln, Ausdauer, Kriegskunde"
  },
  {
    "name": "Medium",
    "benefit": "Erhalte +10, wenn du Omen, Echos oder Anzeichen geisterhafter Präsenz deutest.",
    "vulnerability": "Bei katastrophal misslungenem okkultem Kontakt markierst du zusätzlich zum normalen Nachhall +1 Bürde.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du einem unruhigen Geist kurz Gehör oder Form gibst.",
    "skills": "Altertumskunde (Gebiet), Astrologie, Ausdauer, Hypnose, Magiekunde, Magietheorie (Geister), Mythen (Gebiet), Okkultes (Gebiet), Zeichnen"
  },
  {
    "name": "Bader",
    "benefit": "Erhalte +10 auf grobe Traumaversorgung und Proben zur Stabilisierung im Kampf.",
    "vulnerability": "Bei feiner langwieriger Behandlung erhältst du -10 auf die erste präzise medizinische Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du mit einfachen Mitteln Blutung, Fieber oder Schock eindämmst.",
    "skills": "Alchimie, Anatomie, Giftkunde, Lehren/Erklären, Magiekunde, Pflanzenkunde, Psychologie, Krankheiten heilen, Wunden heilen"
  },
  {
    "name": "Abdecker",
    "benefit": "Erhalte +10 auf Einschüchterung, die Verarbeitung von Kadavern und Ausdauer bei grimmiger Arbeit.",
    "vulnerability": "In sozialen Szenen erhältst du -10 auf die erste Probe der Szene.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du aus totem Material noch Nützliches ziehst.",
    "skills": "Alchimie, Anatomie, Giftkunde, Lehren/Erklären, Magiekunde, Pflanzenkunde, Psychologie, Krankheiten heilen, Wunden heilen"
  },
  {
    "name": "Wirt",
    "benefit": "Erhalte +10 auf Proben, wenn du Gäste einschätzt, ein Haus unter Betrieb zusammenhältst oder mit Speise, Trank und Ruhe Einfluss gewinnst.",
    "vulnerability": "Wird ein Ort deiner Gastlichkeit offen entweiht, verwüstet oder blutig gebrochen, erhältst du -10 auf die erste soziale Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn Speise, Schlafplatz oder ein Becher ein Gegenüber weich macht.",
    "skills": "Buchführung, Diplomatie, Etikette (Gebiet), Lügen, Psychologie (Volk), Rechnen, Schätzen, Schreiben, Schwafeln, Tauschhandel, Überzeugen, Verhandeln"
  },
  {
    "name": "Chimärologe",
    "benefit": "Erhalte +10 auf Proben, die Anatomie, Alchemie oder das Verändern lebender Materie betreffen.",
    "vulnerability": "Misslingt dir eine Probe auf lebende Experimente oder körperliche Veränderung, erhälst du zusätzlich +1 Bürde.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du an Fleisch, Knochen oder Organik eine verborgene Möglichkeit erkennst.",
    "skills": "Alchimie, Anatomie, Astrologie, Giftkunde, Magiekunde, Magietheorie (Chimären), Okkultes (Gebiet), Schreiben, Zeichnen, Tierkunde"
  },
  {
    "name": "Dämonologe",
    "benefit": "Erhalte +10 auf Proben, die Beschwörung, Bannung oder das Erkennen dämonischer Einflüsse betreffen.",
    "vulnerability": "Bei katastrophal misslungener dämonischer Magie oder Kontaktaufnahme markierst du zusätzlich +1 Bürde.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du wahren Namen, Siegel oder Schwächen eines Dämons richtig nutzt.",
    "skills": "Altertumskunde (Gebiet), Ausdauer, Giftkunde, Astrologie, Kryptographie, Magiekunde, Magietheorie (Dämonen), Okkultes (Gebiet), Zeichnen"
  },
  {
    "name": "Druide",
    "benefit": "Erhalte +10 auf Proben, die Naturmagie, Pflanzenkunde oder das Deuten wilder Zeichen betreffen.",
    "vulnerability": "In stark urbanen oder verdorbenen Umgebungen erhältst du -10 auf die erste Probe in der Szene.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn Tiere, Wurzeln oder Wetter dir eine Richtung weisen.",
    "skills": "Altertumskunde (Gebiet), Astrologie, Gesteinskunde, Krankheiten heilen, Magiekunde, Material bearbeiten (Material), Mythen und Legenden (Gebiet), Okkultes (Gebiet), Pflanzenkunde (Region)"
  },
  {
    "name": "Geisterbeschwörer",
    "benefit": "Erhalte +10 auf Proben, die Anrufung, Bindung oder Deutung von Geistern und Echos betreffen.",
    "vulnerability": "Bei katastrophal misslungener Geisterbeschwörung oder Kontaktaufnahme markierst du zusätzlich +1 Bürde.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du aus einem Echo klare Auskunft oder Warnung ziehst.",
    "skills": "Altertumskunde (Gebiet), Astrologie, Ausdauer, Hypnose, Magiekunde, Magietheorie (Geister), Mythen (Gebiet), Okkultes (Gebiet), Zeichnen"
  },
  {
    "name": "Hexer",
    "benefit": "Erhalte +10 auf Proben, die Flüche, Hexereien oder das Wirken durch verborgene Pakte betreffen.",
    "vulnerability": "Wird eine Hexerei von dir katastrophal misslungen oder gegen dich zurückgeworfen, markierst du zusätzlich +1 Bürde.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du mit Haar, Blut oder Namen eine Person magisch erreichst.",
    "skills": "Betören, Dressur (Tierart), Giftkunde, Kochen, Magiekunde, Mythen und Legenden, Okkultes, Pflanzenkunde, Psychologie (Volk), Tanzen (Gebiet), Tierkunde (Region), Wunden heilen, Krankheiten heilen, Astrologie, Alchimie, Musizieren (Instrumentenart)"
  },
  {
    "name": "Hermetiker",
    "benefit": "Erhalte +10 auf Proben, die Formeln, Siegel, arkanes Ordnen oder kontrollierte Magie betreffen.",
    "vulnerability": "Wirst du bei der Anwendung von Magie aus deinem vorbereiteten Ablauf gerissen, erhältst du -10 auf die erste Folgeprobe derselben Szene.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du chaotische Magie durch Ordnung, Zahl und Gestus einhegst.",
    "skills": "Alchimie, Altertumskunde (Gebiet), Astrologie, Etikette, Giftkunde, Improvisieren, Kartenkunde, Kryptographie, Magiekunde, Magietheorie (Gebiet), Okkultes, Pflanzenkunde (Region), Rechnen, Schwafeln, Zeichnen"
  },
  {
    "name": "Mystiker",
    "benefit": "Erhalte +10 auf Proben, die Visionen, innere Einkehr oder das Deuten von Omen und verborgenen Zusammenhängen betreffen.",
    "vulnerability": "Wirst du aus Trance, Kontemplation oder innerer Sammlung jäh gerissen, erhältst du -10 auf die nächste Probe in der Szene.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du in Stille eine verborgene Absicht oder kommende Gefahr erkennst.",
    "skills": "Altertumskunde (Gebiet), Diplomatie, Etikette, Gesteinskunde, Kryptographie, Magiekunde, Magietheorie (Mystizismus), Mythen und Legenden (Gebiet), Psychologie (Volk), Schwafeln"
  },
  {
    "name": "Nekrologe",
    "benefit": "Erhalte +10 auf Proben, die Totenriten, nekromantische Erkenntnis oder den Umgang mit sterblichen Überresten betreffen.",
    "vulnerability": "In Szenen mit lebendiger Festlichkeit, Fruchtbarkeit oder ausgelassener Gemeinschaft erhältst du -10 auf die erste soziale Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du an Grab, Asche oder Knochen eine verborgene Geschichte liest.",
    "skills": "Anatomie, Giftkunde, Kryptographie, Magiekunde, Magietheorie (Nekrologie), Okkultes, Pflanzenkunde (Region), Zeichnen"
  },
  {
    "name": "Runenleger",
    "benefit": "Erhalte +10 auf Proben, die Runeninschriften, magische Zeichen oder die Vorbereitung gebundener Wirkungen betreffen.",
    "vulnerability": "Musst du einen Zauber ohne Zeit für saubere Vorbereitung oder ohne geeignete Fläche wirken, erhältst du -10 auf die erste passende Probe der Szene.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du einen Ort, Gegenstand oder Schwellenstein wirksam markierst.",
    "skills": "Astrologie, Gesteinskunde, Giftkunde, Kryptographie, Magiekunde, Magietheorie (Runen), Material bearbeiten (Material), Mythen und Legenden, Okkultes (Gebiet), Zeichnen"
  },
  {
    "name": "Schwarzmagier",
    "benefit": "Erhalte +10 auf Proben, die zerstörerische, verderbende oder furchterregende Magie betreffen.",
    "vulnerability": "Zeigst du in einer Szene offen schwarze Magie, erhältst du -10 auf die erste anschließende soziale Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du mit Furcht, Schmerz oder Verfall einen Willen brichst.",
    "skills": "Alchimie, Astrologie, Etikette (Gebiet), Giftkunde, Kryptographie, Lehren/Erklären, Lügen, Magiekunde, Magietheorie (Schwarzmagie), Okkultes (Gebiet), Rechnen, Schreiben, Zeichnen, Überzeugen"
  },
  {
    "name": "Weissmagier",
    "benefit": "Erhalte +10 auf Proben, die Heilung, Schutz oder reinigende Magie betreffen.",
    "vulnerability": "Verursachst du vorsätzlich Leid oder nutzt deine Magie offen zur Grausamkeit, erhältst du -10 auf die nächste Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du Bann, Segen oder Läuterung gegen klaren Frevel richtest.",
    "skills": "Alchimie, Anatomie, Etikette (Gebiet), Krankheiten heilen, Giftkunde, Lehren/Erklären, Magiekunde, Magietheorie (Weissmagie), Pflanzenkunde (Region), Psychologie (Volk), Rechtskunde (Volk), Schreiben, Schwafeln, Wunden heilen"
  },
  {
    "name": "Zauberer",
    "benefit": "Erhalte +10 auf Proben, die freie Zauberei, magische Improvisation oder das Anpassen bekannter Wirkungen betreffen.",
    "vulnerability": "Wirkst du unter starkem unmittelbarem Druck ohne Vorbereitung, erhältst du -10 auf die erste Zauberprobe der Szene.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du einen bekannten Effekt überraschend umdeutest.",
    "skills": "Alchimie, Balancieren, Bauchreden, Improvisieren, Lügen, Magiekunde, Musizieren (Instrumentenart), Mythen und Legenden (Gebiet), Schwafeln, Verkleiden"
  },
  {
    "name": "Waldläufer",
    "benefit": "Erhalte +10 auf Verfolgung, Handwerk und die Vorbereitung von Fallen im wilden Gelände.",
    "vulnerability": "In dichten Stadtvierteln erhältst du -10 auf Orientierung, sofern dir kein ortskundiger Führer hilft.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du eine Gruppe sicher durch schweres Gelände führst.",
    "skills": "Ausdauer, Dauerlauf, Jagen, Klettern, Magiekunde, Mythen und Legenden (Gebiet), Orientierung, Schleichen, Springen, Tarnen, Verstecken, Wetterkunde, Wildnisleben (Region)"
  },
  {
    "name": "Mönch",
    "benefit": "Erhalte +10 auf Proben, wenn ruhige Sammlung, körperliche Kontrolle oder standhafte Selbstzucht den Ausschlag geben.",
    "vulnerability": "In Szenen, die Hast, lärmende Unordnung oder überstürzte Reaktion verlangen, erhältst du -10 auf die erste passende Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du Hunger, Schmerz oder Versuchung durch Disziplin bezwingst.",
    "skills": "Altertumskunde (Region), Astrologie, Braukunst, Diplomatie, Etikette (Volk), Kartenkunde, Lehren/Erklären, Magiekunde, Mythen und Legenden (Region), Psychologie, Religionskunde (Religion), Überzeugen, Schreiben"
  },
  {
    "name": "Paladin",
    "benefit": "Erhalte +10 auf Proben, die heiligen Kampf, Schutz Unschuldiger oder standhafte Glaubensautorität betreffen.",
    "vulnerability": "Weichst du in einer Szene offen von deinem Eid oder deiner heiligen Pflicht ab, erhältst du -10 auf die nächste Probe in der Szene.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du dich sichtbar zwischen Unschuldige und Verderben stellst.",
    "skills": "Abrollen, Altertumskunde (Gebiet), Ausdauer, Blind kämpfen, Diplomatie, Etikette, Lehren, Magiekunde, Rechtskunde (Volk), Religionskunde (Religion), Staatskunst (Volk), Waffenkunde (Waffenart)"
  },
  {
    "name": "Priester",
    "benefit": "Erhalte +10 auf Proben, die Liturgie, Seelsorge oder das Anrufen göttlicher Ordnung betreffen.",
    "vulnerability": "Wirst du in einer Szene öffentlich der Heuchelei, Glaubensschwäche oder Entweihung beschuldigt, erhältst du -10 auf die nächste Probe.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn du durch Liturgie einen Raum ordnest oder eine Menge stillst.",
    "skills": "Altertumskunde (Gebiet), Astrologie, Diplomatie, Etikette (Tempel), Führung (Orden), Kryptographie, Lehren/Erklären, Magiekunde, Magietheorie (Magieart), Mythen und Legenden (Gebiet), Psychologie (Volk), Rechtskunde (Volk), Religionskunde (Religion), Schreiben"
  },
  {
    "name": "Vampirjäger",
    "benefit": "Erhalte +10 auf Proben, die das Aufspüren, Erkennen oder Bekämpfen von Vampiren und blutgebundenen Schrecken betreffen.",
    "vulnerability": "In Gegenwart offensichtlicher vampirischer Verderbnis erhältst du -10 auf die erste Probe zu Zurückhaltung, Heimlichkeit oder diplomatischem Abwarten.",
    "facet": "Einmal pro Sitzung erhältst du +10, wenn geweihte Vorbereitung, Pfahl oder Sonnenwissen den Ausschlag geben.",
    "skills": "Altertumskunde (Gebiet), Anatomie, Astrologie, Blind kämpfen, Fallen stellen/entschärfen, Klettern, Magiekunde, Material bearbeiten (Holz), Mythen und Legenden (Gebiet)"
  }
] satisfies MarkRule[];

export const bondRules = [
  {
    "name": "Die Heimat",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn du für dein Heimatland sprichst, seine Sitten kennst oder es gegen äußere Bedrohung verteidigst.",
    "vulnerability": "Wird deine Heimat verspottet, verraten oder bedroht, erhältst du -10 auf die nächste Probe."
  },
  {
    "name": "Die Familie",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn du handelst, um Angehörige zu schützen, zu versorgen oder ihren Ruf zu bewahren.",
    "vulnerability": "Wird deine Familie beschuldigt, bedroht oder entehrt, erhältst du -10 auf die erste Probe."
  },
  {
    "name": "Die letzte Ernte",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn du Vorräte sicherst, Bauern schützt oder Not durch Hunger und Mangel abwendest.",
    "vulnerability": "Siehst du, wie Nahrung vergeudet oder Wehrlose ausgehungert werden, erhältst du -10 auf die nächste Probe."
  },
  {
    "name": "Die Straße nach Bayard",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn Gerüchte, Reisewege, Händlerkontakte oder Botenwissen entlang der großen Straßen helfen könnten.",
    "vulnerability": "Wirst du auf offener Straße als Schuldiger, Verräter oder Gesuchter erkannt, erhältst du -10 auf die erste Probe."
  },
  {
    "name": "Die Karawane aus Al Bah JiRa",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn Handelsetikette, Karawanenwissen oder gegenseitige Gastfreundschaft dir helfen.",
    "vulnerability": "In Szenen von offenem Vertragsbruch oder entehrter Gastfreundschaft erhältst du -10 auf die erste Probe zu Vertrauen oder ruhiger Verhandlung."
  },
  {
    "name": "Die Wälder Hadewalds",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn altes Waldwissen, natürliche Deckung oder die Zeichen des Forsts dir nützen.",
    "vulnerability": "In verbrannten, gerodeten oder entweihten Waldgebieten erhältst du -10 auf die erste Probe."
  },
  {
    "name": "Die freien Städte Yavons",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn freie Bürgerschaft, städtische Politik oder unabhängige Netzwerke von Nutzen sind.",
    "vulnerability": "Unter starrem Befehl, Lehnszwang oder offener Tyrannei erhältst du -10 auf die erste Probe zu Unterordnung oder höfischer Folgsamkeit."
  },
  {
    "name": "Die Flüchtlinge des Südens",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn du Schutz, Fluchtwege oder Versorgung für Schutzsuchende organisierst.",
    "vulnerability": "Lässt du Schutzsuchende sichtbar im Stich oder wirst dazu gezwungen, erhältst du -10 auf die nächste Probe."
  },
  {
    "name": "Die verlorenen Kinder Yadosiens",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn du Geflohene aus Yadosien verbirgst, führst oder für sie sprichst.",
    "vulnerability": "Wirst du mit yadosischer Ausgrenzung, Misstrauen oder Denunziation konfrontiert, erhältst du -10 auf die erste Probe zu Geduld oder gesellschaftlicher Anpassung."
  },
  {
    "name": "Der alte Lehrmeister",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Vorbereitungs-, Wissens- oder Taktikprobe, wenn du dich auf die Lehre deines Mentors berufst.",
    "vulnerability": "Ignorierst du eine offensichtliche Lehre oder Warnung deines Lehrmeisters, erhältst du -10 auf die nächste passende Probe."
  },
  {
    "name": "Die Kameraden der Front",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn du mit Veteranen kooperierst, unter Beschuss standhältst oder Kampflogik anwendest.",
    "vulnerability": "Wenn du ehemalige Kameraden im Stich lässt oder ihr Opfer entwertet wird, erhältst du -10 auf die erste Probe zu Moral oder Entschlusskraft."
  },
  {
    "name": "Die kleine Tempelgemeinschaft",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn lokale Geistliche, Zuflucht oder das Vertrauen einfacher Gläubiger dir helfen.",
    "vulnerability": "Wird ein Heiligtum geschändet oder seine Schutzsuchenden missbraucht, erhältst du -10 auf die erste Probe zu Nachsicht oder stillem Zusehen."
  },
  {
    "name": "Das fahrende Volk",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn Reisekontakte, Schaustellerkunst oder improvisierte Lagergemeinschaft von Nutzen sind.",
    "vulnerability": "Unter starrem Protokoll, Sesshaftigkeitszwang oder offener Verachtung für Fahrende erhältst du -10 auf die nächtse Probe."
  },
  {
    "name": "Die Gilde deines Handwerks",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn Zunftwissen, Werkstattkontakte oder der Ruf deines Standes helfen.",
    "vulnerability": "Wird dein Handwerk als wertlos, unehrenhaft oder betrügerisch behandelt, erhältst du -10 auf die erste soziale Probe."
  },
  {
    "name": "Die Kinder des Viertels",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn Straßenwissen, Verstecke oder das Vertrauen von Kindern dir helfen.",
    "vulnerability": "Wird ein Kind bedroht, missbraucht oder für fremde Zwecke benutzt, erhältst du -10 auf die erste Probe zu Zurückhaltung."
  },
  {
    "name": "Die Grenzer von Büttingen",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn Grenzdienst, Wachsamkeit oder erschöpfte Soldatenlogik den Ausschlag geben.",
    "vulnerability": "Bei Feigheit vor der Front oder fahrlässiger Preisgabe einer Stellung erhältst du -10 auf die erste Probe zu Selbstachtung oder Kameradschaft."
  },
  {
    "name": "Der Orden eines Heilers",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn Heilwissen, Sanitätsdisziplin oder der Schutz Verwundeter im Mittelpunkt steht.",
    "vulnerability": "Verweigert jemand Hilfe aus Grausamkeit oder Eigennutz, erhältst du -10 auf die erste Probe zu Gleichgültigkeit oder harter Priorisierung."
  },
  {
    "name": "Die Bruderschaft des Rechten Weges",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn geheime Hilfe, eingeschworene Loyalität oder alte Schuldverhältnisse tragen.",
    "vulnerability": "Wenn eine offene Forderung der Bruderschaft gegen dein Gewissen steht, erhältst du -10 auf die erste Probe zu Klarheit oder Unabhängigkeit."
  },
  {
    "name": "Ein Zwergenclan der Fraxut",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn alte Eide, Steinwege oder zähe Clanloyalität dir helfen.",
    "vulnerability": "Wird ein Schwur leichtfertig gebrochen oder zwergische Ehre verlacht, erhältst du -10 auf die erste Probe zu Nachsicht oder schnellem Einlenken."
  },
  {
    "name": "Die Schattenjäger",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn nächtige Jagd, Monsterwissen oder koordinierte Verfolgung in der Dunkelheit entscheidend sind.",
    "vulnerability": "In echter Dunkelheit oder bei Anzeichen von Schattenkreaturen erhältst du -10 auf die erste Probe zu Entspannung oder falscher Sicherheit."
  },
  {
    "name": "Das verlassene Gutshaus",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn Besitzansprüche, Familiengeheimnisse oder alte Gemäuer deines Hauses helfen.",
    "vulnerability": "Wird dein Erbe verhöhnt, geplündert oder entweiht, erhältst du -10 auf die erste Probe."
  },
  {
    "name": "Das vergessene Schlachtfeld",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn du Gefahren eines alten Kampfplatzes liest oder den Gefallenen Ehre erweist.",
    "vulnerability": "Wird das Opfer der Toten verspottet oder geplündert, erhältst du -10 auf die nächste Probe."
  },
  {
    "name": "Die alte Garnison",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn Festungsroutine, Restbestände oder Loyalität alter Besatzungen dir helfen.",
    "vulnerability": "Wird eine Stellung unnötig aufgegeben oder verraten, erhältst du -10 auf die erste Probe zu Rückzug oder Kapitulation."
  },
  {
    "name": "Der Schrein",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn Glaube, Schutzriten oder stille Andacht gegen das Böse zutreffen.",
    "vulnerability": "In bewusst entweihten oder verfinsterten Kultstätten erhältst du -10 auf die erste Probe."
  },
  {
    "name": "Der letzte Brief",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn Erinnerung, Schuld oder ein unerfüllter Auftrag dir Entschlusskraft gibt.",
    "vulnerability": "Wirst du mit der Wahrheit hinter dem Brief oder seinem Verlust konfrontiert, erhältst du -10 auf die erste Probe."
  },
  {
    "name": "Die verlorene Bibliothek",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn Bücherrettung, Archivdenken oder verborgene Gelehrsamkeit entscheidend sind.",
    "vulnerability": "Wird Wissen mutwillig verbrannt, verfälscht oder verboten, erhältst du -10 auf die erste Probe zu Beherrschung oder Kompromiss."
  },
  {
    "name": "Der schwarze Turm Yadosiens",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn düstere Visionen, verbotene Hinweise oder okkulte Aufmerksamkeit dir nützen.",
    "vulnerability": "Wenn Träume oder Zeichen des Turms dich heimsuchen, erhältst du -10 auf die erste Probe zu Schlaf, Ruhe oder geistiger Abschirmung."
  },
  {
    "name": "Die Glocke von Thenon",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn Pflichtgefühl, bürgerliche Ordnung oder das Sammeln der Entschlossenen gefragt ist.",
    "vulnerability": "Beim Klang großer Alarmglocken oder Massenpanik erhältst du -10 auf die erste Probe zu Ruhe oder heimlicher Bewegung."
  },
  {
    "name": "Der letzte Garten",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn du Leben bewahrst, einen Ort der Ruhe verteidigst oder Verwüstung entgegenwirkst.",
    "vulnerability": "In mutwillig verwüsteten, verbrannten oder entweihten Zufluchtsorten erhältst du -10 auf die erste Probe zu Hoffnung oder Nachsicht."
  },
  {
    "name": "Der verbotene Geliebte",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn Sehnsucht, Opferbereitschaft oder geheime Treffen deinen Entschluss stärken.",
    "vulnerability": "Wird deine verbotene Liebe bloßgestellt oder verspottet, erhältst du -10 auf die erste Probe zu Fassung oder gesellschaftlicher Tarnung."
  },
  {
    "name": "Das Lied der Heimat",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn ein Lied, eine Geschichte oder ein alter Brauch Mut und Zusammenhalt stiftet.",
    "vulnerability": "Wird die Kultur deines Volkes verhöhnt oder ausgelöscht, erhältst du -10 auf die erste Probe zu stiller Duldung oder sachlicher Distanz."
  },
  {
    "name": "Die freien Götter",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn uralte Riten, Opferzeichen oder das Wissen um einen bestimmten Gott dir helfen.",
    "vulnerability": "Wird dein alter Glaube als Aberglaube verspottet oder entweiht, erhältst du -10 auf die erste Probe zu Zurückhaltung oder Zweifel."
  },
  {
    "name": "Ein Vertrauter der Titanen",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn Visionen, titanische Eingebungen oder unheimliche Vorzeichen gedeutet werden müssen.",
    "vulnerability": "Wenn titanische Zeichen widersprüchlich oder verstörend werden, erhältst du -10 auf die erste Probe zu klarer weltlicher Vernunft."
  },
  {
    "name": "Die verbotene Liebe zu einem Nichtmenschen",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn du Vorurteile überwindest, zwischen Kulturen vermittelst oder für diese Liebe einstehst.",
    "vulnerability": "Bei offenem Rassismus, religiöser Verurteilung oder Schande gegen diese Verbindung erhältst du -10 auf die erste Probe zu Fassung oder Tarnung."
  },
  {
    "name": "Das Banner des gefallenen Hauptmanns",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn du einen letzten Auftrag erfüllst, andere sammelst oder unter einem Zeichen standhältst.",
    "vulnerability": "Wird das Banner entehrt, verloren oder zum Rückzug gezwungen, erhältst du -10 auf die erste Probe zu Moral oder Gehorsam."
  },
  {
    "name": "Die Stimmen der Ahnen",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn Ahnenrat, Erinnerung oder alte Familienweisheit dir Richtung geben.",
    "vulnerability": "Wenn die Ahnen schweigen, sich widersprechen oder dich warnen, erhältst du -10 auf die erste Probe zu Selbstvertrauen oder entschlossener Eile."
  },
  {
    "name": "Das Licht vor der Dunkelheit",
    "benefit": "Einmal pro Szene erhältst du +10 auf eine Probe, wenn du trotz Schrecken Hoffnung verteidigst oder andere gegen Verzweiflung aufrichtest.",
    "vulnerability": "Bei überwältigender Finsternis, Ausweglosigkeit oder Zeichen der Schattenwelt erhältst du -10 auf die erste Probe zu Mut oder innerer Ruhe."
  }
] satisfies MarkRule[];
