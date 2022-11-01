const axios = require('axios');
const TICKET_API = process.env.TICKET_API;
module.exports = {
    buyTicket: async (id, quantity, user) => {
        try {
            const headers = {
                'Authorization': `Bearer ${user.token}`
            };
            const result = await axios.put(`${TICKET_API}/buyticket/${id}`, {quantity}, {headers});
            
            return result.data;
        } catch (error) {
            if(error.response.data.message === "Ingresso desabilitado") throw 'Ingresso desabilitado'
            throw 'Ocorreu um erro ao finalizar a compra';
        }
    }
}