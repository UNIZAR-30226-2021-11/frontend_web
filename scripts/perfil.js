let buscarPerfil = document.querySelector("#userSearch");

buscarPerfil.onsubmit = peticion();

function peticion() {
    let username = document.querySelector('#username');
    let urlprovisional = 'http://15.188.14.213:11050/api/v1/users/' + username;

    const Http = new XMLHttpRequest();
    const url = urlprovisional;
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        console.log(Http.responseText)
    }
}