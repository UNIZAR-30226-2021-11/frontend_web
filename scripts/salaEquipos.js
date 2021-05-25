let idPartida = sessionStorage.getItem('idPartida');
let numPartida = sessionStorage.getItem('numPartida');
let token = sessionStorage.getItem('token');
let username = sessionStorage.getItem('username');
let id = sessionStorage.getItem('id');
let idEquipo1 = 0;
let idEquipo2 = 0;
let numeroJugadores = 0;

document.querySelector(".idPartida").innerHTML = `Identificador de la sala: <b><em>${idPartida}</em></b>`;
document.querySelector(".equipo1").innerHTML = "Unirse a equipo 1";
document.querySelector(".equipo2").innerHTML = "Unirse a equipo 2";

document.querySelector(".miembro1").innerHTML = "---";
document.querySelector(".miembro2").innerHTML = "---";
document.querySelector(".miembro3").innerHTML = "---";
document.querySelector(".miembro4").innerHTML = "---";
document.querySelector(".iniciarPartida").disabled = true;

function obtenerParejas() {
    fetch(`http://15.188.14.213:11050/api/v1/games/${numPartida}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if(response.ok) {
            return response.text();
        }
        else {
            alert("Se ha producido un fallo al recuperar la partida.");
            throw "Respuesta incorrecta por parte del servidor";
        }
    })
    .then(data => {
        let json = JSON.parse(data);
        let userAux = "";
        let jugadorJoined = false;
        idEquipo1 = json.game.pairs[0].id;
        idEquipo2 = json.game.pairs[1].id;

        // 1- buscar si el jugador esta en la sala y desactivar botones en caso afirmativo
        // 2- escribir los nombres de los jugadores de la sala
        if(json.game.pairs[0].users != null) {
            if(json.game.pairs[0].users[0].username == username) {
                jugadorJoined = true;
            }
            userAux = json.game.pairs[0].users[0].username;
            document.querySelector(".miembro1").innerHTML = `${userAux}`;
            numeroJugadores++;
            if(json.game.pairs[0].users[1] != null) {
                if(json.game.pairs[0].users[1].username == username) {
                    jugadorJoined = true;
                }
                userAux = json.game.pairs[0].users[1].username;
                document.querySelector(".miembro2").innerHTML = `${userAux}`;
                document.querySelector(".equipo1").disabled = true;
                document.querySelector(".equipo1").innerHTML = "Equipo 1 completo";
                numeroJugadores++;
            }
        }
        if(json.game.pairs[1].users != null) {
            if(json.game.pairs[1].users[0].username == username) {
                jugadorJoined = true;
            }
            userAux = json.game.pairs[1].users[0].username;
            document.querySelector(".miembro3").innerHTML = `${userAux}`;
            numeroJugadores++;
            if(json.game.pairs[1].users[1] != null) {
                if(json.game.pairs[1].users[1].username == username) {
                    jugadorJoined = true;
                }
                userAux = json.game.pairs[1].users[1].username;
                document.querySelector(".miembro4").innerHTML = `${userAux}`;
                document.querySelector(".equipo2").disabled = true;
                document.querySelector(".equipo2").innerHTML = "Equipo 2 completo";
                numeroJugadores++;
            }
        }
        if(jugadorJoined == true) {
            document.querySelector(".equipo1").disabled = true;
            document.querySelector(".equipo2").disabled = true;
        }
        if(numeroJugadores == 4 && jugadorJoined==true) {
            document.querySelector(".iniciarPartida").disabled = false;
        }
    })
    .catch(err => console.log(err));
}

function joinEquipo1() {
    let idAux = parseInt(id, 10);
    let jsonData = JSON.stringify({
        user_id: idAux,
        pair_id: idEquipo1
    });
    fetch("http://15.188.14.213:11050/api/v1/players/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: jsonData
    })
    .then(response => {
        if(response.ok) {
            return response.text();
        }
        else {
            alert("Fallo al intentar unirse al Equipo 1.");
            throw "Respuesta incorrecta por parte del servidor";
        }
    })
    .then(data => {
        obtenerParejas();
    })
    .catch(err => console.log(err));
}

function joinEquipo2() {
    let idAux = parseInt(id, 10);
    let jsonData = JSON.stringify({
        user_id: idAux,
        pair_id: idEquipo2
    });
    fetch("http://15.188.14.213:11050/api/v1/players/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: jsonData
    })
    .then(response => {
        if(response.ok) {
            return response.text();
        }
        else {
            alert("Fallo al intentar unirse al Equipo 2.");
            throw "Respuesta incorrecta por parte del servidor";
        }
    })
    .then(data => {
        obtenerParejas();
    })
    .catch(err => console.log(err));
}

obtenerParejas();
document.querySelector(".equipo1").addEventListener('click', joinEquipo1);
document.querySelector(".equipo2").addEventListener('click', joinEquipo2);
document.querySelector(".iniciarPartida").onclick = function() {
    window.location.href = "tableroJuego.html";
}
