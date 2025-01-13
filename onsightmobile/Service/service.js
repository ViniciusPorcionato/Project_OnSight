import axios from "axios";

const portApi = '5281'
const url = 'http://172.16.39.54'
// const portApi = '5288'
// const url = 'http://10.0.0.108'

const apiUrl = `${url}:${portApi}/api`

const api = axios.create({
    baseURL: apiUrl
})

export default api;
