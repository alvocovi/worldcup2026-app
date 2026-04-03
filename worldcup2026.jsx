import { useState, useMemo, useRef, useEffect } from "react";

// ─── BROADCAST DATA ────────────────────────────────────────────────────────────
const BROADCAST_DATA = {
  US: { country: "United States", flag: "🇺🇸", region: "North America", tv: ["FOX Sports", "FOX", "Telemundo"], streaming: ["FOX Sports App", "FOX.com", "Peacock (Spanish)"], fta: true },
  CA: { country: "Canada", flag: "🇨🇦", region: "North America", tv: ["CTV", "TSN", "RDS"], streaming: ["TSN+", "RDS App", "CTV App"], fta: true },
  MX: { country: "Mexico", flag: "🇲🇽", region: "North America", tv: ["Televisa", "TV Azteca", "Canal 5"], streaming: ["ViX+", "Azteca Deportes App"], fta: true },
  BR: { country: "Brazil", flag: "🇧🇷", region: "South America", tv: ["TV Globo", "SBT", "N Sports"], streaming: ["Globoplay", "CazéTV (YouTube – free, all matches)", "DAZN"], fta: true },
  AR: { country: "Argentina", flag: "🇦🇷", region: "South America", tv: ["Telefe", "TV Pública", "TyC Sports"], streaming: ["Telefe App", "TyC Sports App"], fta: true },
  CO: { country: "Colombia", flag: "🇨🇴", region: "South America", tv: ["Caracol TV", "Canal RCN", "Win Sports"], streaming: ["Caracol Play", "RCN App"], fta: true },
  CL: { country: "Chile", flag: "🇨🇱", region: "South America", tv: ["Chilevisión"], streaming: ["Chilevisión App"], fta: true },
  PE: { country: "Peru", flag: "🇵🇪", region: "South America", tv: ["América Televisión"], streaming: ["América TVGO"], fta: true },
  UY: { country: "Uruguay", flag: "🇺🇾", region: "South America", tv: ["Canal 5", "Antel TV"], streaming: ["Canal 5 App"], fta: true },
  EC: { country: "Ecuador", flag: "🇪🇨", region: "South America", tv: ["Teleamazonas"], streaming: ["Teleamazonas App"], fta: true },
  PY: { country: "Paraguay", flag: "🇵🇾", region: "South America", tv: ["SNT", "Trece", "Unicanal", "Telefuturo", "Tigo Sports", "Movistar Deportes"], streaming: ["Tigo Sports App"], fta: true },
  VE: { country: "Venezuela", flag: "🇻🇪", region: "South America", tv: ["Televen"], streaming: ["Televen App"], fta: true },
  GB: { country: "United Kingdom", flag: "🇬🇧", region: "Europe", tv: ["BBC One", "BBC Two", "ITV", "ITV4"], streaming: ["BBC iPlayer", "ITVX"], fta: true },
  DE: { country: "Germany", flag: "🇩🇪", region: "Europe", tv: ["ARD", "ZDF"], streaming: ["ARD Mediathek", "ZDF Mediathek", "MagentaTV (subscription)"], fta: true },
  FR: { country: "France", flag: "🇫🇷", region: "Europe", tv: ["M6", "W9"], streaming: ["6play (free)", "beIN Sports (subscription)"], fta: true },
  ES: { country: "Spain", flag: "🇪🇸", region: "Europe", tv: ["La 1 (RTVE)", "La 2"], streaming: ["RTVE Play", "DAZN (subscription)"], fta: true },
  IT: { country: "Italy", flag: "🇮🇹", region: "Europe", tv: ["RAI 1", "RAI 2"], streaming: ["RaiPlay", "DAZN (subscription)"], fta: true },
  PT: { country: "Portugal", flag: "🇵🇹", region: "Europe", tv: ["Sport TV"], streaming: ["Sport TV+", "LiveModeTV / CazéTV (1 match/day free)"], fta: false },
  NL: { country: "Netherlands", flag: "🇳🇱", region: "Europe", tv: ["NPO 1", "NPO 3 (NOS)"], streaming: ["NOS.nl", "NPO Start"], fta: true },
  BE: { country: "Belgium", flag: "🇧🇪", region: "Europe", tv: ["VRT (Flemish)", "RTBF (French)"], streaming: ["VRT Max", "Auvio (RTBF)"], fta: true },
  AT: { country: "Austria", flag: "🇦🇹", region: "Europe", tv: ["ORF", "ServusTV"], streaming: ["ORF TVthek", "ServusTV Online"], fta: true },
  CH: { country: "Switzerland", flag: "🇨🇭", region: "Europe", tv: ["SRF (German)", "RTS (French)", "RSI (Italian)"], streaming: ["Play SRF", "Play RTS", "Play RSI"], fta: true },
  SE: { country: "Sweden", flag: "🇸🇪", region: "Europe", tv: ["SVT", "TV4"], streaming: ["SVT Play", "TV4 Play"], fta: true },
  NO: { country: "Norway", flag: "🇳🇴", region: "Europe", tv: ["NRK", "TV 2"], streaming: ["NRK TV", "TV 2 Play"], fta: true },
  DK: { country: "Denmark", flag: "🇩🇰", region: "Europe", tv: ["DR", "TV 2"], streaming: ["DR TV", "TV 2 Play"], fta: true },
  FI: { country: "Finland", flag: "🇫🇮", region: "Europe", tv: ["Yle", "MTV3"], streaming: ["Yle Areena", "MTV Katsomo"], fta: true },
  PL: { country: "Poland", flag: "🇵🇱", region: "Europe", tv: ["TVP"], streaming: ["TVP VOD"], fta: true },
  IE: { country: "Ireland", flag: "🇮🇪", region: "Europe", tv: ["RTÉ", "RTÉ 2"], streaming: ["RTÉ Player"], fta: true },
  HR: { country: "Croatia", flag: "🇭🇷", region: "Europe", tv: ["HRT"], streaming: ["HRT+"], fta: true },
  RS: { country: "Serbia", flag: "🇷🇸", region: "Europe", tv: ["RTS", "Arena Sport"], streaming: ["RTS Play", "Arena Sport App"], fta: true },
  GR: { country: "Greece", flag: "🇬🇷", region: "Europe", tv: ["ERT"], streaming: ["ERT.gr"], fta: true },
  TR: { country: "Turkey", flag: "🇹🇷", region: "Europe", tv: ["TRT"], streaming: ["TRT İzle"], fta: true },
  UA: { country: "Ukraine", flag: "🇺🇦", region: "Europe", tv: ["MEGOGO"], streaming: ["MEGOGO (subscription)"], fta: false },
  CZ: { country: "Czech Republic", flag: "🇨🇿", region: "Europe", tv: ["ČT Sport (Czech TV)", "TV Nova"], streaming: ["ČT Sport+", "Nova Sport App"], fta: true },
  HU: { country: "Hungary", flag: "🇭🇺", region: "Europe", tv: ["M1", "M4 Sport (MTVA)"], streaming: ["Médiaklikk"], fta: true },
  BG: { country: "Bulgaria", flag: "🇧🇬", region: "Europe", tv: ["BNT"], streaming: ["BNT.bg"], fta: true },
  SK: { country: "Slovakia", flag: "🇸🇰", region: "Europe", tv: ["RTVS (Jednotka)"], streaming: ["RTVS Online"], fta: true },
  SI: { country: "Slovenia", flag: "🇸🇮", region: "Europe", tv: ["Arena Sport"], streaming: ["Arena Sport App"], fta: false },
  RU: { country: "Russia", flag: "🇷🇺", region: "Europe", tv: ["Match TV"], streaming: ["Match! Premier"], fta: true },
  IS: { country: "Iceland", flag: "🇮🇸", region: "Europe", tv: ["RÚV"], streaming: ["RÚV App"], fta: true },
  AL: { country: "Albania", flag: "🇦🇱", region: "Europe", tv: ["TV Klan"], streaming: ["Klan Plus"], fta: true },
  BA: { country: "Bosnia & Herzegovina", flag: "🇧🇦", region: "Europe", tv: ["Arena Sport"], streaming: ["Arena Sport App"], fta: false },
  MK: { country: "North Macedonia", flag: "🇲🇰", region: "Europe", tv: ["Arena Sport"], streaming: ["Arena Sport App"], fta: false },
  XK: { country: "Kosovo", flag: "🇽🇰", region: "Europe", tv: ["RTK", "TV Vala", "Arena Sport"], streaming: ["Arena Sport App"], fta: true },
  GE: { country: "Georgia", flag: "🇬🇪", region: "Europe", tv: ["GPB (Georgian Public Broadcasting)"], streaming: ["GPB.ge"], fta: true },
  AM: { country: "Armenia", flag: "🇦🇲", region: "Europe", tv: ["AMPTV"], streaming: ["Armvision"], fta: true },
  AZ: { country: "Azerbaijan", flag: "🇦🇿", region: "Europe", tv: ["İctimai TV"], streaming: ["ictimai.tv"], fta: true },
  JP: { country: "Japan", flag: "🇯🇵", region: "Asia", tv: ["NHK", "Nippon TV", "Fuji TV"], streaming: ["DAZN (all 104 matches)", "NHK Plus"], fta: true },
  KR: { country: "South Korea", flag: "🇰🇷", region: "Asia", tv: ["JTBC"], streaming: ["NAVER Sports", "CHZZK", "JTBC+"], fta: false },
  CN: { country: "China", flag: "🇨🇳", region: "Asia", tv: ["CCTV (CMG)"], streaming: ["CCTV.com", "Migu Video", "CMG+ App"], fta: true },
  AU: { country: "Australia", flag: "🇦🇺", region: "Asia Pacific", tv: ["SBS", "SBS Viceland"], streaming: ["SBS On Demand (free)"], fta: true },
  NZ: { country: "New Zealand", flag: "🇳🇿", region: "Asia Pacific", tv: ["TVNZ 1"], streaming: ["TVNZ+"], fta: true },
  IN: { country: "India", flag: "🇮🇳", region: "Asia", tv: ["Sports18"], streaming: ["JioCinema"], fta: false },
  SG: { country: "Singapore", flag: "🇸🇬", region: "Asia", tv: ["Mediacorp (28 matches free-to-air)"], streaming: ["meWATCH", "Singtel TV Go (full)"], fta: true },
  MY: { country: "Malaysia", flag: "🇲🇾", region: "Asia", tv: ["RTM", "Astro SuperSport"], streaming: ["Astro Go"], fta: true },
  ID: { country: "Indonesia", flag: "🇮🇩", region: "Asia", tv: ["TVRI"], streaming: ["Vidio.com"], fta: true },
  TH: { country: "Thailand", flag: "🇹🇭", region: "Asia", tv: ["True Visions", "Workpoint"], streaming: ["True ID"], fta: false },
  VN: { country: "Vietnam", flag: "🇻🇳", region: "Asia", tv: ["VTV"], streaming: ["VTV Go", "FPT Play"], fta: true },
  PH: { country: "Philippines", flag: "🇵🇭", region: "Asia", tv: ["GMA Network"], streaming: ["GMA Pinoy TV"], fta: true },
  HK: { country: "Hong Kong", flag: "🇭🇰", region: "Asia", tv: ["Now TV (PCCW)"], streaming: ["Now E"], fta: false },
  TW: { country: "Taiwan", flag: "🇹🇼", region: "Asia", tv: ["ELTA Sports", "EBC", "TTV"], streaming: ["ELTA Online"], fta: true },
  AF: { country: "Afghanistan", flag: "🇦🇫", region: "Asia", tv: ["Ariana TV (ATN)"], streaming: ["Ariana App"], fta: true },
  MN: { country: "Mongolia", flag: "🇲🇳", region: "Asia", tv: ["MNB", "EduTV", "NTV", "Suld TV"], streaming: ["mobihome VOO"], fta: true },
  SA: { country: "Saudi Arabia", flag: "🇸🇦", region: "Middle East", tv: ["beIN Sports", "Saudi Sports TV"], streaming: ["beIN Sports Connect", "TOD"], fta: true },
  AE: { country: "UAE", flag: "🇦🇪", region: "Middle East", tv: ["beIN Sports"], streaming: ["beIN Sports Connect", "TOD"], fta: false },
  QA: { country: "Qatar", flag: "🇶🇦", region: "Middle East", tv: ["beIN Sports (free-to-air in Qatar)"], streaming: ["beIN Sports Connect", "TOD"], fta: true },
  EG: { country: "Egypt", flag: "🇪🇬", region: "Middle East", tv: ["beIN Sports"], streaming: ["beIN Sports Connect", "TOD"], fta: false },
  MA: { country: "Morocco", flag: "🇲🇦", region: "Middle East", tv: ["beIN Sports", "2M (select matches)"], streaming: ["beIN Sports Connect", "TOD"], fta: true },
  TN: { country: "Tunisia", flag: "🇹🇳", region: "Middle East", tv: ["Wataniya Sport", "beIN Sports"], streaming: ["Wataniya App", "beIN Connect"], fta: false },
  DZ: { country: "Algeria", flag: "🇩🇿", region: "Middle East", tv: ["ENTV", "beIN Sports"], streaming: ["Algérie Sports App", "beIN Connect"], fta: true },
  IR: { country: "Iran", flag: "🇮🇷", region: "Middle East", tv: ["IRIB TV3", "Persiana Sports"], streaming: ["IRIB VOD"], fta: true },
  IQ: { country: "Iraq", flag: "🇮🇶", region: "Middle East", tv: ["beIN Sports", "IMC"], streaming: ["beIN Connect", "TOD"], fta: true },
  IL: { country: "Israel", flag: "🇮🇱", region: "Middle East", tv: ["KAN (Public)", "Sports 5"], streaming: ["KAN.org.il", "Sports 5 Plus"], fta: true },
  JO: { country: "Jordan", flag: "🇯🇴", region: "Middle East", tv: ["beIN Sports", "Jordan TV"], streaming: ["beIN Connect", "TOD"], fta: true },
  ZA: { country: "South Africa", flag: "🇿🇦", region: "Africa", tv: ["SABC", "SuperSport"], streaming: ["SABC Sport App", "DStv App"], fta: true },
  NG: { country: "Nigeria", flag: "🇳🇬", region: "Africa", tv: ["NTA", "SuperSport", "New World TV"], streaming: ["SuperSport App", "DStv App"], fta: true },
  GH: { country: "Ghana", flag: "🇬🇭", region: "Africa", tv: ["GTV Sports+", "SuperSport"], streaming: ["SuperSport App"], fta: true },
  KE: { country: "Kenya", flag: "🇰🇪", region: "Africa", tv: ["KBC", "SuperSport", "New World TV"], streaming: ["SuperSport App", "DStv App"], fta: true },
  ET: { country: "Ethiopia", flag: "🇪🇹", region: "Africa", tv: ["EBC", "SuperSport"], streaming: ["SuperSport App"], fta: true },
  SN: { country: "Senegal", flag: "🇸🇳", region: "Africa", tv: ["RTS Sénégal", "New World TV"], streaming: ["New World TV App"], fta: true },
  CI: { country: "Côte d'Ivoire", flag: "🇨🇮", region: "Africa", tv: ["RTI", "New World TV"], streaming: ["New World TV App"], fta: true },
  CM: { country: "Cameroon", flag: "🇨🇲", region: "Africa", tv: ["CRTV", "SuperSport"], streaming: ["SuperSport App"], fta: true },
  CD: { country: "DR Congo", flag: "🇨🇩", region: "Africa", tv: ["RTNC", "SuperSport"], streaming: ["SuperSport App"], fta: true },
  TZ: { country: "Tanzania", flag: "🇹🇿", region: "Africa", tv: ["TBC", "SuperSport", "New World TV"], streaming: ["SuperSport App"], fta: true },
  CR: { country: "Costa Rica", flag: "🇨🇷", region: "Central America", tv: ["Teletica", "Tigo Sports"], streaming: ["Teletica.com", "Tigo Sports App"], fta: true },
  SV: { country: "El Salvador", flag: "🇸🇻", region: "Central America", tv: ["Telecorporación Salvadoreña", "Tigo Sports"], streaming: ["Tigo Sports App"], fta: true },
  GT: { country: "Guatemala", flag: "🇬🇹", region: "Central America", tv: ["Albavisión", "Tigo Sports"], streaming: ["Tigo Sports App"], fta: true },
  HN: { country: "Honduras", flag: "🇭🇳", region: "Central America", tv: ["Televicentro", "Tigo Sports"], streaming: ["Tigo Sports App"], fta: true },
  NI: { country: "Nicaragua", flag: "🇳🇮", region: "Central America", tv: ["Grupo Ratensa", "Tigo Sports"], streaming: ["Tigo Sports App"], fta: true },
  PA: { country: "Panama", flag: "🇵🇦", region: "Central America", tv: ["RPC TV", "Telemetro", "TVN", "TVMax", "Tigo Sports"], streaming: ["Tigo Sports App"], fta: true },
  KZ: { country: "Kazakhstan", flag: "🇰🇿", region: "Central Asia", tv: ["QAZTRK"], streaming: ["QAZTRK App"], fta: true },
  UZ: { country: "Uzbekistan", flag: "🇺🇿", region: "Central Asia", tv: ["Zo'r TV"], streaming: ["Zo'r TV App"], fta: true },
  KG: { country: "Kyrgyzstan", flag: "🇰🇬", region: "Central Asia", tv: ["KTRK"], streaming: ["KTRK App"], fta: true },
  TJ: { country: "Tajikistan", flag: "🇹🇯", region: "Central Asia", tv: ["Varzish TV", "TV Football"], streaming: ["Varzish TV App"], fta: false },
  TM: { country: "Turkmenistan", flag: "🇹🇲", region: "Central Asia", tv: ["Turkmenistan Sport"], streaming: ["TM Sport App"], fta: true },
};

