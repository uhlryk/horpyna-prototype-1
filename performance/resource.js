var request = require('request');
var Core = require('./../js/index');

var count = 0;
var errorCount = 0;
var max = 10000;
var start, end, time;

var myApp = new Core.Application(require("./config/config"));
moduleResource = new Core.App.Module.Resource(myApp.root, "test1");
moduleResource.addField("model1", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource.addField("model2", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource.addField("model3", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource.addField("model4", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource = new Core.App.Module.Resource(myApp.root, "test2");
moduleResource.addField("model1", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource.addField("model2", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource.addField("model3", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource.addField("model4", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource = new Core.App.Module.Resource(myApp.root, "test3");
moduleResource.addField("model1", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource.addField("model2", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource.addField("model3", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource.addField("model4", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource = new Core.App.Module.Resource(myApp.root, "test4");
moduleResource.addField("model1", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource.addField("model2", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource.addField("model3", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource.addField("model4", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource = new Core.App.Module.Resource(myApp.root, "test5");
moduleResource.addField("model1", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource.addField("model2", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource.addField("model3", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
moduleResource.addField("model4", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
myApp.run()
.then(function(){
		start = new Date().getTime();
		callTimeoutApi(0)
});
function callTimeoutApi(i){
	if(i < max){
		setTimeout(function(){
			i++;
			callApi('http://localhost:8885/test1/list');
			callTimeoutApi(i);
		}, 1);
	}
}
function callApi(url){
	request(url, function (error, response, body) {
		count++;
		if (!error && response.statusCode == 200) {
		} else {
			errorCount++
			console.log(error);
		}
		console.log(count);
		checkFinish();
	});
}
function checkFinish(){
	if(count >=max){
		end = new Date().getTime();
		time = end - start;
		console.log("time for " + max + " requests "+time/1000 + "s errors: " + errorCount);
	}
}