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
var sourceDir="./test/upload";
var uploadDir="./upload";
describe("Test uploadu: ", function(){
	describe("Sprawdzenie uploadu zdjęcia gdy akcja nie ma pola pliku", function () {
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
});
