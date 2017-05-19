"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var http_1 = require('@angular/http');
var http_2 = require('@angular/http');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/map');
var LoginComponent = (function () {
    function LoginComponent(router, http) {
        this.router = router;
        this.http = http;
        this.loginError = false;
        this.failedLogins = 0;
    }
    LoginComponent.prototype.afterError = function () {
        this.failedLogins++;
        console.log(this.failedLogins);
        window.alert('Login fehlgeschlagen!');
    };
    LoginComponent.prototype.onSubmit = function (form) {
        var _this = this;
        //TODO Überprüfen Sie die Login-Daten über die REST-Schnittstelle und leiten Sie den Benutzer bei Erfolg auf die Overview-Seite weiter
        console.log(form.value.username);
        var val = form.value;
        var val1 = form.value.password;
        console.log(form.value.password);
        var headers = new http_2.Headers({ 'Content-Type': 'application/json' });
        var options = new http_2.RequestOptions({
            headers: headers
        });
        this.http.post('http://localhost:8081/login', val, headers).subscribe(function () { return _this.router.navigate(['/overview']); }, function (err) { return _this.afterError(); });
    };
    LoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-login',
            templateUrl: '../views/login.html'
        }), 
        __metadata('design:paramtypes', [router_1.Router, http_1.Http])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map