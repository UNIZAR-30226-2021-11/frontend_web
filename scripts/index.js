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
            if (response.ok) {
                return response.text();
            } else {
                alert("Fallo al iniciar sesión: usuario o contraseña incorrectos.");
                document.querySelector("#user").value = "";
                document.querySelector("#pass").value = "";
                throw "Respuesta incorrecta por parte del servidor";
            }
        })
        .then(data => {
            let json = JSON.parse(data);
            sessionStorage.setItem('token', json.token);
            sessionStorage.setItem('id', json.user.id);
            sessionStorage.setItem('username', json.user.username);
            if(document.querySelector("#recordar").checked) {
                // guardar credenciales
                let hoy = new Date();
                let expira = new Date();
                // las cookies expiran dentro de un año
                expira.setTime(hoy.getTime() + 3600000*24*30*12);
                document.cookie = "name=" + username + ";path=/" + ";expires=" + expira.toUTCString();
                document.cookie = "password=" + encodeURI(pass) + ";path=/" + ";expires=" + expira.toUTCString();
            }
            window.location.href = "lobby.html";
        })
        .catch(err => console.log(err));
}

botonLogin.addEventListener('click', login);

window.onload = function() {
    const ck = `; ${document.cookie}`;

    const nombre = ck.split("; name=");
    if(nombre.length == 2) {
        document.querySelector("#user").value = nombre.pop().split(';').shift();
    }

    const contra = ck.split("; password=");
    if(contra.length == 2) {
        document.querySelector("#pass").value = contra.pop().split(';').shift();
    }
}
