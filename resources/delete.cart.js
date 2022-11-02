const Auth = require('../middlewares/Auth')
module.exports = {
    http_method: "delete",
    route: "/cart",
    middleware: [Auth],
    handler: async (req, res) => {
        const Cart = require('../models/Cart');
        
        try {
            await Cart.deleteOne({user: req.user._id});
            return res.json({deleted: true})
        } catch (error) {
            return res.status(400).json({deleted: false})
        }
    }
}