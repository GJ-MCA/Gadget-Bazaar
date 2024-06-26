import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
const config = require("../config/config");
export const adminFrontBasePostFix = "/gadgetbazaar/admin";
export const adminFrontLoginPostFix =`${adminFrontBasePostFix}/auth/login`;
export const adminFrontForgotPasswordPostFix = `${adminFrontBasePostFix}/auth/forgotpassword`;
export const adminFrontResetPasswordPostFix = `${adminFrontBasePostFix}/auth/resetpassword`;
export const adminFrontDashboardPostFix = `${adminFrontBasePostFix}/dashboard`;
export const adminFrontProductsPostFix = `${adminFrontDashboardPostFix}/products`;
export const adminFrontProductReviewPostFix = `${adminFrontDashboardPostFix}/product-reviews`;
export const adminFrontCategoryPostFix = `${adminFrontDashboardPostFix}/category`;
export const adminFrontBrandsPostFix = `${adminFrontDashboardPostFix}/brands`;
export const adminFrontSpecificationsPostFix = `${adminFrontDashboardPostFix}/specifications`;
export const adminFrontPromotionsPostFix = `${adminFrontDashboardPostFix}/promotions`;
export const adminFrontOrdersPostFix = `${adminFrontDashboardPostFix}/orders`;
export const adminFrontUsersPostFix = `${adminFrontDashboardPostFix}/users`;
export const adminFrontReportsPostFix = `${adminFrontDashboardPostFix}/reports`;

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const isUserAdmin = async (token) => {
    try {
        const response = await fetch(`${config.authAPIUrl}/isadmin`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': `Bearer ${token}`
            },
        });
        const data = await response.json();
        console.log(data)
        if(data){
            if(data.status){
                if(data.status === "failed"){
                    window.location.href = config.adminLoginUrl;
                    return false;
                }else{
                    return true;
                }
            }
        }
    } catch (err) {
        console.error(err.message);
    }
};

export async function adminMiddleware(){
    const token = localStorage.getItem("auth-token");
    if(token) {
        let result = await isUserAdmin(token)
        if(result)
            return true;
    }
    else
        window.location.href = config.adminLoginUrl;
}


