let username = sessionStorage.getItem('username');
let gameId = parseInt(sessionStorage.getItem('idPartida'), 10);
let playerId = parseInt(sessionStorage.getItem('playerId'), 10);
let pairId = parseInt(sessionStorage.getItem('pairId'), 10);
let creaPartida = sessionStorage.getItem('crearPartida');

let ws = new WebSocket("ws:15.188.14.213:11050/simulation");
let singlePlayer = sessionStorage.getItem('singlePlayer');
let cartas = [];
let botones = [];
let botonesP = [];
for (i = 0; i < 6; i++) {
    cartas.push(new Image());
    botones.push(null);
}
let me = 0;

let gameState;

//Muestra un texto de carga en pantalla
function cargando() {
    var c = document.getElementById("tablero");
    var ctx = c.getContext("2d");

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillStyle = "white";
    ctx.fillText("Cargando...", window.innerWidth / 2, window.innerHeight / 2);
}

//Establecido el WebSocket enviamos el primer mensaje para crear la partida
ws.onopen = function(event) {
    console.log("WS abierto...");
    cargando();
    var cabecera = {
        "player_id": playerId,
        "pair_id": pairId,
    };
    if (singlePlayer == "true") { //Modo Single Player
        var msg = {
            "game_id": gameId,
            "player_id": playerId,
            "username": username,
            "event_type": 8,
        };
    } else if (creaPartida == "true") { //Modo Online (Crear Partida)
        var msg = {
            "game_id": gameId,
            "player_id": playerId,
            "pair_id": pairId,
            "username": username,
            "event_type": 0,
        }
    } else { //Modo Online (Unirse a partida)
        var msg = {
            "game_id": gameId,
            "player_id": playerId,
            "pair_id": pairId,
            "username": username,
            "event_type": 1,
        }
    }

    console.log("Enviando cabecera: " + JSON.stringify(cabecera));
    ws.send(JSON.stringify(cabecera));
    console.log("Enviando mensaje: " + JSON.stringify(msg));
    ws.send(JSON.stringify(msg));
}

//Procesa el mensaje recibido
ws.onmessage = function(event) {
    console.log("Mensaje recibido... \n" + event.data);
    gameState = JSON.parse(event.data);
    if (gameState.status == "votePause") { //Votar pausa
        dibujarVotacion();
    } else if (gameState.status == "paused") { //Pausado, toca salir
        var msg = {
            "game_id": gameId,
            "player_id": playerId,
            "event_type": 2,
        };
        ws.send(JSON.stringify(msg));
        alert("Juego pausado, saliendo de la partida... ");

        window.location.href = "lobby.html";
    } else if (gameState.status == "normal") { //Juego normal
        if ((gameState.game_state.current_round == 0) && (gameState.game_state.cards_played_round == null)) { //Primera ronda
            dibujar(true);
        } else if (gameState.game_state.ended && (gameState.game_state.winner_pair != null)) { //Fin de la partida
            dibujarVictoria();
        } else { //Juego
            dibujar(false);
        }
    }
}

//Dibuja el tablero de juegp
function dibujar(firstR) {
    var c = document.getElementById("tablero");
    var ctx = c.getContext("2d");
    c.height = window.innerHeight;
    var tablero = new Image();
    if (firstR) {
        c.addEventListener('click', function(evt) { //Detección de eventos de click en el canvas
            var mousePos = getMousePos(c, evt);
            if (gameState.status == "votePause") { //Click en votación de pausa
                var i = isInside(mousePos, botonesP)
                if (i >= 0) {
                    botonPulsado(i);
                }
            } else if (gameState.game_state.ended) { //Click con la partida terminada
                botonPulsado(0);
            } else { //Click en situaciones normales
                var i = isInside(mousePos, botones)
                if (i >= 0) {
                    botonPulsado(i);
                }
            }
        }, false);
    }
    switch (localStorage.getItem(`${username}_tablero`)) { //Cargamos el tablero
        case "1":
            tablero.src = '../images/casino_table.jpg';
            break;
        case "2":
            tablero.src = '../images/casino_table_azul.jpg';
            break;
        case "3":
            tablero.src = '../images/casino_table_rojo.jpg';
            break;
        default:
            tablero.src = '../images/casino_table.jpg';
    }
    tablero.addEventListener('load', function() { //Mostramos el tablero una vez haya cargado la imagen
        ctx.drawImage(tablero, 0, 0, 1920, 1080);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillStyle = 'white';
        let texto = sessionStorage.getItem('idPartida');
        ctx.fillText(texto, 1900, 20);
        dibujarMano(firstR);
        dibujarMesa();
        dibujarBotones(firstR);
        dibujarPila();
    }, false)
}

