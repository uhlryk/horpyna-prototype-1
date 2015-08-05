var express = require('express');
var chai = require("chai");
var fs = require("fs");
var morgan = require("morgan");
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
var sourceDir="./test/upload";
var uploadDir="./upload";
describe("Test uploadu: ", function(){
	describe("Sprawdzenie uploadu zdjęcia bez walidacji", function () {
		var myField1;
		beforeEach(function (done) {
			deleteFolderRecursive(uploadDir);
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var myAction = new Core.Action.BaseAction(Core.Action.BaseAction.POST, "act1");
			myModule.addAction(myAction);
			var fileAction = new Core.Action.BaseAction(Core.Action.BaseAction.POST, "file");
			myModule.addAction(fileAction);
			myField1 = new Core.Field("field1", Core.Action.FieldType.FILE_FIELD);
			fileAction.addField(myField1);

			myApp.init().then(function () {
				done();
			});
		});
		it("zwraca 200 gdy wyślemy plik do akcji która na niego nie czeka (nie zostanie przez serwer przyjęty)'", function (done) {
			request(app).post("/mod1/act1/")
				.attach("field1",sourceDir+"/text.txt")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					expect(isAnyFileInUploadDir(uploadDir)).to.be.false;
					done();
				});
		});
		it("zwraca 200 gdy wyślemy plik do akcji która czeka na plik'", function (done) {
			request(app).post("/mod1/file/")
				.attach("field1",sourceDir+"/text.txt")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					expect(isAnyFileInUploadDir(uploadDir)).to.be.true;
					done();
				});
		});
	});
	describe("Sprawdzenie uploadu pliku z walidacją mime type", function () {
		var myField1;
		beforeEach(function (done) {
			deleteFolderRecursive(uploadDir);
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var fileAction = new Core.Action.BaseAction(Core.Action.BaseAction.POST, "file");
			fileAction.setActionHandler(function(request, response, action){
				var v = request.getField(Core.Action.FieldType.FILE_FIELD,"field1");
				// console.log(v);
			});
			myModule.addAction(fileAction);
			myField1 = new Core.Field("field1", Core.Action.FieldType.FILE_FIELD);
			fileAction.addField(myField1);
			// var myField2 = new Core.Field("field2", Core.Action.FieldType.FILE_FIELD);
			// fileAction.addField(myField2);
			done();
		});
		it("zwraca 200 gdy wyślemy plik o właściwym mime, a walidacja w fazie preupload'", function (done) {
			var MimeTypeValidator = Core.Validator.File.MimeTypeValidator;
			var val = new MimeTypeValidator("mime", MimeTypeValidator.TEXT_MIME, Core.Validator.BaseValidator.PREUPLOAD_PHASE);
			myField1.addValidator(val);
			myApp.init().then(function () {
				request(app).post("/mod1/file/")
				.attach("field1",sourceDir+"/text.txt")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					expect(isAnyFileInUploadDir(uploadDir)).to.be.true;
					done();
				});
			});
		});
		it("zwraca 422 gdy wyślemy plik o NIE właściwym mime, a walidacja w fazie preupload'", function (done) {
			var MimeTypeValidator = Core.Validator.File.MimeTypeValidator;
			var val = new MimeTypeValidator("mime", MimeTypeValidator.JPEG_MIME, Core.Validator.BaseValidator.PREUPLOAD_PHASE);
			myField1.addValidator(val);
			myApp.init().then(function () {
				request(app).post("/mod1/file/")
				.attach("field1",sourceDir+"/text.txt")
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					expect(isAnyFileInUploadDir(uploadDir)).to.be.true;
					done();
				});
			});
		});
		it("zwraca 200 gdy wyślemy plik o właściwym mime, a walidacja w fazie postupload'", function (done) {
			var MimeTypeValidator = Core.Validator.File.MimeTypeValidator;
			var val = new MimeTypeValidator("mime", MimeTypeValidator.TEXT_MIME, Core.Validator.BaseValidator.POSTUPLOAD_PHASE);
			myField1.addValidator(val);
			myApp.init().then(function () {
				request(app).post("/mod1/file/")
				.attach("field1",sourceDir+"/text.txt")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					expect(isAnyFileInUploadDir(uploadDir)).to.be.true;
					done();
				});
			});
		});
		it("zwraca 422 gdy wyślemy plik o NIE właściwym mime, a walidacja w fazie postupload'", function (done) {
			var MimeTypeValidator = Core.Validator.File.MimeTypeValidator;
			var val = new MimeTypeValidator("mime", MimeTypeValidator.JPEG_MIME, Core.Validator.BaseValidator.POSTUPLOAD_PHASE);
			myField1.addValidator(val);
			myApp.init().then(function () {
				request(app).post("/mod1/file/")
				.attach("field1",sourceDir+"/text.txt")
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					expect(isAnyFileInUploadDir(uploadDir)).to.be.true;
					done();
				});
			});
		});
	});
	describe("Sprawdzenie uploadu zdjęcia z walidacją rozmiaru ", function () {
		var myField1;
		beforeEach(function (done) {
			deleteFolderRecursive(uploadDir);
			app = require('./core/app')();
			myApp = new Core.Application(app);
			var myModule = new Core.Module("mod1");
			myApp.addModule(myModule);
			var fileAction = new Core.Action.BaseAction(Core.Action.BaseAction.POST, "file");
			fileAction.setActionHandler(function(request, response, action){
				var v = request.getField(Core.Action.FieldType.FILE_FIELD,"field1");
				// console.log(v);
			});
			myModule.addAction(fileAction);
			myField1 = new Core.Field("field1", Core.Action.FieldType.FILE_FIELD);
			fileAction.addField(myField1);
			// var myField2 = new Core.Field("field2", Core.Action.FieldType.FILE_FIELD);
			// fileAction.addField(myField2);
			done();
		});
		it("zwraca 200 gdy wyślemy plik o właściwym rozmiarze'", function (done) {
			var SizeValidator = Core.Validator.File.SizeValidator;
			var val = new SizeValidator("mime", 3, 10);
			myField1.addValidator(val);
			myApp.init().then(function () {
				request(app).post("/mod1/file/")
				.attach("field1",sourceDir+"/text.txt")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					expect(isAnyFileInUploadDir(uploadDir)).to.be.true;
					done();
				});
			});
		});
		it("zwraca 422 gdy wyślemy plik o za dużym rozmiarze'", function (done) {
			var SizeValidator = Core.Validator.File.SizeValidator;
			var val = new SizeValidator("mime", 3, 10);
			myField1.addValidator(val);
			myApp.init().then(function () {
				request(app).post("/mod1/file/")
				.attach("field1",sourceDir+"/textBig.txt")
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					expect(isAnyFileInUploadDir(uploadDir)).to.be.true;
					done();
				});
			});
		});
	});
	describe("Sprawdzenie uploadu pliku przez ResourceModule gdy plik jest obowiązkowy", function (done) {
		var moduleResource1;
		var filePath;
		before(function (done) {
			deleteFolderRecursive(uploadDir);
			app = require('./core/app')();
			myApp = new Core.Application(app);
			myApp.setDbDefaultConnection("postgres", "localhost", 5432, "horpyna", "root", "root");
			moduleResource1 = new Core.ResourceModule("res1");
			myApp.addModule(moduleResource1);
			moduleResource1.addField("sometext", Core.Action.FormInputType.TEXT, [], {length:50});
			moduleResource1.addField("field1", Core.Action.FormInputType.FILE, []);
			myApp.init().then(function () {
				done();
			});
		});
		it("kod 200 create", function (done) {
			request(app).post("/res1/create")
				.field("sometext", "ala")
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
		it("kod 200 create", function (done) {
			request(app).post("/res1/create")
				.attach("field1",sourceDir+"/textBig.txt")
				.field("sometext", "ala")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					expect(res.body.redirect.status).to.be.equal(302);
					done();
				});
		});
		it("kod 200 list", function (done) {
			request(app).get("/res1/list")
				.end(function (err, res) {
					filePath = res.body.content[0].element.field1[0].path;
					expect(isPath(filePath)).to.be.true;
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 detail", function (done) {
			request(app).get("/res1/detail/1")
				.end(function (err, res) {
					filePath = res.body.content.element.field1[0].path;
					expect(isPath(filePath)).to.be.true;
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 edycja tylko pola tekstowego", function (done) {
			request(app).post("/res1/update/1")
				.field("sometext", "ala111")
				.end(function (err, res) {
					expect(res.status).to.be.equal(422);
					done();
				});
		});
		it("kod 200 edujemy plik, więc ścieżka powinna być inna", function (done) {
			deleteFolderRecursive(uploadDir);
			request(app).post("/res1/update/1")
				.field("sometext", "ala222")
				.attach("field1",sourceDir+"/text.txt")
				.end(function (err, res) {
					expect(isPath(filePath)).to.be.false;
					expect(res.status).to.be.equal(200);
					expect(res.body.redirect.status).to.be.equal(302);
					done();
				});
		});
		it("kod 200 delete", function (done) {
			request(app).post("/res1/delete/1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					expect(res.body.redirect.status).to.be.equal(302);
					done();
				});
		});
	});
	describe("Sprawdzenie uploadu pliku przez ResourceModule gdy plik jest opcjonalny", function (done) {
		var moduleResource1;
		var filePath;
		before(function (done) {
			deleteFolderRecursive(uploadDir);
			app = require('./core/app')();
			myApp = new Core.Application(app);
			myApp.setDbDefaultConnection("postgres", "localhost", 5432, "horpyna", "root", "root");
			moduleResource1 = new Core.ResourceModule("res1");
			myApp.addModule(moduleResource1);
			moduleResource1.addField("sometext", Core.Action.FormInputType.TEXT, [], {length:50});
			moduleResource1.addField("field1", Core.Action.FormInputType.FILE, [], {isOptional:true});
			myApp.init().then(function () {
				done();
			});
		});
		it("kod 200 create", function (done) {
			request(app).post("/res1/create")
				.field("sometext", "ala")
				.end(function (err, res) {
					console.log(res.body);
					expect(isAnyFileInUploadDir(uploadDir)).to.be.false;
					expect(res.status).to.be.equal(200);
					expect(res.body.redirect.status).to.be.equal(302);
					done();
				});
		});
		it("kod 200 edycja pola bez pliku i w edycji też nie dodaliśmy", function (done) {
			request(app).post("/res1/update/1")
				.field("sometext", "ala111")
				.end(function (err, res) {
					expect(isAnyFileInUploadDir(uploadDir)).to.be.false;
					expect(res.status).to.be.equal(200);
					expect(res.body.redirect.status).to.be.equal(302);
					done();
				});
		});
		it("kod 200 edycja pola bez pliku i w edycji dodajemy", function (done) {
			request(app).post("/res1/update/1")
				.field("sometext", "ala111")
				.attach("field1",sourceDir+"/textBig.txt")
				.end(function (err, res) {
					expect(isAnyFileInUploadDir(uploadDir)).to.be.true;
					expect(res.status).to.be.equal(200);
					expect(res.body.redirect.status).to.be.equal(302);
					done();
				});
		});
		it("kod 200 szczegóły formularza który ma plik dodany", function (done) {
			request(app).get("/res1/detail/1")
				.end(function (err, res) {
					filePath = res.body.content.element.field1[0].path;
					expect(isPath(filePath)).to.be.true;
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 edycja pola z plikiem  ale w edycji nie  dodajemy nowego i nie usuwamy starego", function (done) {
			request(app).post("/res1/update/1")
				.field("sometext", "ala111")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					expect(res.body.redirect.status).to.be.equal(302);
					done();
				});
		});
		it("kod 200 szczegóły pola które ma plik", function (done) {
			request(app).get("/res1/detail/1")
				.end(function (err, res) {
					// expect(res.body.content.element.field1).to.be.not.null;
					filePath = res.body.content.element.field1[0].path;
					expect(isPath(filePath)).to.be.true;
					expect(res.status).to.be.equal(200);
					done();
				});
		});
		it("kod 200 edycja pola z plikiem  ale w edycji nie  dodajemy nowego i usuwamy stary", function (done) {
			request(app).post("/res1/update/1")
				.field("sometext", "ala111")
				.field("field1", "1")
				.end(function (err, res) {
					expect(res.status).to.be.equal(200);
					expect(res.body.redirect.status).to.be.equal(302);
					done();
				});
		});
		it("kod 200 szczegóły pola które nie ma pliku", function (done) {
			request(app).get("/res1/detail/1")
				.end(function (err, res) {
					expect(res.body.content.element.field1).to.be.null;
					expect(res.status).to.be.equal(200);
					done();
				});
		});
	});
});
