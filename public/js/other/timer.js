
let sec = 0
let min = 0
let hour = 0

async function timer() {
    setInterval(() => {
        sec += 1
        if(sec === 10) {
            min++
            console.log('ite on min bro')
        }
    }, 1000)
}

timer()
