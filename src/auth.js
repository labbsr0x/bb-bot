const { BASIC_AUTH_USERNAME, BASIC_AUTH_PASSWORD } = require('./environment')

function isValidAuth (req, res, next) {
	const authorizationHeader = req.get('Authorization')
	const token = authorizationHeader.split(' ')[1]
	// const textToken = Buffer.from(token, 'base64').toString('ascii')
	const validToken = simpleAuth()
	if (token === validToken) {
		return next()
	} else {
		res.status(400).json({
			status: 'Error',
			message: 'Invalid authorization'
		})
	}
}

function simpleAuth (req, res, next) {
	console.log('simple auth')
	const user = BASIC_AUTH_USERNAME
	const password = BASIC_AUTH_PASSWORD
	const buff = Buffer.from(user + ':' + password)
	const encodeString = buff.toString('base64')

	return encodeString
}

module.exports = {
	simpleAuth,
	isValidAuth
}
