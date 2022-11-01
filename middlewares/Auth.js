const axios = require('axios');
const AUTH_URL = process.env.USER_API;

const Auth = async (req, res, next) => {
    if (!req.headers.authorization && !req.headers.authorization.split(' ')[0].toLocaleLowerCase() === 'bearer') {
        return res.status(401).json('Token inválido');
    }
    try {
        let validatedUser = await axios.get(`${AUTH_URL}/validate`, {
            headers: {
                'Authorization': `Bearer ${req.headers.authorization.split(' ')[1]}`
            }
        })
        req.user = validatedUser.data
        req.user.token = req.headers.authorization.split(' ')[1]
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json('Aconteceu um erro.');
    }
}

module.exports = Auth