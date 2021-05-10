let botonRegistro = document.querySelector(".crearCuenta");
let botonLogin = document.querySelector(".acceder");

botonRegistro.onclick = function() {
    window.location.href = "../code/crearCuenta.html";
}

function login() {
    const username = document.querySelector("#user").value;
    const pass = document.querySelector("#pass").value;
    const jsonData = JSON.stringify({
        username: username,
        password: pass
    });

    fetch("http://localhost:9000/api/v1/users/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonData
    })
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        else {
            alert("Fallo al iniciar sesión.");
            throw "Respuesta incorrecta por parte del servidor";
        }
    })
    .then(data => {
        console.log(data);
        window.location.href = "../code/lobby.html";
    })
    .catch(err => console.log(err));
}

botonLogin.addEventListener('click', login);
