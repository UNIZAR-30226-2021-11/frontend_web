let idPartida = sessionStorage.getItem('idPartida');
let numPartida = sessionStorage.getItem('numPartida');
document.querySelector(".idPartida").innerHTML = `Identificador de la sala: <b><em>${idPartida}</em></b>`;
document.querySelector(".equipo1").innerHTML = "Unirse a equipo 1";
document.querySelector(".equipo2").innerHTML = "Unirse a equipo 2";

if(sessionStorage.getItem('partidaCreada') == "true") {
    document.querySelector(".equipo1").disabled = true;
    document.querySelector(".equipo2").disabled = true;
    document.querySelector(".miembro1").innerHTML = sessionStorage.getItem('username');
    document.querySelector(".miembro2").innerHTML = "---";
    document.querySelector(".miembro3").innerHTML = "---";
    document.querySelector(".miembro4").innerHTML = "---";
    document.querySelector(".iniciarPartida").disabled = true;
    sessionStorage.setItem('partidaCreada', false);
}

else {
    let token = sessionStorage.getItem('token');
    fetch(`http://localhost:9000/api/v1/games/${numPartida}`, {
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
        if(json.game.pairs[0].users != null) {
            let user1 = json.game.pairs[0].users[0].username;
            document.querySelector(".miembro1").innerHTML = `${user1}`;

            if(json.game.pairs[0].users[1] != null) {
                let user2 = json.game.pairs[0].users[1].username;
                document.querySelector(".miembro2").innerHTML = `${user2}`;
            }
            else {
                document.querySelector(".miembro2").innerHTML = "---";
            }
        }
        else {
            document.querySelector(".miembro1").innerHTML = "---";
            document.querySelector(".miembro2").innerHTML = "---";
        }

        if(json.game.pairs[1].users != null) {
            let user3 = json.game.pairs[1].users[0].username;
            document.querySelector(".miembro3").innerHTML = `${user3}`;

            if(json.game.pairs[1].users[1] != null) {
                let user4 = json.game.pairs[1].users[1].username;
                document.querySelector(".miembro4").innerHTML = `${user4}`;
            }
            else {
                document.querySelector(".miembro4").innerHTML = "---";
            }
        }
        else {
            document.querySelector(".miembro3").innerHTML = "---";
            document.querySelector(".miembro4").innerHTML = "---";
        }
    })
}

function joinEquipo1() {
    // conseguir pair id y hacer peticion?
}

function joinEquipo2() {
    
}


let botonEquipo1 = document.querySelector(".equipo1");
let botonEquipo2 = document.querySelector(".equipo2");
botonEquipo1.addEventListener('click', joinEquipo1);
botonEquipo2.addEventListener('click', joinEquipo2);
