// Define the base URL of API server as a global variable

const clientUrl = "http://localhost:3000" //Frontend URL
const baseUrl = 'http://localhost:5000'; //Backend URL
const authAPIUrl = `${baseUrl}/gadgetbazaar/auth` //Auth API URL
const jwtSecret = "G@dgetB^z@^r_$ecured"; //JWT Token For Auth
const emailService = "Gmail";
const emailAddress = "gj.mcaproject@gmail.com";
const emailPassword = "HelloMCAProjectiamGJ@940"
module.exports = {
    clientUrl,
    baseUrl,
    authAPIUrl,
    jwtSecret,
    emailService,
    emailAddress,
    emailPassword,
};