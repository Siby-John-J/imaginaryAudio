
const mainaddress = document.getElementsByClassName('address-add')
const paymentaddress = document.getElementsByClassName('payment-div')

function envoke() {
    if(mainaddress[0].style.transform === 'translateY(-234px)') {
        mainaddress[0].style.transform = "translateY(0px)"
        paymentaddress[0].style.transform = "translateY(0px)"
    } else {
        mainaddress[0].style.transform = "translateY(-234px)"  
        paymentaddress[0].style.transform = "translateY(-292px)"
    }
}
