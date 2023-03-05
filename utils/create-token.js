const jwt = require('jsonwebtoken')

async function createToken(req, user) {
	
	const role = await req
		.model("Role")
		.findById(user.role)

	const payload = {
		_id: user._id,
		role: role.name,
	};
	
	const userResponse = {
		_id: user._id,
		name: user.name,
		isActive: user.isActive,
		role: role.name,
	};

	const privateKey = process.env.SECRET_KEY
	
	const token = jwt.sign(payload, privateKey, {
		expiresIn: req.config.auth.token.expiresIn,
	});

	return { user: userResponse, token }; /* token: `Bearer ${token}` */
}

module.exports = createToken;
