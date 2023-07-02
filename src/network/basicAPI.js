import axios from "axios";

function LocalAxios() {
    return axios.create({
        baseURL: "http://127.0.0.1:5000",
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 3000000
    });
}

export default LocalAxios