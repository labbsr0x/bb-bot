const { Payload } = require('dialogflow-fulfillment')

/**
 *  Prepares a proper dialogflow fulfillment payload to be used as a message with options
 * @param {String} title the message text before the options
 * @param {String[]} texts
 */
function getTelegramButtons (title, texts, callbackPrefix = '') {
  const inlineKeyboard = []
  let row = 0
  for (let i = 0; i < texts.length; i = i + 2) {
    inlineKeyboard.push([])
    inlineKeyboard[row].push({ text: texts[i], callback_data: callbackPrefix + texts[i] })
    if (i + 1 < texts.length) {
      inlineKeyboard[row].push({ text: texts[i + 1], callback_data: callbackPrefix + texts[i + 1] })
    }
    row++
  }
  const payload = {
    text: title,
    reply_markup: {
      inline_keyboard: inlineKeyboard
    }
  }
  return new Payload('TELEGRAM', payload, { sendAsMessage: true })
}

module.exports = {
  getTelegramButtons
}
