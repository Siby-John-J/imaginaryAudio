
const address = document.getElementsByClassName('flexCheckDefault')

async function setAddress(count, user) {
    console.log(user)
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({address: count})
    }
    
    await fetch(`/${user}/setaddress`, request)
}
