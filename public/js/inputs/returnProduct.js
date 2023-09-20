const model = document.getElementsByClassName('model')

function activate() {
    model[0].style.display = 'flex'
}

function deactivate(event) {
    event.preventDefault()
    model[0].style.display = 'none'
}