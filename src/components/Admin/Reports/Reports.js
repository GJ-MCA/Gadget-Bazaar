import React, { useState, useEffect } from 'react';
import { adminFrontReportsPostFix, generatePdf } from '../../../helpers/adminHelper';
import { Link } from 'react-router-dom';

  
const Reports = () => {
  return (
    <div className='content'>
      <h1>GadgetBazaar Reports</h1>
        <ul className="list-group">
        <Link to={`${adminFrontReportsPostFix}/sales-report`} className="list-group-item">Sales Report</Link>
        <Link to={`${adminFrontReportsPostFix}/product-sales-report`} className="list-group-item">Product Sales Report</Link>
      </ul>
      
    </div>
  );
};

export default Reports;
