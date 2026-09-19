import axios from 'axios';

const PRODUCTION= true;
const API_ENDPOINT = PRODUCTION ? process.env.REACT_APP_ENDPOINT : process.env.REACT_APP_ENDPOINT_LOCAL;

export const apiCalls = async (method, endPoint,id = null, body = null,query='') => {
    const url = API_ENDPOINT + `${endPoint}`  + (id != null ? `/${id}` : '');
    const token = localStorage.getItem("accesstoken");
    const options = {
        method: method,
        url: url, 
        headers:{
            "Content-Type": "application/json",
            ...(token && {
                Authorization: `Bearer ${token}`
            })
        },
        data: body,
        params: query,
    };
    try {  
        return await axios.request(options);
    } catch (error) {
        if (error.response?.status === 401) {
           

            // Tell AuthProvider to logout
            window.dispatchEvent(
                new Event("unauthorized")
            );
            return error.response;
        }

        return error;
    }
};

export const guestAuth = async (cid) => {
    const url = API_ENDPOINT + 'guest-auth'  ;
    const options = {
        method: "POST",
        url: url,
        data: { cid: cid }
    };
    try {
        return await axios.request(options);
    } catch (error) {
        
        return error;
    }
    // api calls
};

