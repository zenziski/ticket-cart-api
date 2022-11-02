const axios = require('axios');
const TICKET_API = process.env.TICKET_API;

const getHeaders = (user) => {
    return {
        'Authorization': `Bearer ${user.token}`
    };
}

module.exports = {
    buyTicket: async (id, quantity, user) => {
        try {
            const headers = getHeaders(user)
            const result = await axios.put(`${TICKET_API}/buyticket/${id}`, {quantity}, {headers});
            
            return result.data;
        } catch (error) {
            console.log(error);
            if(error.response.data.message){
                throw `${error.response.data.message}`
            }
            throw 'Ocorreu um erro ao finalizar a compra';
        }
    },
    getTicket: async (id, user) => {
        try {
            const headers = getHeaders(user)
            const result = await axios.get(`${TICKET_API}/ticket/${id}`, {headers});
            
            return result.data;
        } catch (error) {
            throw 'Ocorreu um erro ao consultar o ticket';
        } 
    }
}