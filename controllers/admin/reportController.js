
const reportmodel = require('../../models/salesModel')
const fs = require('fs')
const PDFDocument = require('pdfkit')
let printable = []
let n = 0

module.exports.viewReport = async(req, res) => {
    const list_report = await reportmodel.find({})
    printable = list_report

    // console.log(list_report)

    res.render('pages/admin/mainpage', {page: 'report',
        data: list_report
    })
}

module.exports.filterReport = async(req, res) => {
    const dateData = []

    console.log(req.body)

    const findit = await reportmodel.find({})
    if(req.body.fromdate && req.body.todate) {
        const from = new Date(req.body.fromdate)
        const to = new Date(req.body.todate)

        for(let i of findit) {
            let date = new Date(i.date)
            if(date >= from && date <= to) {
                if(req.body.payment !== 'all') {
                    if(i.payment === req.body.payment) {
                        dateData.push(i)
                    }
                } else {
                    dateData.push(i)
                }
            }
        }
    }

    if(dateData.length > 0) {
        printable = dateData
        res.render('pages/admin/mainpage', {page: 'report',
            data: dateData
        })
        generatePDF(generateData(dateData))
    } else {
        if(req.body.payment === 'all') {
            const list_report = await reportmodel.find({})
            printable = list_report
            res.render('pages/admin/mainpage', {page: 'report',
                data: list_report
            })
            generatePDF(generateData(list_report))
        } else {
            const list_report = await reportmodel.find({payment: req.body.payment})
            printable = list_report
            res.render('pages/admin/mainpage', {page: 'report',
                data: list_report
            })
            generatePDF(generateData(list_report))
        }
    }
}

module.exports.printReport = async(req, res) => {
    res.sendFile(`F://ImaginaryAudio//output.pdf`)
}

function generatePDF(data) {
  try {
    const doc = new PDFDocument()
    const outputStream = fs.createWriteStream(`output.pdf`)
    doc.pipe(outputStream)

    // doc.fontSize(18).text(JSON.stringify(data), {
    //   align: 'center',
    // });

    // console.log(data)
      const data1 = []

      for(let i of data) {
        let dat = {}
        let prod = ''

        if(i.products.length > 0) {
          for(let p of i.products) {
            prod += `${p.name}[${p.count}]\n`
          }
        }

        console.log(prod.trim().length)
        
        dat.id = i.orderid,
        dat.purchase_date = i.date,
        // dat.products = prod
        dat.phone = String(i.phone),
        dat.address = i.address,
        dat.total = String('$'+i.total),
        dat.payment = i.payment

        data1.push(dat)
      }

      // const doc = new PDFDocument()
      const stream = fs.createWriteStream('invoice.pdf')
  
      doc.pipe(stream)
  
      doc.fontSize(40).text('Sales Report', { align: 'center' })
      doc.moveDown(0.5)

      // doc.fontSize(24).text('Order-Details', { align: 'center' })
      // doc.moveDown(0.5)

      let total = 0

      data.map(item => {
        doc.fontSize(14).text('Id : ' + item.orderid +
                              '     Date: ' + item.date +
                              '     Products: ' + item.products[0] +
                              '     User: ' + item.user +
                              '     Phone: ' + item.phone +
                              '     Address: ' + item.address +
                              '     Total: ' + item.total +
                              '     Payment: ' + item.payment, { align: 'start' })
        doc.moveDown(0.3)
        total += item.total
      })
      
      doc.moveDown(1.7)
      doc.fontSize(20).text('Total Price: ' + '$' + total , { align: 'start' })

      
      // doc.fontSize(14).text('Order id :   ' + invoice.orderid, { align: 'start' })
      // doc.moveDown(0.3)
      // doc.fontSize(14).text('Status :     ' + invoice.status, { align: 'start' })
      // doc.moveDown(0.3)

      // doc.fontSize(14).text('totalPrice : ' + invoice.totalprice, { align: 'start' })
      // doc.moveDown(0.3)

      // doc.fontSize(14).text('Address :    ' + invoice.address, { align: 'start' })
      // doc.moveDown(0.3)

      // doc.moveDown(0.5)
      // doc.fontSize(24).text('Product-Details', { align: 'center' })
      // doc.moveDown(0.5)

      // const space = '       '

      // orderItems.map(item => {
      //     doc.fontSize(14).text('name : ' + String(item.name) + space + 
      //     'price : ' + String(item.price) + space + 'count : ' + String(item.count) + space +
      //     'total : ' + String(item.total),  {align: 'start'})
      //     doc.moveDown(0.3)
      // })
      
      doc.end()

    outputStream.on('finish', () => {
      console.log('PDF generated successfully!')
    })
  } catch (error) {
      console.log(error)
  }
}

function generateData(data) {
    return data
}

function generateTable(doc, tableData, options) {
    const columnCount = options.columns.length;
    const columnWidth = doc.page.width / columnCount;
    const tableTop = 100; // Adjust the vertical position of the table
    const tableLeft = 0; // Adjust the horizontal position of the table
    const rowHeight = 30; // Adjust the height of each row
    const headerColor = '#5e5e5e'; // Adjust the header color to gray
    const rowColor = '#ffffff'; // Adjust the row color to white
    const textColor = 'rgba(0, 0, 0, 0.2)'; // Set the text color to black
  
    // Helper function to draw a cell with a specific style
    function drawCell(text, x, y, width, height, style) {
      doc
        .rect(x, y, width, height)
        .lineWidth(1)
        .fillOpacity(0.4)
        .fillAndStroke(style.color, rowColor) // Use the style color for the background
        .text(text, x + 5, y + 5, {
          width: width - 10,
          height: height - 10,
          align: style.align,
          valign: 'center',
          lineBreak: false,
          color: '#000000'
        });
    }
    
    // Draw header
    for (let i = 0; i < columnCount; i++) {
      const headerStyle = {
        color: headerColor,
        align: 'center',
      };
      drawCell(options.columns[i].header, tableLeft + i * columnWidth, tableTop, columnWidth, rowHeight, headerStyle);
    }
  
    // Draw data rows
    let yPos = tableTop + rowHeight;
    for (const row of tableData) {
      const rowStyle = {
        color: textColor,
        align: 'left',
      };
      for (let i = 0; i < columnCount; i++) {
        drawCell(row[options.columns[i].key], tableLeft + i * columnWidth, yPos, columnWidth, rowHeight, rowStyle);
      }
      yPos += rowHeight;
    }
  }