var exec = require('child_process').exec;
// ------------------------------------------
//  CRON
// ------------------------------------------

exports.cron = function(callback, task , SARAH ){
  if (!task.macadr){
    console.log("Pas de mac adresse du mobile");
    return;
  }
  // VARIABLE MAC ADRES
  var mac_mobiles=new Array('90-01-3b-e8-25-44',' c0-d0-44-5d-79-35','00-21-56-05-90-c1');
  var non_mobile=new Array('papa','maman','enfant');
  // ----------==========*********===================------------------  
  // LECTURE DU FICHIER ATTENDRE 1 MINUTE AVANT DE LANCER LA DETECTION
 setTimeout(function(){
    // DEBUT DE LA BOUCLE DE RECHERCHE DE PLUSIEUR ADRESS MAC
    var donne=0;
    mac_mobiles.forEach(function(mac_mobile){
		// DEBUT LECTURE FICHER DES MAC ADRESS
		var fs = require("fs");
		var resulat = fs.readFileSync(task.disk+':\\' +task.dossier+ '\\plugins\\hellowifi\\mac_adres.txt', 'UTF-8', function(err, content) {
				if (err) {
						console.log('err lecture mac_adres.txt:'+err);
						} 
					});
		// ------ FIN
		// RECHERCHE LA MAC ADRESS
		var machello="";
//console.log(" mac adre :"+mac_mobile);
		machello = resulat.search(mac_mobile);
//console.log(" hello :"+machello);
		// SI TU TROUVE LA MAC ADDRESS CONTINUE
		if (machello !== "-1" || machello !== "" ){
			// EXTRACTION DE L'ADRESSE IP
			var ip_mobile=resulat.substring(machello-24,machello-2);
//console.log("mobile IP:"+ip_mobile.length);
			var mobile_present="";
				if ( ip_mobile.length !== '0' ){
						// PING ADRESS MOBILE ET MES LE RESULTAT DANS LE FICHIER ping.txt
						var ping_adres  = "ping "+ip_mobile+" > "+task.disk+":\\"+task.dossier+"\\plugins\\hellowifi\\ping.txt";
						var child = exec(ping_adres, function (error, stdout, stderr) {
							if (error !== null) {
									console.log('exec ping:' +error);
									}
							});
						//---- FIN 	
						// VERIFI QUE IP 	
						// LECTURE DU FICHIER mac_adress.txt
					    var fs = require("fs");
						var ping_mobile = fs.readFileSync(task.disk+':\\' +task.dossier+ '\\plugins\\hellowifi\\ping.txt', 'UTF-8', function(err, content) {
							if (err) {
								console.log('err read ping:'+err);
									}
						});
						// -- FIN
						var ping_ok="perte 0%";
						mobile_present=ping_mobile.search(ping_ok);
					}
		}
		// -- FIN
		if (mobile_present !== ""){
					console.log('le mobile de ' +non_mobile[donne]+' et la. ');
					} else{
						console.log('le mobile de '+non_mobile[donne]+' nes pas la. ');
						}
      // -- FIN BOUCLE IP 
      ++donne;	  
	});	
	  //  
},60000);		
	// DEBUT DU SCAN IP MAC ADRESS DU RESEAU
	 
	// SCAN LES IP DU RESEAU
	var mac_adres  = task.disk+":\\"+task.dossier+"\\plugins\\hellowifi\\ping_range.bat";
    //console.log('cmd:'+mac_adres);
    var child = exec(mac_adres, function (error, stdout, stderr) {
			if (error !== null) {
			   		console.log('exec scan:' +error);
					}
			}); 
	// GEGERE LE FICHIER IP,MAC ADRESSE
	var mac_adres  = " arp -a > "+task.disk+":\\"+task.dossier+"\\plugins\\hellowifi\\mac_adres.txt";
    var child = exec(mac_adres, function (error, stdout, stderr) {
			if (error !== null) {
			   		console.log('exec arp:' +error);
					}
			}); 
   // --------------------------------------------------------------------------------------------   
   console.log('cron: Scan Wifi ');
   
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


