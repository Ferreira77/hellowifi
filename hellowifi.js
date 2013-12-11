var exec = require('child_process').exec;
// ------------------------------------------
//  CRON
// ------------------------------------------

exports.cron = function(callback, task , SARAH ){
  if (!task.dossier){
    console.log("cron :hellowifi Pas de dossier");
    return;
  }
   if (!task.disk){
    console.log("cron :hellowifi Pas de disque");
    return;
  }
  // ===============================================================================================
  var urlfile = task.disk+":\\"+task.dossier+"\\plugins\\hellowifi\\";   
 // ECRIRE LA MAC ADRESSE EN MINUSCULE 
  var mac_mobiles=new Array('90-01-3b-e8-25-44',' c0-d0-44-5d-79-35','98-0c-82-ec-d6-ad');
  // -- LIGNE  A COPIER non_mobile 
  var non_mobiles=new Array('papa','maman','enfant');
  // ===============================================================================================
  // LECTURE DU FICHIER ATTENDRE 1 MINUTE AVANT DE LANCER LA DETECTION
 setTimeout(function(){
    // DEBUT DE LA BOUCLE DE RECHERCHE DE PLUSIEUR ADRESS MAC
    var donne=0; 
    mac_mobiles.forEach(function(mac_mobile){
		// DEBUT LECTURE FICHER DES MAC ADRESS
		var resulat = readfile(urlfile+'mac_adres.txt');
		// ------ FIN
		// RECHERCHE DE LA MAC ADRESS
		var machello="";
		machello = resulat.search(mac_mobile);
		// SI TU TROUVE LA MAC ADDRESS CONTINUE
		if (machello !== "-1" || machello !== "" ){
			// EXTRACTION DE L'ADRESSE IP
			var ip_mobile=resulat.substring(machello-24,machello-2);
			var mobile_present="";
				if ( ip_mobile.length >= 1  ){
				    // MAC ADRESS PRESENTE SUR LE RESEAU 
					var mobile_present= 3;		
					}
			}
		// -- FIN
		// LECTURE DE L'ETAT AVANT MODIFICATION
		var retour_etat = readfile(urlfile+non_mobiles[donne]+".txt");
		if (mobile_present >= 1 ){
					//
					// mac adresse on line
					console.log( non_mobiles[donne]+' ON LINE ');
					save_file(urlfile+non_mobiles[donne]+".txt",'TRUE');
					// NOTIFICATION
					if (retour_etat != "TRUE") {
												if (task.notification == "TRUE") {
															 SARAH.speak(non_mobiles[donne]+' viens de rentre a la maison');
															 }
												}
					//================================================================================================							
					} else{
						// mac adresse off line
						console.log(non_mobiles[donne]+' OFF LINE ');
						save_file(urlfile+non_mobiles[donne]+".txt",'FALSE');
						// NOTIFICATION
						if (retour_etat != "FALSE") {
												if (task.notification == "TRUE") {
															 SARAH.speak(non_mobiles[donne]+' viens de sortir de la maison');
															 }
												}
						}
	    // -- FIN BOUCLE IP 
    ++donne;	  
	});	
	  //  
},60000);		
	// DEBUT DU SCAN IP MAC ADRESS DU RESEAU
    // SCAN LES IP DU RESEAU 
	var mac_adres  = urlfile+"ping_range.bat";
    var child = exec(mac_adres, function (error, stdout, stderr) {
			if (error !== null) {
			   		console.log('exec scan:' +error);
					}
			}); 
	// GEGERE LE FICHIER IP,MAC ADRESSE
	var mac_adres  = " arp -a > "+urlfile+"mac_adres.txt";
    var child = exec(mac_adres, function (error, stdout, stderr) {
			if (error !== null) {
			   		console.log('exec arp:' +error);
					}
			}); 

// -------------------------------------------
// FIN CRON
// -------------------------------------------
   console.log('cron: Scan network');
   }

exports.action = function(data, callback, config, SARAH){
  // config module
  config = config.modules.hellowifi;
 // ==================================================================================================================== 		
 // -- COLLER ICI LIGNE  non_mobile
 var non_mobiles=new Array('papa','maman','enfant');		
 // ====================================================================================================================
 var urlfile = config.disk+":\\"+config.dossier+"\\plugins\\hellowifi\\"; 
 // COMPTE LES PRESENTS 
  var donne=0;
		non_mobiles.forEach(function(non_mobile){
			var retour_etat = readfile(urlfile+non_mobile+".txt");
			if (retour_etat == "TRUE") {++donne; }
		});	
  // FIN DE LA BOUCLE DE COMPTAGE
  
  switch(data.key)
  		{
		case "IN":
		// ON LINE  VUE
			SARAH.speak('Je detecte la présence de ');
			    // BOUCLE DE LECTUER
				non_mobiles.forEach(function(non_mobile){
					// LECTURE FICHIER DE L ETAT
					var retour_etat = readfile(urlfile+non_mobile+".txt");
							if (retour_etat == "TRUE") {
										SARAH.speak(non_mobile);
										}
					});	
		break;
		
		case "OUT":
		// OFF LINE NON VUE
		// COMPTE LES NON VUE
		var nonvu =0;
		non_mobiles.forEach(function(non_mobile){
					// LECTURE FICHIER DE L ETAT
					var retour_etat = readfile(urlfile+non_mobile+".txt");
						if (retour_etat == "FALSE") {
										++nonvu;
										}
								});
		//--------------------------------------------
		
		console.log('rt:'+ donne);
		if (donne == nonvu ){
				SARAH.speak('Tout le monde est de sortie');	
				break;
				} 
				
		if (nouvu == '0'){
		        SARAH.speak('Tout le monde est a la maison');
				break;			   
			   }
		if (nouvu != donne){
					SARAH.speak('Je detecte pas ');
					// BOUCLE DE LECTUER
					non_mobiles.forEach(function(non_mobile){
					// LECTURE FICHIER DE L ETAT
					var retour_etat = readfile(urlfile+non_mobile+".txt");
						if (retour_etat == "FALSE") {
										SARAH.speak(non_mobile);
										}
								});	
								
			}					
		break;
		
		case "CALL":
		// COMPTE LES PRESENCES
			if (donne >=1){
			            SARAH.speak('Je detecte '+donne+' personnes ');
						} else {
								 SARAH.speak('Je detecte personnes ');
								 }
		break;
		
		}
callback({});
}
 //**********************************************************************************************************************
// ======================= subroutine sauver fichier
var save_file = function(filesave,txtsave) {
        var fs = require('fs');
		fs.writeFile(filesave, txtsave, function(err) {
				if(err) {
					console.log('err save file:'+err);
				return "ERROR";
			} 
 }); 
return
}

//  ============================= subroutine lecture fichier
var readfile = function(fileread){
		var fs = require('fs');
		var resulat_read = fs.readFileSync(fileread, 'UTF-8', function(err, content) {
				if (err) {
						console.log('err lecture fichier:'+fileread);
						return "ERROR";
						} 
				
		});
return resulat_read
}