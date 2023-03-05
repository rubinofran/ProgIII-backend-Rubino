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
		/* userName: user.userName,
		clientType: user.clientType, */
		name: user.name,
		/* address: user.address,
		accountType: user.accountType, 
		cbu: user.cbu,
		alias: user.alias,
		moneyInAccount: user.moneyInAccount, */
		isActive: user.isActive,
		role: role.name,
		/* createdAt: user.createdAt,
		updatedAt: user.updatedAt, */
	};

	const privateKey = process.env.SECRET_KEY/* req.config.auth.token.secret */
	
	const token = jwt.sign(payload, privateKey, {
		expiresIn: req.config.auth.token.expiresIn,
	});

	return { user: userResponse, token }; /* token: `Bearer ${token}` */
}

module.exports = createToken;
