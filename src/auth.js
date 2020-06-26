
function isValidAuth (req, res, next) {
	const authorizationHeader = req.get('Authorization')
	const token = authorizationHeader.split(' ')[1]
	const text = Buffer.from(token, 'base64').toString('ascii')
	console.log(text)
	return next()
}

function simpleAuth (req, res, next) {
	console.log('simple auth')
	const user = 'user'
	const password = 'password'
	const buff = Buffer.from(user + ':' + password)
	const encodeString = buff.toString('base64')

	res.set('Authorization', 'Basic ' + encodeString)
	res.send(encodeString)
}

module.exports = {
	simpleAuth,
	isValidAuth
}
