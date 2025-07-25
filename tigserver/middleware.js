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
            throw new CustomError("AUTHORIZATION_ERROR", 403, "Access denied. Token not found.")
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next()
        return;
    }
    catch (error) {
        console.error(error);
        res.status(error.statusCode || 403).json({
            message: error.message,
            error: error
        });
        return;
    }

}