//Dibuja las cartas de la mano del jugador
function dibujarMano(firstR) {
    var c = document.getElementById("tablero");
    var ctx = c.getContext("2d");
    preloadImagesHand();
    cartas.forEach(function(carta, idx) {
        botones[idx] = mkBoton(idx + 6, 245 * (idx + 1), 600, 200, 319);
        if (firstR) {
            carta.addEventListener('load', function() {
                ctx.save();
                if (!gameState.game_state.players.players[me].can_play || !gameState.game_state.players.players[me].cards[idx].playable) {
                    console.log("Detectada carta no jugable " + gameState.game_state.players.players[me].cards[idx].val + "," + gameState.game_state.players.players[me].cards[idx].suit);
                    ctx.globalAlpha = 0.5;
                }
                ctx.drawImage(carta, 250 * (idx + 1), 600);
                ctx.restore();
            }, false);
        }
    });
}

//Carga las imagenes de las cartas
function preloadImagesHand() {
    var encontrado = false;
    if (playerId != null) {
        for (i = 0; i < 4 && !encontrado; i++) {
            if (gameState.game_state.players.players[i].id == playerId) {
                encontrado = true;
                me = i;
                for (j = 0; j < 6; j++) {
                    if (gameState.game_state.players.players[i].cards[j] != null) {
                        cartas[j].src = '../images/' + gameState.game_state.players.players[i].cards[j].suit + '_' + gameState.game_state.players.players[i].cards[j].val + '.png';
                    } else {
                        cartas[j].src = '';
                    }
                }
            }
        }
    } else { alert("No hay id de sesion"); }
}

//Dibuja el monton y triunfo
function dibujarMesa() {
    if (!gameState.game_state.arrastre) {
        var c = document.getElementById("tablero");
        var ctx = c.getContext("2d");
        var triunfo = new Image();
        triunfo.src = '../images/' + gameState.game_state.triumph_card.suit + '_' + gameState.game_state.triumph_card.val + '.png';
        triunfo.addEventListener('load', function() {
            ctx.save();
            ctx.translate(660, 0);
            ctx.rotate(90 * Math.PI / 180);
            ctx.drawImage(triunfo, 200, -120);
            ctx.restore();
            switch (localStorage.getItem(`${username}_reverso`)) {
                case "1":
                    monton.src = '../images/reverso.png';
                    break;
                case "2":
                    monton.src = '../images/reverso_negro.png';
                    break;
                case "3":
                    monton.src = '../images/reverso_rojo.jpg';
                    break;
                default:
                    monton.src = '../images/reverso.png';
            }
        }, false);
        var monton = new Image();

        monton.addEventListener('load', function() {
            ctx.drawImage(monton, 450, 150);
        }, false);
    }
}

//Dibuja la pila de cartas la ronda
function dibujarPila() {
    var c = document.getElementById("tablero");
    var ctx = c.getContext("2d");
    var pila = [new Image(), new Image(), new Image(), new Image()];
    preloadImagesPila(pila);
    pila.forEach(function(carta, idx) {
        carta.addEventListener('load', function() {
            ctx.save();
            ctx.drawImage(carta, 1000 + (120 * idx), 150);
            ctx.restore();
        }, false);
    });
}

//Carga las imagenes de las cartas de la pila
function preloadImagesPila(p) {
    if (gameState.game_state.cards_played_round != null) {
        for (i = 0; i < 4; i++) {
            if (i < gameState.game_state.cards_played_round.length) {
                p[i].src = '../images/' + gameState.game_state.cards_played_round[i].suit + '_' + gameState.game_state.cards_played_round[i].val + '.png';
            } else {
                p[i].src = '';
            }
        }
    }
}

