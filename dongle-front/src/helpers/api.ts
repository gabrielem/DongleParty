import { getErrorMessage } from '@/utils/utils'
import axios, { AxiosResponse } from 'axios'

const baseURL = '/api/'
const apiClient: any = axios.create({ baseURL })



const buildTheRequest = async ({method, url, payload, token}: any) => {
    if (method !== 'post' && method !== 'get') { throw new Error('Metodo API non consentito!') }
    if (!url) { throw new Error('API URL non trovato!') }

    // let config: [string, any?, any?] = [url]
    let config: [string, any?, { headers: { authorization: string } }?] = [url];

    const tokenIndex = payload ? 2 : 1
    if (payload) {  config[1] = payload  }
    if (token) {  config[tokenIndex] = {headers: {authorization: `Bearer ${token}`}} }
    try {
        const response: AxiosResponse<any> = await apiClient[method](...config)
        return response.data
    } catch (error) {
        console.log('❌ buildTheRequest - error', error)
        throw getErrorMessage(error)
    }
}
const api = {
    async getChallenges (token: string | null | undefined) {
        return buildTheRequest({method: 'get', url: '/getChallenges', token})
    },
    async setChallenge (payload: any, token: string | null | undefined) {
        return buildTheRequest({method: 'post', url: '/setChallenge', payload, token})
    },
    // getWallet
    async getWallet (token: string | null | undefined) {
        return buildTheRequest({method: 'get', url: '/getWallet', token})
    },
    // joinChallenge
    async joinChallenge (payload: any, token: string | null | undefined) {
        return buildTheRequest({method: 'post', url: '/joinChallenge', payload, token})
    },
    // setMessage
    async setMessage (payload: any, token: string | null | undefined) {
        return buildTheRequest({method: 'post', url: '/setMessage', payload, token})
    },
    // getHistory
    async getHistory (payload: any, token: string | null | undefined) {
        return buildTheRequest({method: 'post', url: '/getHistory', payload, token})
    },
    // getBalances
    async getBalances (payload: any) {
        return buildTheRequest({method: 'post', url: '/getBalances', payload})
    },
    // setBalance   
    async setBalance (payload: any, token: string | null | undefined) {
        return buildTheRequest({method: 'post', url: '/setBalance', payload, token})
    },
    
    
}

export default api