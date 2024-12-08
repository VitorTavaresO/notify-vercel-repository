const form = document.querySelector("form");
const iname = document.querySelector("name");
const icpf = document.querySelector("cpf");
const isiape = document.querySelector("siape");
const iposition = document.querySelector("position");
const iemail = document.querySelector("email");
const iphone = document.querySelector("phone"); 
const ipassword = document.querySelector("password");

function register() {
    fetch("http://localhost:8080/api/user"), {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            name: iname.value,
            cpf: icpf.value,
            siape: isiape.value,
            position: iposition.value,
            email: iemail.value,
            phone: iphone.value,
            password: ipassword.value
        })
            .then(function (res) { console.log(res) })
            .catch(function (res) { console.log(res) })
    }
}

function clear() {
    iname.value = "",
    icpf.value = "",
    isiape.value = "",
    iposition.value = "",
    iemail.value = "",
    iphone.value = "",
    ipassword.value = ""
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    register();
    clear();
});
