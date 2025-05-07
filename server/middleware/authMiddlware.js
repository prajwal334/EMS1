import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const verifyUser = async(req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ success: false, error: "Unauthorized User" });
        }

        const user = await User.findById({_id: decoded._id}).select('-password');

        if (!user) {
            return res.status(401).json({ success: false, error: "User Not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server Error" });
    }


};

export default verifyUser;