//Dibuja los botones del usuario
function dibujarBotones(firstR) {
    var c = document.getElementById("tablero");
    var ctx = c.getContext("2d");
    var buttons = [];
    var dibujo = false;
    buttons.push(makeButton(1, 25, 25, 250, 60, 'Solicitar pausa', 'gray', 'black', 'black'));
    buttons.push(makeButton(2, 25, 95, 230, 60, 'Cambiar triunfo', 'gray', 'black', 'black'));
    buttons.push(makeButton(3, 265, 95, 175, 60, 'No Cambiar', 'gray', 'black', 'black'));
    buttons.push(makeButton(4, 25, 165, 230, 60, 'Cantar', 'gray', 'black', 'black'));
    buttons.push(makeButton(5, 265, 165, 175, 60, 'No cantar', 'gray', 'black', 'black'));
    buttons.forEach(function(b, idx) {
        switch (b.id) {
            case 1:
                if (singlePlayer == "false") {
                    dibujo = true;
                }
                break;
            case 2:
            case 3:
                if (gameState.game_state.players.players[me].can_change) {
                    dibujo = true;
                }
                break;
            case 4:
            case 5:
                if (gameState.game_state.players.players[me].can_sing) {
                    dibujo = true;
                }
                break;
        }
        if (dibujo) {
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
        if (firstR) {
            botones.push(mkBoton(b.id, b.x, b.y, b.w, b.h));
        }
        dibujo = false;
    });
}

//Muestra la interfaz de votacion de pausa
function dibujarVotacion() {
    var c = document.getElementById("tablero");
    var ctx = c.getContext("2d");
    var buttons = [];
    buttons.push(makeButton(0, 560, 300, 800, 300, 'El equipo contrario a solicitado pausar la partida', 'white', 'black', 'black'));
    buttons.push(makeButton(1, 585, 515, 250, 60, 'Aceptar', 'gray', 'black', 'black'));
    buttons.push(makeButton(2, 1085, 515, 250, 60, 'Rechazar', 'gray', 'black', 'black'));
    buttons.forEach(function(b, idx) {
        ctx.clearRect(b.x - 1, b.y - 1, b.w + 2, b.h + 2);
        ctx.fillStyle = b.fill;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = b.stroke;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 30px sans-serif';
        ctx.fillStyle = b.labelcolor;
        if (b.id == 0) {
            ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 4);
        } else {
            ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 2);
            if (botonesP.length < 2) {
                botonesP.push(mkBoton(b.id + 11, b.x, b.y, b.w, b.h));
            }
        }
    });
}

//Muestra la interfaz de victoria
function dibujarVictoria() {
    var c = document.getElementById("tablero");
    var ctx = c.getContext("2d");
    if (singlePlayer == "true") {
        var font = 'bold 50px sans-serif';
        if (gameState.game_state.winner_pair == gameState.game_state.players.players[me].pair) {
            var txt = "Victoria";
        } else {
            var txt = "Derrota"
        }

    } else {
        var txt = `Victoria del equipo ${gameState.game_state.winner_pair}`;
        var font = 'bold 30px sans-serif';
    }
    var b = makeButton(0, 560, 300, 800, 300, txt, 'white', 'black', 'black');
    ctx.clearRect(b.x - 1, b.y - 1, b.w + 2, b.h + 2);
    ctx.fillStyle = b.fill;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeStyle = b.stroke;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = font;
    ctx.fillStyle = b.labelcolor;
    ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h / 4);
    var idx = 2;
    for (i = 0; i < 4; i++) {
        if (gameState.game_state.winner_pair == gameState.game_state.players.players[i].pair) {
            ctx.fillText(gameState.game_state.players.players[i].username, b.x + b.w / 2, b.y + b.h * idx / 4);
            idx++;
        }
    }
}

