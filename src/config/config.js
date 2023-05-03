// Define the base URL of API server as a global variable

const gadgetBazaarTitle = "Gadget Bazaar";
const clientUrl = "http://localhost:3000" //Frontend URL
const baseUrl = 'http://localhost:5000/backend-gadgetbazaar'; //Backend URL
const authAPIUrl = `${baseUrl}/auth`; //Auth API URL
const orderAPIUrl = `${baseUrl}/order`; //Order API URL
const paymentAPIUrl = `${baseUrl}/payment`; //Payment API URL
const checkoutUrl = `${orderAPIUrl}/checkout` //Shipping Methods URL
const shippingMethodUrl = `${orderAPIUrl}/shipping/methods` //Shipping Methods URL
const showShippingMethodUrl = `${shippingMethodUrl}/show` //Show Shipping Methods URL
const addShippingMethodUrl = `${shippingMethodUrl}/add` //Add Shipping Methods URL
const jwtSecret = "G@dgetB^z@^r_$ecured"; //JWT Token For Auth
const adminBaseUrl = `${clientUrl}/gadgetbazaar/admin` //Admin Base URL
const pdpPagePreUrl = `${clientUrl}/product/`; //PDP Prefix URL
const myOrdersPreUrl = `${clientUrl}/my-orders/`; //My Orders Prefix URL
module.exports = {
    gadgetBazaarTitle,
    clientUrl,
    baseUrl,
    authAPIUrl,
    orderAPIUrl,
    paymentAPIUrl,
    checkoutUrl,
    shippingMethodUrl,
    showShippingMethodUrl,
    addShippingMethodUrl,
    jwtSecret,
    adminBaseUrl,
    pdpPagePreUrl,
    myOrdersPreUrl
};