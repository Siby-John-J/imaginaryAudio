

function checkVal(event) {
    const name = document.getElementById('name')
    const email = document.getElementById('email')
    const pass = document.getElementById('pass')
    const passCon = document.getElementById('pass-con')
    const ph = document.getElementById('ph')
    
    if(name.value === '') {
        name.placeholder = 'field not be empty'
        event.preventDefault()
    }
    if(email.value === '') {
        email.placeholder = 'field not be empty'
        event.preventDefault()
    }
    if(pass.value === '') {
        pass.placeholder = 'field not be empty'
        pass.preventDefault()
    }
    if(passCon.value === '') {
        passCon.placeholder = 'field not be empty'
        event.preventDefault()
    }
    if(ph.value === '') {
        ph.placeholder = 'field not be empty'
        event.preventDefault()
    }

    if(pass.value !== passCon.value) {
        pass.style.backgroundColor = '#ff8181'
        passCon.style.backgroundColor = '#ff8181'
        event.preventDefault()
    } else {
        pass.style.backgroundColor = 'white'
        passCon.style.backgroundColor = 'white'
    }
}