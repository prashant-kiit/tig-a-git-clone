// token verification
// refresh token
// register api
// repositories in tigstore

import jwt from 'jsonwebtoken';
import CustomError from './customError.js';

export function authorize(req, res, next) {
    try {
        const token = req.headers["authorization"].split(' ')[1]
        if (!token)
            throw new CustomError("AUTHORIZATION_ERROR", 401, "Acces denied. Token not found.")
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next()
    }
    catch (error) {
        console.error(error.message);
        return res.status(error.statusCode || 500).json({
            message: error.message,
            error: error
        });
    }

}