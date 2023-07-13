let pending = document.getElementsByClassName('pending')
let processing = document.getElementsByClassName('processing')
let delivered = document.getElementsByClassName('shipped')

let img1 = document.getElementById('img1')
let img2 = document.getElementById('img2')
let img3 = document.getElementById('img3')

let pend_line = window.getComputedStyle(pending[0], '::after')
let process_line = window.getComputedStyle(pending[0], '::after')
let deli_line = window.getComputedStyle(pending[0], '::after')

let select = document.getElementsByClassName('input-show')
        
if(select[0].value === 'pending') {
    pending[0].style.backgroundColor = 'yellow'
    pending[0].style.setProperty('--afterBack', 'yellow')
    img2.style.display = 'none'
    img3.style.display = 'none'
        
} else if(select[0].value === 'progress') {
    pending[0].style.backgroundColor = 'blue'
    processing[0].style.backgroundColor = 'blue'
    
    pending[0].style.setProperty('--afterBack', 'blue')
    processing[0].style.setProperty('--afterBack', 'blue')
    img3.style.display = 'none'
} else if(select[0].value === 'delivered') {
    pending[0].style.backgroundColor = 'green'
    processing[0].style.backgroundColor = 'green'
    delivered[0].style.backgroundColor = 'green' 
    
    pending[0].style.setProperty('--afterBack', 'green')
    processing[0].style.setProperty('--afterBack', 'green')
} else {
    pending[0].style.backgroundColor = 'red'
    processing[0].style.backgroundColor = 'red'
    delivered[0].style.backgroundColor = 'red' 
    
    pending[0].style.setProperty('--afterBack', 'red')
    processing[0].style.setProperty('--afterBack', 'red')
    img1.style.display = 'none'
    img2.style.display = 'none'
    img3.style.display = 'none'
}