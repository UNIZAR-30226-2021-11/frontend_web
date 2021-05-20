let obj = {
    "status": "normal",
    "game_state": {
        "points_team_a": 0,
        "points_team_b": 11,
        "points_sing_a": 0,
        "points_sing_b": 0,
        "current_round": 2,
        "players": {
            "players": [{
                    "cards": [{
                            "suit": "bastos",
                            "val": 5,
                            "points": 0,
                            "playable": true
                        },
                        {
                            "suit": "espadas",
                            "val": 1,
                            "points": 11,
                            "playable": true
                        },
                        {
                            "suit": "oros",
                            "val": 1,
                            "points": 11,
                            "playable": true
                        },
                        {
                            "suit": "espadas",
                            "val": 2,
                            "points": 0,
                            "playable": true
                        },
                        {
                            "suit": "espadas",
                            "val": 7,
                            "points": 0,
                            "playable": true
                        },
                        null
                    ],
                    "id": 43,
                    "pair": 1,
                    "username": "",
                    "can_play": false,
                    "can_sing": false,
                    "sing_suit": "",
                    "can_change": false,
                    "singing_suits": null
                },
                {
                    "cards": [{
                            "suit": "bastos",
                            "val": 10,
                            "points": 3,
                            "playable": true
                        },
                        {
                            "suit": "copas",
                            "val": 10,
                            "points": 3,
                            "playable": true
                        },
                        {
                            "suit": "espadas",
                            "val": 3,
                            "points": 10,
                            "playable": true
                        },
                        {
                            "suit": "bastos",
                            "val": 11,
                            "points": 2,
                            "playable": true
                        },
                        {
                            "suit": "copas",
                            "val": 7,
                            "points": 0,
                            "playable": true
                        },
                        null
                    ],
                    "id": 42,
                    "pair": 2,
                    "username": "",
                    "can_play": true,
                    "can_sing": false,
                    "sing_suit": "",
                    "can_change": true,
                    "singing_suits": null
                },
                {
                    "cards": [{
                            "suit": "oros",
                            "val": 3,
                            "points": 10,
                            "playable": true
                        },
                        {
                            "suit": "copas",
                            "val": 12,
                            "points": 4,
                            "playable": true
                        },
                        {
                            "suit": "copas",
                            "val": 4,
                            "points": 0,
                            "playable": true
                        },
                        {
                            "suit": "oros",
                            "val": 10,
                            "points": 3,
                            "playable": true
                        },
                        {
                            "suit": "oros",
                            "val": 5,
                            "points": 0,
                            "playable": true
                        },
                        null
                    ],
                    "id": 41,
                    "pair": 1,
                    "username": "",
                    "can_play": false,
                    "can_sing": false,
                    "sing_suit": "",
                    "can_change": false,
                    "singing_suits": null
                },
                {
                    "cards": [{
                            "suit": "bastos",
                            "val": 6,
                            "points": 0,
                            "playable": true
                        },
                        {
                            "suit": "bastos",
                            "val": 12,
                            "points": 4,
                            "playable": true
                        },
                        {
                            "suit": "oros",
                            "val": 12,
                            "points": 4,
                            "playable": true
                        },
                        {
                            "suit": "bastos",
                            "val": 1,
                            "points": 11,
                            "playable": true
                        },
                        {
                            "suit": "espadas",
                            "val": 4,
                            "points": 0,
                            "playable": true
                        },
                        null
                    ],
                    "id": 40,
                    "pair": 2,
                    "username": "",
                    "can_play": false,
                    "can_sing": false,
                    "sing_suit": "",
                    "can_change": false,
                    "singing_suits": null
                }
            ]
        },
        "triumph_card": {
            "suit": "copas",
            "val": 5,
            "points": 0,
            "playable": false
        },
        "vueltas": false,
        "arrastre": false,
        "ended": false,
        "winner_pair": 2,
        "cards_played_round": [{
                "suit": "oros",
                "val": 7,
                "points": 0,
                "playable": true
            },
            {
                "suit": "oros",
                "val": 6,
                "points": 0,
                "playable": true
            },
            {
                "suit": "espadas",
                "val": 10,
                "points": 3,
                "playable": true
            },
            {
                "suit": "espadas",
                "val": 11,
                "points": 2,
                "playable": true
            }
        ]
    }
}
let cartas = [];
let botones = [];
for (i = 0; i < 6; i++) {
    cartas.push(new Image());
    botones.push(null);
}
var me = 0;


document.addEventListener('DOMContentLoaded', dibujar());

var c = document.getElementById("tablero");
var ctx = c.getContext("2d");

