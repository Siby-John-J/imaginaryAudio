
const orders = document.getElementsByClassName('order1')
const ordermodel = document.getElementById('view-order')

function vieworder(data) {
    console.log(data)
    // ordermodel.children[0].textContent = data

    ordermodel.style.display = 'block'
}
