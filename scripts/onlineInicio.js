let atras = document.querySelector(".flechaIz");
let crearPartida = document.querySelector(".crearPartida");
let buscarPartida = document.querySelector(".unirseSala");

atras.onclick = function() {
    window.location.href = "../code/lobby.html";
}

crearPartida.onclick = function() {
    window.location.href = "../code/crearPartida.html";
}

buscarPartida.onclick = function() {
    window.location.href = "../code/listaPartidas.html";
}