import axios from "axios";

const portApi = '5288'
const url = 'localhost'
// const url = '192.168.15.144'
// const url = '172.16.39.54'

const apiUrl = `http://${url}:${portApi}/api`

const api = axios.create({
    baseURL: apiUrl
})

export default api;