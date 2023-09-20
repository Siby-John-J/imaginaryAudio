let dat1 = []
let dat2 = []

async function getData() {
  let get = await fetch('http://localhost:2000/admin/dashboard_data')
  let data = await get.json()
  for(let i of data.key) {
    dat1.push(i.sales)
    dat2.push(i.return)
  }
}


getData()
setTimeout(() => {
  const lineConfig = {
    type: 'line',
    data: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'March'],
      datasets: [
        {
          label: 'Sales',
          backgroundColor: '#0694a2',
          borderColor: '#0694a2',
          data: dat1,
          fill: false,
        },
        {
          label: 'Returns',
          fill: false,
          backgroundColor: '#7e3af2',
          borderColor: '#7e3af2',
          data: dat2,
        },
      ],
    },
    options: {
      responsive: true,
      legend: {
        display: false,
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      scales: {
        x: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Month',
          },
        },
        y: {
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Value',
          },
        },
      },
    },
  }
  const lineCtx = document.getElementById('line')
  window.myLine = new Chart(lineCtx, lineConfig)
}, 300);

console.log('yeeah boi')


// change this to the id of your chart element in HMTL
