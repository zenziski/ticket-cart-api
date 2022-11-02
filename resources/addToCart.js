const Auth = require('../middlewares/Auth')
module.exports = {
    http_method: "post",
    route: "/cart",
    middleware: [Auth],
    handler: async (req, res) => {
        const Cart = require('../models/Cart');
        const TicketApi = require('../services/TicketApi')
        const userId = req.user._id;

        let { ticketId, quantity } = req.body;
        quantity = Math.ceil(quantity); //trata caso usuario mande um numero float;

        if (!ticketId || !quantity) return res.status(400).json({ message: "Preencher todos os dados." })

        try {
            let cart = await Cart.findOne({ user: userId }).lean();
            if (!cart) {
                const ticket = await TicketApi.getTicket(ticketId, req.user);
                if (ticket.limited.active && ticket.limited?.quantity < quantity) {
                    return res.status(400).json({ message: `Ingresso tem limitação de compra de ${ticket.limited?.quantity} ingressos por pessoa.` })
                }
                if (ticket.quantity < quantity) {
                    return res.status(400).json({ message: `Quantidade de ingressos no estoque menor que a desejada.` })
                }

                cart = await Cart.create({
                    user: userId,
                    on_cart: [{ ticketId, quantity }]
                });
                return res.json({ ok: true, cart })
            }

            let update = false;
            for (let item of cart.on_cart) {
                if (item.ticketId !== ticketId) continue;

                const ticket = await TicketApi.getTicket(item.ticketId, req.user);
                if (ticket.limited.active && ticket.limited?.quantity < item.quantity + quantity) {
                    return res.status(400).json({ message: `Ingresso tem limitação de compra de ${ticket.limited?.quantity} ingressos por pessoa.` })
                }
                if (ticket.quantity < item.quantity + quantity) {
                    return res.status(400).json({ message: `Quantidade de ingressos no estoque menor que a desejada.` })
                }
                
                item.quantity += quantity
                update = true;
            }

            if (!update) { // se não teve update no carrinho, o usuário está apenas inserindo um ingresso novo.
                cart.on_cart.push({ ticketId, quantity })
            }

            await Cart.updateOne({ user: userId }, {
                $set: {
                    on_cart: cart.on_cart
                }
            })
            return res.json({ ok: true, cart: cart.on_cart })
        } catch (error) {
            return res.status(400).json({ ok: false, error })
        }
    }


}