export const getDashboardCounts = async() =>{
    const token = localStorage.getItem("auth-token");
    try {
    const response = await fetch(`${config.adminMainAPIUrl}/get-counts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'auth-token': `Bearer ${token}`
        },
    });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error.message);
      throw new Error('Error fetching dashboard counts');
    }
}


export const generateSalesReportPdf = (salesReport, fromDate, toDate) => {
    const tableRows = [];
  
    // Add table header
    tableRows.push([    { text: 'Date', style: 'tableHeader' },    { text: 'Sales', style: 'tableHeader' },    { text: 'Quantity Sold', style: 'tableHeader' },  ]);
  
    // Add table rows
    let totalSales = 0;
    let totalQuantitySold = 0;
    Object.keys(salesReport).forEach((key) => {
      const row = [      { text: salesReport[key]._id.date+"/"+salesReport[key]._id.month+"/"+salesReport[key]._id.year, style: 'tableCell' },      { text: `₹ ${salesReport[key].sales.toFixed(2)}`, style: 'tableCell' },
        { text: salesReport[key].quantity.toString(), style: 'tableCell' },
      ];
      tableRows.push(row);
      totalSales += salesReport[key].sales;
      totalQuantitySold += salesReport[key].quantity;
    });
    tableRows.push([
      { text: 'Total', style: 'tableCellBold' },
      { text: `₹ ${totalSales.toFixed(2)}`, style: 'tableCellBold' },
      { text: totalQuantitySold.toString(), style: 'tableCellBold' },
    ]);
    const fromDateObj = new Date(fromDate);
    const formattedFromDate = fromDateObj.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    const toDateObj = new Date(toDate);
    const formattedToDate = toDateObj.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const docDefinition = {
        content: [
          { text: `Gadget Bazaar Sales Report From ${formattedFromDate} to ${formattedToDate}`, style: 'header' },
          {
            table: {
              widths:  ['*', '*', '*'], // set the table width to 100%
              body: tableRows
            },
            layout: 'lightHorizontalLines'
          },
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
            noWrap: true,
          },
          tableCellBold: {
            fontSize: 12,
            color: 'black',
            alignment: 'center',
            noWrap: true,
            bold: true,
          },
        },
      };
      
      
  
    const pdfDocGenerator = pdfMake.createPdf(docDefinition); // use createPdf method
  
    return pdfDocGenerator;
  };
  export const generateProductSalesReportPdf = (salesReport, fromDate, toDate) => {
    const tableRows = [];
  
    // Add table header
    tableRows.push([
      { text: 'Product Id', style: 'tableHeader' },
      { text: 'Product Name', style: 'tableHeader' },
      { text: 'Quantity Sold', style: 'tableHeader' },
      { text: 'Sales', style: 'tableHeader' },
    ]);
  
    // Add table rows
    let totalSales = 0;
    let totalQuantitySold = 0;
  
    Object.keys(salesReport).forEach((key) => {
      const row = [
        { text: salesReport[key].productId, style: 'tableCell' },
        { text: salesReport[key].productName, style: 'tableCell' },
        { text: salesReport[key].quantitySold.toString(), style: 'tableCell' },
        { text: `₹ ${parseFloat(salesReport[key].totalSale).toFixed(2)}`, style: 'tableCell' },
      ];
  
      tableRows.push(row);
  
      totalSales += parseFloat(salesReport[key].totalSale);
      totalQuantitySold += salesReport[key].quantitySold;
    });
  
    tableRows.push([
      { text: 'Total', style: 'tableCellBold', colSpan: 2 },
      {},
      { text: totalQuantitySold.toString(), style: 'tableCellBold' },
      { text: `₹ ${totalSales.toFixed(2)}`, style: 'tableCellBold' },
    ]);
  
    const fromDateObj = new Date(fromDate);
    const formattedFromDate = fromDateObj.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  
    const toDateObj = new Date(toDate);
    const formattedToDate = toDateObj.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  
    const docDefinition = {
      content: [
        { text: `Gadget Bazaar Product Sales Report From ${formattedFromDate} to ${formattedToDate}`, style: 'header' },
        {
          table: {
            widths: ['*', '*', 'auto', '*'], // set the table width to 100%
            body: tableRows,
          },
          layout: 'lightHorizontalLines',
        },
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
          noWrap: true,
        },
        tableCellBold: {
          fontSize: 12,
          color: 'black',
          alignment: 'center',
          noWrap: true,
          bold: true,
        },
      },
    };
  
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    return pdfDocGenerator;
  };
  

  export const addNeccessaryClasses = () =>{
    const form = document.getElementsByTagName("form");
    if (form) {
        Array.from(form).forEach((formItem)=>{
            if(!formItem.classList.contains("admin-form"))
            formItem.classList.add("admin-form");
        });
        const inputFields = document.querySelectorAll('form.admin-form input');
            inputFields.forEach((input) => {
            if (!input.classList.contains('form-control')) {
                input.classList.add('form-control');
            }
        });
 
    }
  }
  export const getOrderByReferenceCode = async (order_reference_code) => {
    try {
      console.log(order_reference_code)
      const response = await fetch(`${config.adminMainAPIUrl}/orders/getorderbyreferencecode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({order_reference_code: order_reference_code })
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err.message);
    }
  };
  export const getOrderStatusValues = async () => {
    try {
      const response = await fetch(`${config.adminMainAPIUrl}/orders/status/getallvalues`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err.message);
    }
  };
  export const updateOrderStatusValue = async (order_id, status) => {
    try {
      const response = await fetch(`${config.adminMainAPIUrl}/orders/status/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({order_id: order_id, order_status: status })
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err.message);
    }
  };
  export const updateOrderEstimatedDeliveryDate = async (order_id, estimated_delivery_date) => {
    try {
      const response = await fetch(`${config.adminMainAPIUrl}/orders/estimated-delivery/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({order_id: order_id, estimated_delivery_date  })
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err.message);
    }
  };
  export const getUserRoleValues = async () => {
    try {
      const response = await fetch(`${config.adminMainAPIUrl}/users/role/getallvalues`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err.message);
    }
  };
  export const getPromotionStatusValues = async () => {
    try {
      const response = await fetch(`${config.adminMainAPIUrl}/promotions/status/getallvalues`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err.message);
    }
  };
  export const getAdminUserProfile = async (token) => {
    try {
        const response = await fetch(`${config.adminMainAPIUrl}/getprofile`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': `Bearer ${token}`
            },
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err.message);
    }
};

export const updateAdminUserProfile = async (token, userData) => {
    try {
        const response = await fetch(`${config.adminMainAPIUrl}/updateprofile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err.message);
    }
};