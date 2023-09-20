

const time = document.getElementsByClassName('timeControl')

time[0].addEventListener('keydown', (event) => {
    let str = event.target.value

    if(str.length >= 6) {
        // alert('stop')
        // console.log(event)
        time[0].style.color = 'red'
        // time[0].value = 'must enter the right value'
    } else {
        time[0].style.color = 'black'
        // time[0].placeholder = ''
    }
    // if(event.key !== ':' || Number(event.key) === NaN) {
    //     time[0].style.borderColor = 'red'
    //     time[0].style.color = 'red'
    //     doc[0].style.value = 'please enter the right input'
    // } else {
    //     console.log(event.key)
    //     time[0].style.borderColor = 'black'
    //     time.style.color = 'black'
    // }
    // if(time[0].value === '') {
    //     time[0].style.borderColor = 'black'
    //     time.style.color = 'black'
    // }
})

// setTimeout(() => {
//     alert('hi')
// }, 3000)

const input = document.getElementById('example-number-input')

function setType() {
    var selectElement = document.getElementById("example-select");

    if(selectElement.value === 'percentage') {
        input.setAttribute('max', '90')
    } else if(selectElement.value === 'amount' && input.getAttribute('max') !== null) {
        input.removeAttribute('max')
    }
}

input.addEventListener('keyup', () => {
    if(input.getAttribute('max') !== null) {
        if(Number(input.value) > Number(input.getAttribute('max'))) {
            input.value = ''
        }
        console.log(typeof(input.value), typeof(input.getAttribute('max')))
    }

})