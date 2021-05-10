document.addEventListener('DOMContentLoaded', dibujar());

function dibujar() {
    var c = document.getElementById("tablero");
    var ctx = c.getContext("2d");
    var img = document.getElementById("tapete");
    ctx.drawImage(img, 0, 0, 1920, 1080);
    var carta1 = document.getElementById("copa1");
    ctx.drawImage(carta1, 50, 110, 20, 31);
    var carta2 = document.getElementById("espada1");
    ctx.drawImage(carta2, 90, 110, 20, 31);
    var carta3 = document.getElementById("bastos4");
    ctx.drawImage(carta3, 130, 110, 20, 31);
    var carta4 = document.getElementById("espadas6");
    ctx.drawImage(carta4, 170, 110, 20, 31);
    var carta5 = document.getElementById("oros2");
    ctx.drawImage(carta5, 210, 110, 20, 31);
    var carta6 = document.getElementById("oros11");
    ctx.drawImage(carta6, 250, 110, 20, 31);
    var monton = document.getElementById("reverso");
    ctx.drawImage(monton, 100, 40, 20, 31);
}