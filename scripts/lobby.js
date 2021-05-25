let boton1 = document.querySelector(".botonJugarSolo");
let boton2 = document.querySelector(".botonJugarOnline");
let boton3 = document.querySelector(".botonPerfil");
let boton4 = document.querySelector(".botonLogout");

boton1.onclick = function() {
    sessionStorage.setItem('singlePlayer', true);
    window.location.href = "tableroJuego.html";
}
boton2.onclick = function() {
    window.location.href = "onlineInicio.html";
}
boton3.onclick = function() {
    window.location.href = "perfil.html";
}
boton4.onclick = function() {
    sessionStorage.clear();
    window.location.href = "index.html"
}
