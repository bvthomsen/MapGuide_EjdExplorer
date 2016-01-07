# Integration af LIFA EjdExplorer og Geografs WEB-GIS system

Integrationen består i et sæt af programmer/services, som giver brugere af Geograf's WEB GIS system mulighed for at udpege flader/linier/enkeltpositioner i web gis systemet og benytte disse til at udpege og vise ejemdoms/matrikel data i EjeExplorer.

### Installation af service

For at gennemføre installationen er det nødvendigt, at du har kendskab til at administrere IIS.

NB! Hvis du allerede har installeret seneste udgave af LIFA2 integrations system, kan du springe dette afsnit over. Der er ikke sket nogen opdateringer af service delen.

1. Fra GITHub distributionen kopier du mappe "lifa" til en vilkårlig placering på din iis-server. Mappen kan dog med fordel placeres sammen med andre "virtual directories" mapper på din server, f.eks. "c:\inetpub\wwwroot\lifa".

2. Bruger IUSR gives "read & execute" rettigheder til den kopierede lifa-mappe samt fil indhold.

3. Start IIS manager og tilføj en ny "application" under "Default Web Site"

4. I dialogen "Add application" udfyldes "Alias" med navnet på applikationen, f.eks "lifa" (anbefales); under "Application pool" vælges "ASP .NET v4.0" (Hvis dette valg ikke findes, har du ikke installeret .NET 4 på serveren. Dette skal gøres, før du kan komme videre). I "Physical Path" vælges placeringen på den i pkt. 1 generede mappe.

### Installation af knap i Geograf web GIS

For at gennemføre denne del skal du have kendskab til Geografs WebGIS Editor

1. Fra GITHub distributionen kopier du fil "lifa3.button.js" til mappe "MineWidgets" i din Geograf WebGIS installation, f.eks. "C:\inetpub\wwwroot\WebGIS\widgets\MineWidgets".
2. Fra GITHub distributionen kopier du fil "EjdExplorer16.png" til mappe "grafik\widgets" i din Geograf WebGIS installation, f.eks. "C:\inetpub\wwwroot\WebGIS\grafik\widgets".

3. Start Geografs WebGISEditor og log ind på det relevante site.
4. Tryk på knap "Værktøjer"
5. I dialogen "Rediger toolbar" trykker du på knappen "Tilføj værktøj" (Grøn cirkel med hvidt kryds) og navigerer dig frem til "Indbyggede" > "MineWidgets" > "LIFA3". Knappen bliver installeret i bunden af listen over allerede installerede knapper

6. Markér "LIFA3" i WebGISEditor og under "Opsætning af widget" ændrer du "GST Username" og "GST password" til dit eget username/password til Geodatastyrelsens services.

7. Du kan ændre på standard indstilliger for knappen:
I "Default metode for selektering" kan du sætte hvilket digitaliserings værktøj (Flade, linie eller punkt), som brugeren starter med at have til rådighed.
I "Metode til aktivering af EjdExplorer" sætter du hvilket faneblad i EjdExplorer (Enkeltsøgning, Forespørgsel, eller Adresseudtræk), som EjdExplorer starter starter op med.
I "Vis alle eksportmetoder" bestemmer du om brugeren får mulighed for at ændre på aktiveringsmetode.

8. Hvis du **ikke** har installeret LIFA service i virtuel mappe "/lifa" skal du også tilpasse "URL for LIFA service" til den ændrede placering. (Bevar den øvrige del af stien i feltet)

Ved opstart af dit Geograf WebGIS site skulle du nu kunne se en ny knap på knap-linien.

### Brug af LIFA EjdExplorer integration i Geograf WebGS

LIFA ejdexplorer integration aktiveres ved hjælp af knap "Aktiverer EjdExplorer vha. tegnet geografisk objekt." (Knap med ejdexplorer-ikon).

1. Når du trykker på knappen aktiverer du et digitaliseringsværktøj, som kan benyttes til at tegne en flade, linie eller punkt. Linie eller flade digitalisering afsluttes med dobbeltklik, mens punkt afsluttes med et enkelt venstre-klik på musen.

2. Efter digitalisering af det geografiske objekt benyttes dette af integrationsprogrammet til at finde en liste over alle matrikler, som berøres/krydses af objektet. Slutteligt startes/aktiveres EjdExplorer med matrikel-listen som inddata.

Umiddelbart til højre for selve EjdExplorer-knappen findes en "drop-down" knap, som aktiverer en undermenu for EjdExplorer funktionen. Undermenuen er delt op i to grupper (*):
- Den øverste gruppe giver dig mulighed for at vælge hvilken søgeobjekt du definerer: Enten en flade, linie eller et punkt. Valget aktiverer også selve søgefunktionen.
- Den nederste gruppe giver dig mulighed for at bestemme til hvilket faneblad i EjdExplorer de fundne matrikler vises i: Enten Enkeltsøgning, Forespørgsesgenerator eller Adresseudtræk.

(*) Det er muligt, at valgmuligheden for at vælge faneblad i EjdExplorer er fjernet af administrator, så du kun kan vælge digitaliseringsværktøj.


















