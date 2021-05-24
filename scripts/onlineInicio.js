let atras = document.querySelector(".flechaIz");
let crearPartida = document.querySelector(".crearPartida");
let buscarPartida = document.querySelector(".unirseSala");
let entrarTorneo = document.querySelector(".torneo");

atras.onclick = function() {
    window.location.href = "../code/lobby.html";
}

crearPartida.onclick = function() {
    window.location.href = "crearPartida.html";
}

buscarPartida.onclick = function() {
    window.location.href = "listaPartidas.html";
}

entrarTorneo.onclick = function() {
    window.location.href = "listaPartidasTorneo.html";
}
