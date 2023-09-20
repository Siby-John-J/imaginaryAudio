
const address = document.getElementsByClassName('flexCheckDefault')

// console.log(address)
// address[0].addEventListener('onclick', () => {
//     console.log('lwal')
// })


async function setAddress(count) {
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({address: count})
    }
    
    await fetch(`http://localhost:2000/aria/setaddress`, request)
}