// ─── MATCH DATA ─────────────────────────────────────────────────────────────────
const MATCHES = [
  // ── GROUP STAGE ──
  // Group A matchday 1
  { id: 1, phase: "Group A", md: 1, utc: "2026-06-11T19:00:00Z", home: "Mexico", away: "South Africa", venue: "Estadio Azteca", city: "Mexico City, MEX" },
  { id: 2, phase: "Group A", md: 1, utc: "2026-06-12T02:00:00Z", home: "South Korea", away: "Czech Republic", venue: "Estadio Akron", city: "Zapopan, MEX" },
  // Group B matchday 1
  { id: 3, phase: "Group B", md: 1, utc: "2026-06-12T19:00:00Z", home: "Canada", away: "Bosnia & Herz.", venue: "BMO Field", city: "Toronto, CAN" },
  { id: 4, phase: "Group B", md: 1, utc: "2026-06-13T19:00:00Z", home: "Qatar", away: "Switzerland", venue: "Levi's Stadium", city: "Santa Clara, USA" },
  // Group C matchday 1
  { id: 5, phase: "Group C", md: 1, utc: "2026-06-13T22:00:00Z", home: "Brazil", away: "Morocco", venue: "MetLife Stadium", city: "East Rutherford, USA" },
  { id: 6, phase: "Group C", md: 1, utc: "2026-06-14T01:00:00Z", home: "Haiti", away: "Scotland", venue: "Gillette Stadium", city: "Foxborough, USA" },
  // Group D matchday 1
  { id: 7, phase: "Group D", md: 1, utc: "2026-06-13T01:00:00Z", home: "USA", away: "Paraguay", venue: "SoFi Stadium", city: "Los Angeles, USA" },
  { id: 8, phase: "Group D", md: 1, utc: "2026-06-14T04:00:00Z", home: "Australia", away: "Turkey", venue: "BC Place", city: "Vancouver, CAN" },
  // Group E matchday 1
  { id: 9, phase: "Group E", md: 1, utc: "2026-06-14T17:00:00Z", home: "Germany", away: "Curaçao", venue: "NRG Stadium", city: "Houston, USA" },
  { id: 10, phase: "Group E", md: 1, utc: "2026-06-14T23:00:00Z", home: "Côte d'Ivoire", away: "Ecuador", venue: "Lincoln Financial Field", city: "Philadelphia, USA" },
  // Group F matchday 1
  { id: 11, phase: "Group F", md: 1, utc: "2026-06-14T20:00:00Z", home: "Netherlands", away: "Japan", venue: "AT&T Stadium", city: "Arlington, USA" },
  { id: 12, phase: "Group F", md: 1, utc: "2026-06-15T02:00:00Z", home: "Sweden", away: "Tunisia", venue: "Estadio BBVA", city: "Guadalupe, MEX" },
  // Group G matchday 1
  { id: 13, phase: "Group G", md: 1, utc: "2026-06-15T19:00:00Z", home: "Belgium", away: "Egypt", venue: "Lumen Field", city: "Seattle, USA" },
  { id: 14, phase: "Group G", md: 1, utc: "2026-06-16T01:00:00Z", home: "Iran", away: "New Zealand", venue: "SoFi Stadium", city: "Los Angeles, USA" },
  // Group H matchday 1
  { id: 15, phase: "Group H", md: 1, utc: "2026-06-15T16:00:00Z", home: "Spain", away: "Cabo Verde", venue: "Mercedes-Benz Stadium", city: "Atlanta, USA" },
  { id: 16, phase: "Group H", md: 1, utc: "2026-06-15T22:00:00Z", home: "Saudi Arabia", away: "Uruguay", venue: "Hard Rock Stadium", city: "Miami Gardens, USA" },
  // Group I matchday 1
  { id: 17, phase: "Group I", md: 1, utc: "2026-06-16T19:00:00Z", home: "France", away: "Senegal", venue: "MetLife Stadium", city: "East Rutherford, USA" },
  { id: 18, phase: "Group I", md: 1, utc: "2026-06-16T22:00:00Z", home: "Iraq", away: "Norway", venue: "Gillette Stadium", city: "Foxborough, USA" },
  // Group J matchday 1
  { id: 19, phase: "Group J", md: 1, utc: "2026-06-17T01:00:00Z", home: "Argentina", away: "Algeria", venue: "Children's Mercy Park", city: "Kansas City, USA" },
  { id: 20, phase: "Group J", md: 1, utc: "2026-06-17T04:00:00Z", home: "Austria", away: "Jordan", venue: "Levi's Stadium", city: "Santa Clara, USA" },
  // Group K matchday 1
  { id: 21, phase: "Group K", md: 1, utc: "2026-06-17T17:00:00Z", home: "Portugal", away: "DR Congo", venue: "NRG Stadium", city: "Houston, USA" },
  { id: 22, phase: "Group K", md: 1, utc: "2026-06-18T02:00:00Z", home: "Uzbekistan", away: "Colombia", venue: "Estadio Azteca", city: "Mexico City, MEX" },
  // Group L matchday 1
  { id: 23, phase: "Group L", md: 1, utc: "2026-06-17T20:00:00Z", home: "England", away: "Croatia", venue: "AT&T Stadium", city: "Arlington, USA" },
  { id: 24, phase: "Group L", md: 1, utc: "2026-06-17T23:00:00Z", home: "Ghana", away: "Panama", venue: "BMO Field", city: "Toronto, CAN" },
  // ── MATCHDAY 2 ──
  { id: 25, phase: "Group A", md: 2, utc: "2026-06-18T16:00:00Z", home: "Czech Republic", away: "South Africa", venue: "Mercedes-Benz Stadium", city: "Atlanta, USA" },
  { id: 26, phase: "Group A", md: 2, utc: "2026-06-19T01:00:00Z", home: "Mexico", away: "South Korea", venue: "Estadio Akron", city: "Zapopan, MEX" },
  { id: 27, phase: "Group B", md: 2, utc: "2026-06-18T19:00:00Z", home: "Switzerland", away: "Bosnia & Herz.", venue: "SoFi Stadium", city: "Los Angeles, USA" },
  { id: 28, phase: "Group B", md: 2, utc: "2026-06-18T22:00:00Z", home: "Canada", away: "Qatar", venue: "BC Place", city: "Vancouver, CAN" },
  { id: 29, phase: "Group C", md: 2, utc: "2026-06-19T22:00:00Z", home: "Scotland", away: "Morocco", venue: "Gillette Stadium", city: "Foxborough, USA" },
  { id: 30, phase: "Group C", md: 2, utc: "2026-06-20T01:00:00Z", home: "Brazil", away: "Haiti", venue: "Lincoln Financial Field", city: "Philadelphia, USA" },
  { id: 31, phase: "Group D", md: 2, utc: "2026-06-19T19:00:00Z", home: "USA", away: "Australia", venue: "Lumen Field", city: "Seattle, USA" },
  { id: 32, phase: "Group D", md: 2, utc: "2026-06-20T04:00:00Z", home: "Turkey", away: "Paraguay", venue: "Levi's Stadium", city: "Santa Clara, USA" },
  { id: 33, phase: "Group E", md: 2, utc: "2026-06-20T17:00:00Z", home: "Germany", away: "Côte d'Ivoire", venue: "BMO Field", city: "Toronto, CAN" },
  { id: 34, phase: "Group E", md: 2, utc: "2026-06-21T00:00:00Z", home: "Ecuador", away: "Curaçao", venue: "Children's Mercy Park", city: "Kansas City, USA" },
  { id: 35, phase: "Group F", md: 2, utc: "2026-06-20T20:00:00Z", home: "Netherlands", away: "Sweden", venue: "NRG Stadium", city: "Houston, USA" },
  { id: 36, phase: "Group F", md: 2, utc: "2026-06-21T04:00:00Z", home: "Tunisia", away: "Japan", venue: "Estadio BBVA", city: "Guadalupe, MEX" },
  { id: 37, phase: "Group G", md: 2, utc: "2026-06-21T19:00:00Z", home: "Belgium", away: "Iran", venue: "SoFi Stadium", city: "Los Angeles, USA" },
  { id: 38, phase: "Group G", md: 2, utc: "2026-06-22T01:00:00Z", home: "New Zealand", away: "Egypt", venue: "BC Place", city: "Vancouver, CAN" },
  { id: 39, phase: "Group H", md: 2, utc: "2026-06-21T16:00:00Z", home: "Spain", away: "Saudi Arabia", venue: "Mercedes-Benz Stadium", city: "Atlanta, USA" },
  { id: 40, phase: "Group H", md: 2, utc: "2026-06-21T22:00:00Z", home: "Uruguay", away: "Cabo Verde", venue: "Hard Rock Stadium", city: "Miami Gardens, USA" },
  { id: 41, phase: "Group I", md: 2, utc: "2026-06-22T21:00:00Z", home: "France", away: "Iraq", venue: "Lincoln Financial Field", city: "Philadelphia, USA" },
  { id: 42, phase: "Group I", md: 2, utc: "2026-06-23T00:00:00Z", home: "Norway", away: "Senegal", venue: "BMO Field", city: "Toronto, CAN" },
  { id: 43, phase: "Group J", md: 2, utc: "2026-06-22T17:00:00Z", home: "Argentina", away: "Austria", venue: "AT&T Stadium", city: "Arlington, USA" },
  { id: 44, phase: "Group J", md: 2, utc: "2026-06-23T03:00:00Z", home: "Jordan", away: "Algeria", venue: "Levi's Stadium", city: "Santa Clara, USA" },
  { id: 45, phase: "Group K", md: 2, utc: "2026-06-23T17:00:00Z", home: "Portugal", away: "Uzbekistan", venue: "NRG Stadium", city: "Houston, USA" },
  { id: 46, phase: "Group K", md: 2, utc: "2026-06-24T02:00:00Z", home: "Colombia", away: "DR Congo", venue: "Estadio Akron", city: "Zapopan, MEX" },
  { id: 47, phase: "Group L", md: 2, utc: "2026-06-23T20:00:00Z", home: "England", away: "Ghana", venue: "Gillette Stadium", city: "Foxborough, USA" },
  { id: 48, phase: "Group L", md: 2, utc: "2026-06-23T23:00:00Z", home: "Panama", away: "Croatia", venue: "Gillette Stadium", city: "Foxborough, USA" },
  // ── MATCHDAY 3 (simultaneous) ──
  { id: 49, phase: "Group A", md: 3, utc: "2026-06-25T01:00:00Z", home: "South Africa", away: "South Korea", venue: "Estadio BBVA", city: "Guadalupe, MEX" },
  { id: 50, phase: "Group A", md: 3, utc: "2026-06-25T01:00:00Z", home: "Czech Republic", away: "Mexico", venue: "Estadio Azteca", city: "Mexico City, MEX" },
  { id: 51, phase: "Group B", md: 3, utc: "2026-06-24T19:00:00Z", home: "Switzerland", away: "Canada", venue: "BC Place", city: "Vancouver, CAN" },
  { id: 52, phase: "Group B", md: 3, utc: "2026-06-24T19:00:00Z", home: "Bosnia & Herz.", away: "Qatar", venue: "Lumen Field", city: "Seattle, USA" },
  { id: 53, phase: "Group C", md: 3, utc: "2026-06-24T22:00:00Z", home: "Morocco", away: "Haiti", venue: "Mercedes-Benz Stadium", city: "Atlanta, USA" },
  { id: 54, phase: "Group C", md: 3, utc: "2026-06-24T22:00:00Z", home: "Scotland", away: "Brazil", venue: "Hard Rock Stadium", city: "Miami Gardens, USA" },
  { id: 55, phase: "Group D", md: 3, utc: "2026-06-26T02:00:00Z", home: "Turkey", away: "USA", venue: "SoFi Stadium", city: "Los Angeles, USA" },
  { id: 56, phase: "Group D", md: 3, utc: "2026-06-26T02:00:00Z", home: "Paraguay", away: "Australia", venue: "Levi's Stadium", city: "Santa Clara, USA" },
  { id: 57, phase: "Group E", md: 3, utc: "2026-06-25T20:00:00Z", home: "Curaçao", away: "Côte d'Ivoire", venue: "Lincoln Financial Field", city: "Philadelphia, USA" },
  { id: 58, phase: "Group E", md: 3, utc: "2026-06-25T20:00:00Z", home: "Ecuador", away: "Germany", venue: "MetLife Stadium", city: "East Rutherford, USA" },
  { id: 59, phase: "Group F", md: 3, utc: "2026-06-25T23:00:00Z", home: "Tunisia", away: "Netherlands", venue: "Children's Mercy Park", city: "Kansas City, USA" },
  { id: 60, phase: "Group F", md: 3, utc: "2026-06-25T23:00:00Z", home: "Japan", away: "Sweden", venue: "AT&T Stadium", city: "Arlington, USA" },
  { id: 61, phase: "Group G", md: 3, utc: "2026-06-27T03:00:00Z", home: "New Zealand", away: "Belgium", venue: "BC Place", city: "Vancouver, CAN" },
  { id: 62, phase: "Group G", md: 3, utc: "2026-06-27T03:00:00Z", home: "Egypt", away: "Iran", venue: "Lumen Field", city: "Seattle, USA" },
  { id: 63, phase: "Group H", md: 3, utc: "2026-06-27T00:00:00Z", home: "Cabo Verde", away: "Saudi Arabia", venue: "NRG Stadium", city: "Houston, USA" },
  { id: 64, phase: "Group H", md: 3, utc: "2026-06-27T00:00:00Z", home: "Uruguay", away: "Spain", venue: "Estadio Akron", city: "Zapopan, MEX" },
  { id: 65, phase: "Group I", md: 3, utc: "2026-06-26T19:00:00Z", home: "Norway", away: "France", venue: "Gillette Stadium", city: "Foxborough, USA" },
  { id: 66, phase: "Group I", md: 3, utc: "2026-06-26T19:00:00Z", home: "Senegal", away: "Iraq", venue: "BMO Field", city: "Toronto, CAN" },
  { id: 67, phase: "Group J", md: 3, utc: "2026-06-27T00:00:00Z", home: "Algeria", away: "Austria", venue: "Children's Mercy Park", city: "Kansas City, USA" },
  { id: 68, phase: "Group J", md: 3, utc: "2026-06-27T00:00:00Z", home: "Jordan", away: "Argentina", venue: "AT&T Stadium", city: "Arlington, USA" },
  { id: 69, phase: "Group K", md: 3, utc: "2026-06-27T21:00:00Z", home: "Panama", away: "England", venue: "MetLife Stadium", city: "East Rutherford, USA" },
  { id: 70, phase: "Group K", md: 3, utc: "2026-06-27T21:00:00Z", home: "Croatia", away: "Ghana", venue: "Lincoln Financial Field", city: "Philadelphia, USA" },
  { id: 71, phase: "Group L", md: 3, utc: "2026-06-27T23:30:00Z", home: "Colombia", away: "Portugal", venue: "Hard Rock Stadium", city: "Miami Gardens, USA" },
  { id: 72, phase: "Group L", md: 3, utc: "2026-06-27T23:30:00Z", home: "DR Congo", away: "Uzbekistan", venue: "Mercedes-Benz Stadium", city: "Atlanta, USA" },
  // ── ROUND OF 32 ──
  { id: 73, phase: "Round of 32", md: null, utc: "2026-06-28T02:00:00Z", home: "TBD", away: "TBD", venue: "Children's Mercy Park", city: "Kansas City, USA" },
  { id: 74, phase: "Round of 32", md: null, utc: "2026-06-28T02:00:00Z", home: "TBD", away: "TBD", venue: "AT&T Stadium", city: "Arlington, USA" },
  { id: 75, phase: "Round of 32", md: null, utc: "2026-06-28T19:00:00Z", home: "TBD", away: "TBD", venue: "SoFi Stadium", city: "Los Angeles, USA" },
  { id: 76, phase: "Round of 32", md: null, utc: "2026-06-29T17:00:00Z", home: "TBD", away: "TBD", venue: "NRG Stadium", city: "Houston, USA" },
  { id: 77, phase: "Round of 32", md: null, utc: "2026-06-29T20:30:00Z", home: "TBD", away: "TBD", venue: "Gillette Stadium", city: "Foxborough, USA" },
  { id: 78, phase: "Round of 32", md: null, utc: "2026-06-30T01:00:00Z", home: "TBD", away: "TBD", venue: "Estadio BBVA", city: "Guadalupe, MEX" },
  { id: 79, phase: "Round of 32", md: null, utc: "2026-06-30T17:00:00Z", home: "TBD", away: "TBD", venue: "AT&T Stadium", city: "Arlington, USA" },
  { id: 80, phase: "Round of 32", md: null, utc: "2026-06-30T21:00:00Z", home: "TBD", away: "TBD", venue: "MetLife Stadium", city: "East Rutherford, USA" },
  { id: 81, phase: "Round of 32", md: null, utc: "2026-07-01T01:00:00Z", home: "TBD", away: "TBD", venue: "Estadio Azteca", city: "Mexico City, MEX" },
  { id: 82, phase: "Round of 32", md: null, utc: "2026-07-01T16:00:00Z", home: "TBD", away: "TBD", venue: "Mercedes-Benz Stadium", city: "Atlanta, USA" },
  { id: 83, phase: "Round of 32", md: null, utc: "2026-07-01T20:00:00Z", home: "TBD", away: "TBD", venue: "Lumen Field", city: "Seattle, USA" },
  { id: 84, phase: "Round of 32", md: null, utc: "2026-07-02T00:00:00Z", home: "TBD", away: "TBD", venue: "Levi's Stadium", city: "Santa Clara, USA" },
  { id: 85, phase: "Round of 32", md: null, utc: "2026-07-02T19:00:00Z", home: "TBD", away: "TBD", venue: "SoFi Stadium", city: "Los Angeles, USA" },
  { id: 86, phase: "Round of 32", md: null, utc: "2026-07-02T23:00:00Z", home: "TBD", away: "TBD", venue: "BMO Field", city: "Toronto, CAN" },
  { id: 87, phase: "Round of 32", md: null, utc: "2026-07-03T03:00:00Z", home: "TBD", away: "TBD", venue: "BC Place", city: "Vancouver, CAN" },
  { id: 88, phase: "Round of 32", md: null, utc: "2026-07-03T18:00:00Z", home: "TBD", away: "TBD", venue: "AT&T Stadium", city: "Arlington, USA" },
  { id: 89, phase: "Round of 32", md: null, utc: "2026-07-03T22:00:00Z", home: "TBD", away: "TBD", venue: "Hard Rock Stadium", city: "Miami Gardens, USA" },
  { id: 90, phase: "Round of 32", md: null, utc: "2026-07-04T01:30:00Z", home: "TBD", away: "TBD", venue: "Children's Mercy Park", city: "Kansas City, USA" },
  // ── ROUND OF 16 ──
  { id: 91, phase: "Round of 16", md: null, utc: "2026-07-04T17:00:00Z", home: "TBD", away: "TBD", venue: "NRG Stadium", city: "Houston, USA" },
  { id: 92, phase: "Round of 16", md: null, utc: "2026-07-04T21:00:00Z", home: "TBD", away: "TBD", venue: "Lincoln Financial Field", city: "Philadelphia, USA" },
  { id: 93, phase: "Round of 16", md: null, utc: "2026-07-05T20:00:00Z", home: "TBD", away: "TBD", venue: "MetLife Stadium", city: "East Rutherford, USA" },
  { id: 94, phase: "Round of 16", md: null, utc: "2026-07-06T00:00:00Z", home: "TBD", away: "TBD", venue: "Estadio Azteca", city: "Mexico City, MEX" },
  { id: 95, phase: "Round of 16", md: null, utc: "2026-07-06T19:00:00Z", home: "TBD", away: "TBD", venue: "AT&T Stadium", city: "Arlington, USA" },
  { id: 96, phase: "Round of 16", md: null, utc: "2026-07-07T00:00:00Z", home: "TBD", away: "TBD", venue: "Lumen Field", city: "Seattle, USA" },
  { id: 97, phase: "Round of 16", md: null, utc: "2026-07-07T16:00:00Z", home: "TBD", away: "TBD", venue: "Mercedes-Benz Stadium", city: "Atlanta, USA" },
  { id: 98, phase: "Round of 16", md: null, utc: "2026-07-07T20:00:00Z", home: "TBD", away: "TBD", venue: "BC Place", city: "Vancouver, CAN" },
  // ── QUARTERFINALS ──
  { id: 99, phase: "Quarterfinal", md: null, utc: "2026-07-09T20:00:00Z", home: "TBD", away: "TBD", venue: "Gillette Stadium", city: "Foxborough, USA" },
  { id: 100, phase: "Quarterfinal", md: null, utc: "2026-07-10T19:00:00Z", home: "TBD", away: "TBD", venue: "SoFi Stadium", city: "Los Angeles, USA" },
  { id: 101, phase: "Quarterfinal", md: null, utc: "2026-07-11T21:00:00Z", home: "TBD", away: "TBD", venue: "Hard Rock Stadium", city: "Miami Gardens, USA" },
  { id: 102, phase: "Quarterfinal", md: null, utc: "2026-07-12T01:00:00Z", home: "TBD", away: "TBD", venue: "Children's Mercy Park", city: "Kansas City, USA" },
  // ── SEMIFINALS ──
  { id: 103, phase: "Semifinal", md: null, utc: "2026-07-14T19:00:00Z", home: "TBD", away: "TBD", venue: "AT&T Stadium", city: "Arlington, USA" },
  { id: 104, phase: "Semifinal", md: null, utc: "2026-07-15T19:00:00Z", home: "TBD", away: "TBD", venue: "Mercedes-Benz Stadium", city: "Atlanta, USA" },
  // ── THIRD PLACE & FINAL ──
  { id: 105, phase: "Third Place", md: null, utc: "2026-07-18T21:00:00Z", home: "TBD", away: "TBD", venue: "Hard Rock Stadium", city: "Miami Gardens, USA" },
  { id: 106, phase: "Final", md: null, utc: "2026-07-19T19:00:00Z", home: "TBD", away: "TBD", venue: "MetLife Stadium", city: "East Rutherford, USA" },
];

