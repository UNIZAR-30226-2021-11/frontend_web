let boton1 = document.querySelector(".botonJugarSolo");
let boton2 = document.querySelector(".botonJugarOnline");
let boton3 = document.querySelector(".botonPerfil");
let boton4 = document.querySelector(".botonLogout");

boton1.onclick = function() {
    crearPartida();
};

boton2.onclick = function() {
    window.location.href = "onlineInicio.html";
}
boton3.onclick = function() {
    window.location.href = "perfil.html";
}
boton4.onclick = function() {
    sessionStorage.clear();
    window.location.href = "index.html"
}

function crearPartida() {
    let id = sessionStorage.getItem('id');
    let token = sessionStorage.getItem('token');

    const jsonData = JSON.stringify({
        name: `PartidaSolo_${sessionStorage.getItem('username')}`,
        public: false
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
            sessionStorage.setItem('nombrePartida', json.game.name);
            sessionStorage.setItem('idPartida', json.game.id);
            sessionStorage.setItem('pairId', json.game.my_pair_id);
            sessionStorage.setItem('playerId', json.game.my_player_id);
            sessionStorage.setItem('crearPartida', true);
            sessionStorage.setItem('singlePlayer', true);

            window.location.href = "tableroJuego.html";
        })
        .catch(err => console.log(err));
}