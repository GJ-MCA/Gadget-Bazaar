import React, { useState, useEffect } from 'react';
import { generatePdf } from '../../../helpers/adminHelper';

const generatePdfUrl = async (data,fromDate,toDate) => {
    const pdfDocGenerator = generatePdf(data,fromDate,toDate);
    return new Promise((resolve, reject) => {
        pdfDocGenerator.getBase64((data) => {
          const pdfUrl = `data:application/pdf;base64,${data}`;
          resolve(pdfUrl);
        }, (error) => {
          reject(error);
        });
      });
  };
  
const Reports = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [salesReport, setSalesReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const config = require("../../../config/config");
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

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
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError('Internal Server Error');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sales Report</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fromDate">From Date:</label>
        <input type="date" id="fromDate" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
        <label htmlFor="toDate">To Date:</label>
        <input type="date" id="toDate" value={toDate} onChange={(e) => setToDate(e.target.value)} required />
        <button type="submit" disabled={loading}>Generate Report</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {salesReport && (
        <div className='report-container mt-2 main-table-container'>
          <h2>Sales Report for {fromDate} to {toDate}</h2>
           <div className='text-right'>
                <button onClick={handleGeneratePdf}>Generate PDF</button>
                {pdfUrl && !pdfDownloaded && (
                    <p className='text-right'>
                    <a href={pdfUrl} download={`sales-report-${new Date().toLocaleDateString()}.pdf`} onClick={handlePdfDownload}>
                        Download PDF
                    </a>
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
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