// ─── GROUPS INFO ─────────────────────────────────────────────────────────────
const GROUPS_INFO = {
  A: ["Mexico", "South Africa", "South Korea", "Czech Republic"],
  B: ["Canada", "Switzerland", "Qatar", "Bosnia & Herz."],
  C: ["Brazil", "Morocco", "Haiti", "Scotland"],
  D: ["USA", "Paraguay", "Australia", "Turkey"],
  E: ["Germany", "Curaçao", "Côte d'Ivoire", "Ecuador"],
  F: ["Netherlands", "Japan", "Tunisia", "Sweden"],
  G: ["Belgium", "Egypt", "Iran", "New Zealand"],
  H: ["Spain", "Cabo Verde", "Saudi Arabia", "Uruguay"],
  I: ["France", "Senegal", "Norway", "Iraq"],
  J: ["Argentina", "Algeria", "Austria", "Jordan"],
  K: ["Portugal", "Uzbekistan", "Colombia", "DR Congo"],
  L: ["England", "Croatia", "Ghana", "Panama"],
};

const TEAM_FLAGS = {
  Mexico: "🇲🇽", "South Africa": "🇿🇦", "South Korea": "🇰🇷", "Czech Republic": "🇨🇿",
  Canada: "🇨🇦", Switzerland: "🇨🇭", Qatar: "🇶🇦", "Bosnia & Herz.": "🇧🇦",
  Brazil: "🇧🇷", Morocco: "🇲🇦", Haiti: "🇭🇹", Scotland: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  USA: "🇺🇸", Paraguay: "🇵🇾", Australia: "🇦🇺", Turkey: "🇹🇷",
  Germany: "🇩🇪", "Curaçao": "🇨🇼", "Côte d'Ivoire": "🇨🇮", Ecuador: "🇪🇨",
  Netherlands: "🇳🇱", Japan: "🇯🇵", Tunisia: "🇹🇳", Sweden: "🇸🇪",
  Belgium: "🇧🇪", Egypt: "🇪🇬", Iran: "🇮🇷", "New Zealand": "🇳🇿",
  Spain: "🇪🇸", "Cabo Verde": "🇨🇻", "Saudi Arabia": "🇸🇦", Uruguay: "🇺🇾",
  France: "🇫🇷", Senegal: "🇸🇳", Norway: "🇳🇴", Iraq: "🇮🇶",
  Argentina: "🇦🇷", Algeria: "🇩🇿", Austria: "🇦🇹", Jordan: "🇯🇴",
  Portugal: "🇵🇹", Uzbekistan: "🇺🇿", Colombia: "🇨🇴", "DR Congo": "🇨🇩",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", Croatia: "🇭🇷", Ghana: "🇬🇭", Panama: "🇵🇦",
  TBD: "⚽",
};

