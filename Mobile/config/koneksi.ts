import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const baseUrl = process.env.EXPO_PUBLIC_API_URL!

const API = axios.create({
    baseURL: baseUrl + '/api',
    timeout: 10000 
})

API.interceptors.request.use(async(config)=> {
    const authData = await AsyncStorage.getItem('auth')
    if(authData){
        const {token} = JSON.parse(authData)
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
});

export default API