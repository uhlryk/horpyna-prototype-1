var chai = require("chai");
chai.use(require('chai-things'));
var expect = chai.expect;
var request = require('supertest');
var Core = require('./../js/lib/index');
var app;
var myApp
/**
 * podstawowe testy, czy serwer działa i logowanie
 */
describe("Artwave is instantioned, but none modules are added to Artwave. Basic app has route '/' and fallback 404 error: ", function(){
    beforeEach(function(done){
        app = require('./helpers/app')();
        myApp = new Core.Application();
        app.get('/', function (req, res) {
            res.sendStatus(200);
        });
        app.use(function (req, res, next) {
            res.sendStatus(404);
        });
        done();
    });
    it("should return status code 200 when accessing '/' and Artwave router is not added to app.use", function(done){
        request(app).get("/")
            .end(function(err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
    it("should return status code 200 when accessing '/' and Artwave router is added to app.use", function(done){
        app.use(myApp.run());
        request(app).get("/")
            .end(function(err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
    it("should return status code 404 when accessing '/custom' and Artwave router is added to app.use", function(done){
        request(app).get("/custom")
            .end(function(err, res) {
                expect(res.status).to.be.equal(404);
                done();
            });
    });
});
describe("Artwave is instantioned, but none modules are added to Artwave. Basic app has route '/' and none 404 fallback. Artwave app has route 'test': ", function() {
    beforeEach(function (done) {
        app = require('./helpers/app')();
        myApp = new Core.Application();
        app.use("/test/",myApp.run());
        app.get('/', function (req, res) {
            res.sendStatus(200);
        });
        app.use(function (req, res, next) {
            res.sendStatus(500);
        });
        done();
    });
    it("should return status code 200 when accessing '/test'", function (done) {
        request(app).get("/test")
            .end(function (err, res) {
                expect(res.status).to.be.equal(200);
                done();
            });
    });
    it("should return status code 404 when accessing '/test/someurl'", function (done) {
        request(app).get("/test/test")
            .end(function (err, res) {
                expect(res.status).to.be.equal(404);
                done();
            });
    });
});
describe("Artwave is instantioned, added instance of SimpleModule with name 'simple'. Basic app has route '/' and none 404 fallback. Artwave app has route 'test'. Actions named std ", function() {
    beforeEach(function (done) {
        app = require('./helpers/app')();
        myApp = new Core.Application();
        var simpleModule = new Core.SimpleModule("simple");
        myApp.addModule(simpleModule);
        app.use("/test/",myApp.run());
        app.get('/', function (req, res) {
            res.sendStatus(200);
        });
        app.use(function (req, res, next) {
            res.sendStatus(500);
        });
        done();
    });
    it("should return status code 200 when accessing '/test'", function (done) {
        request(app).get("/test")
          .end(function (err, res) {
              expect(res.status).to.be.equal(200);
              done();
          });
    });
    it("should return status code 400 when accessing '/test/simple/List';  'index' is SimpleModule default controller route", function (done) {
        request(app).get("/test/simple/List")
          .end(function (err, res) {
              expect(res.status).to.be.equal(400);
              done();
          });
    });
});
describe("Artwave is instantioned, added instance of SimpleModule with name 'simple'. Basic app has route '/' and none 404 fallback. Artwave app has route 'test'.Actions are set default ", function() {
    beforeEach(function (done) {
        app = require('./helpers/app')();
        myApp = new Core.Application();
        var simpleModule = new Core.SimpleModule("simple");
        myApp.addModule(simpleModule);
        app.use("/test/",myApp.run());
        app.get('/', function (req, res) {
            res.sendStatus(200);
        });
        app.use(function (req, res, next) {
            res.sendStatus(500);
        });
        done();
    });
    it("should return status code 400 when accessing '/test/simple/index';  'index' is SimpleModule default controller route", function (done) {
        request(app).get("/test/simple/List")
          .end(function (err, res) {
              expect(res.status).to.be.equal(400);
              done();
          });
    });
});