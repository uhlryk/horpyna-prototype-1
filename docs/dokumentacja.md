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
Moduły mogą zarejestrować dowolną liczbę obiektów które będą nasłuchiwały na eventy w aplikacji.
Przykładowe użycie

`var onDetailAction = new Core.Event.Action.OnReady.Subscriber();`
`onDetailAction.setEmiterRegexp(/\/detail$/);`
`onDetailAction.addCallback((data:Core.Event.Action.OnReady.Data, done)=>{`
`this.onDetailAction(data, done);`
`});`
`this.subscribe(onDetailAction);`