const PHASE_ORDER = [
  "Group A","Group B","Group C","Group D","Group E","Group F",
  "Group G","Group H","Group I","Group J","Group K","Group L",
  "Round of 32","Round of 16","Quarterfinal","Semifinal","Third Place","Final"
];

const PHASE_COLORS = {
  "Group A": "#1e40af", "Group B": "#1d4ed8", "Group C": "#2563eb",
  "Group D": "#3b82f6", "Group E": "#0891b2", "Group F": "#0e7490",
  "Group G": "#065f46", "Group H": "#047857", "Group I": "#059669",
  "Group J": "#7c3aed", "Group K": "#6d28d9", "Group L": "#5b21b6",
  "Round of 32": "#b45309", "Round of 16": "#c2410c",
  "Quarterfinal": "#dc2626", "Semifinal": "#be123c",
  "Third Place": "#92400e", "Final": "#854d0e",
};

const REGIONS = ["All Regions", "North America", "South America", "Europe", "Asia", "Asia Pacific", "Middle East", "Africa", "Central America", "Central Asia"];

// ─── PER-MATCH CHANNEL DATA ───────────────────────────────────────────────────
// UK: match IDs confirmed on ITV (all others → BBC)
// Source: ITV Press Centre + live-footballontv.com
const GB_ITV_IDS = new Set([
  1,  // Mexico vs South Africa
  2,  // South Korea vs Czech Republic
  4,  // Qatar vs Switzerland
  8,  // Australia vs Turkey
  9,  // Germany vs Curaçao
  11, // Netherlands vs Japan
  12, // Sweden vs Tunisia
  15, // Spain vs Cabo Verde
  16, // Saudi Arabia vs Uruguay
  19, // Argentina vs Algeria
  22, // England vs Croatia  ← England's 1st group game
  23, // Ghana vs Panama
  27, // Switzerland vs Bosnia & Herz.
  28, // Canada vs Qatar
  29, // Scotland vs Morocco
  30, // Brazil vs Haiti
  32, // Turkey vs Paraguay
  33, // Germany vs Côte d'Ivoire
  37, // Belgium vs Iran
  38, // New Zealand vs Egypt
  42, // Norway vs Senegal
  44, // Jordan vs Algeria
  45, // Portugal vs Uzbekistan
  46, // Colombia vs DR Congo
  51, // Switzerland vs Canada
  52, // Bosnia & Herz. vs Qatar
  55, // Turkey vs USA
  56, // Paraguay vs Australia
  63, // Cabo Verde vs Saudi Arabia
  64, // Uruguay vs Spain
  65, // Norway vs France
  66, // Senegal vs Iraq
  69, // Panama vs England  ← England's 3rd group game
  70, // Croatia vs Ghana
]);

