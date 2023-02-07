 //AQUI VAN CREDENCIALES Y AUTORIZACIONES DE FIREBASE PARA CONEXION DE INTERFAZ CON BASE DE DATOS
 //AQUI VAN VARIABLES Y VINCULOS POR ESTRUCTURA DE DATOS ARBOLES DE LA BASEDEDATOS.
 //AQUI VAN FUNCIONES DE CADA SENSOR O DISPOSITIVO CONECTADO A LA BASE DE DATOS 
 //FUNCIONES COMO CARGA, DELAYS, SELECCION DE COLORES, RESPUESTAS EN BASE A DATOS LEIDOS,ETC. 
 
 var config = {
    apiKey: "AIzaSyDg0KpjhmYGp3Y4lkzGkiq806AQK8RKk40",
    authDomain: "casa1-6fadc.firebaseapp.com",
    databaseURL: "https://casa1-6fadc.firebaseio.com",
    projectId: "casa1-6fadc",
    storageBucket: "casa1-6fadc.appspot.com",
    messagingSenderId: "781148104853",
    appId: "1:781148104853:web:7a5dc78b232570c1"
  };
  
  firebase.initializeApp(config); // INICIALIZACION DATABASE
  var db = firebase.database();   // db ES LA DATABASE EN GENERAL
  var casa = 'casa1';             // VARIABLE PARA NODO PADRE

  var foco1 = firebase.database().ref(casa).child('foco1'); // VARIABLE ENRUTADA A FOCO 1 
  var foco2 = firebase.database().ref(casa).child('foco2'); // VARIABLE ENRUTADA A FOCO 2
  
  var alarma = firebase.database().ref(casa).child('alarma');            // VARIABLE ENRUTADA A SISTEMA ALARMA
  var movimiento = firebase.database().ref(casa).child('movimiento');    // VARIABLE ENRUTADA A SENSOR PIR
  var temperatura = firebase.database().ref(casa).child('temperatura');  // VARIABLE ENRUTADA A LA TEMPERATURA DEL DHT11
  var humedad = firebase.database().ref(casa).child('humedad');          // VARIABLE ENRUTADA A HUMEDAD DEL DHT11
  var gasSensor = firebase.database().ref(casa).child('gasEstado');      // VARIABLE ENRUTADA A SENSOR DE GAS
 
  var rgbLed = firebase.database().ref(casa).child('rgb');
  var dimmer = firebase.database().ref(casa).child('dimmer');
  var tv = firebase.database().ref(casa).child('tv');
  var netflix = firebase.database().ref(casa).child('netflix');
  var youtube = firebase.database().ref(casa).child('youtube');

  var temFin;
  var humFin;
  var gasStatus;
  
  var colorRGB; // COLOR LEDS 
  
  var parpadeo;
  
//SergioITSE-C4

  function detectaMov(){  // FUNCION PARA CAMBIAR HACER PARPADEAR ICONO DE MOVIMIENTO CUANDO SE ENCIENDE ALARMA 

       $('.mov').text('¡CUIDADO!');
       $(".mov").fadeTo(500, .1)
                .fadeTo(500, 1);
       $(".movImg").fadeTo(500, .1)
                .fadeTo(500, 1);

  }

