import axios from 'axios';

const instance = axios.create({
   
    // baseURL: process.env.REACT_APP_API_CALL_URL
    baseURL:"http://159.89.165.83"
});

export default instance;