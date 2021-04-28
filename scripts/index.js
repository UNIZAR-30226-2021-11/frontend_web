let botonRegistro = document.querySelector(".crearCuenta");
let botonLogin = document.querySelector(".acceder");

botonRegistro.onclick = function() {
    window.location.href = "../code/crearCuenta.html";
}

botonLogin.onclick = function() {
    let username = document.querySelector("#user").value;
    let pass = document.querySelector("#pass").value;

    const http = new XMLHttpRequest();
    const url = 'https://jsonplaceholder.typicode.com/posts';
    http.onreadystatechange = function() {
        if(this.readyState==4 && this.status==200) {
            console.log(http.responseText);
        }
    }
    http.open("GET", url);
    http.send();
}
