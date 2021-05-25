let token = sessionStorage.getItem('token');

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
        let json = JSON.parse(data);
        let lista = document.querySelector(".listaPartidas");
        if (json.games != null) {
            for (let i = 0; i < json.games.length; i++) {
                lista.innerHTML += `<tr>
                                    <td>${json.games[i].name}</td>
                                    <td><button type="button" class="join${i}">Unirse</button>
                                </tr>`;
                document.querySelector(`.join${i}`).onclick = function() {
                    sessionStorage.setItem('idPartida', `${json.games[i].id}`);
                    sessionStorage.setItem('nombrePartida', `${json.games[i].name}`);
                    window.location.href = "salaEquipos.html";
                }
            }
        }
    })
    .catch(err => console.log(err));

document.querySelector(".flechaIz").onclick = function() {
    window.location.href = "onlineInicio.html";
}