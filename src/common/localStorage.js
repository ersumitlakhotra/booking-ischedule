
import { jwtDecode } from "jwt-decode";

export const getStorage = async () => {
    const token = localStorage.getItem("accesstoken");
    if (!token)
        return { cid: null, custid:null }

    const decoded = jwtDecode(token);
    return { cid: decoded.cid ,custid:decoded.custid }

};