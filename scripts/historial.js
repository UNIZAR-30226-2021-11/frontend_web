let id_hist = sessionStorage.getItem('id_hist');
let token = sessionStorage.getItem('token');

fetch(`http://localhost:9000/api/v1/games/user/${id_hist}`, {
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
        alert("Fallo al recuperar el historial de partidas del usuario.");
        throw "Respesta incorrecta por parte del servidor";
    }
})
.then(data => {
    json = JSON.parse(data);
    let resultadoPartida = "";
    if(json.games != null) {
        for(let i=0; i<json.games.length; i++) {
            if(json.games[i].winned == true) {
                resultadoPartida = "Victoria";
            }
            else {
                resultadoPartida = "Derrota";
            }
            document.querySelector(".historialPartidas").innerHTML +=
                `<tr>
                    <td>x minutos</td>
                    <td>${json.games[i].name}</td>
                    <td>${resultadoPartida}</td>
                    <td>Puntuación</td>
                </tr>`;
        }
    }
})
.catch(err => console.log(err));
