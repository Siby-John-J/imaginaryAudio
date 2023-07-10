

const mainModel = document.getElementsByClassName('add-address')
const orderpanel = document.getElementsByClassName('place-order-label')
const form = document.getElementsByClassName('edit_add_form')

async function action(add='') {
    mainModel[0].style.display = 'flex'
}

function closeBar() {
    mainModel[0].style.display = 'none'
}
