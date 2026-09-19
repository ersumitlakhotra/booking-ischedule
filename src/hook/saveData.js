import { apiCalls } from "./apiCall";

const SaveData = async ({ label, method, endPoint, id = null, body = null, logs = true, cid = null }) => { 
    try {
        const res = await apiCalls(method, endPoint, id, body);
        return {
            status: res.status,
            message: res.data.message,
            isSuccess: res.status === 201 || res.status === 200,
            data: res.data.data
        }
    }
    catch (e) {
        return {
            status: 500,
            message: 'There is some issue while processing the request',
            isSuccess: false,
            data: []
        }
    }

}
export default SaveData;

