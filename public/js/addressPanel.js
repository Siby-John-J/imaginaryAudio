
const addAddress = document.getElementsByClassName('add-address-checkout')
const noaddress = document.getElementsByClassName('no-address-panel')
// const noadpop = document.getElementsByClassName('place-order-btn')

const errorCheckout = document.getElementById('checkout-error')
const orderClose = document.getElementsByClassName('place-order-label')

function adding(data) {
    if(data) {
        addAddress[0].style.display = 'flex'
        noaddress[0].style.display = 'none'
    } else {
        errorCheckout.style.display = 'flex'
    }
}

function closeAdd() {
    addAddress[0].style.display = 'none'
}

function order(event, ent='') {
    if(ent === 'ent') {
        orderClose[0].style.display = 'none'
    } else {
        addAddress[0].style.display = 'none'
        orderClose[0].style.display = 'flex'
    }
}

function noAddress() {
    addAddress[0].style.display = 'none'
    noaddress[0].style.display = 'flex'
}
