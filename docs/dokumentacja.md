Dokumentacja HORPYNA
====================

Instalacja
----------
1. W katalogu głównym projektu należy utworzyć katalog 'log'
Ponieważ logger sam sobie nie utworzy katalogu
2. Do katalogu głównego należy przenieść z biblioteki Horpyna katalog 'views'
Zawiera wstępnie przygotowane widoki dla JadeResourceModule. Należy je potem zmienić

Zmienne środowiskowe
--------------------
### Ogólnie
System do dodatkowej konfiguracji przy pracy developerskiej używa zmiennych środowiskowych w postaci HORPYNA_*
Użycie takiej zmiennej jest albo przez ustawienie globalne albo przy wywoływaniu za każdym razem przez konsolę np:
HORPYNA_DUMMY=dummy node app.js
### HORPYNA_LOG
Służy do określenia pracy loggera w konsoli. Domyślnie w konsoli nic nie wyświetla. Możemy włączyć by wyświetlał wszystko lub tylko errory
#### Wartości
all			wyświetla wszystkie logi
error		wyświetla błędy
mute		nie wyświetla nic
#### Przykład
HORPYNA_LOG=all node app.js

Zmienne DEBUG
-------------
### Ogólnie
Debug jest to moduł do debugowania kodu. Wyświetla w console.log te rzeczy których przestrzenie nazw się zgadzają z wpisanym w konsoli
np
DEBUG=dummy:cos node app.js
możemy mieć wiele przestrzeni nazw, wtedy podajemy je po przecinku
DEBUG=foo,bar
System wprawadza kilka przydatnych przestrzeni nazw do debugowania aplikacji
### horpyna*
wszystkie komunikaty z całej aplikacji
### horpyna:dispatcher
WYświetla przebieg procesów w module dispatcher
### horpyna:component*
przebieg procesów we wszystkich komponentach
### horpyna:component:<nazwa komponentu>
przebieg procesów w danym komponencie
### horpyna:action*
przebieg procesów we wszystkich komponentach action
### horpyna:action:<nazwa akcji>
przebieg procesów w danej akcji
### horpyna:view
odpowiedzi jakie generuje view (w testach normalnie ich nie widać)
### horpyna:event*
przebieg procesów we wszystkich eventach
### horpyna:event:<typ eventu>
przebieg procesów dla danego eventu

Eventy
------
### Nasłuch
Components mają możliwość publikacji eventu
służy do tego metoda:
publish(request: Action.Request, response: Action.Response, type: string, subtype?: string): Util.Promise<void>

Metoda wykonuje się w promise

Publikacja wemituje się w kierunku ComponentManager i odpali po drodze wszystkie subskrypcje których warunki nasłuchu
odpowiadają opubblikowanemu eventowi. Wszystkie te subskrypcje które się odpalą przed dojściem do ComponentManagera
muszą być ustawione jako lokalne (inaczej się nie odpalą).
Gdy dojdzie do Componenent Managera ten robi broadcasta z tym eventem w dół do wszystkich Modułów. Wtedy susbskrypcje
muszą być ustawione jako publiczne.

Subskrypcje rejestrować może tylko Module.
Rejestracja wygląda:
public subscribe(subscriber:Event.BaseEvent)
Gdzie Event to obiekt opisujący jakie warunki mają być spełnione by nastąpiło odpalenie callbacka tego eventu

var event = new Core.Event.Action.OnFinish();
event.addCallback((request: Core.Action.Request, response: Core.Action.Response, done) => {
	//tu obsługa
	done();
});
this.subscribe(event);

event może mieć  określony podtyp (subtype)
event może mieć określone czy jest publiczny czy lokalny
event domyślnie na podstawie konstruktora ma określony typ
event może określić EmiterRegexp czyli sprawdza aktualną scieżkę route i określa czy jest zgodna z warunkiem


Pola (Field)
------------
### Ogólnie
Wyróżniamy 5 typów pól : param, body, query, app, head. Wszystkie podlegają walidacji
1. param - są to parametry przekazane w adresie np id. Parametry muszą być zamapowane w routerze by były parametrami
np mydomain.com/:id/
Parametry w zasobach automatycznie dodawane są to 'where' przy zapytaniach. Mają niższy priorytet niż pola app które je mogą nadpisać
2. app - są to parametry tworzone przez eventy i inne moduły. Parametr ten nie może być przekazany przez adres. Przykładowo jest to id usera który jest zalogowany.
Parametry w zasobach automatycznie dodawane są do 'where' przy zapytaniach. Nadpisują pola 'param' jeśli oba mają tą samą wartość.
Jest to ważne ze względu bezpieczeństwa. By w adresie nie przekazać 'param' którym jest id usera co da większe uprawnienia. Jest to raczej nie możliwe, Bo celowo trzeba by utworzyć taki sam param - a to oznacza że programista chciał coś takiego
3. body - są to parametry przekazywane w post formularzach. Są one automaycznie dodawane do wartości w update i create
4. query - są to parametry z url w parach klucz i wartość np mydomain.com?k1=v1&k2=v2. Pełnią rolę dodatkowych parametrów np do sortowania czy paginacji
5. header - specjalny parametr, zastosowanie przez konkretne moduły. Nie jest używany automatycznie. pole 'token' służy np do autoryzacji


