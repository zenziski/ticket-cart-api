const Auth = require('../middlewares/Auth')
module.exports = {
    http_method: "get",
    route: "/cart",
    middleware: [Auth],
    handler: async (req, res) => {
        const Cart = require('../models/Cart');
        
        try {
            const cart = await Cart.findOne({user: req.user._id}).lean()
            if(!cart) return res.status(404).json({message: "Não foi encontrado nenhum item no seu carrinho."})
            return res.json({cart})
        } catch (error) {
            return res.status(400).json({message: "Ocorreu um erro ao consultar seu carrinho."})
        }
    }
}