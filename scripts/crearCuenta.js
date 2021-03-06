let botonSubmit = document.querySelector(".accept");
let atras = document.querySelector(".flechaIz");

function crearUsuario(e) {
    e.preventDefault();
    const email = document.querySelector("#mail").value;
    const username = document.querySelector("#user").value;
    const pass = document.querySelector("#pass").value;
    const jsonData = JSON.stringify({
        username: username,
        email: email,
        location: "Terrer",
        password: pass
    });

    if (username.indexOf(" ") != -1) {
        alert("Error: el nombre de usuario no puede contener espacios en blanco.");
        document.querySelector("#user").value = "";
        document.querySelector("#pass").value = "";
    } else {
        fetch("http://15.188.14.213:11050/api/v1/users/", {
                method: "POST",
                headers: {
                    //Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: jsonData
            })
            .then(response => {
                if (response.ok) {
                    alert("Usuario creado correctamente.");
                    localStorage.setItem(`${username}_reverso`, 1);
                    localStorage.setItem(`${username}_tablero`, 1);
                    window.location.href = "index.html";
                } else {
                    alert("Se ha producido un fallo. No se ha podido crear el usuario.");
                    throw "Respuesta incorrecta por parte del servidor.";
                }
            })
            .catch(err => console.log(err));
    }
}

botonSubmit.addEventListener('click', crearUsuario);

atras.onclick = function() {
    window.location.href = "index.html";
}