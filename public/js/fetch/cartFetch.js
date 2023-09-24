

const inp = document.getElementsByClassName('count_inp')
const total = document.getElementsByClassName('each-total')
const subtotal = document.getElementsByClassName('sub-total')
const ftotal = document.getElementsByClassName('total')

async function inc(count, id, user, n) {
    let cur = Number(inp[Number(n)].value)

    if(cur > 1) {
        count === 'max' ? cur++ : cur--
    } else if(cur === 1) {
        count === 'max' ? cur++ : ''
    }

    inp[Number(n)].value = String(cur)
    // "/<%= user %>/cart/countcart?item=<%= data[i][0]._id %>&num=min"
    const get = await fetch(`/${user}/cart/countcart?item=${id}&num=${count}`)
    const data = await get.json()

    // console.log(n, data.subtotal)
    // console.log(subtotal[0])
    total[Number(n)].textContent = "$" + data.total
    subtotal[0].textContent = "$" + data.subtotal
    ftotal[0].textContent = "$" + data.subtotal
}

async function message() {
    const get = await fetch(`http://localhost:2000/aria/cart`)
    const data = await get.json({})

    console.log(data)
}

// message()
