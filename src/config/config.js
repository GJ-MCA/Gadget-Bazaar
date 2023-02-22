// Define the base URL of API server as a global variable

const gadgetBazaarTitle = "Gadget Bazaar";
const clientUrl = "http://localhost:3000" //Frontend URL
const baseUrl = 'http://localhost:5000'; //Backend URL
const authAPIUrl = `${baseUrl}/gadgetbazaar/auth` //Auth API URL
const jwtSecret = "G@dgetB^z@^r_$ecured"; //JWT Token For Auth
module.exports = {
    gadgetBazaarTitle,
    clientUrl,
    baseUrl,
    authAPIUrl,
    jwtSecret,
};