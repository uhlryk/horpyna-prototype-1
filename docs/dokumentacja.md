Dokumentacja
============

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

