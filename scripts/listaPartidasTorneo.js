let token = sessionStorage.getItem('token');
let json = {};

function joinPartida() {
    let index = event.target.className;
    sessionStorage.setItem('idPartida', `${json.games[index].id}`);
    sessionStorage.setItem('nombrePartida', `${json.games[index].name}`);
    window.location.href = "salaEquipos.html";
}

fetch("http://15.188.14.213:11050/api/v1/games/tournament", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            alert("Se ha producido un error al recuperar las partidas del torneo");
            throw "Respuesta incorrecta por parte del servidor";
        }
    })
    .then(data => {
        json = JSON.parse(data);
        let lista = document.querySelector(".listaPartidas");
        if (json.games != null) {
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
        }
    })
    .catch(err => console.log(err));

document.querySelector(".flechaIz").onclick = function() {
    window.location.href = "onlineInicio.html";
}
