let perfilBuscado = document.querySelector("#username");
let username = sessionStorage.getItem('username');
let token = sessionStorage.getItem('token');
let id = sessionStorage.getItem('id');
let reverso = 0;
let tablero = 0;
let json = {}

document.querySelector(".banner").style.display = 'none';

fetch(`http://15.188.14.213:11050/api/v1/users/${username}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            alert("Fallo al recuperar los datos de usuario del servidor.");
            throw "Respesta incorrecta por parte del servidor";
        }
    })
    .then(data => {
        json = JSON.parse(data);
        sessionStorage.setItem('id_hist', json.user.id);
        document.querySelector(".username").innerHTML = `${json.user.username}`;

        fetch(`http://15.188.14.213:11050/api/v1/games/user/${json.user.id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    alert("Fallo al recuperar el historial de partidas del usuario.");
                    throw "Respuesta incorrecta por parte del servidor";
                }
            })
            .then(data => {
                json = JSON.parse(data);
                let resultadoPartida = "";
                let iteraciones;
                let numeroDerrotas = 0;
                let numeroVictorias = 0;
                if (json.games != null) {
                    if (json.games.length <= 10) {
                        iteraciones = json.games.length;
                    } else {
                        iteraciones = 10;
                    }
                    for (let i = 0; i < iteraciones; i++) {
                        if (json.games[i].winned == true) {
                            resultadoPartida = "Victoria";
                        } else {
                            resultadoPartida = "Derrota";
                        }
                        const final = new Date(json.games[i].end_date);
                        let date = final.toDateString();

                        if (json.games[i].points > 0) {
                            document.querySelector("#historialCorto").innerHTML +=
                                `<tr>
                                <td>${date}</td>
                                <td>${json.games[i].name}</td>
                                <td>${resultadoPartida}</td>
                                <td>${json.games[i].points}</td>
                            </tr>`;
                        }
                    }
                    for (let i = 0; i < json.games.length; i++) {
                        if (json.games[i].points > 100) {
                            numeroVictorias++;
                        } else if (json.games[i].points > 0) {
                            numeroDerrotas++;
                        }
                    }
                }
                document.querySelector(".victorias").innerHTML = numeroVictorias;
                document.querySelector(".derrotas").innerHTML = numeroDerrotas;
            })
            .catch(err => console.log(err));
    })
    .catch(err => console.log(err));




function buscarUsuario() {
    document.querySelector("#historialCorto").innerHTML =
        `<tr>
            <th>Finalizaci??n</th>
            <th>Nombre de la partida</th>
            <th>Resultado</th>
            <th>Puntuaci??n</th>
        </tr>`;

    let usuario = perfilBuscado.value;
    if (usuario != "") {
        fetch(`http://15.188.14.213:11050/api/v1/users/${usuario}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    alert("Usuario no encontrado.");
                    throw "Respesta incorrecta por parte del servidor";
                }
            })
            .then(data => {
                json = JSON.parse(data);
                sessionStorage.setItem('id_hist', json.user.id);
                document.querySelector(".username").innerHTML = `${json.user.username}`;
                document.querySelector(".victorias").innerHTML = `${json.user.games_won}`;
                document.querySelector(".derrotas").innerHTML = `${json.user.games_lost}`;

                fetch(`http://15.188.14.213:11050/api/v1/games/user/${json.user.id}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then(response => {
                        if (response.ok) {
                            return response.text();
                        } else {
                            alert("Fallo al recuperar el historial de partidas del usuario.");
                            throw "Respesta incorrecta por parte del servidor";
                        }
                    })
                    .then(data => {
                        json = JSON.parse(data);
                        let resultadoPartida = "";
                        let iteraciones;
                        let numeroDerrotas = 0;
                        let numeroVictorias = 0;
                        if (json.games != null) {
                            if (json.games.length <= 10) {
                                iteraciones = json.games.length;
                            } else {
                                iteraciones = 10;
                            }
                            for (let i = 0; i < iteraciones; i++) {
                                if (json.games[i].winned == true) {
                                    resultadoPartida = "Victoria";
                                } else {
                                    resultadoPartida = "Derrota";
                                }
                                const final = new Date(json.games[i].end_date);
                                let date = final.toDateString();

                                if (json.games[i].points > 0) {
                                    document.querySelector("#historialCorto").innerHTML +=
                                        `<tr>
                                    <td>${date}</td>
                                    <td>${json.games[i].name}</td>
                                    <td>${resultadoPartida}</td>
                                    <td>${json.games[i].points}</td>
                                </tr>`;
                                }
                            }
                            for (let i = 0; i < json.games.length; i++) {
                                if (json.games[i].points > 100) {
                                    numeroVictorias++;
                                } else if (json.games[i].points > 0) {
                                    numeroDerrotas++;
                                }
                            }
                        }
                        document.querySelector(".victorias").innerHTML = numeroVictorias;
                        document.querySelector(".derrotas").innerHTML = numeroDerrotas;
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }
}

function borrarCuenta() {
    fetch(`http://15.188.14.213:11050/api/v1/users/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                alert("Cuenta eliminada satisfactoriamente.");
                sessionStorage.clear();
                localStorage.removeItem(`${username}_reverso`);
                localStorage.removeItem(`${username}_tablero`);
                window.location.href = "index.html";
            } else {
                alert("Se ha producido un fallo al intentar eliminar la cuenta.");
                throw "Respuesta incorrecta por parte del servidor";
            }
        })
        .catch(err => console.log(err));
}

function mostrarHistorial() {
    window.location.href = "historial.html";
}

function mostrarBanner() {
    document.querySelector(".banner").style.display = 'block';
}

function guardarCambios() {
    document.querySelector(".banner").style.display = 'none';
    if (reverso == 1) {
        localStorage.setItem(`${username}_reverso`, 1);
    } else if (reverso == 2) {
        localStorage.setItem(`${username}_reverso`, 2);
    } else if (reverso == 3) {
        localStorage.setItem(`${username}_reverso`, 3);
    }

    if (tablero == 1) {
        localStorage.setItem(`${username}_tablero`, 1);
    } else if (tablero == 2) {
        localStorage.setItem(`${username}_tablero`, 2);
    } else if (tablero == 3)?? {
        localStorage.setItem(`${username}_tablero`, 3);
    }
}

function descartarCambios() {
    document.querySelector(".banner").style.display = 'none';
}

document.querySelector(".buscarUsuario").addEventListener('click', buscarUsuario);
document.querySelector(".botonBorrar").addEventListener('click', borrarCuenta);
document.querySelector(".botonHistorial").addEventListener('click', mostrarHistorial);
document.querySelector(".engranaje").addEventListener('click', mostrarBanner);
document.querySelector(".botonGuardar").addEventListener('click', guardarCambios);
document.querySelector(".botonDescartar").addEventListener('click', descartarCambios);

document.querySelector(".reverso1").onclick = function() {
    reverso = 1;
}
document.querySelector(".reverso2").onclick = function() {
    reverso = 2;
}
document.querySelector(".reverso3").onclick = function() {
    reverso = 3;
}

document.querySelector(".tablero1").onclick = function() {
    tablero = 1;
}
document.querySelector(".tablero2").onclick = function() {
    tablero = 2;
}
document.querySelector(".tablero3").onclick = function() {
    tablero = 3;
}