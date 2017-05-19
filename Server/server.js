/*jslint node: true */
/*jslint esversion: 6*/
/*jslint eqeqeq: true */

var express = require('express');
var app = express();
var fs = require("fs");
var expressWs = require('express-ws')(app);
var http = require('http');

var simulation = require('./simulation.js');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var uuid = require('uuid');
var multer = require('multer');
var upload = multer();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

var username;
var userpassword;

var mydevices;

var router = express.Router();
//TODO Implementieren Sie hier Ihre REST-Schnittstelle
/* Ermöglichen Sie wie in der Angabe beschrieben folgende Funktionen:
 *  Abrufen aller Geräte als Liste
 *  Hinzufügen eines neuen Gerätes
 *  Löschen eines vorhandenen Gerätes
 *  Bearbeiten eines vorhandenen Gerätes (Verändern des Gerätezustandes und Anpassen des Anzeigenamens)
 *  Log-in und Log-out des Benutzers
 *  Ändern des Passworts
 *  Abrufen des Serverstatus (Startdatum, fehlgeschlagene Log-ins).
 *
 *  BITTE BEACHTEN!
 *      Verwenden Sie dabei passende Bezeichnungen für die einzelnen Funktionen.
 *      Achten Sie bei Ihrer Implementierung auch darauf, dass der Zugriff nur nach einem erfolgreichem Log-In erlaubt sein soll.
 *      Vergessen Sie auch nicht, dass jeder Client mit aktiver Verbindung über alle Aktionen via Websocket zu informieren ist.
 *      Bei der Anlage neuer Geräte wird eine neue ID benötigt. Verwenden Sie dafür eine uuid (https://www.npmjs.com/package/uuid, Bibliothek ist bereits eingebunden).
 */
 function writePassword(newPassword){
   var fileName = './resources/login.config';
   fs.readFile(fileName, 'utf8', function (err,data){
     if(err){
       return console.log(err);
     }

     var password = data.replace(userpassword, newPassword);

     fs.writeFile(fileName, password, 'utf8', function (err){
       if(err){
         return console.log(err);
       }
     });

   });
 }



 var myObj = {
   id: "a79dbhb4-g94b-11e6-bf01-fe66835034f3",
   description: "Genauere Informationen zu diesem Thermometer",
   display_name: "Heizkörper Esszimmer",
   type: "Heizkörperthermostat",
   type_name: "eQ-3 Smart",
   image: "images/thermometer.svg",
   image_alt: "Thermometer zur Temperaturanzeige",
   control_units: [
     {
       name: "Temperatur einstellen",
       type: "continuous",
       min: 0,
       max: 50,
       current: 0,
       primary: true
     }
   ]
 };



app.post("/updateCurrent", function (req, res) {
    "use strict";
    //TODO Vervollständigen Sie diese Funktion, welche den aktuellen Wert eines Gerätes ändern soll
    /*
     * Damit die Daten korrekt in die Simulation übernommen werden können, verwenden Sie bitte die nachfolgende Funktion.
     *      simulation.updatedDeviceValue(device, control_unit, Number(new_value));
     * Diese Funktion verändert gleichzeitig auch den aktuellen Wert des Gerätes, Sie müssen diese daher nur mit den korrekten Werten aufrufen.
     */
});


function readUser() {
    "use strict";
    //TODO Lesen Sie die Benutzerdaten aus dem login.config File ein.
	var config = fs.readFileSync('./resources/login.config', 'utf8');
	var passwordIndex = config.indexOf('password: ');
	username = config.slice(10, passwordIndex-2);
	userpassword = config.slice(passwordIndex+10, config.length);
}

function readDevices() {
    "use strict";
    //TODO Lesen Sie die Gerätedaten aus der devices.json Datei ein.
    /*
     * Damit die Simulation korrekt funktioniert, müssen Sie diese mit nachfolgender Funktion starten
     *      simulation.simulateSmartHome(devices.devices, refreshConnected);
     * Der zweite Parameter ist dabei eine callback-Funktion, welche zum Updaten aller verbundenen Clients dienen soll.
     */
	 var readDevices = JSON.parse(fs.readFileSync('./resources/devices.json','utf8'));
	 mydevices = readDevices;
   //console.log(readDevices.devices);
   //return readDevices;
}


function addDevice(newDevice){
  mydevices.devices[mydevices.devices.length] = newDevice;
}


//console.log(devices);
//readDevices();
//console.log(devices);

function refreshConnected() {
    "use strict";
    //TODO Übermitteln Sie jedem verbundenen Client die aktuellen Gerätedaten über das Websocket
    /*
     * Jedem Client mit aktiver Verbindung zum Websocket sollen die aktuellen Daten der Geräte übermittelt werden.
     * Dabei soll jeder Client die aktuellen Werte aller Steuerungselemente von allen Geräte erhalten.
     * Stellen Sie jedoch auch sicher, dass nur Clients die eingeloggt sind entsprechende Daten erhalten.
     *
     * Bitte beachten Sie, dass diese Funktion von der Simulation genutzt wird um periodisch die simulierten Daten an alle Clients zu übertragen.
     */
}

