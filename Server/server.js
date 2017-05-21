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
var router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

var username;
var userpassword;

var mydevices;

var noobIdGenerator = 0;

var discrete_values = ["offen", "halb geöffnet", "geschlossen"];

var failed_logins = 0;

router.get('/details/:id', function(req,res){
  console.log(req.baseUrl);
  res.send("Hai!");
})
app.use('/details/:id',router);

//  device actions
const DEVICE_CREATED  = "DEVICE_CREATED";
const DEVICE_UPDATED  = "DEVICE_UPDATED";
const DEVICE_DELETED  = "DEVICE_DELETED";

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


 function addDevice(newDevice){
   mydevices.devices[mydevices.devices.length] = newDevice;
 }


app.post("/updateCurrent", function (req, res) {
    "use strict";
    //TODO Vervollständigen Sie diese Funktion, welche den aktuellen Wert eines Gerätes ändern soll
    /*
     * Damit die Daten korrekt in die Simulation übernommen werden können, verwenden Sie bitte die nachfolgende Funktion.
     *      simulation.updatedDeviceValue(device, control_unit, Number(new_value));
     * Diese Funktion verändert gleichzeitig auch den aktuellen Wert des Gerätes, Sie müssen diese daher nur mit den korrekten Werten aufrufen.
     */
	 var targetDevice = mydevices.devices[findDeviceIndex(req.body["id"])];
  for(var i=0;i<targetDevice.control_units.length;i++){
    if(targetDevice.control_units[i].name === req.body["c_unit"].name){
      targetDevice.control_units[i] = req.body["c_unit"];
      break;
    }
  }
  console.log(mydevices.devices[findDeviceIndex(req.body["id"])].control_units);

  res.status(200).end();
	 
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
}


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

//app.use(express.static('C:/Users/ardad/OneDrive/TUWIEN/Web Engineering/UE3/lab3/Client/app/views/'));

function findDevice(id){
  for(i =0;i<mydevices.devices.length;i++){
    if(mydevices.devices[i].id == id){
      return mydevices.devices[i];
    }
  }

}

function findDeviceIndex(id){
  for(i =0;i<mydevices.devices.length;i++){
    if(mydevices.devices[i].id == id){
      return i;
    }
  }

}

function deleteDevice(id){
  for(i =0;i<mydevices.devices.length;i++){
    if(mydevices.devices[i].id == id){
      mydevices.devices.splice(i,1);
    }
  }
}

//Landing page is login.  *this is a server-side root route, it probably shouldn't provide any GUI (unless requested)
app.get('/', function(req,res){

    //res.redirect('/login')
    res.send("Hello From Big Home Backend!");
});

app.get('/login', function(req,res){

	res.json(failed_logins);
	res.status(200).end();

});

/*
app.get('/options', function(req,res){

  res.sendFile('C:/Users/ardad/OneDrive/TUWIEN/Web Engineering/UE3/lab3/Client/app/views/options.html')

});
*/


app.get('/overview', function(req,res){

  res.json(mydevices);

});

app.post('/options',upload.array(), function(req,res){

 readUser();

 if(req.body["old-password"] !== userpassword || req.body["new-password"] !== req.body["repeat-password"]){
   res.status(401).end();
 }else{
   writePassword(newPasswordReceived);
   res.status(200).end();
 }
});

app.post('/login', function(req,res){
	readUser();
	if(req.body.username == username && req.body.password == userpassword){
    res.status(200).end();
	}else{
	failed_logins++;
    res.status(401).end(); //Unauthorized
	}
});




/*
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

    }
  ],
  current="",
  primary=""
};
*/
app.post('/edit_device', function(req,res){

  var device_id = req.body["id"];
  //console.log(req.body);
  findDevice(req.body["id"]).display_name = req.body["display_name"];
  res.status(200).end();

  informClients(DEVICE_UPDATED, {
    id: device_id
  });

});

app.post('/delete_device', function(req,res){
  //console.log(req.body);

  var device_id = req.body["id"];
  console.log(mydevices);
  deleteDevice(req.body["id"]);
  console.log(mydevices);
  res.status(200).end();

  informClients(DEVICE_DELETED, {
    id: device_id
  });

});

app.post('/overview', function(req,res){
    //create a new device
    var desc              = req.body["elementname"];
    var disp_name         = req.body["displayname"];
    var type_input        = req.body["type-input"];
    var typename          = req.body["typename"];
    var elementtype_input = req.body["elementtype-input"];

    var devicetoadd = {
      id:           noobIdGenerator++,
      description:  desc,
      display_name: disp_name,
      type:         type_input,
      type_name:    typename,
      image:        "",
      image_alt:    "",
      control_units:[
        {
          name:"",
          type:"",
        }
      ],
      current:      "",
      primary:      ""
    };

    if(elementtype_input == "Ein/Auschalter"){

      devicetoadd.control_units = [
        { name:elementtype_input,
          type:"boolean",
          values:[ "" ],
          current:0,
          primary:true }
       ];

    }else if(elementtype_input == "Diskrete Werte"){

      if(discrete_values.indexOf(req.body["discrete-values"])!==-1){

        var value = req.body["discrete-values"];
        console.log(value);
        devicetoadd.control_units = [
          { name:   elementtype_input,
            type:   "enum",

            values:["offen",
                    "halb geöffnet",
                    "geschlossen"],

            current: value,
            primary: true }
          ];

      }else{

        res.status(400).end();
        return;

      }
    }else{

      var minimum = req.body["minimum-value"];
      var maximum = req.body["maximum-value"];

      if(minimum>maximum){
        res.end();
        return;
      }
      var currentValue = 0;

      //Calculate a default current value
      if(minimum<0){
        if(maximum<0){
          currentValue = minimum - maximum;
        }else{
          currentValue = maximum + minimum;
        }
      }else{
        currentValue = maximum - minimum;
      }

      devicetoadd.control_units = [{name:elementtype_input, type:"continuous", min:minimum, max:maximum, current:currentValue,primary:true}]

    }

    devicetoadd.primary = true;

    //Put images accordingly.
    if(type_input == "Beleuchtung"){
      devicetoadd.image = "images/bulb.svg";
      devicetoadd.image_alt = "Glühbirne als Indikator für Aktivierung";
    }else if(type_input == "Heizkörperthermostat"){
      devicetoadd.image = "images/thermometer.svg";
      devicetoadd.image_alt = "Thermometer zur Temperaturanzeige";
    }else if(type_input == "Rollladen"){
      devicetoadd.image = "images/roller_shutter.svg";
      devicetoadd.image_alt = "Rollladenbild als Indikator für Öffnungszustand";
    }else {
      devicetoadd.image = "images/webcam.svg";
      devicetoadd.image_alt = "Webcam als Indikator für Aktivierung";
    }

    addDevice(devicetoadd);
    res.status(200);
    res.end();

    var device_id = devicetoadd.id;

    informClients(DEVICE_CREATED, {
      id: device_id
    });

});


/* web socket endpoint */
//  config and test
router.ws('/echo', function(ws, req) {
  ws.on('message', function(msg) {

    wss.clients.forEach(function each(client) {
      if (client.readyState === ws.OPEN) {
        client.send("Hello WS Client!");
      }
    });

  });
  console.log('hello');
});
 
/* web socket root */
app.use("/ws-stuff", router);

/* sends message to all web socket clients */
//  @action type of action successfully carried out on the server
//  @data   least amount of information necessary in order to identify entity related to the above action
function informClients(action, data){

  var wss = expressWs.getWss();

    console.log(wss);

    wss.clients.forEach(function each(client) {
      //if (client.readyState === ws.OPEN) {
        //client.send(req.body["id"]);
      //}

      try {

        client.send(JSON.stringify({
          "action": action,
          "data": data
        }));

      } catch(err) {

        console.log(err);

      }

    });
}


/* server init */
var server = app.listen(8081, function () {
    "use strict";

    try {

      readUser();
      readDevices();
      var host = server.address().address;
      var port = server.address().port;
      console.log("Big Smart Home Server listening at http://%s:%s", host, port);
    
    } catch(err){

      console.log(err);
    }

});
