let botonRegistro = document.querySelector(".crearCuenta");
let botonLogin = document.querySelector(".acceder");

botonRegistro.onclick = function() {
    window.location.href = "crearCuenta.html";
}

function login() {
    const username = document.querySelector("#user").value;
    const pass = document.querySelector("#pass").value;
    const jsonData = JSON.stringify({
        username: username,
        password: pass
    });

    fetch("http://15.188.14.213:11050/api/v1/users/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonData
    })
    .then(response => {
        if(response.ok) {
            return response.text();
        }
        else {
            alert("Fallo al iniciar sesión.");
            throw "Respuesta incorrecta por parte del servidor";
        }
    })
    .then(data => {
        let json = JSON.parse(data);
        sessionStorage.setItem('token', json.token);
        sessionStorage.setItem('id', json.user.id);
        sessionStorage.setItem('username', json.user.username);
        window.location.href = "lobby.html";
    })
    .catch(err => console.log(err));
}

botonLogin.addEventListener('click', login);
