import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Component({
    moduleId: module.id,
    selector: 'my-login',
    templateUrl: '../views/login.html'
})
export class LoginComponent {

    loginError: boolean = false;
    failedLogins: number = 0;


    constructor(private router: Router, private http: Http) {
    }

    private afterError() {
      this.failedLogins++;
      console.log(this.failedLogins);
      window.alert('Login fehlgeschlagen!');
    }

    onSubmit(form: NgForm): void {
        //TODO Überprüfen Sie die Login-Daten über die REST-Schnittstelle und leiten Sie den Benutzer bei Erfolg auf die Overview-Seite weiter
        console.log(form.value.username);
        const val = form.value;
        const val1 = form.value.password;
        console.log(form.value.password);



        const headers = new Headers({ 'Content-Type': 'application/json' });

        const options = new RequestOptions({
        headers: headers
        });

        this.http.post('http://localhost:8081/login', val, headers).subscribe(
            () =>  this.router.navigate(['/overview']) ,
            err => this.afterError()
        );


    }
}
