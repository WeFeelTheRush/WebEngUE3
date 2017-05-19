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
var http_1 = require('@angular/http');
require('rxjs/add/operator/toPromise');
var router_1 = require('@angular/router');
var http_2 = require('@angular/http');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/map');
var OptionsComponent = (function () {
    function OptionsComponent(router, http) {
        this.router = router;
        this.http = http;
    }
    ;
    OptionsComponent.prototype.ngOnInit = function () {
        this.updateError = false;
    };
    OptionsComponent.prototype.equalsPW = function (form) {
        if (!form || !form.value || !form.value["repeat-password"] || !form.value["new-password"]) {
            return false;
        }
        return form.value["repeat-password"] === form.value["new-password"];
    };
    OptionsComponent.prototype.handleError = function () {
        window.alert("Please check your credentials.");
    };
    /**
     * Liest das alte Passwort, das neue Passwort und dessen Wiederholung ein und übertraegt diese an die REST-Schnittstelle
     * @param form
     */
    OptionsComponent.prototype.onSubmit = function (form) {
        var _this = this;
        //TODO Lesen Sie Daten aus der Form aus und übertragen Sie diese an Ihre REST-Schnittstelle
        //this.altesPasswort = form.value["old-password"];
        //this.neuesPasswort = form.value["new-password"];
        //this.neuesPasswortWiederholt = form.value["repeat-password"];
        var val = form.value;
        if (!form) {
            return;
        }
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_2.RequestOptions({
            headers: headers
        });
        this.http.post('http://localhost:8081/options', val, headers).subscribe(function () { return _this.router.navigate(['/overview']); }, function (err) { return _this.handleError(); });
    };
    OptionsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-options',
            templateUrl: '../views/options.html'
        }), 
        __metadata('design:paramtypes', [router_1.Router, http_1.Http])
    ], OptionsComponent);
    return OptionsComponent;
}());
exports.OptionsComponent = OptionsComponent;
//# sourceMappingURL=options.component.js.map