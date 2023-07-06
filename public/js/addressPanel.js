
const addAddress = document.getElementsByClassName('add-address-checkout')
const orderClose = document.getElementsByClassName('place-order-label')

function adding() {
    addAddress[0].style.display = 'flex'
}

function closeAdd() {
    addAddress[0].style.display = 'none'
}

function order(ent='') {
    if(ent === 'ent') {
        orderClose[0].style.display = 'none'
    } else {
        addAddress[0].style.display = 'none'
        orderClose[0].style.display = 'flex'
    }
}