// US: match IDs confirmed/indicated on FOX (all unknown group stage → "FOX / FS1")
// Source: FOX Sports press release + Deadline
const US_FOX_IDS = new Set([
  1,  // Mexico vs South Africa (opening match)
  3,  // Canada vs Bosnia (host nation)
  5,  // Brazil vs Morocco
  7,  // USA vs Paraguay  ← USMNT
  17, // France vs Senegal
  19, // Argentina vs Algeria
  22, // England vs Croatia
  31, // USA vs Australia  ← USMNT
  43, // Argentina vs Austria
  47, // England vs Ghana
  50, // Czech Republic vs Mexico (host)
  54, // Scotland vs Brazil
  55, // Turkey vs USA  ← USMNT
  64, // Uruguay vs Spain
  65, // Norway vs France
  68, // Jordan vs Argentina
  69, // Panama vs England
  71, // Colombia vs Portugal
  72, // DR Congo vs Uzbekistan
  // Round of 32 (first 14 of 16 on FOX; last 2 on FS1)
  73,74,75,76,77,78,79,80,81,82,83,84,85,86,
  // Round of 16 and beyond — all FOX
  91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,
]);
const US_FS1_IDS = new Set([87, 88]); // last 2 Round of 32 matches

// Brazil: TV Globo shows 54 matches (all Brazil games + semis + final + opening)
// SBT/N Sports shows 32 matches; CazéTV streams all 104 free on YouTube
// Source: SportBusiness, Sportcal
const BR_TEAM_MATCHES = new Set([5,29,30,31,52,53,54]); // known Brazil group matches (C)
// IDs where Brazil plays or high-profile (Globo priority)
const BR_GLOBO_IDS = new Set([
  // Group C: Brazil matches
  5, 30, 54,
  // Opening match
  1,
  // Final + semis + 3rd place
  103,104,105,106,
  // Other high-profile group matches
  7,17,19,22,47,64,65,71,
]);

