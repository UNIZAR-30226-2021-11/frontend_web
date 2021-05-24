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
            return response.text();
        }
        else {
            alert("Fallo al iniciar sesión.");
            throw "Respuesta incorrecta por parte del servidor";
        }
    })
    .then(data => {
        let foo = data.split(",");
        let index = foo[0].lastIndexOf("\"");
        let token = foo[0].slice(10, index);
        sessionStorage.setItem('token', token);

        index = foo[1].lastIndexOf(":") + 1;
        let index2 = foo[1].length;
        let userId = foo[1].slice(index, index2);
        sessionStorage.setItem('id', userId);

        index = foo[2].lastIndexOf(":") + 2;
        index2 = foo[2].length - 1;
        let user = foo[2].slice(index, index2);
        sessionStorage.setItem('username', user);

        window.location.href = "lobby.html";
    })
    .catch(err => console.log(err));
}

botonLogin.addEventListener('click', login);
