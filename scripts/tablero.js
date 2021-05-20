document.addEventListener('DOMContentLoaded', dibujar());

var estado = obj;

//The rectangle should have x,y,width,height properties
var rect = {
    x: 25,
    y: 25,
    width: 250,
    height: 60
};

var c = document.getElementById("tablero");
var ctx = c.getContext("2d");

//Binding the click event on the canvas
c.addEventListener('click', function(evt) {
    var mousePos = getMousePos(c, evt);

    if (isInside(mousePos, rect)) {
        alert('clicked inside rect');
    } else {
        alert('clicked outside rect');
    }
}, false);

function dibujar() {
    var c = document.getElementById("tablero");
    var ctx = c.getContext("2d");
    c.height = window.innerHeight;
    var img = document.getElementById("tapete");
    ctx.drawImage(img, 0, 0, 1920, 1080);
    dibujarMano();
    dibujarMesa();
    dibujarBoton();
}

function dibujarMano() {
    var c = document.getElementById("tablero");
    var ctx = c.getContext("2d");
    var carta1 = new Image();
    carta1.src = '../images/copas_1.png';
    var carta2 = new Image();
    carta2.src = '../images/espadas_1.png';
    var carta3 = new Image();
    carta3.src = '../images/bastos_4.png';
    var carta4 = new Image();
    carta4.src = '../images/espadas_6.png';
    var carta5 = new Image();
    carta5.src = '../images/oros_11.png';
    var carta6 = new Image();
    carta6.src = '../images/oros_2.png';
    carta1.addEventListener('load', function() {
        ctx.drawImage(carta1, 250, 600);
    }, false);
    carta2.addEventListener('load', function() {
        ctx.drawImage(carta2, 500, 600);
    }, false);
    carta3.addEventListener('load', function() {
        ctx.drawImage(carta3, 750, 600);
    }, false);
    carta4.addEventListener('load', function() {
        ctx.drawImage(carta4, 1000, 600);
    }, false);
    carta5.addEventListener('load', function() {
        ctx.drawImage(carta5, 1250, 600);
    }, false);
    carta6.addEventListener('load', function() {
        ctx.drawImage(carta6, 1500, 600);
    }, false);
}

function dibujarMesa() {
    var c = document.getElementById("tablero");
    var ctx = c.getContext("2d");
    var triunfo = new Image();
    triunfo.src = '../images/oros_1.png';
    triunfo.addEventListener('load', function() {
        ctx.save();
        ctx.translate(560, 0);
        ctx.rotate(90 * Math.PI / 180);
        ctx.drawImage(triunfo, 200, -120);
        ctx.restore();
        var monton = document.getElementById("reverso");
        ctx.drawImage(monton, 350, 150);
    }, false);
}

function dibujarBoton() {
    var c = document.getElementById("tablero");
    var ctx = c.getContext("2d");
    var b = makeButton(1, 25, 25, 250, 60, 'Solicitar pausa', 'gray', 'black', 'black',
        function() {});
    ctx.clearRect(b.x - 1, b.y - 1, b.w + 2, b.h + 2);
    ctx.fillStyle = b.fill;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeStyle = b.stroke;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillStyle = b.labelcolor;
    ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2);
}

function makeButton(id, x, y, w, h, label, fill, stroke, labelcolor, clickFn) {
    return ({
        id: id,
        x: x,
        y: y,
        w: w,
        h: h,
        fill: fill,
        stroke: stroke,
        labelcolor: labelcolor,
        label: label,
        click: clickFn,
    });
}

//Function to get mouse position
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
//Function to check whether a point is inside a rectangle
function isInside(pos, rect) {
    return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
}