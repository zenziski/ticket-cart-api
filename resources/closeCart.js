const Auth = require('../middlewares/Auth')
module.exports = {
    http_method: "post",
    route: "/close/cart",
    middleware: [Auth],
    handler: async (req, res) => {
        const Cart = require('../models/Cart');
        const TicketApi = require('../services/TicketApi')
        const userId = req.user._id;

        try {
            const cart = await Cart.findOne({ user: userId }).lean();
            let result = [];
            for (let ticket of cart.on_cart) {
                let bought = await TicketApi.buyTicket(ticket.ticketId, ticket.quantity, req.user)
                if (bought) result.push({ ticketId: ticket.ticketId, quantity: ticket.quantity })

            }
            return res.json({ message: "Comprado com sucesso", boughtTickets: result })
        } catch (error) {
            return res.status(400).json({ message: "Ocorreu um erro ao finalizar sua compra", error })
        }


    }
}