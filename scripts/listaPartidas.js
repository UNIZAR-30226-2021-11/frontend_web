let token = sessionStorage.getItem('token');
let json = {};

fetch("http://localhost:9000/api/v1/games/", {
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
        alert("Fallo al recuperar la lista de partidas del servidor.");
        throw "Respesta incorrecta por parte del servidor";
    }
})
.then(data => {
    json = JSON.parse(data);
    let lista = document.querySelector(".listaPartidas");
    for(let i=0; i<json.games.length; i++) {
        lista.innerHTML += `<tr>
                                <td>${json.games[i].name}</td>
                                <td><button type="button" class="join${i}">Unirse</button>
                            </tr>`;
        document.querySelector(`.join${i}`).onclick = function() {
            sessionStorage.setItem('numPartida', `${json.games[i].id}`);
            sessionStorage.setItem('idPartida', `${json.games[i].name}`);
            window.location.href = "salaEquipos.html";
        }
    }
})
.catch(err => console.log(err));

let atras = document.querySelector(".flechaIz");
atras.onclick = function() {
    window.location.href = "onlineInicio.html";
}

let botonBuscar = document.querySelector(".botonBuscar");
botonBuscar.onclick = function() {
    let query = document.querySelector(".buscador").value;
    let lista = document.querySelector(".listaPartidas");
    lista.innerHTML =
        `<tr>
            <th>Identificador de la partida</th>
            <th>Entrar en la sala</th>
        </tr>`;
        
    if(query != "") {
        for(let i=0; i<json.games.length; i++) {
            if(query == json.games[i].name) {
                lista.innerHTML +=
                `<tr>
                    <td>${json.games[i].name}</td>
                    <td><button type="button" class="join${i}">Unirse</button>
                </tr>`;
                document.querySelector(`.join${i}`).onclick = function() {
                    sessionStorage.setItem('numPartida', `${json.games[i].id}`);
                    sessionStorage.setItem('idPartida', `${json.games[i].name}`);
                    window.location.href = "salaEquipos.html";
                }
            }
        }
    }
    else {
        for(let i=0; i<json.games.length; i++) {
            lista.innerHTML += `<tr>
                                    <td>${json.games[i].name}</td>
                                    <td><button type="button" class="join${i}">Unirse</button>
                                </tr>`;
            document.querySelector(`.join${i}`).onclick = function() {
                sessionStorage.setItem('numPartida', `${json.games[i].id}`);
                sessionStorage.setItem('idPartida', `${json.games[i].name}`);
                window.location.href = "salaEquipos.html";
            }
        }
    }
}
