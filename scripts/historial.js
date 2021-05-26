let id_hist = sessionStorage.getItem('id_hist');
let token = sessionStorage.getItem('token');

fetch(`http://15.188.14.213:11050/api/v1/games/user/${id_hist}`, {
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
    let inicio, final;
    let fecha1, hora1, fecha2, hora2;
    let anyo1, mes1, dia1, anyo2, mes2, dia2;
    let horas1, minutos1, segundos1, horas2, minutos2, segundos2;
    if(json.games != null) {
        for(let i=0; i<json.games.length; i++) {
            if(json.games[i].winned == true) {
                resultadoPartida = "Victoria";
            }
            else {
                resultadoPartida = "Derrota";
            }

            // tratamiento de la fecha de inicio y de fin
            inicio = json.games[i].creation_date;
            fecha1 = inicio.slice(1, inicio.indexOf("T"));
            hora1 = inicio.slice(inicio.indexOf("T") + 1, inicio.indexOf("Z"));
            anyo1 = parseInt(fecha1.slice(0, fecha1.indexOf("-")), 10);
            mes1 = parseInt(fecha1.slice(fecha1.indexOf("-")+1, fecha1.lastIndexOf("-")), 10);
            dia1 = parseInt(fecha1.slice(fecha1.lastIndexOf("-")+1), 10);
            horas1 = parseInt(hora1.slice(0, hora1.indexOf("-")), 10);
            minutos1 = parseInt(hora1.slice(hora1.indexOf("-")+1, hora1.lastIndexOf("-")), 10);
            segundos1 = parseInt(hora1.slice(hora1.lastIndexOf("-")+1), 10);

            final = json.games[i].end_date;
            fecha2 = final.slice(1, final.indexOf("T"));
            hora2 = final.slice(final.indexOf("T") + 1, final.indexOf("Z"));
            anyo2 = parseInt(fecha2.slice(0, fecha2.indexOf("-")), 10);
            mes2 = parseInt(fecha2.slice(fecha2.indexOf("-")+1, fecha2.lastIndexOf("-")), 10);
            dia2 = parseInt(fecha2.slice(fecha2.lastIndexOf("-")+1), 10);
            horas2 = parseInt(hora2.slice(0, hora2.indexOf("-")), 10);
            minutos2 = parseInt(hora2.slice(hora2.indexOf("-")+1, hora2.lastIndexOf("-")), 10);
            segundos2 = parseInt(hora2.slice(hora2.lastIndexOf("-")+1), 10);

            document.querySelector(".historialPartidas").innerHTML +=
                `<tr>
                    <td>x minutos</td>
                    <td>${json.games[i].name}</td>
                    <td>${resultadoPartida}</td>
                    <td>${json.games[i].points}</td>
                </tr>`;
        }
    }
})
.catch(err => console.log(err));
