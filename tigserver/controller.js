import { loginService, repoService, pushService, logoutService, refreshService, forcedLogoutService } from './service.js';

export const loginContoller = async (req, res) => {
    try {
        const user = req.body;
        const userLoggedIn = await loginService(user);
        console.log("Successfully logged in");
        res.status(200).json({
            message: "Successfully logged in",
            body: userLoggedIn
        })
        return;
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({
            message: error.message,
            error: error
        });
        return;
    }
}

export const repoContoller = async (req, res) => {
    try {
        const repo = req.body.repo;
        const user = req.user;
        const repoCreated = await repoService(repo, user);
        console.log("Repository added successfully.");
        res.status(200).json({
            message: "Repository added successfully.",
            body: repoCreated
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({
            message: error.message,
            error: error
        });
        return;
    }
}

export const pushContoller = async (req, res) => {
    try {
        const pushed = req.body.pushed;
        const repo = req.body.repo;
        const user = req.user;
        const repoCreated = await pushService(user, repo, pushed);
        console.log("Commits pushed successfully.");
        res.status(200).json({
            message: "Commits pushed successfully.",
            body: repoCreated
        });
        return;
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({
            message: error.message,
            error: error
        });
        return;
    }
}

export const logoutContoller = async (req, res) => {
    try {
        const user = req.user;
        const userLoggedOut = await logoutService(user);
        console.log("Successfully logged out");
        res.status(200).json({
            message: "Successfully logged out",
            body: userLoggedOut
        })
        return;
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({
            message: error.message,
            error: error
        });
        return;
    }
}

export const refreshContoller = async (req, res) => {
    const userId = req.headers["userid"];
    try {
        const refreshToken = req.body.refreshToken;
        const userLoggedIn = await refreshService(refreshToken);
        console.log("Successfully refreshed");
        res.status(200).json({
            message: "Successfully refreshed",
            body: userLoggedIn
        })
        return;
    } catch (error) {
        await forcedLogoutService(userId)
        console.error(error);
        res.status(error.statusCode || 500).json({
            message: error.message,
            error: error
        });
        return;
    }
}