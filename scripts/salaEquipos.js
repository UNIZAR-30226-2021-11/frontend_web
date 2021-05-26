let nombrePartida = sessionStorage.getItem('nombrePartida');
let idPartida = sessionStorage.getItem('idPartida');
let token = sessionStorage.getItem('token');
let username = sessionStorage.getItem('username');
let id = sessionStorage.getItem('id');
let idEquipo1 = 0;
let idEquipo2 = 0;
let userAux = "";

sessionStorage.setItem('crearPartida', false);

document.querySelector(".idPartida").innerHTML = `Identificador de la sala: <b><em>${idPartida}</em></b>`;
document.querySelector(".equipo1").innerHTML = "Unirse a equipo 1";
document.querySelector(".equipo2").innerHTML = "Unirse a equipo 2";

document.querySelector(".miembro1").innerHTML = "---";
document.querySelector(".miembro2").innerHTML = "---";
document.querySelector(".miembro3").innerHTML = "---";
document.querySelector(".miembro4").innerHTML = "---";

function obtenerParejas() {
    fetch(`http://15.188.14.213:11050/api/v1/games/${idPartida}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                alert("Se ha producido un fallo al recuperar la partida.");
                throw "Respuesta incorrecta por parte del servidor";
            }
        })
        .then(data => {
            let json = JSON.parse(data);
            let jugadorJoined = false;
            idEquipo1 = json.game.pairs[0].id;
            idEquipo2 = json.game.pairs[1].id;
            if (json.game.pairs[0].users != null) {
                if (json.game.pairs[0].users[0].username == username) {
                    jugadorJoined = true;
                }
                userAux = json.game.pairs[0].users[0].username;
                document.querySelector(".miembro1").innerHTML = `${userAux}`;
                if (json.game.pairs[0].users[1] != null) {
                    if (json.game.pairs[0].users[1].username == username) {
                        jugadorJoined = true;
                    }
                    userAux = json.game.pairs[0].users[1].username;
                    document.querySelector(".miembro2").innerHTML = `${userAux}`;
                    document.querySelector(".equipo1").disabled = true;
                    document.querySelector(".equipo1").innerHTML = "Equipo 1 completo";
                }
            }
            if (json.game.pairs[1].users != null) {
                if (json.game.pairs[1].users[0].username == username) {
                    jugadorJoined = true;
                }
                userAux = json.game.pairs[1].users[0].username;
                document.querySelector(".miembro3").innerHTML = `${userAux}`;
                if (json.game.pairs[1].users[1] != null) {
                    if (json.game.pairs[1].users[1].username == username) {
                        jugadorJoined = true;
                    }
                    userAux = json.game.pairs[1].users[1].username;
                    document.querySelector(".miembro4").innerHTML = `${userAux}`;
                    document.querySelector(".equipo2").disabled = true;
                    document.querySelector(".equipo2").innerHTML = "Equipo 2 completo";
                }
            }
            if (jugadorJoined == true) {
                document.querySelector(".equipo1").disabled = true;
                document.querySelector(".equipo2").disabled = true;
            }
        })
        .catch(err => console.log(err));
}

function joinEquipo1() {
    // antes de unirse, comprobar que el equipo1 no este completo
    let equipoCompleto = false;
    fetch(`http://15.188.14.213:11050/api/v1/games/${idPartida}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                alert("Se ha producido un fallo al intentar unirse al Equipo 1.");
                throw "Respuesta incorrecta por parte del servidor";
            }
        })
        .then(data => {
            let json = JSON.parse(data);
            if (json.game.pairs[0].users != null) {
                if (json.game.pairs[0].users[1] != null) {
                    // equipo completo
                    equipoCompleto = true;
                }
            }
        })
        .catch(err => console.log(err));

    if (equipoCompleto == false) {
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
                if (response.ok) {
                    return response.text();
                } else {
                    alert("Se ha producido un fallo al intentar unirse al Equipo 1.");
                    throw "Respuesta incorrecta por parte del servidor";
                }
            })
            .then(data => {
                let json = JSON.parse(data);
                sessionStorage.setItem('playerId', json.player.id);
                sessionStorage.setItem('pairId', json.player.pair_id);

                window.location.href = "tableroJuego.html";
            })
            .catch(err => console.log(err));
    }
}

function joinEquipo2() {
    // antes de unirse, comprobar que el equipo2 no este completo
    let equipoCompleto = false;
    fetch(`http://15.188.14.213:11050/api/v1/games/${idPartida}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                alert("Se ha producido un fallo al intentar unirse al Equipo 2.");
                throw "Respuesta incorrecta por parte del servidor";
            }
        })
        .then(data => {
            let json = JSON.parse(data);
            if (json.game.pairs[1].users != null) {
                if (json.game.pairs[1].users[1] != null) {
                    // equipo completo
                    equipoCompleto = true;
                }
            }
        })
        .catch(err => console.log(err));

    if (equipoCompleto == false) {
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
                if (response.ok) {
                    return response.text();
                } else {
                    alert("Se ha producido un fallo al intentar unirse al Equipo 2.");
                    throw "Respuesta incorrecta por parte del servidor";
                }
            })
            .then(data => {
                let json = JSON.parse(data);
                sessionStorage.setItem('playerId', json.player.id);
                sessionStorage.setItem('pairId', json.player.pair_id);

                window.location.href = "tableroJuego.html";
            })
            .catch(err => console.log(err));
    }
}

obtenerParejas();
document.querySelector(".equipo1").addEventListener('click', joinEquipo1);
document.querySelector(".equipo2").addEventListener('click', joinEquipo2);