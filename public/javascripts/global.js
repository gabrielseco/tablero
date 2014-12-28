$(function(){
     localStorage.clear();
     $("#numJugadores").focus();
     bindEvents();//all events are sended to this function

});


//Function that creates the input's or is an error we treat the error's that occured

function enviarJugadores(){


    $(".winner").remove(); // removing the winner div


    var numJugadores = $("#numJugadores").val();//get the value of the principal input

    numJugadores = +numJugadores; //PARSE THE NUMBER OF PLAYERS

    $("i").remove(); // removing the x

        if ( isNaN(numJugadores) || numJugadores <= 1 || numJugadores >= 9 ) {
          $("#wrapper").addClass("inner-addon right-addon");
          $("#wrapper").prepend("<i class='glyphicon fa fa-times errorJugador'></i>");
          $("#numJugadores").val("");
        }
        else {
            $("#numJugadores").remove();
            $("#enviarJugadores").remove();

            numeroInput(numJugadores); //SEND THE NUMBER OF PLAYERS TO GENERATE HTML
            bindEvents(numJugadores);
        }
}


//We generate the number of inputs based in the number of players entered.And we change the colour of the button
function numeroInput(numJugadores) {
    var html = "";
    for ( var i = 0;i<numJugadores;i++ ) {
         html += "<input type='text' placeholder='Nombre usuario' name='usuario_"+i+"' id='usuario_"+i+"'class='nombreJugador' />";
            }
            $("#wrapper").prepend(html);
            $(".nombreJugador").first().focus();
            html = "";
            html = "<button class='enviarNombres' value='ENVIAR' id='enviarNombres'>Enviar</button>";
            $("#wrapper").append(html);
}



function enviarNombres(numJugadores){
    var jugadores = new Array(); //we store the name of players

    $(".nombreJugador").each(function(key,value){ // stay in the input or jump over the next

        if(this.value === ""){
            $(this).focus();
            return false;
        }

        else if(this.value !== ""){
            jugadores.push(this.value);
            $(this).next().focus();
        }

    });
    var html = '<div id="puntuaciones">';
    if (jugadores.length < numJugadores) {
        return false;
    }

    else{

        for(var i = 0;i<jugadores.length;i++){
             html += "<div class='jugador'><label for='nombre_"+i+"'>"+jugadores[i].toUpperCase()+"</label><input id='nombre_"+i+"' type='number' placeholder='Puntos'  class='inputPuntos'/><button class='chinchonButton' id='chinchonButton_"+i+"'>Chinchón</button></div>";

        }

        html += "</div>";

        $("#wrapper").hide(500);
        $("body").append(html);
        $("#wrapper").remove();
        $("#nombre_0").focus();
        bindEvents();
    }

}


function enviarPuntos(){

    var puntosRonda = parseInt($(arguments[0]).val());
    var puntosTotal = parseInt($(arguments[0]).closest(".jugador").find("span").text()) + puntosRonda || puntosRonda;
    var ganador = "";
    var inputs = $(".chinchonButton").length;

    var json = {};


    if(isNaN(puntosRonda)){
        $(arguments[0]).val("").focus();
        bindEvents();
    }
    else {
        $(arguments[0]).closest(".jugador").find("span").remove();
        $(arguments[0]).after("<span>"+puntosTotal+"</span>");
        $(arguments[0]).val("");

        var input = $(arguments[0]).parent().next().find("input").attr("id"); //focus until the last element
        var id = localStorage.getItem("id");
        localStorage.setItem("id",input);

        if ( input !== undefined ){
            $(arguments[0]).parent().next().find("input").focus();
        }
        else{
            $(".jugador").first().find("input").focus();
        }

    }

    if(puntosTotal > 100){
      //  json.nombre = $(arguments[0]).closest(".jugador").find("label").text();
        //json.puntuacion  = $(arguments[0]).closest(".jugador").find("span").text();
        $(arguments[0]).closest(".jugador").remove();
        inputs = $(".chinchonButton").length;




    }


    if(inputs === 1){

        //json.nombre = $(".chinchonButton").closest(".jugador").find("label").text();
        //  json.puntuacion = $(".chinchonButton").closest(".jugador").find("span").text();
      //json.winner = true;
        var ganador = $(".chinchonButton").closest(".jugador").find("label").text();
        winner(ganador);

    }



}


//Function which show us the name of the winner and show us a button to repeat the game
function winner(ganador){
    var html = "";
    html = "<div class='winner'><p class='jugadorGanador'>El Ganador es:"+ganador+"</p><button id='jugarDeNuevo'>Volver a Jugar</button></div>";
    $("#puntuaciones").hide(2000);
    $("body").append(html);
   bindEvents();

}

function createGame(){
    localStorage.clear();
    $("#wrapper").remove();
    $(".puntuaciones").remove();
    var html = "<div id='wrapper'><input id='numJugadores' type='number' placeholder='Número de Jugadores' class='numJugadores'/><button id='enviarJugadores' class='enviarJugadores'>Enviar</button></div>";
    $(".winner").hide(2000);
    $("body").append(html);
    bindEvents();
}





//Function which treats all the events that happen during the app
function bindEvents(numJugadores) {
    $("#enviarJugadores").on('click', enviarJugadores);//FUNCTION THAT TAKES THE NUMBER OF PLAYERS

    $("#numJugadores").keypress(function (e) {
        if (e.which === 10 || e.which === 13) {
            enviarJugadores();
        }
    });

    $("#enviarNombres").on('click',function(){//FUNCTION THAT SEND THE NAMES
                enviarNombres(numJugadores);
    });

    $(".nombreJugador").keypress(function(e){
                if (e.which === 10 || e.which === 13){
                    enviarNombres(numJugadores);
                }
    });


     $(".inputPuntos").keypress(function(e){
        if (e.which === 10 || e.which === 13){
                    enviarPuntos($(this));
            }
    });

    $(".chinchonButton").on('click.chinchon',function(){//FUNCTION THAT SENDS THE NAME OF THE PLAYER
        $(this).closest(".jugador").find("input").val(-101);
        var ganador = $(this).closest(".jugador").find("label").text();
        winner(ganador);
    });

    $("#jugarDeNuevo").on('click',function(){
        createGame();
    });

}
