import { useNavigate } from "react-router-dom";

const config = require("../config/config");
export const fetchCurrentUser = async (token) => {
    try {
        const response = await fetch(`${config.authAPIUrl}/getuser`, {
            method: 'POST',
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

export function useLoginMiddleware() {
    const navigate = useNavigate();
  
    function loginMiddleware() {
        const token = localStorage.getItem('auth-token');
        if(!token){
            navigate("/login");
        }
    }
  
    return loginMiddleware;
}