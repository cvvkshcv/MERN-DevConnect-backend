const jwt = require('jsonwebtoken');
const keys = require('./keys');
module.exports = (req, res, next) => {
	const token = req.headers['x-access-token'];
	if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

	jwt.verify(token, keys.secretKey, (err, decoded) => {
		if (err) return res.status(500).send({ auth: false, message: 'Token expired.' });
		req.decoded = decoded;
	});
	next();
};