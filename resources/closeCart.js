const Auth = require('../middlewares/Auth')
module.exports = {
    http_method: "put",
    route: "/close/cart",
    middleware: [Auth],
    handler: async (req, res) => {
        const Cart = require('../models/Cart');
        const TicketApi = require('../services/TicketApi')
        const userId = req.user._id;

        try {
            const cart = await Cart.findOne({ user: userId }).lean();
            if(!cart) return res.status(400).json({ message: "Você não possui nada dentro do carrinho."})
            let result = [];
            for (let ticket of cart.on_cart) {
                let bought = await TicketApi.buyTicket(ticket.ticketId, ticket.quantity, req.user)
                if (bought) result.push({ ticketId: ticket.ticketId, quantity: ticket.quantity, ticketCodes: bought.ticketCodes })
            }

            await Cart.deleteOne({ user: userId });

            return res.json({ message: "Comprado com sucesso", boughtTickets: result })
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Ocorreu um erro ao finalizar sua compra", error })
        }


    }
}