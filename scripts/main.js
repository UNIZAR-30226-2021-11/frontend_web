let boton1 = document.querySelector("#botonJugarSolo");
let boton2 = document.querySelector("#botonJugarOnline");
let boton3 = document.querySelector("#botonPerfil");
let boton4 = document.querySelector(".engranaje");

boton1.onclick = function() {
    alert("Comienza el modo de juego en solitario.");
}
boton2.onclick = function() {
    window.location.href = "onlineInicio.html";
}
boton3.onclick = function() {
    window.location.href = "inicioSesion.html";
}
boton4.onclick = function() {
    alert("Botón de opciones pulsado");
}