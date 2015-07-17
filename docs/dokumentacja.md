Dokumentacja HORPYNA
====================

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