//Binding the click event on the canvas
c.addEventListener('click', function(evt) {
    var mousePos = getMousePos(c, evt);
    console.log(mousePos.x + ',' + mousePos.y)
    var i = isInside(mousePos, botones)
    if (i >= 0) {
        alert('clicked ' + i + ' boton');
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
    dibujarBotones();
    dibujarPila();
}

function dibujarMano() {
    var c = document.getElementById("tablero");
    var ctx = c.getContext("2d");
    preloadImagesHand();
    cartas.forEach(function(carta, idx) {
        botones[idx] = mkBoton(idx + 6, 245 * (idx + 1), 600, 200, 319);
        carta.addEventListener('load', function() {
            ctx.save();
            if (obj.game_state.players.players[me].can_play == false || obj.game_state.players.players[me].cards[idx].playable == false) {
                ctx.globalAlpha = 0.5;
            }
            ctx.drawImage(carta, 250 * (idx + 1), 600);
            ctx.restore();
        }, false);
    });
}

function dibujarMesa() {
    var c = document.getElementById("tablero");
    var ctx = c.getContext("2d");
    var triunfo = new Image();
    triunfo.src = '../images/' + obj.game_state.triumph_card.suit + '_' + obj.game_state.triumph_card.val + '.png';
    triunfo.addEventListener('load', function() {
        ctx.save();
        ctx.translate(660, 0);
        ctx.rotate(90 * Math.PI / 180);
        ctx.drawImage(triunfo, 200, -120);
        ctx.restore();
        var monton = document.getElementById("reverso");
        ctx.drawImage(monton, 450, 150);
    }, false);
}

function dibujarPila() {
    var c = document.getElementById("tablero");
    var ctx = c.getContext("2d");
    var pila = [new Image(), new Image(), new Image(), new Image()];
    preloadImagesPila(pila);
    pila.forEach(function(carta, idx) {
        carta.addEventListener('load', function() {
            ctx.save();
            ctx.drawImage(carta, 1000 + (75 * idx), 150);
            ctx.restore();
        }, false);
    });
}

function dibujarBotones() {
    var c = document.getElementById("tablero");
    var ctx = c.getContext("2d");
    var buttons = [];
    buttons.push(makeButton(1, 25, 25, 250, 60, 'Solicitar pausa', 'gray', 'black', 'black', function() {}));
    buttons.push(makeButton(2, 25, 95, 230, 60, 'Cambiar triunfo', 'gray', 'black', 'black', function() {}));
    buttons.push(makeButton(3, 265, 95, 175, 60, 'No Cambiar', 'gray', 'black', 'black', function() {}));
    buttons.push(makeButton(4, 25, 165, 230, 60, 'Cantar', 'gray', 'black', 'black', function() {}));
    buttons.push(makeButton(5, 265, 165, 175, 60, 'No cantar', 'gray', 'black', 'black', function() {}));
    buttons.forEach(function(b, idx) {
        if (!(obj.game_state.players.players[me].can_sing == false && (b.id == 4 || b.id == 5)) &&
            !(obj.game_state.players.players[me].can_change == false && (b.id == 2 || b.id == 3))) {
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
    });
    botones.push(mkBoton(1, 25, 25, 250, 60));
    botones.push(mkBoton(2, 25, 95, 230, 60));
    botones.push(mkBoton(3, 265, 95, 175, 60));
    botones.push(mkBoton(4, 25, 165, 230, 60));
    botones.push(mkBoton(5, 265, 165, 175, 60));
}

function preloadImagesHand() {
    var encontrado = false;
    var myId = 43;
    for (i = 0; i < 4 && !encontrado; i++) {
        if (obj.game_state.players.players[i].id == myId) {
            encontrado = true;
            me = i;
            for (j = 0; j < 6; j++) {
                if (obj.game_state.players.players[i].cards[j] != null) {
                    cartas[j].src = '../images/' + obj.game_state.players.players[i].cards[j].suit + '_' + obj.game_state.players.players[i].cards[j].val + '.png';
                }
            }
        }
    }
}

function preloadImagesPila(p) {
    for (i = 0; i < p.length && i < 4; i++) {
        if (obj.game_state.cards_played_round[i] != null) {
            p[i].src = '../images/' + obj.game_state.cards_played_round[i].suit + '_' + obj.game_state.cards_played_round[i].val + '.png';
        }
    }
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

function mkBoton(id, x, y, w, h) {
    return ({
        id: id,
        x: x,
        y: y,
        w: w,
        h: h,
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
function isInside(pos, botones) {
    var id = -1;
    botones.forEach(function(b, idx) {
        if (b != null) {
            if ((pos.x > b.x && pos.x < (b.x + b.w)) && (pos.y < (b.y + b.h) && pos.y > b.y)) {
                console.log('click detectado en boton ' + b.id);
                id = b.id;
            }
        }
    });
    return id;
}

//var ws = new WebSocket("ws:http://15.188.14.213:11050/simulation");
var ws = new WebSocket("ws:http://192.168.1.141:9000/simulation");