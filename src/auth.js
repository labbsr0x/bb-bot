const { BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD } = require('./environment')

function isValidAuth (req, res, next) {
	if (!BASIC_AUTH_PASSWORD || !BASIC_AUTH_USERNAME) {
		return next()
	}
	const authorizationHeader = req.get('Authorization')
	if (!authorizationHeader) {
		return res.status(400).json({
			status: 'Error',
			message: 'Invalid authorization'
		})
	}

	const token = authorizationHeader.split(' ')[1]
	const validToken = simpleAuth()
	if (token === validToken) {
		res.status(200)
		return next()
	} else {
		res.status(400).json({
			status: 'Error',
			message: 'Invalid authorization'
		})
	}
}

function simpleAuth () {
	const user = BASIC_AUTH_USERNAME
	const password = BASIC_AUTH_PASSWORD
	const encodeString = Buffer.from(user + ':' + password).toString('base64')

	return encodeString
}

module.exports = {
	simpleAuth,
	isValidAuth
}
