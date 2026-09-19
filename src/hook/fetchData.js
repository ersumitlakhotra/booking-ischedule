import { apiCalls } from "./apiCall";

const FetchData = async ({ method='GET', endPoint, id = null, body = null,query='' }) => {
  try {
    const res = await apiCalls(method, endPoint,id, body,query);
    return { data: res.data.data, status: res.status, message:res.data.message }
  }
  catch (e) {
    return { data: [], status: 500, message:"Not Found" }
    //error(error.message)
  }

}
export default FetchData;
