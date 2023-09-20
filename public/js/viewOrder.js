
const orders = document.getElementsByClassName('main-model')
const ordermodel = document.getElementById('main-model')
const status = document.getElementsByClassName('statusMain')
const cancel_btn = document.getElementsByClassName('cancel-btn')

let n = 0

function vieworder(data) {
    // ordermodel.children[0].textContent = data
    
    orders[0].style.display = 'block'
}

function closeorder() {
    orders[0].style.display = 'none'
}

setTimeout(() => {
    for(let i of status) {
        if(i.textContent === 'return') {
            cancel_btn[n].disabled = true
        }
        n++
    }
}, 500)
