let id_hist = sessionStorage.getItem('id_hist');
let token = sessionStorage.getItem('token');

fetch(`http://15.188.14.213:11050/api/v1/games/user/${id_hist}`, {
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
        if (json.games != null) {
            for (let i = 0; i < json.games.length; i++) {
                if (json.games[i].winned == true) {
                    resultadoPartida = "Victoria";
                } else {
                    resultadoPartida = "Derrota";
                }

                // tratamiento de la fecha de inicio y de fin
                const final = new Date(json.games[i].end_date);
                let date = final.toDateString();

                if (json.games[i].points > 0) {
                    document.querySelector("#historialCompleto").innerHTML +=
                        `<tr>
                        <td>${date}</td>
                        <td>${json.games[i].name}</td>
                        <td>${resultadoPartida}</td>
                        <td>${json.games[i].points}</td>
                    </tr>`;
                }
            }
        }
    })
    .catch(err => console.log(err));