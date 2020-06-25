
function isValidAuth (req, res, next) {
	console.log('is valid auth')
	return next()
}

function simpleAuth (req, res) {
	console.log('simple auth')
	const user = 'user'
	const password = 'password'
	const buff = Buffer.from(user + ':' + password)
	const encodeString = buff.toString('base64')

	res.set('WWW-Authenticate', encodeString)
	res.send('set auth')
}

module.exports = {
	simpleAuth,
	isValidAuth
}