function makeButton(id, x, y, w, h, label, fill, stroke, labelcolor) {
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

function botonPulsado(boton) {
    var msg = null;

    switch (boton) {
        case 0: //Fin de la partida
            msg = {
                "game_id": gameId,
                "player_id": playerId,
                "event_type": 2,
            };
            ws.send(JSON.stringify(msg));
            alert("Partida terminada, saliendo... ");

            window.location.href = "lobby.html";
            break;
        case 1: //solicitar pausa
            if (singlePlayer == "false") {
                msg = {
                    "game_id": gameId,
                    "player_id": playerId,
                    "event_type": 6,
                };
            }
            break;
        case 2: //cambiar triunfo
            if (gameState.game_state.players.players[me].can_change == true) {
                msg = {
                    "game_id": gameId,
                    "player_id": playerId,
                    "changed": true,
                    "event_type": 4,
                };
            }
            break;
        case 3: //no cambiar triunfo
            if (gameState.game_state.players.players[me].can_change == true) {
                msg = {
                    "game_id": gameId,
                    "player_id": playerId,
                    "changed": false,
                    "event_type": 4,
                };
            }
            break;
        case 4: //cantar
            if (gameState.game_state.players.players[me].can_sing == true) {
                msg = {
                    "game_id": gameId,
                    "player_id": playerId,
                    "suit": gameState.game_state.players.players[me].sing_suit,
                    "has_singed": true,
                    "event_type": 5,
                };
            }
            break;
        case 5: //no cantar
            if (gameState.game_state.players.players[me].can_sing == true) {
                msg = {
                    "game_id": gameId,
                    "player_id": playerId,
                    "suit": gameState.game_state.players.players[me].sing_suit,
                    "has_singed": false,
                    "event_type": 5,
                };
            }
            break;
        case 6: //tirar carta 1
            if (gameState.game_state.players.players[me].can_play == true) {
                if (gameState.game_state.players.players[me].cards[0].playable) {
                    msg = {
                        "game_id": gameId,
                        "player_id": playerId,
                        "card": {
                            "suit": gameState.game_state.players.players[me].cards[0].suit,
                            "val": gameState.game_state.players.players[me].cards[0].val,
                        },
                        "event_type": 3,
                    };
                }
            }
            break;
        case 7: //tirar carta 2
            if (gameState.game_state.players.players[me].can_play == true && gameState.game_state.players.players[me].cards[1] != null) {
                if (gameState.game_state.players.players[me].cards[1].playable) {
                    msg = {
                        "game_id": gameId,
                        "player_id": playerId,
                        "card": {
                            "suit": gameState.game_state.players.players[me].cards[1].suit,
                            "val": gameState.game_state.players.players[me].cards[1].val,
                        },
                        "event_type": 3,
                    };
                }
            }
            break;
        case 8: //tirar carta 3
            if (gameState.game_state.players.players[me].can_play == true && gameState.game_state.players.players[me].cards[2] != null) {
                if (gameState.game_state.players.players[me].cards[2].playable) {
                    msg = {
                        "game_id": gameId,
                        "player_id": playerId,
                        "card": {
                            "suit": gameState.game_state.players.players[me].cards[2].suit,
                            "val": gameState.game_state.players.players[me].cards[2].val,
                        },
                        "event_type": 3,
                    };
                }
            }
            break;
        case 9: //tirar carta 4
            if (gameState.game_state.players.players[me].can_play == true && gameState.game_state.players.players[me].cards[3] != null) {
                if (gameState.game_state.players.players[me].cards[3].playable) {
                    msg = {
                        "game_id": gameId,
                        "player_id": playerId,
                        "card": {
                            "suit": gameState.game_state.players.players[me].cards[3].suit,
                            "val": gameState.game_state.players.players[me].cards[3].val,
                        },
                        "event_type": 3,
                    };
                }
            }
            break;
        case 10: //tirar carta 5
            if (gameState.game_state.players.players[me].can_play == true && gameState.game_state.players.players[me].cards[4] != null) {
                if (gameState.game_state.players.players[me].cards[4].playable) {
                    msg = {
                        "game_id": gameId,
                        "player_id": playerId,
                        "card": {
                            "suit": gameState.game_state.players.players[me].cards[4].suit,
                            "val": gameState.game_state.players.players[me].cards[4].val,
                        },
                        "event_type": 3,
                    };
                }
            }
            break;
        case 11: //tirar carta 6
            if (gameState.game_state.players.players[me].can_play == true && gameState.game_state.players.players[me].cards[5] != null) {
                if (gameState.game_state.players.players[me].cards[5].playable) {
                    msg = {
                        "game_id": gameId,
                        "player_id": playerId,
                        "card": {
                            "suit": gameState.game_state.players.players[me].cards[5].suit,
                            "val": gameState.game_state.players.players[me].cards[5].val,
                        },
                        "event_type": 3,
                    };
                }
            }
            break;
        case 12: //votacion de pausa aceptada
            if (gameState.status == "votePause") {
                msg = {
                    "game_id": gameId,
                    "player_id": playerId,
                    "vote": true,
                    "event_type": 7,
                };
            }
            break;
        case 13: //votacion de pausa rechazada
            if (gameState.status == "votePause") {
                msg = {
                    "game_id": gameId,
                    "player_id": playerId,
                    "vote": false,
                    "event_type": 7,
                };
            }
            break;
    }
    if (msg != null) {
        ws.send(JSON.stringify(msg));
    }
    console.log("boton pulsado " + boton + ", mensaje: " + JSON.stringify(msg));
}