const Auth = require('../middlewares/Auth')
module.exports = {
    http_method: "put",
    route: "/cart",
    middleware: [Auth],
    handler: async (req, res) => {
        const Cart = require('../models/Cart');
        
        try {
            await Cart.updateOne({user: req.user._id}, {
                ...req.body
            });
            return res.json({updated: true})
        } catch (error) {
            return res.status(400).json({updated: false})
        }
    }
}