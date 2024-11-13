# Stop 'n Shop
Naš je projektni zadatak na kolegiju Programsko inženjerstvo bio izraditi web aplikaciju koja bi ublažila problem nedovoljne povezanosti između stanovništva i njihovih lokalnih trgovina. 

Današnji ubrzani i dinamičan tempo života zahtjeva moderniji pristup kupnji dnevnih potrepština. Dio rješenja problema krije se u olakšavanju pronalaženja informacija kojima se stanovnici vode prilikom donošenja odluke gdje izvršiti svoju kupovinu. Najbitnije informacije saželi smo na jednom, intuitivnom, lako dostupnom mjestu. Ta se aplikacija naziva Stop 'n Shop.

# Funkcionalni zahtjevi
Neregistrirani korisnici upućeni su na izradu korisničkog računa. Registracija se izvršava u nekoliko koraka – korisnik bira korisničko ime, unosi svoju email adresu te izabire lozinku.

Popis trgovina sadržavat će, uz imena trgovina, njihove adrese, kontakt informacije, radno vrijeme, kratak opis usluga koje nude, kao i specijalizirane oznake (npr. prilagođeno za kućne ljubimce) kako bi kupcima olakšali pronalazak određenih usluga koje traže.

Kupci mogu pregledavati listu trgovina, kao i filtrirati iste ovisno o izabranim parametrima (npr. kategorija proizvoda, cijena, udaljenost trgovine…) te pogledati vlastitu povijest kupovina. Također mogu ostavljati recenzije na proizvode ocjenom, komentarima i slikom te tako pomoći drugim kupcima željnima drugog mišljenja. Ocjene trgovina i proizvoda koje nude bit će prikazane na profilima trgovina. Kako bismo recenzije održali pristojnima, forum će nadgledati moderatori kako bi se korisnicima omogućilo ugodno iskustvo.

Vlasnici trgovina imat će priliku kreirati događaje unoseći naziv, lokaciju, vrijeme, datum i opis događaja. Zainteresirani stanovnici moći će potvrditi svoj dolazak putem integrirane kalendarske usluge. Ako se interes za određene događaje bude pokazao velikim, trgovine također mogu stvoriti cikličke događaje za koje bi imali unaprijed definirane pozivnice te opciju automatskog ponavljanja događaja.

Osim događaja, trgovine će moći kreirati posebne ponude i promocije, objavljivati kuponske kodove i rasprodaje. Korisnicima će se automatski predlagati ponude ovisno o njihovim prijašnje iskazanim interesima, a određene ponude trgovine će moći ograničiti samo na pojedine kategorije korisnika (npr. novim kupcima ponuditi popust na prvoj kupovini).

# Nefunkcionalni zahtjevi
Pri izradi aplikacije, glavne niti vodilje bile su nam efikasnost te zadovoljstvo korisnika.

Prilagodili smo display aplikacije koristeći responsive design, kako bismo korisnicima omogućili neometano korištenje usluga, neovisno o ekranu preko kojeg vrše kupovinu.

Za lakšu i sigurniju prijavu, implementirali smo third-party authentication. Ako korisnici imaju Google account, mogu ga iskoristiti i za prijavu u našu aplikaciju.

# Tehnologije
Za izradu backenda, koristimo Javu i Spring Boot, a za frontend smo pak odabrali React.

Kako bismo komunikaciju održavali redovnom i aktualnom, koristimo Discord za izmjenu ideja i smišljanje novih planova, a za svaki slučaj, tu je i naša WhatsApp grupa u kojoj razmjenjujemo podsjetnike za buduće sastanke/datume od važnosti.
