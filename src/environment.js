import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const fileEnv = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'

// get the env variables from the .env file relative to the current NODE_ENV
let ENV_VARS = {}
try {
	console.log('dir_name', path.join(__dirname, '..'))
	ENV_VARS = dotenv.parse(fs.readFileSync(path.resolve(path.join(__dirname, '..'), fileEnv)))
} catch (err) {
	console.log('err', err)
	ENV_VARS = {}
}
console.log('Env vars', ENV_VARS)
const valuesEnvToReplace = () => {
	return Object.entries(ENV_VARS).reduce((acc, [key, val]) => {
		process.env[key] = JSON.stringify(val)
		return acc
	}, {})
}
console.log('process env', process.env)
valuesEnvToReplace()

const ETCD_URLS = process.env.ETCD_URLS
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN
let LANGUAGE = process.env.LANGUAGE
let BB_BOT_KB_CONFIG = process.env.BB_BOT_KB_CONFIG
const BASIC_AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD

/***
 * Load all envs and structure them correctly
 * @returns {{ETCD_URLS: string[]}}
 */
const loadEnvs = () => {
	if (!ETCD_URLS) {
		throw new Error('ETCD_URLS cannot be null or empty')
	}

	if (!TELEGRAM_TOKEN) {
		throw new Error('TELEGRAM_TOKEN cannot be null or empty')
	}

	if (!LANGUAGE) {
		LANGUAGE = 'en'
	}

	if (!BB_BOT_KB_CONFIG) {
		BB_BOT_KB_CONFIG = ''
	}

	return {
		ETCD_URLS: ETCD_URLS.split(','),
		TELEGRAM_TOKEN: TELEGRAM_TOKEN,
		LANGUAGE: LANGUAGE,
		KB_CONFIG: BB_BOT_KB_CONFIG,
		BASIC_AUTH_USERNAME: BASIC_AUTH_USERNAME,
		BASIC_AUTH_PASSWORD: BASIC_AUTH_PASSWORD
	}
}

module.exports = loadEnvs()
