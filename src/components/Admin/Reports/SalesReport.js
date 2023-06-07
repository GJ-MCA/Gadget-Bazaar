import React, { useState, useEffect } from 'react';
import { adminFrontReportsPostFix, generateSalesReportPdf } from '../../../helpers/adminHelper';
import { Link } from 'react-router-dom';
import { setPageTitle } from '../../../helpers/titleHelper';

const generatePdfUrl = async (data,fromDate,toDate) => {
    const pdfDocGenerator = generateSalesReportPdf(data,fromDate,toDate);
    return new Promise((resolve, reject) => {
        pdfDocGenerator.getBase64((data) => {
          const pdfUrl = `data:application/pdf;base64,${data}`;
          resolve(pdfUrl);
        }, (error) => {
          reject(error);
        });
      });
  };
  
const SalesReport = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [salesReport, setSalesReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const config = require("../../../config/config");
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const handleGeneratePdf = async () => {
    const url = await generatePdfUrl(salesReport, fromDate, toDate);
    setPdfUrl(url);
    setPdfDownloaded(false);
  };
  const handlePdfDownload = () => {
    // set the pdfDownloaded state variable to true
    setPdfDownloaded(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.adminMainAPIUrl}/sales-report?fromDate=${fromDate}&toDate=${toDate}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data.data)
      if (Object.keys(data.data).length === 0) {
        setError('No sales report found');
      } else {
        setSalesReport(data.data);
        const totalSale = Object.values(data.data).reduce((total, report) => total + report.sales, 0);
        const totalQty = Object.values(data.data).reduce((total, report) => total + report.quantity, 0);
        setTotalSales(totalSale);
        setTotalQuantity(totalQty);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError('Internal Server Error');
      setLoading(false);
    }
  };
  function formatDate(datestr){
    const dateObj = new Date(datestr);
    const formattedDate = dateObj.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    return formattedDate
  }
  return (
    <div className='content'>
      {setPageTitle("Sales Report")}
      <h1 className='mb-2'>Sales Report</h1>
      <Link to={adminFrontReportsPostFix} className='mb-4 d-inline-block'>Go Back to Reports</Link>
      <form onSubmit={handleSubmit} className='admin-form'>
        <label htmlFor="fromDate" className='mr-2'>From Date:</label>
        <input type="date" id="fromDate" className='form-control w-25 d-inline-block' value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
        <label htmlFor="toDate" className='mr-2 ml-4'>To Date:</label>
        <input type="date" id="toDate" className='form-control w-25 d-inline-block' value={toDate} onChange={(e) => setToDate(e.target.value)} required />
        <button type="submit" className='d-block' disabled={loading}>Generate Report</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {salesReport && (
        <div className='report-container mt-2 main-table-container'>
          <h2>Sales Report for {formatDate(fromDate)} to {formatDate(toDate)}</h2>
           <div className='text-right'>
                <button onClick={handleGeneratePdf}>Generate PDF</button>
                {pdfUrl && !pdfDownloaded && (
                    <p className='text-right'>
                    <Link to={pdfUrl} download={`sales-report-${new Date().toLocaleDateString()}.pdf`} style={{fontSize: "16px", marginTop: "5px"}} onClick={handlePdfDownload}>
                        Download PDF
                    </Link>
                    </p>
                )}
            </div>
          <div className='table-container mt-4'>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Sales</th>
                  <th>Quantity Sold</th>
                </tr>
              </thead>
              <tbody>
                {salesReport && Object.keys(salesReport).map((key) => (
                  <tr key={key}>
                    <td>{salesReport[key]._id.date+"/"+salesReport[key]._id.month+"/"+salesReport[key]._id.year}</td>
                    <td>&#8377;{salesReport[key].sales.toFixed(2)}</td>
                    <td>{salesReport[key].quantity}</td>
                  </tr>
                ))}
                {totalSales && totalQuantity && (
                  <tr>
                    <td style={{fontWeight: "800"}}>
                      Total
                    </td>
                    <td style={{fontWeight: "800"}}>
                      {totalSales}
                    </td>
                    <td style={{fontWeight: "800"}}>
                      {totalQuantity}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
