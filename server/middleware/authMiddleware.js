
export async function authenticate(req, res, next) {
    const token = req.headers['authorization'];
    try {
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(403).send('Invalid token');
                }
                req.userId = decoded.id;
                next();
            });
        } else {
            res.status(403).send('No token provided');
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error authenticating");
    }
}