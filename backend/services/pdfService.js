const pdfMake = require('pdfmake');

const generatePdf = (salesReport) =>{
  const tableRows = [];

  // Add table header
  tableRows.push([    { text: 'Date', style: 'tableHeader' },    { text: 'Sales', style: 'tableHeader' },    { text: 'Amount', style: 'tableHeader' },  ]);

  // Add table rows
  Object.keys(salesReport).forEach((key) => {
    const row = [      { text: key, style: 'tableCell' },      { text: `₹ ${salesReport[key].sales.toFixed(2)}`, style: 'tableCell' },
      { text: salesReport[key].quantity.toString(), style: 'tableCell' },
    ];
    tableRows.push(row);
  });

  const docDefinition = {
    content: [
      { text: 'Sales Report', style: 'header' },
      { table: { body: tableRows }, layout: 'lightHorizontalLines' },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black',
        fillColor: '#f2f2f2',
        alignment: 'center',
      },
      tableCell: {
        fontSize: 12,
        color: 'black',
        alignment: 'center',
      },
    },
  };

  const printer = new pdfMake();
  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  return pdfDoc;
}

module.exports = { generatePdf };