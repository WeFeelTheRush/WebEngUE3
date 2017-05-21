import {Device} from '../model/device';
import {Injectable} from '@angular/core';

import {DEVICES} from '../resources/mock-device';
import {DeviceParserService} from './device-parser.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {ControlUnit} from '../model/controlUnit'


import 'rxjs/add/operator/toPromise';


@Injectable()
export class DeviceService {

    constructor(private parserService: DeviceParserService, private http: Http) {
    }

    //TODO Sie können dieses Service benutzen, um alle REST-Funktionen für die Smart-Devices zu implementieren

    getDevices(): Promise<Device[]> {
        //TODO Lesen Sie die Geräte über die REST-Schnittstelle aus
        /*
         * Verwenden Sie das DeviceParserService um die via REST ausgelesenen Geräte umzuwandeln.
         * Das Service ist dabei bereits vollständig implementiert und kann wie unten demonstriert eingesetzt werden.
         */

        return this.http.get('http://localhost:8081/overview').toPromise().then(response => {
          let devices = response.json()
          devices = devices.devices;
            for (let i = 0; i < devices.length; i++) {
                devices[i] = this.parserService.parseDevice(devices[i]);
                console.log(devices[i]);
            }
            return devices;
        });
    }

    getDevice(id: string): Promise<Device> {
        return this.getDevices()
            .then(devices => devices.find(device => device.id === id));
    }

    postAjaxRequest(device: Device, controlUnit: ControlUnit){
      const device_data = device;
      const device_controlunit = controlUnit;


      let xhr = new XMLHttpRequest();

      let method = 'POST';
      let url = 'http://localhost:8081/updateCurrent';

      xhr.open(method, url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      //xhr.setRequestHeader("Access-Control-Allow-Origin", "*");

      xhr.onreadystatechange = function(){
        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
          console.log(xhr.responseText);
        }
      }
        xhr.send(JSON.stringify({id:device.id, c_unit:device_controlunit}));
    }

}
