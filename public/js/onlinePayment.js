

const paypal = document.getElementById('paypal')
const razorpay = document.getElementById('razorpay')
const model = document.getElementsByClassName('payment-model')
 
paypal.addEventListener('click', () => {
    if(paypal.checked) {
        model[0].style.display = 'flex'
    }
})

razorpay.addEventListener('click', () => {
    if(razorpay.checked) {
        model[0].style.display = 'flex'
        // alert('razorpay broooo....')
    }
})