app.use(express.static('C:/Users/ardad/OneDrive/TUWIEN/Web Engineering/UE3/lab3/Client/app/views/'));

app.get('/', function(req,res){

    res.redirect('/login')

});

app.get('/login', function(req,res){

	res.sendFile('C:/Users/ardad/OneDrive/TUWIEN/Web Engineering/UE3/lab3/Client/app/views/login.html')

});


app.get('/overview', function(req,res){

	res.sendFile('C:/Users/ardad/OneDrive/TUWIEN/Web Engineering/UE3/lab3/Client/app/views/overlay.component.html')

});

app.get('/options', function(req,res){

  res.sendFile('C:/Users/ardad/OneDrive/TUWIEN/Web Engineering/UE3/lab3/Client/app/views/options.html')

});

app.post('/options',upload.array(), function(req,res){
 readUser();
 var oldPasswordReceived = req.body["old-password"];
 var newPasswordReceived = req.body["new-password"];
 var repeatPasswordReceived = req.body["repeat-password"];

 if(oldPasswordReceived !== userpassword || newPasswordReceived !== repeatPasswordReceived){
   //console.log("You shall not pass!");
   res.status(401);
   res.end();
 }else{
   //console.log("Proceeding to change password");
   writePassword(newPasswordReceived);
   res.status(200);
   res.end();
 }
});

app.post('/login', function(req,res){
	console.log(req.body.username);
	console.log(req.body.password);
	//index, change hard coded values.
	readUser();
	if(req.body.username == username && req.body.password == userpassword){
  //  res.redirect('/overview')
    res.status(200);
    res.send("OK");
    res.end();
	}else{
    res.status(401); //Unauthorized
		console.log('login failed');
    res.end();
	}
});

var enumDiscrete = ["offen", "halb geschlossen", "geschlossen"];

function Device(id, description, display_name, type, type_name){
  this.id=id,
  this.description=description,
  this.display_name=display_name,
  this.type=type,
  this.type_name = type_name;
  image="",
  image_alt="",
  control_units=[
    {
      name:"",
      type:"",
      //values:[]
      //min
      //max
      //monkey-patch
    }
  ],
  current="",
  primary=""
};

app.post('/overview', function(req,res){
    //create a new device
    console.log(req.body);
    var id = "something";
    var desc = req.body["elementname"];
    var disp_name = req.body["displayname"];
    var type_input = req.body["type_input"]; //Geraetetyp
    var typename = req.body["typename"];
    var elementtype_input = req.body["elementtype-input"]; //actual type... jesus...
    //var elementname = req.body["elementname"];
    //console.log(id);
    //console.log(elementtype_input);
    //console.log(desc);


    var devicetoadd = {
      id:"something",
      description:desc,
      display_name:disp_name,
      type:type_input,
      type_name : typename,
      image:"",
      image_alt:"",
      control_units:[
        {
          name:"",
          type:"",
          //values:[]
          //min
          //max
          //monkey-patch
        }
      ],
      current:"",
      primary:""
    };

    if(elementtype_input == "Ein/Auschalter"){
      console.log("im inside");
      devicetoadd.control_units = [{name:elementtype_input, type:"boolean", values:[ "" ]}];

    }else if(elementtype_input == "Diskrete Werte"){
      if(enumDiscrete.indexOf(req.body["discrete-values"])!==-1){
        var value = req.body["discrete-values"];
        devicetoadd.control_units = [{name:elementtype_input, type:"enum", values:["offen",
        "halb geöffnet",
        "geschlossen"]}];
      }else{
        res.status(400);
        res.end();
      }
      devicetoadd.current = value;
    }else{
      var minimum = req.body["minimum-value"];
      var maximum = req.body["maximum-value"];

      devicetoadd.control_units = [{name:elementtype_input, type:"continuous", min:minimum, max:maximum}]
      devicetoadd.current = 0;
    }

    devicetoadd.primary = true;

    if(type_input === "Beleuchtung"){
      devicetoadd.image = "images/bulb.svg";
      devicetoadd.image_alt = "Glühbirne als Indikator für Aktivierung";
    }else if(type_input === "Heizkörperthermmostat"){
      devicetoadd.image = "images/thermometer.svg";
      devicetoadd.image_alt = "Thermometer zur Temperaturanzeige";
    }else if(type_input === "Rolladen"){
      devicetoadd.image = "images/roller_shutter.svg";
      devicetoadd.image_alt = "Rollladenbild als Indikator für Öffnungszustand";
    }else {
      devicetoadd.image = "images/webcam.svg";
      devicetoadd.image_alt = "Webcam als Indikator für Aktivierung";
    }

    addDevice(devicetoadd);
    console.log(mydevices);
    res.status(200);
    res.end();
    //console.log(devicetoadd);
    //console.log(req.body);
    //add image info

});




var server = app.listen(8081, function () {
    "use strict";
    readUser();
    readDevices();


   //change.foo('arda');
   //console.log(devices);
   //JSON.stringify(myObj);
   //addDevice(myObj);
   //console.log(mydevices)
    var host = server.address().address;
    var port = server.address().port;
    console.log("Big Smart Home Server listening at http://%s:%s", host, port);
});
