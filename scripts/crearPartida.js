let botonCrear = document.querySelector("button");

function crearPartida() {
    let id = sessionStorage.getItem('id');
    let token = sessionStorage.getItem('token');

    const nombrePartida = document.querySelector("#idSala").value;
    const esPublica = document.querySelector("#esPublica").checked;
    const jsonData = JSON.stringify({
        name: nombrePartida,
        public: esPublica
    });

    fetch(`http://15.188.14.213:11050/api/v1/games/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: jsonData
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                alert("Fallo al crear la partida.");
                throw "Respuesta incorrecta por parte del servidor";
            }
        })
        .then(data => {
            let json = JSON.parse(data);
            sessionStorage.setItem('idPartida', json.game.name);
            sessionStorage.setItem('numPartida', json.game.id);
            sessionStorage.setItem('pairId', json.game.my_pair_id);
            sessionStorage.setItem('crearPartida', true);
            window.location.href = "tableroJuego.html";
        })
        .catch(err => console.log(err));
}

botonCrear.addEventListener('click', crearPartida);
