import jwt from 'jsonwebtoken'
import userModel from '../models/Usermodel.js'
const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies

        if (!token) {
            return res.status(401).json({ message: "unauthorized to access!" })
        }

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await userModel.findById(decodedUser.id)



        next()
    } catch (error) {
        return res.status(500).json({ message: `Error : ${error}` })
    }
}
export default isAuthenticated