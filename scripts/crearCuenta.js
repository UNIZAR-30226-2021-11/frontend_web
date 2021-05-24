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

    //fetch("http://15.188.14.213:11050/api/v1/users/", {
    fetch("http://localhost:9000/api/v1/users/", {
        method: "POST",
        headers: {
            //Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: jsonData
    })
    .then(response => {
        if(response.ok) {
            alert("Usuario creado correctamente.");
            window.location.href = "index.html";
        }
        else {
            alert("Se ha producido un fallo. No se ha podido crear el usuario.");
            throw "Respuesta incorrecta por parte del servidor.";
        }
    })
    .catch(err => console.log(err));
}

botonSubmit.addEventListener('click', crearUsuario);

atras.onclick = function() {
    window.location.href = "../code/index.html";
}
