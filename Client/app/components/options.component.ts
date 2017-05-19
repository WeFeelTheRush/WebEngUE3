import {Component, OnInit} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';

import { Response } from '@angular/http';
import { RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Component({
    moduleId: module.id,
    selector: 'my-options',
    templateUrl: '../views/options.html'
})
export class OptionsComponent implements OnInit {

    updateError: boolean;
    altesPasswort: string;
    neuesPasswort: string;
    neuesPasswortWiederholt: string;

    constructor(private router: Router, private http: Http) {
    };

    ngOnInit(): void {
        this.updateError = false;
    }

    public equalsPW(form: NgForm): boolean {
        if (!form || !form.value || !form.value["repeat-password"] || !form.value["new-password"]) {
            return false;
        }
        return form.value["repeat-password"] === form.value["new-password"];
    }

    handleError(){
      window.alert("Please check your credentials.");
    }

    /**
     * Liest das alte Passwort, das neue Passwort und dessen Wiederholung ein und übertraegt diese an die REST-Schnittstelle
     * @param form
     */
    onSubmit(form: NgForm): void {

        //TODO Lesen Sie Daten aus der Form aus und übertragen Sie diese an Ihre REST-Schnittstelle
        //this.altesPasswort = form.value["old-password"];
        //this.neuesPasswort = form.value["new-password"];
        //this.neuesPasswortWiederholt = form.value["repeat-password"];
        const val = form.value;
        if (!form) {
            return;
        }

        const headers = new Headers({ 'Content-Type': 'application/json' });

        const options = new RequestOptions({
        headers: headers
        });

        this.http.post('http://localhost:8081/options', val, headers).subscribe(
            () =>  this.router.navigate(['/overview']) ,
            err => this.handleError()
        );

    }

}
