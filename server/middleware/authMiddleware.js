const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
    const header = req.headers['authorization']
    if(!header) {
        return res.status(401).json({message: "No authorized user"})
    }

    const token = header.split(' ')[1]
    if (!token) {
        return res.json({message: "Invalid token"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (e) {
        return res.json({message: e})
    }
}

function roleMiddleware(requiredRole) {
    return (req, res, next) => {
        if (req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    }
}

module.exports = {
    authMiddleware,
    roleMiddleware
}