// ─── MATCH BROADCAST RESOLVER ────────────────────────────────────────────────
function getMatchBroadcast(matchId, countryCode) {
  const base = BROADCAST_DATA[countryCode];
  if (!base) return null;

  // ── United Kingdom: full BBC/ITV per-match split ──
  if (countryCode === "GB") {
    const isKnockout = matchId >= 73;
    if (isKnockout) {
      return { ...base, tv: ["BBC / ITV (TBC)"], streaming: ["BBC iPlayer", "ITVX"], note: "Specific channel confirmed closer to match" };
    }
    const isITV = GB_ITV_IDS.has(matchId);
    return {
      ...base,
      tv: isITV ? ["ITV1", "ITV4"] : ["BBC One", "BBC Two"],
      streaming: isITV ? ["ITVX", "STV Player"] : ["BBC iPlayer"],
    };
  }

  // ── United States: FOX / FS1 split ──
  if (countryCode === "US") {
    let enTV, enStream, esTV, esStream, note;
    if (US_FOX_IDS.has(matchId)) {
      enTV = ["FOX"]; enStream = ["FOX Sports App", "FOX.com"]; esTV = ["Telemundo"]; esStream = ["Peacock"];
    } else if (US_FS1_IDS.has(matchId)) {
      enTV = ["FS1"]; enStream = ["FOX Sports App"]; esTV = ["Universo"]; esStream = ["Peacock"];
    } else {
      enTV = ["FOX / FS1"]; enStream = ["FOX Sports App"]; esTV = ["Telemundo / Universo"]; esStream = ["Peacock"];
      note = "Check FOX Sports for exact channel";
    }
    return { ...base, tv: enTV, streaming: enStream, spanish: esTV, spanishStreaming: esStream, note, fta: US_FOX_IDS.has(matchId) };
  }

  // ── Brazil: Globo / SBT / CazéTV split ──
  if (countryCode === "BR") {
    const isGlobo = BR_GLOBO_IDS.has(matchId);
    return {
      ...base,
      tv: isGlobo ? ["TV Globo", "SporTV"] : ["SBT", "N Sports"],
      streaming: ["CazéTV on YouTube (all matches – free)", isGlobo ? "Globoplay" : ""],
      note: "CazéTV streams every match free on YouTube regardless of TV channel",
    };
  }

  return base;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function fmtDate(utc) {
  return new Date(utc).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZoneName: "short" });
}
function fmtTime(utc) {
  return new Date(utc).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" });
}
function isGroupPhase(p) { return p.startsWith("Group"); }

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
// ─── SEARCHABLE COUNTRY DROPDOWN ─────────────────────────────────────────────
function CountrySearch({ options, value, onChange }) {
  const selected = value ? BROADCAST_DATA[value] : null;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handle(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter(([, v]) => v.country.toLowerCase().includes(q) || v.region.toLowerCase().includes(q));
  }, [query, options]);

  function select(code) {
    onChange(code);
    setOpen(false);
    setQuery("");
  }

  function clear(e) {
    e.stopPropagation();
    onChange("");
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={containerRef} style={{ position: "relative", flex: "2 1 260px" }}>
      <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 6 }}>COUNTRY</label>

      {/* Input trigger */}
      <div
        onClick={() => { setOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 0); }}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#0f172a", border: `1px solid ${open ? "#3b82f6" : "#475569"}`,
          borderRadius: 8, padding: "10px 12px", cursor: "pointer",
          boxShadow: open ? "0 0 0 2px #3b82f630" : "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
          minHeight: 42,
        }}
      >
        {open ? (
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type to search countries..."
            onClick={e => e.stopPropagation()}
            style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#f1f5f9", fontSize: 14, minWidth: 0 }}
          />
        ) : (
          <span style={{ flex: 1, fontSize: 14, color: selected ? "#f1f5f9" : "#64748b" }}>
            {selected ? `${selected.flag} ${selected.country}` : "Select your country..."}
          </span>
        )}
        {selected && !open && (
          <span
            onClick={clear}
            title="Clear"
            style={{ color: "#64748b", fontSize: 16, lineHeight: 1, cursor: "pointer", padding: "0 2px" }}
          >×</span>
        )}
        <span style={{ color: "#64748b", fontSize: 12, flexShrink: 0 }}>{open ? "▲" : "▼"}</span>
      </div>

      {/* Dropdown list */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100,
          background: "#0f172a", border: "1px solid #3b82f6", borderRadius: 8,
          maxHeight: 240, overflowY: "auto",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "12px 14px", color: "#64748b", fontSize: 14 }}>No countries found</div>
          ) : (
            filtered.map(([code, v]) => (
              <div
                key={code}
                onClick={() => select(code)}
                style={{
                  padding: "9px 14px", cursor: "pointer", fontSize: 14,
                  display: "flex", alignItems: "center", gap: 10,
                  background: code === value ? "#1e3a5f" : "transparent",
                  color: code === value ? "#f1f5f9" : "#cbd5e1",
                  borderLeft: code === value ? "3px solid #3b82f6" : "3px solid transparent",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => { if (code !== value) e.currentTarget.style.background = "#1e293b"; }}
                onMouseLeave={e => { if (code !== value) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{v.flag}</span>
                <span style={{ flex: 1 }}>{v.country}</span>
                <span style={{ color: "#475569", fontSize: 11 }}>{v.region}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function BroadcastBanner({ countryCode }) {
  if (!countryCode) {
    return (
      <div style={{ background: "#1e293b", borderRadius: 10, padding: "14px 18px", marginBottom: 20, border: "1px solid #334155", textAlign: "center" }}>
        <p style={{ color: "#94a3b8", margin: 0, fontSize: 14 }}>
          🌍 Select a country above to see broadcast info on every match card.
        </p>
      </div>
    );
  }
  const bc = BROADCAST_DATA[countryCode];
  if (!bc) return null;
  return (
    <div style={{ background: "linear-gradient(135deg,#1e3a5f,#0f2340)", borderRadius: 10, padding: "12px 18px", marginBottom: 20, border: "1px solid #2d4a70", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
      <span style={{ fontSize: 26 }}>{bc.flag}</span>
      <div style={{ flex: 1 }}>
        <span style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 15 }}>{bc.country}</span>
        <span style={{ color: "#64748b", fontSize: 13, marginLeft: 8 }}>· Broadcast info shown on each match below</span>
      </div>
      <span style={{
        background: bc.fta ? "#14532d" : "#431407",
        color: bc.fta ? "#4ade80" : "#fb923c",
        fontSize: 12, fontWeight: 700,
        padding: "4px 12px", borderRadius: 20,
        border: `1px solid ${bc.fta ? "#166534" : "#9a3412"}`,
        whiteSpace: "nowrap",
      }}>
        {bc.fta ? "✓ Free-to-Air Available" : "⚠ Subscription Required"}
      </span>
    </div>
  );
}

function MatchCard({ match, highlightTeam, broadcast }) {
  const isTBD = match.home === "TBD" || match.away === "TBD";
  const homeFlag = TEAM_FLAGS[match.home] || "⚽";
  const awayFlag = TEAM_FLAGS[match.away] || "⚽";
  const phaseColor = PHASE_COLORS[match.phase] || "#334155";
  const isHighlighted = highlightTeam && (match.home === highlightTeam || match.away === highlightTeam);

  return (
    <div style={{
      background: isHighlighted ? "linear-gradient(135deg,#1e3a5f,#172554)" : "#1e293b",
      border: `1px solid ${isHighlighted ? "#3b82f6" : "#334155"}`,
      borderRadius: 10,
      padding: "14px 16px",
      marginBottom: 10,
      boxShadow: isHighlighted ? "0 0 0 2px #3b82f650" : "none",
      transition: "all 0.15s",
    }}>
      {/* Phase badge + match number */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ background: phaseColor, color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {match.phase}{match.md ? ` · MD${match.md}` : ""}
        </span>
        <span style={{ color: "#64748b", fontSize: 12 }}>#{match.id}</span>
      </div>

      {/* Teams */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ flex: 1, textAlign: "right" }}>
          <div style={{ fontSize: 22 }}>{homeFlag}</div>
          <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 14 }}>{match.home}</div>
        </div>
        <div style={{ textAlign: "center", padding: "0 12px" }}>
          <div style={{ color: "#94a3b8", fontSize: 20, fontWeight: 700 }}>vs</div>
          <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 13, marginTop: 4 }}>
            {isTBD ? "—" : fmtTime(match.utc)}
          </div>
        </div>
        <div style={{ flex: 1, textAlign: "left" }}>
          <div style={{ fontSize: 22 }}>{awayFlag}</div>
          <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 14 }}>{match.away}</div>
        </div>
      </div>

      {/* Venue & date */}
      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#64748b", fontSize: 12 }}>🏟 {match.venue}</span>
        <span style={{ color: "#64748b", fontSize: 12 }}>📍 {match.city}</span>
      </div>
      <div style={{ color: "#475569", fontSize: 12, marginTop: 4 }}>
        📅 {fmtDate(match.utc)}
      </div>

      {/* Broadcast info — shown only when a country is selected */}
      {broadcast && (
        <div style={{ marginTop: 12, borderTop: "1px solid #334155", paddingTop: 12 }}>

          {/* Main grid: TV + Streaming */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {/* TV Channels */}
            <div>
              <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
                📺 TV
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {broadcast.tv.map((ch, i) => (
                  <span key={i} style={{ background: "#0f172a", color: "#e2e8f0", fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "1px solid #1e3a5f" }}>
                    {ch}
                  </span>
                ))}
              </div>
            </div>

            {/* Streaming */}
            <div>
              <div style={{ color: "#86efac", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
                🎥 Streaming
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {broadcast.streaming.filter(Boolean).map((s, i) => (
                  <span key={i} style={{ background: "#0f172a", color: "#e2e8f0", fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "1px solid #14532d" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Spanish-language row (US only) */}
          {broadcast.spanish && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
              <div>
                <div style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
                  📺 En Español
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {broadcast.spanish.map((ch, i) => (
                    <span key={i} style={{ background: "#0f172a", color: "#e2e8f0", fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "1px solid #78350f" }}>
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 }}>
                  🎥 Stream (ES)
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {broadcast.spanishStreaming && broadcast.spanishStreaming.map((s, i) => (
                    <span key={i} style={{ background: "#0f172a", color: "#e2e8f0", fontSize: 12, padding: "4px 8px", borderRadius: 6, border: "1px solid #78350f" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom row: FTA badge + optional note */}
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{
              background: broadcast.fta ? "#14532d" : "#431407",
              color: broadcast.fta ? "#4ade80" : "#fb923c",
              fontSize: 11, fontWeight: 700,
              padding: "3px 10px", borderRadius: 20,
              border: `1px solid ${broadcast.fta ? "#166534" : "#9a3412"}`,
            }}>
              {broadcast.fta ? "✓ Free-to-Air" : "⚠ Subscription Required"}
            </span>
            {broadcast.note && (
              <span style={{ color: "#64748b", fontSize: 11, fontStyle: "italic" }}>
                ℹ {broadcast.note}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function GroupCard({ groupLetter }) {
  const teams = GROUPS_INFO[groupLetter];
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 10, padding: 16, minWidth: 160 }}>
      <h4 style={{ margin: "0 0 10px", color: "#93c5fd", fontSize: 14, fontWeight: 700 }}>Group {groupLetter}</h4>
      {teams.map((t, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span>{TEAM_FLAGS[t] || "⚽"}</span>
          <span style={{ color: "#e2e8f0", fontSize: 13 }}>{t}</span>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function WorldCup2026() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [phaseFilter, setPhaseFilter] = useState("All");
  const [searchTeam, setSearchTeam] = useState("");
  const [showGroups, setShowGroups] = useState(false);
  const [tab, setTab] = useState("schedule"); // "schedule" | "groups"

  const countryOptions = useMemo(() => {
    return Object.entries(BROADCAST_DATA)
      .filter(([, v]) => selectedRegion === "All Regions" || v.region === selectedRegion)
      .sort((a, b) => a[1].country.localeCompare(b[1].country));
  }, [selectedRegion]);

  const filteredMatches = useMemo(() => {
    return MATCHES.filter(m => {
      if (phaseFilter !== "All") {
        if (phaseFilter === "Group Stage" && !isGroupPhase(m.phase)) return false;
        if (phaseFilter !== "All" && phaseFilter !== "Group Stage" && m.phase !== phaseFilter) return false;
      }
      if (searchTeam) {
        const q = searchTeam.toLowerCase();
        if (!m.home.toLowerCase().includes(q) && !m.away.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [phaseFilter, searchTeam]);

  const groupedMatches = useMemo(() => {
    const grouped = {};
    filteredMatches.forEach(m => {
      if (!grouped[m.phase]) grouped[m.phase] = [];
      grouped[m.phase].push(m);
    });
    return PHASE_ORDER.filter(p => grouped[p]).map(p => ({ phase: p, matches: grouped[p] }));
  }, [filteredMatches]);

  const phaseButtons = ["All","Group Stage","Round of 32","Round of 16","Quarterfinal","Semifinal","Third Place","Final"];

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* ── HEADER ── */}
      <div style={{ background: "linear-gradient(135deg,#1e3a5f 0%,#0a1628 100%)", padding: "32px 24px 24px", textAlign: "center", borderBottom: "2px solid #1e3a5f" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>⚽</div>
        <h1 style={{ margin: "0 0 6px", fontSize: 32, fontWeight: 800, background: "linear-gradient(90deg,#f59e0b,#fbbf24,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          FIFA World Cup 2026™
        </h1>
        <p style={{ color: "#94a3b8", margin: 0, fontSize: 15 }}>June 11 – July 19 · USA · Canada · Mexico · 48 Teams · 104 Matches</p>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 8 }}>
          {["schedule","groups"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ background: tab === t ? "#2563eb" : "#1e293b", color: "#f1f5f9", border: "1px solid #334155", borderRadius: 20, padding: "8px 20px", cursor: "pointer", fontWeight: 600, fontSize: 14, textTransform: "capitalize" }}>
              {t === "schedule" ? "📅 Schedule" : "🗂 All Groups"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        {tab === "groups" ? (
          <>
            <h2 style={{ color: "#93c5fd", marginBottom: 16, fontSize: 20 }}>🗺 All 12 Groups</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12 }}>
              {"ABCDEFGHIJKL".split("").map(g => <GroupCard key={g} groupLetter={g} />)}
            </div>
            <div style={{ marginTop: 24, background: "#1e293b", borderRadius: 12, padding: 20, border: "1px solid #334155" }}>
              <h3 style={{ color: "#f59e0b", margin: "0 0 12px" }}>🏆 Tournament Format</h3>
              <p style={{ color: "#94a3b8", lineHeight: 1.7, margin: 0 }}>
                48 teams compete in 12 groups of 4. The top 2 teams from each group <strong style={{color:"#e2e8f0"}}>plus the 8 best 3rd-place teams</strong> advance to a new Round of 32 — a format debut at the World Cup. From there, the knockout bracket runs through Round of 16 → Quarterfinals → Semifinals → Final at MetLife Stadium on July 19.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* ── COUNTRY SELECTOR ── */}
            <div style={{ background: "#1e293b", borderRadius: 12, padding: "20px", marginBottom: 20, border: "1px solid #334155" }}>
              <h2 style={{ color: "#f1f5f9", margin: "0 0 16px", fontSize: 18 }}>🌍 Where Are You Watching?</h2>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 6 }}>REGION</label>
                  <select value={selectedRegion} onChange={e => { setSelectedRegion(e.target.value); setSelectedCountry(""); }}
                    style={{ width: "100%", background: "#0f172a", color: "#f1f5f9", border: "1px solid #475569", borderRadius: 8, padding: "10px 12px", fontSize: 14 }}>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <CountrySearch
                  options={countryOptions}
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                />
              </div>
            </div>

            {/* ── BROADCAST BANNER ── */}
            <BroadcastBanner countryCode={selectedCountry} />

            {/* ── FILTERS ── */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {phaseButtons.map(p => (
                  <button key={p} onClick={() => setPhaseFilter(p)}
                    style={{ background: phaseFilter === p ? "#2563eb" : "#1e293b", color: phaseFilter === p ? "#fff" : "#94a3b8", border: `1px solid ${phaseFilter === p ? "#3b82f6" : "#334155"}`, borderRadius: 20, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontWeight: phaseFilter === p ? 700 : 400 }}>
                    {p}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="🔍 Search by team name..."
                value={searchTeam}
                onChange={e => setSearchTeam(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", background: "#1e293b", color: "#f1f5f9", border: "1px solid #475569", borderRadius: 8, padding: "10px 14px", fontSize: 14 }}
              />
            </div>

            {/* ── MATCH LIST ── */}
            <div style={{ marginBottom: 8, color: "#64748b", fontSize: 13 }}>
              Showing {filteredMatches.length} match{filteredMatches.length !== 1 ? "es" : ""} · Times shown in your local timezone
            </div>

            {groupedMatches.length === 0 && (
              <div style={{ textAlign: "center", color: "#64748b", padding: 40 }}>No matches found for this filter.</div>
            )}

            {groupedMatches.map(({ phase, matches }) => (
              <div key={phase} style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ height: 3, flex: 1, background: `linear-gradient(90deg, ${PHASE_COLORS[phase] || "#334155"}, transparent)`, borderRadius: 2 }} />
                  <h3 style={{ margin: 0, color: "#f1f5f9", fontSize: 16, fontWeight: 700, whiteSpace: "nowrap" }}>
                    {phase} {isGroupPhase(phase) && GROUPS_INFO[phase.split(" ")[1]] ? `(${GROUPS_INFO[phase.split(" ")[1]].length} teams)` : `· ${matches.length} matches`}
                  </h3>
                  <div style={{ height: 3, flex: 1, background: `linear-gradient(270deg, ${PHASE_COLORS[phase] || "#334155"}, transparent)`, borderRadius: 2 }} />
                </div>
                {isGroupPhase(phase) && (() => {
                  const letter = phase.split(" ")[1];
                  const teams = GROUPS_INFO[letter];
                  if (!teams) return null;
                  return (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                      {teams.map(t => (
                        <button key={t} onClick={() => setSearchTeam(searchTeam === t ? "" : t)}
                          style={{ background: searchTeam === t ? "#1d4ed8" : "#0f172a", color: "#e2e8f0", border: `1px solid ${searchTeam === t ? "#3b82f6" : "#334155"}`, borderRadius: 20, padding: "4px 12px", cursor: "pointer", fontSize: 12 }}>
                          {TEAM_FLAGS[t] || "⚽"} {t}
                        </button>
                      ))}
                    </div>
                  );
                })()}
                {matches.map(m => (
                  <MatchCard
                    key={m.id}
                    match={m}
                    highlightTeam={searchTeam || null}
                    broadcast={selectedCountry ? getMatchBroadcast(m.id, selectedCountry) : null}
                  />
                ))}
              </div>
            ))}

            {/* ── FOOTER NOTE ── */}
            <div style={{ marginTop: 32, background: "#1e293b", borderRadius: 12, padding: "16px 20px", border: "1px solid #334155", color: "#64748b", fontSize: 13 }}>
              <strong style={{ color: "#94a3b8" }}>ℹ Note:</strong> All kick-off times are automatically converted to your device's local timezone.
              Broadcast rights shown are based on confirmed deals as of April 2026. Some details may change — check your local broadcaster for the latest scheduling.
              First-round knockout opponents (Round of 32 & beyond) depend on group stage results.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
