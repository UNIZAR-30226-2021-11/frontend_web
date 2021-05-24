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

    fetch(`http://localhost:9000/api/v1/games/${id}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: jsonData
    })
    .then(response => {
        if(response.ok) {
            return response.text();
        }
        else {
            alert("Fallo al crear la partida.");
            throw "Respuesta incorrecta por parte del servidor";
        }
    })
    .then(data => {
        let json = JSON.parse(data);
        let idPartida = json.game.name;
        let numPartida = json.game.id;
        sessionStorage.setItem('idPartida', idPartida);
        sessionStorage.setItem('numPartida', numPartida);
        sessionStorage.setItem('partidaCreada', true);

        window.location.href = "salaEquipos.html";
    })
    .catch(err => console.log(err));
}

botonCrear.addEventListener('click', crearPartida);
