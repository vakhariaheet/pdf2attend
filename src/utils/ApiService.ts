import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

class ApiService { 
    static async get<Response>(url: string,config?: any) { 
        const res = await axios.get<Response>(API_URL + url, config);
        return res;
    }
    static async post<Response>(url: string, data: any, config?: any) { 
        const res = await axios.post<Response>(API_URL + url, data, config);
        return res;
    }
    static async put<Response>(url: string, data: any, config?: any) { 
        const res = await axios.put<Response>(API_URL + url, data, config);
        return res;
    }
    static async delete<Response>(url: string, config?: any) {
        const res = await axios.delete<Response>(API_URL + url, config);
        return res;
    }
}
export default ApiService;