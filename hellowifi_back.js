var exec = require('child_process').exec;
//-------------------------------------------
//
// ------------------------------------------
//  CRON
// ------------------------------------------

exports.cron = function(callback, task , SARAH ){
  if (!task.macadr){
    console.log("Pas de mac adresse du mobile");
    return;
  }
  // VARIABLE MAC ADRES
  // task.macadr
  // LECTURE DU FICHIER ATTENDRE 1 MINUTE AVANT DE LANCER LA DETECTION
  var chain_mobile=new Array("00:d0:d9:02:29:4e","00:21:56:05:90:c0","00:21:56:05:90:c0");
  var non_mobile=new Array("papa","maman","enfant");
  
  
  setTimeout(function(){
		var fs = require("fs");
		var resulat = fs.readFileSync(task.disk+':\\' +task.dossier+ '\\plugins\\hellowifi\\mac_adres.txt', 'UTF-8', function(err, content) {
				if (err) {
						console.err(err);
						} else {
								console.log('file read: ' + content.length + ' bytes');
								}
					});
		// fin lecture fichier
		// recherhce la mac adress dans le fichier test
		resulat = unaccetuate(resulat);
		var machello="";
		machello=resulat.search(task.macadr);
		// si tu trouve la mac adress tu continue
		if (machello !== ""){
			//console.log(" hello :"+machello);
			// extraction de l'adresse ip du mobile
			var ip_mobile=resulat.substring(machello-24,machello-2);
			var mobile_present="";
				if ( ip_mobile !== ""){
						console.log("mobile IP:"+ip_mobile);
						// ping adress mobile et mes le resultat dans un fichier
						var ping_adres  = "ping "+ip_mobile+" > "+task.disk+":\\"+task.dossier+"\\plugins\\hellowifi\\ping.txt";
						var child = exec(ping_adres, function (error, stdout, stderr) {
							if (error !== null) {
									console.log('exec ping:' +error);
									}
							});
						//-------------fin ping	
						// verification que le portable et bien a la maison		
						// LECTURE DU FICHIER PING.TXT
						var fs = require("fs");
						var ping_mobile = fs.readFileSync(task.disk+':\\' +task.dossier+ '\\plugins\\hellowifi\\mac_adres.txt', 'UTF-8', function(err, content) {
							if (err) {
								console.err(err);
									} else {
								console.log('file read: ' + content.length + ' bytes');
								}
						});
						// fin lecture fichier
						var ping_ok="perte 0%";
						mobile_present=resulat.search(ping_ok);
					}
		}
		// fin de la recherche affiche le resultat
		if (mobile_present !== ""){
					console.log('le mobile et la:'+mobile_present);
					} else{
						console.log('le mobile nes pas la');
						}
		//  
	},60000);		
	// DEBUT DU SCAN IP MAC ADRESS DU RESEAU
	
	// GEGERE LE FICHIER IP,MAC ADRESSE
   var mac_adres  = task.disk+":\\"+task.dossier+"\\plugins\\hellowifi\\ping_range.bat";
   //console.log('cmd:'+mac_adres);
   var child = exec(mac_adres, function (error, stdout, stderr) {
			if (error !== null) {
			   		console.log('exec bat:' +error);
					}
			}); 
	
    // --------------------------------------------------------------------------------------------   
   console.log('cron: scan IP');
   }
// -------------------------------------------
// FIN CRON
// -------------------------------------------

exports.action = function(data, callback, config, SARAH){
  // config module
  config = config.modules.hellowifi;
  if (!config.adrees_ip){
		console.log("No plage IP");
		callback({});
		return;
		}
     callback({});
  
}

//------------------ code calandar-------------------------------
var unaccetuate = function(text) {
   text = text.replace(/[יטךכ]/gi, "e");
  text = text.replace(/[אגה]/gi, "a");
  text = text.replace(/[ןמ]/gi, "i");
  text = text.replace(/[üûש]/gi, "u");
  text = text.replace(/[צפ]/gi, "o");
  text = text.replace(/[ח]/gi, "c");
  text = text.replace(/[']/gi, " ");
  text = text.replace(/[-]/gi, ":");
  text = text.replace(/[?]/gi, " ");
  text = text.replace(/[!]/gi, " ");
  text = text.trim();
  return text
}

