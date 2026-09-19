
import { jwtDecode } from "jwt-decode";

export const getStorage = async () => {
    const token = localStorage.getItem("token");
    if (!token)
        return { cid: null }

    const decoded = jwtDecode(token);
    return { cid: decoded.cid}

};