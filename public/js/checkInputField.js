

function check(event) {
    let name = document.getElementById('p-name')
    let price = document.getElementById('p-price')
    let stock = document.getElementById('p-stock')
    let desc = document.getElementById('p-desc')
    let image = document.getElementById('img')

    console.log(image.files)
    
    if(image.files.length <= 0) {
        alert('image field must not be empty')
    }
    
    if(name.value === '') {
        name.placeholder = 'filed not be empty'
        event.preventDefault()
    }
    if(price.value === '') {
        price.placeholder = 'filed not be empty'
        event.preventDefault()
    }
    if(stock.value === '') {
        stock.placeholder = 'filed not be empty'
        event.preventDefault()
    }
    if(desc.value === '') {
        desc.placeholder = 'filed not be empty'
        event.preventDefault()
    }
    // return true
}