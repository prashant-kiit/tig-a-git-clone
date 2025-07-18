import { loginService } from './service.js';

export const loginContoller = async (req, res) => {
    try {
        const user = req.body;
        const userLoggedIn = await loginService(user);
        console.error("Successfully logged in");
        res.status(200).json({
            message: "Successfully logged in",
            body: userLoggedIn
        })
        return;
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: error.message,
            error: error
        });
        return;
    }
}