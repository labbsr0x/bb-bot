const { listSubscriptions } = require('./db')
const { TELEGRAM_TOKEN } = require('./environment')
const axios = require('axios')

async function alert (name, message) {
	const subss = await listSubscriptions(name)
	const sendMessagePath = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`
	const promisses = subss.map((chatId) => {
		return axios.post(sendMessagePath,
			{
				chat_id: chatId,
				text: `${message}`
			})
	})
	return Promise.all(promisses)
}

module.exports = {
	alert
}
