let botonSubmit = document.querySelector(".accept");
let atras = document.querySelector(".flechaIz");

function crearUsuario(e) {
    e.preventDefault();
    const email = document.querySelector("#mail").value;
    const username = document.querySelector("#user").value;
    const pass = document.querySelector("#pass").value;

    fetch("http://15.188.14.213:11050/api/v1/users/", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: pass
        })
    })
        .then(res => res.text())
        .then(data => {
            const {
                result
            } = data;
            alert(result);
        })
        .catch(err => console.log(err));
}

botonSubmit.addEventListener('click', crearUsuario);

atras.onclick = function() {
    window.location.href = "../code/inicioSesion.html";
}
