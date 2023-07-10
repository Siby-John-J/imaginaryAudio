

let model = document.getElementsByClassName('ord-popup')
let error = document.getElementById('no-edit')

function call(num) {
    model[num].style.display = 'flex'
}

function disable() {
    error.style.display = 'flex'
}