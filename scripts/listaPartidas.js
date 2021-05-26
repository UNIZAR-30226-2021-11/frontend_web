let token = sessionStorage.getItem('token');
let json = {};

function joinPartida() {
    let index = event.target.className;
    sessionStorage.setItem('idPartida', `${json.games[index].id}`);
    sessionStorage.setItem('nombrePartida', `${json.games[index].name}`);
    window.location.href = "salaEquipos.html";
}

fetch("http://15.188.14.213:11050/api/v1/games/", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            alert("Fallo al recuperar la lista de partidas del servidor.");
            throw "Respesta incorrecta por parte del servidor";
        }
    })
    .then(data => {
        json = JSON.parse(data);
        let lista = document.querySelector(".listaPartidas");
        for (let i = 0; i < json.games.length; i++) {
            lista.innerHTML += `<tr>
                                <td>${json.games[i].name}</td>
                                <td><button type="button" class="${i}">Unirse</button>
                            </tr>`;
        }
        let listaBotones = document.querySelectorAll(".listaPartidas button");
        for (let i = 0; i < listaBotones.length; i++) {
            listaBotones[i].addEventListener('click', joinPartida);
        }
    })
    .catch(err => console.log(err));

let atras = document.querySelector(".flechaIz");
atras.onclick = function() {
    window.location.href = "onlineInicio.html";
}

document.querySelector(".botonBuscar").onclick = function() {
    let query = document.querySelector(".buscador").value;
        
    if(query != "") {
        fetch(`http://15.188.14.213:11050/api/v1/games/${query}`, {
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
                alert("No se ha podido encontrar la partida buscada.");
                throw "Respesta incorrecta por parte del servidor";
            }
        })
        .then(data => {
            sessionStorage.setItem('idPartida', query);
            window.location.href = "salaEquipos.html";
        })
        .catch(err => console.log(err));
    }
}