$(document).ready(function(){   // FUNCIONES PRINCIPALES DEL DOCUMENTO Y DE TODOS LOS SISTEMAS DE LA INTERFAZ

  setTimeout(cargaColor, 1000); // PARA CARGAR LA PALETA DE COLORES DESPUES DE 1 SEGUNDO

    foco1.on("value", function(snapshot){  //DEFINE FUNCION PARA PRENDER FOCO 1
          var valor = snapshot.val();      //GUARDA VALOR EN UNA BASE DE DATOS INSTANTANEA
          console.log(valor);              //MUESTRA EN LA CONSOLA EL VALOR DEL OBJETO CREADOR PARA ESTA DB INSTANTANEA
        
          if(valor != 'on'){                        // SI EL VALOR ES OFF/LOW PROPORCIONA FALSO BOOLEANO A LA RUTA 
              $('#foco1').prop('checked', false);   // DEL FIREBASE
          }else{
              $('#foco1').prop('checked', true);
          }
                
     });


    foco2.on("value", function(snapshot){
          var valor = snapshot.val(); 
          console.log(valor); 
        
          if(valor != 'on'){
              $('#foco2').prop('checked', false);
          }else{
              $('#foco2').prop('checked', true);
          }
                
     });



    alarma.on("value", function(snapshot){
          var valor = snapshot.val(); 
          console.log(valor); 
        
          if(valor != 'on'){
              console.log('sensor activado');
              $('#sensorMovimiento').prop('checked', false);
          }else{
              db.ref('casa1').update({ movimiento: "off"});
              console.log('sensor desactivado');
              $('#sensorMovimiento').prop('checked', true);
          }
                
     });

    movimiento.on("value", function(snapshot){
          var valor = snapshot.val(); 
          console.log(valor); 
        
          if(valor == 'on'){
            console.log('se detecta Movimiento');
            parpadeo =  setTimeout(detectaMov, 1000); // le damos un delay para que alcance 
                                                      // a cargar el ultimo valor en fire
          }else{
            clearInterval(parpadeo); // detenido
            $('.mov').text(' Movimiento');
              
          }                
     });

     netflix.on("value", function(snapshot){
      var valor = snapshot.val(); 
      console.log(valor); 
    
      if(valor != 'on'){
          $('#netflix').prop('checked', false);
      }else{
          $('#netflix').prop('checked', true);
      }
            
 });
    

    temperatura.on("value", function(snapshot){ // FUNCION PARA OBTENER DB INSTANTANEA DE VALORES DE TEMPERATURA DEL DHT11
          var tem = snapshot.val();             // Y VISUALIZAR LA LECTURA EN GRADOS DENTRO DEL MEDIDOR GRAFICO
          temFin = snapshot.val(); 

          $("#grados").gaugeMeter({percent:tem});
     });


    humedad.on("value", function(snapshot){
          var hum = snapshot.val(); 
          humFin = snapshot.val(); 

          $("#humedadMarca").gaugeMeter({percent:hum});
                  
     });


    rgbLed.on("value", function(snapshot){
                            
          colorRGB = snapshot.val(); 
          console.log(colorRGB)

     });


    dimmer.on("value", function(snapshot){
                            
          dim = snapshot.val(); 
          $('#dimvalue').val(dim); // ACTUALIZA EL SLIDER

     });



    gasSensor.on("value", function(snapshot){
          var valor = snapshot.val(); 
          console.log(valor)
          gasStatus = valor;
          $(".gasStatus").text("Gas detectado");

          if(valor == 'G' ){
             $(".star").hide();
             $(".gasStatus").text("Gas");
             }
          
          if(valor == 'P'){
            $(".star").show();
            responsiveVoice.speak('Peligro! altos grados de gas detectados', "Spanish Latin American Female");
          }

          if(valor == 'D'){
            $(".star").show();
            responsiveVoice.speak('Cuidado, Gas detectado', "Spanish Latin American Female");
          }
                
     });

    tv.on("value", function(snapshot){
          var valor = snapshot.val(); 
          console.log(valor); 
        
          if(valor != 'on'){
              $('#tv').prop('checked', false);
          }else{
              $('#tv').prop('checked', true);
          }
                
     });


//SergioITSE-FESC4
    
      
    $("#foco1 , #foco2 , #sensorMovimiento , #netflix ").on( 'change', function() {

        var foco1 = $('#foco1').is(':checked');
        var foco2 = $('#foco2').is(':checked');
        var sensor = $('#sensorMovimiento').is(':checked');
        var tv = $('#tv').is(':checked');
          
         if(foco1 == true){
            db.ref('casa1').update({ foco1: "on"});
         }else{
            db.ref('casa1').update({ foco1: "off"});
         }

         if(foco2 == true){
            db.ref('casa1').update({ foco2: "on"});
         }else{
            db.ref('casa1').update({ foco2: "off"});
         }

         if(sensor == true){
            db.ref('casa1').update({ alarma: "on"});
         }else{
            db.ref('casa1').update({ alarma: "off"});
         }

         if(netflix == true){
            db.ref('casa1').update({ netflix: "on"});
         }else{
            db.ref('casa1').update({ netflix: "off"});
         }

    });


    $('#aromatizante').on('click',function(){

        db.ref('casa1').update({ aromatizante: "on"});

      });


    $('#netflix').on('click',function(){

        db.ref('casa1').update({ netflix: "on"});

      });

    $('#youtube').on('click',function(){

        db.ref('casa1').update({ youtube: "on"});

      });






$(".GaugeMeter").gaugeMeter();

// selector de colores
    

    function cargaColor(){
          var example = new iro.ColorPicker(".wrapper", {
                   
                    width: 320,
                    height: 320,
                    color: colorRGB,
                    anticlockwise: true,
                    borderWidth: 1,
                    borderColor: "#fff",
                     });


          example.on("color:change", function (color) {
                      
                    //console.log(color.rgbString)
                    rgbFire = color.rgb;
                    db.ref('casa1').update({ rgb: rgbFire });

           });




 
// end selector colores


   /* preloader
    * -------------------------------------------------- */
    var clPreloader = function() {
        
        $("html").addClass('cl-preload');
        $('#preloader').hide();
        
    };



    clPreloader();


    }


// asistente    


  $('#dimvalue').on("input", function(e) {
          //console.log($("#dimvalue").val());
          valor = $("#dimvalue").val();
          db.ref('casa1').update({ dimmer: parseInt(valor) });
          
          
  })


}); // TERMINAN LAS FUNCIONES


/**
           __.                                              
        .-".'                      .--.            _..._    
      .' .'                     .'    \       .-""  __ ""-. 
     /  /                     .'       : --..:__.-""  ""-. \
    :  :                     /         ;.d$$    sbp_.-""-:_:
    ;  :                    : ._       :P .-.   ,"TP        
    :   \                    \  T--...-; : d$b  :d$b        
     \   `.                   \  `..'    ; $ $  ;$ $        
      `.   "-.                 ).        : T$P  :T$P        
        \..---^..             /           `-'    `._`._     
       .'        "-.       .-"                     T$$$b    
      /             "-._.-"               ._        '^' ;   
     :                                    \.`.         /    
     ;            SergioITSE           -.   \`."-._.-'-'     
    :                  "Mancha"            .'\   \ \ \ \         
    ;  ;                             /:  \   \ \ . ;        
   :   :                            ,  ;  `.  `.;  :        
   ;    \        ;                     ;    "-._:  ;        
  :      `.      :                     :         \/         
  ;       /"-.    ;                    :                    
 :       /    "-. :                  : ;                    
 :     .'        T-;                 ; ;        
 ;    :          ; ;                /  :        
 ;    ;          : :              .'    ;       
:    :            ;:         _..-"\     :       
:     \           : ;       /      \     ;      
;    . '.         '-;      /        ;    :      
;  \  ; :           :     :         :    '-.      
'.._L.:-'           :     ;    bug   ;    . `. 
                     ;    :          :  \  ; :  
                     :    '-..       '.._L.:-'  
                      ;     , `.                
                      :   \  ; :                
                      '..__L.:-'
**/