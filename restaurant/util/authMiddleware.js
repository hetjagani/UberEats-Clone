const axios = require("axios");
const errors = require("./errors");

const authMiddleware = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        res.status(401).send(errors.unauthorized);
        return;
    }
    axios
        .get(global.gConfig.auth_url + "/auth/validate?token=" + authHeader)
        .then((response) => {
            if (response.status != 200) {
                res.status(401).send(errors.unauthorized);
                return;
            }

            if (!response.data.valid) {
                res.status(401).send(errors.unauthorized);
                return;
            }

            req.headers.user = response.data.user;
            req.headers.role = response.data.role;
            next();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(errors.serverError);
            return;
        });
};

module.exports = authMiddleware;
