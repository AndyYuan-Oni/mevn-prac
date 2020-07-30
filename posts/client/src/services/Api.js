import axios from "axios";

export default () => {
    return axios.create({
        baseURL: 'http://localhost:5000'
    })
}

//for https, change to:  baseURL: 'https://localhost:5500'