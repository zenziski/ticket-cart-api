const Auth = require('../middlewares/Auth')
module.exports = {
    http_method: "post",
    route: "/cart",
    middleware: [Auth],
    handler: async (req, res) => {
        const Cart = require('../models/Cart');
        const userId = req.user._id;

        const { ticketId, quantity } = req.body;

        if (!ticketId || !quantity) return res.status(400).json({ message: "Preencher todos os dados." })

        try {
            let cart = await Cart.findOne({ user: userId }).lean();
            if (!cart) {
                cart = await Cart.create({
                    user: userId,
                    on_cart: [{ ticketId, quantity }]
                });
                return res.json({ ok: true, cart })
            }
            let update = false;
            cart.on_cart.forEach(item => {
                if (item.ticketId === ticketId) {
                    item.quantity += quantity
                    update = true;
                }
            })
            if(!update){
                cart.on_cart.push({ticketId, quantity})
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