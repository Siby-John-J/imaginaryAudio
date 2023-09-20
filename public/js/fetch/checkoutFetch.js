
const couponParent = document.getElementsByClassName("input_coupon")
const couponTxt = document.getElementsByClassName('coupon_text')

const bills = document.getElementById('billing')
const _data = document.getElementsByClassName('for-edit')[0]
let finalPrice = 0

let _prod = ''
let _type = ''
let = null

async function call(user) {
    const lastchild = bills.lastElementChild.firstElementChild.firstElementChild.textContent
    const message = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            coupon: couponParent[0].value
        })
    }

    const fetchdata = await fetch(`http://localhost:2000/${user}/getcoupon`, message)
    const json = await fetchdata.json({})

    function wrongProduct() {
        if(lastchild === 'Final Price') {
            bills.removeChild(bills.lastChild)
            bills.removeChild(bills.lastChild)
        }

        couponTxt[0].textContent = 'The products are not in the coupon list'
        couponParent[0].style.color = 'orange'
        couponParent[0].style.borderColor = 'orange'
    }

    function outOfValue() {
        if(lastchild === 'Final Price') {
            bills.removeChild(bills.lastChild)
            bills.removeChild(bills.lastChild)
        }

        couponTxt[0].textContent = 'The products cost is too high'
        couponParent[0].style.color = 'yellow'
        couponParent[0].style.borderColor = 'yellow'
    }

    async function approved() {
        const _lastChild = bills.lastElementChild.firstElementChild.firstElementChild.textContent

        console.log(json)

        if(_lastChild !== 'Final Price') {
            couponTxt[0].textContent = 'The Coupon applied for your checkout'
            couponParent[0].style.color = 'green'
            couponParent[0].style.borderColor = 'green'

            // reduced price

            const reduce = document.createElement('tr')
            const reduceSub = document.createElement('td')
            const reduceSub2 = document.createElement('td')

            const red_content = document.createElement('strong')
            const red_content2 = document.createElement('strong')

            // final price
    
            const newChild = document.createElement('tr')
            const subchild = document.createElement('td')
            const subchild2 = document.createElement('td')
            
            const strong1 = document.createElement('strong')
            const strong2 = document.createElement('strong')
    
            let totalprice = 0
            let mainprice = 0
            
            json.data.map(item => {
                totalprice += item.price * item.count
            })

            console.log(totalprice)
    
            if(json.message.type === 'percentage') {
                p = (json.message.Purchase / 100) * totalprice
                _type = 'percentage'
                mainprice = totalprice - p
                if(mainprice <= 0) {
                    mainprice = 0
                }
                finalPrice = mainprice
            } else {
                _type = 'value'
                mainprice = totalprice - json.message.Purchase
                if(mainprice <= 0) {
                    mainprice = 0
                }
                finalPrice = mainprice
            }

            // reduce price append
            red_content.textContent = 'Reduced Price'
            
            if(_type === 'value') {
                red_content2.textContent = `- $${Math.trunc(json.message.Purchase)}`
            } else {
                red_content2.textContent = `(${json.message.Purchase}%) - $${Math.trunc(p)}`
            }

            reduceSub.appendChild(red_content)
            reduceSub2.appendChild(red_content2)

            reduceSub.setAttribute('class', 'text-black font-weight-bold')
            reduceSub2.setAttribute('class', 'text-black font-weight-bold mainprice')

            reduce.appendChild(reduceSub)
            reduce.appendChild(reduceSub2)

            bills.appendChild(reduce)

            // final price append
    
            strong1.textContent = 'Final Price'
            strong2.textContent = '$' + String(mainprice)
    
            subchild.appendChild(strong1)
            subchild2.appendChild(strong2)
    
            subchild.setAttribute('class', 'text-black font-weight-bold')
            subchild2.setAttribute('class', 'text-black font-weight-bold mainprice')
            
            newChild.appendChild(subchild)
            newChild.appendChild(subchild2)
            
            bills.appendChild(newChild)
    
            const data = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    coupon: json.message,
                    price: mainprice
                })
            }
    
            await fetch(`http://localhost:2000/${user}/setcoupon`, data)
        } else if(json.message === null){
            couponParent[0].style.color = 'red'
            couponParent[0].style.borderColor = 'red'
            couponTxt[0].textContent = 'This Coupon code is not exitsted'
            couponTxt[0].color = 'red'
        }
    }
    
    if(json.message !== null) {
        if(json.message.products[0] !== 'all') {
            for(let data of json.data) {
                if(json.message.products.includes(data.name)) {
                } else {
                    _prod = 'wrong_prod'
                    wrongProduct()
                    break
                }
            }
        }

        if(_prod !== 'wrong_prod') {
            let total = 0

            for(let i of json.data) {
                total += i.count * i.price
            }

            // console.log(total, json.message.value)

            (total >= json.message.value) ? outOfValue() : approved()

            // setting the redeemed value

            const price = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    price: finalPrice
                })
            }

            await fetch(`http://localhost:2000/${user}/setprice`, price)
        }
    } else {
        if(lastchild === 'Final Price') {
            bills.removeChild(bills.lastChild)
            bills.removeChild(bills.lastChild)

        }

        couponParent[0].style.color = 'red'
        couponParent[0].style.borderColor = 'red'
        couponTxt[0].textContent = 'This Coupon code is not exitsted'
        couponTxt[0].color = 'red'
    }
}

function check() {
    console.log(lastchild, ' is dis')
    if(lastchild === 'Final Price') {
        bills.removeChild(bills.lastChild)
        bills.removeChild(bills.lastChild)
    }

    couponParent[0].style.color = 'black'
    couponParent[0].style.borderColor = 'black'
    couponTxt[0].textContent = 'Enter your coupon code if you have one'
    couponTxt[0].style.color = 'black'
}

function get(type) {
    console.log(type)
}

function selectCoupon(name) {
    console.log('lwal')
}