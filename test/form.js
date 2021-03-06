var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/index');
var app;
var myApp;
var deleteFolderRecursive = function(path) {
	if( fs.existsSync(path) ) {
		fs.readdirSync(path).forEach(function(file,index){
			var curPath = path + "/" + file;
			if(fs.lstatSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};
var isAnyFileInUploadDir = function(path) {
	if( fs.existsSync(path) ) {
		var isFile = false;
		fs.readdirSync(path).forEach(function(file,index){
			var curPath = path + "/" + file;
			isFile = true;
		});
		return isFile;
	} else {
		return false;
	}
};
var isPath = function(path) {
	if( fs.existsSync(path) ) {
		return true;
	} else {
		return false;
	}
};
var sourceDir="./test/testfiles";
var uploadDir="./test/upload";
describe("Testy formularzy", function() {
	var moduleResource;
	beforeEach(function (done) {
		myApp = new Core.Application(require("./config/config"));
		app = myApp.appServer;
		moduleResource = new Core.App.Module.Resource(myApp.root, "res1");
		done();
	});
	it("powinien zwrócić json z formularzem tworzenia", function(done){
		moduleResource.addField("model", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
		moduleResource.addField("marka", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
		myApp.init().then(function () {
			request(app).get("/res1/create")
				.end(function (err, res) {
					var formList = res.body.content;
					expect(formList).to.be.length(1);
					var form = formList[0];

					expect(form.fields).to.be.length(2);
					expect(form.fields).to.include.some.property("name","model");
					expect(form.fields).to.include.some.property("name","marka");
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
	it("powinien zwrócić json z formularzem tworzenia który ma błąd walidacji", function(done){
		moduleResource.addField("model", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
		moduleResource.addField("marka", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
		myApp.init().then(function () {
			request(app).post("/res1/create")
				.end(function (err, res) {
					var formList = res.body.content;
					expect(formList).to.be.length(1);
					var form = formList[0];
					expect(form.valid).to.be.false;
					expect(form.responseValidatorList).to.be.length(2);
					expect(form.responseValidatorList).to.include.some.property("field","model");
					expect(form.responseValidatorList).to.include.some.property("field","marka");
					expect(res.status).to.be.equal(422);
					done();
				});
		});
	});
	it("powinien zwrócić json z formularzem edycji", function(done){
		moduleResource.addField("model", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
		moduleResource.addField("marka", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6]}], {length:50});
		moduleResource.addFileField("field", [], {optional:true});
		myApp.init().then(function () {
			request(app).post("/res1/create")
			.field("model", "olek")
			.field("marka", "bolek")
			.attach("field",sourceDir+"/textBig.txt")
			.end(function (err, res) {
				expect(res.status).to.be.equal(200);
				request(app).get("/res1/update/1")
				.end(function (err, res) {
					var formList = res.body.content;
					expect(formList).to.be.length(1);
					var form = formList[0];
					expect(form.fields).to.be.length(4);
					expect(form.fields).to.include.some.property("name","model");
					expect(form.fields).to.include.some.property("name","marka");
					expect(form.fields).to.include.some.property("name","field");
					expect(res.status).to.be.equal(200);
					done();
				});
			});
		});
	});
	it("powinien zwrócić json z formularzem edycji który ma błąd walidacji", function(done){
		moduleResource.addField("model", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6] }], {length:50});
		moduleResource.addField("marka", [{name:"size", class: Core.Field.ValidatorStandard.IsStringLengthValidator,params:[3,6] }], {length:50});
		moduleResource.addField("field", [], {optional:true});
		myApp.init().then(function () {
			request(app).post("/res1/create")
			.field("model", "olek")
			.field("marka", "bolek")
			.end(function (err, res) {
				request(app).post("/res1/update/1")
				.field("model","olefsfddsffdsk")
				.field("field", "1")
				.end(function (err, res) {
					var formList = res.body.content;
					expect(formList).to.be.length(1);
					var form = formList[0];
					expect(form.responseValidatorList).to.be.length(3);
					expect(form.responseValidatorList).to.include.some.property("field","model");
					expect(form.responseValidatorList).to.include.some.property("field","marka");
					expect(res.status).to.be.equal(422);
					done();
				});
			});
		});
	});
});