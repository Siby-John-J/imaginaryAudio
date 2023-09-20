
const name = document.getElementById('name')
const email = document.getElementById('email')
const pass = document.getElementById('pass')
const passCon = document.getElementById('pass-con')
const ph = document.getElementById('ph')
const warning = document.getElementById('warning')
const create = document.getElementById('create')

function checkVal(event) {
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

async function validate(content) {
    let value = ''
    if(content === 'name') {
        value = name.value
    } else if(content === 'email') {
        value = email.value
    }

    const data = {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            type: content,
            data: value
        })
    }

    const res = await fetch('http://localhost:2000/signup/data', data)
    const json = await res.json()

    if(json.msg === 'email') {
        warning.textContent = 'this email is already exists'
        // create.setAttribute('disable')
        create.disabled = true
    } else if(json.msg === 'name') {
        create.disabled = true
        warning.textContent = 'this name is already exists'
        // create.setAttribute('disable')
    } else {
        warning.textContent = ''
        // create.removeAttribute('disable')
        create.disabled = false
    }
}
