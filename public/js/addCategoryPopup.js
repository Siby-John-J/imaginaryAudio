

const a = document.getElementById('click')

function popup() {
    const category = prompt("enter category: ")
    fetch('/admin/category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: category
        })
    }).then(data => {
        return data.json()
    }).then(data => {
        // console.log('memes', data)
    })
}