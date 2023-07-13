

const mainModel = document.getElementsByClassName('add-address')
const editmodel = document.getElementsByClassName('edit-address')
const orderpanel = document.getElementsByClassName('place-order-label')
const form = document.getElementsByClassName('edit_add_form')

async function action(add='') {
    mainModel[0].style.display = 'flex'
    editmodel[0].style.display = 'none'
}

function closeBar() {
    mainModel[0].style.display = 'none'
    editmodel[0].style.display = 'none'
}

function edit_action() {
    editmodel[0].style.display = 'flex'
    mainModel[0].style.display = 'none'
}
