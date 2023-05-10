import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
const config = require("../config/config");
export const adminFrontBasePostFix = "/gadgetbazaar/admin";
export const adminFrontLoginPostFix =`${adminFrontBasePostFix}/auth/login`;
export const adminFrontForgotPasswordPostFix = `${adminFrontBasePostFix}/auth/forgotpassword`;
export const adminFrontResetPasswordPostFix = `${adminFrontBasePostFix}/auth/resetpassword`;
export const adminFrontDashboardPostFix = `${adminFrontBasePostFix}/dashboard`;
export const adminFrontProductsPostFix = `${adminFrontDashboardPostFix}/products`;
export const adminFrontCategoryPostFix = `${adminFrontDashboardPostFix}/category`;
export const adminFrontBrandsPostFix = `${adminFrontDashboardPostFix}/brands`;
export const adminFrontSpecificationsPostFix = `${adminFrontDashboardPostFix}/specifications`;
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


export const generatePdf = (salesReport, fromDate, toDate) => {
    const tableRows = [];
  
    // Add table header
    tableRows.push([    { text: 'Date', style: 'tableHeader' },    { text: 'Sales', style: 'tableHeader' },    { text: 'Quantity Sold', style: 'tableHeader' },  ]);
  
    // Add table rows
    Object.keys(salesReport).forEach((key) => {
      const row = [      { text: salesReport[key]._id.date+"/"+salesReport[key]._id.month+"/"+salesReport[key]._id.year, style: 'tableCell' },      { text: `₹ ${salesReport[key].sales.toFixed(2)}`, style: 'tableCell' },
        { text: salesReport[key].quantity.toString(), style: 'tableCell' },
      ];
      tableRows.push(row);
    });
    const fromDateObj = new Date(fromDate);
    const formattedFromDate = fromDateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const toDateObj = new Date(toDate);
    const formattedToDate = toDateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
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
        },
      };
      
      
  
    const pdfDocGenerator = pdfMake.createPdf(docDefinition); // use createPdf method
  
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