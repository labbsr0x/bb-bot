import { ETCD_URLS } from './environment'
import { Etcd3 } from 'etcd3'
import Settings from './types/Settings'
import App from './types/App'

const etcd = new Etcd3({ hosts: ETCD_URLS })

const SERVICE_BASE_URL = '/services'
const APP_BASE_URL = '/apps'
const SETTINGS_BASE_URL = '/settings'
const DESC_BASE_URL = '/desc'
const VERSION_URL = '/version'

/**
 * Adds a new app to be watch by Big Brother
 * @param {String} name the service name
 * @param {String} address the bb-promster address
 * @returns {Promise<IPutResponse>}
 */
export async function addObjApp (app, update = false) {
	const path = `${APP_BASE_URL}/${app.getName()}`
	const keyExists = await etcd.getAll().prefix(`${path}`).keys()
	if (update) {
		await deleteIp(app.getName())
	}
	if (app.hasIps()) {
		await app.getIps().forEach(ip => addIp(app.getName(), ip))
	}
	if (app.hasEnvs()) {
		await app.getEnvs().forEach(appEnv => addVersionToApp(app.getName(), appEnv.getName(), appEnv.getVersion()))
	}
	if (!keyExists || (Array.isArray(keyExists) && keyExists.length === 0) || update) {
		return etcd.put(`${path}`).value(JSON.stringify(app)).exec()
	}
	throw Error('Duplicated app')
}

/**
 * Load apps
 * @param {Object} appName option app name parameter
 * @returns {Promise<IPutResponse>}
 */
export async function loadApps (appName) {
	const path = appName ? `${APP_BASE_URL}/${appName}` : `${APP_BASE_URL}`
	const objects = await etcd.getAll().prefix(`${path}`).strings()
	const result = []
	for (const key of Object.keys(objects)) {
		const app = new App()
		app.dbToObj(JSON.parse(objects[key]))
		result.push(app)
	}
	if (result.length === 0) throw Error('No app found')
	if (appName) {
		return result[0]
	}
	return result
}

/**
 * Check if app already exists
 * @param {Object} appName option app name parameter
 * @returns {Promise<IPutResponse>}
*/
export async function existsApp (appName) {
	const path = `${APP_BASE_URL}/${appName}`
	const keyExists = await etcd.getAll().prefix(path).keys()
	if (!keyExists || (Array.isArray(keyExists) && keyExists.length === 0)) {
		return false
	}
	return true
}

function sliceByIndex (string, index = -1, separator = '/') {
	const res = string.split(separator, index)
	return index <= 0 ? res[res.length - 1] : res.length === index ? res[res.length - 1] : ''
}

/**
 * Connects to ETCD and lists the apps being watched by Big Brother
 * @returns {Promise<string[]>}
 */
export async function listApps (opts = {}) {
	const descApp = 'descApp' in opts ? opts.descApp : false
	const appss = await etcd.getAll().prefix(`${SERVICE_BASE_URL}`).keys()
	let apps = appss.map((sub) => sliceByIndex(sub, 3))
	apps = apps.filter(app => !app.includes('promster') && app !== '')
	const uniqueApps = new Set(apps)
	let uApps = [...uniqueApps]
	if (descApp) {
		uApps = uApps.map(async (app) => {
			let desc = await etcd.getAll().prefix(`${DESC_BASE_URL}/${app}`).keys()
			if (desc.length) {
				const res = desc[0].split('/', 4)
				desc = res.length === 4 ? res[res.length - 1] : ''
			} else {
				desc = ''
			}
			return { app: app, desc: desc }
		})
		const result = await Promise.all(uApps)
		return result
	}
	return uApps
}

/**
 * Connects to ETCD and lists the IPs from a app
 * @returns {Promise<string[]>}
 */
export function listOldApps (etcdUrl) {
	const oldEtcd = new Etcd3({ hosts: etcdUrl })
	return oldEtcd.getAll().prefix('/').keys().then((apps) => {
		const uniqueApps = new Set(apps)
		return new Promise((resolve) => {
			resolve([...uniqueApps])
		})
	})
}

/**
 * Connects to ETCD and lists the IPs from a app
 * @returns {Promise<string[]>}
 */
export function listIPs (app) {
	return etcd.getAll().prefix(`${SERVICE_BASE_URL}/${app}`).keys().then((apps) => {
		let ips = apps.map((app) => sliceByIndex(app))
		ips = ips.filter(Boolean)
		const uniqueIps = new Set(ips)
		return new Promise((resolve) => {
			resolve([...uniqueIps])
		})
	})
}

/**
 * Adds a new ip to be watch by promster
 * @param {String} app the service name
 * @param {String} ip the app ip
 * @returns {Promise<IPutResponse>}
 */
export async function addIp (app, ip) {
	const keyExists = await etcd.getAll().prefix(`${SERVICE_BASE_URL}/${app}/${ip}`).keys()
	if (!keyExists || (Array.isArray(keyExists) && keyExists.length === 0)) {
		return etcd.put(`${SERVICE_BASE_URL}/${app}/${ip}`).value('').exec()
	}
	throw Error('Duplicated ip')
}

/**
 * Delete a ip to etcd
 * @param {String} app the service name
 * @param {String} ip the app ip
 * @returns {Promise<IPutResponse>}
 */
export async function deleteIp (app, ip) {
	const path = ip ? `${SERVICE_BASE_URL}/${app}/${ip}` : `${SERVICE_BASE_URL}/${app}`
	const keyExists = await etcd.getAll().prefix(path).keys()
	if (keyExists || (Array.isArray(keyExists) && keyExists.length >= 1)) {
		return etcd.delete().all().prefix(path).exec()
	}
}

/**
 * Adds a new app to be watch by Big Brother
 * @param {String} name the service name
 * @param {String} address the bb-promster address
 * @returns {Promise<IPutResponse>}
 */
export async function addApp (name, address) {
	const keyExists = await etcd.getAll().prefix(`${SERVICE_BASE_URL}/${name}/${address}`).keys()
	if (!keyExists || (Array.isArray(keyExists) && keyExists.length === 0)) {
		return etcd.put(`${SERVICE_BASE_URL}/${name}/${address}`).value('').exec()
	}
	throw Error('Duplicated app')
}

/**
 * Adds a description for an app
 * @param {String} name the app name
 * @param {String} desc the desc of the app
 * @returns {Promise<IPutResponse>}
 */
export async function addDescApp (name, desc) {
	const keyExists = await etcd.getAll().prefix(`${DESC_BASE_URL}/${name}/${desc}`).keys()
	if (!keyExists || (Array.isArray(keyExists) && keyExists.length === 0)) {
		return etcd.put(`${DESC_BASE_URL}/${name}/${desc}`).value('').exec()
	}
	throw Error('Duplicated description')
}

/**
 * Stops the monitoring of the application by Big Brother
 * @param {String} name the name of the application to be removed
 * @returns {Promise<IDeleteRangeResponse>}
 */
export async function rmApp (app, fullApp=true) {
	try {
		let r = await etcd.delete().all().prefix(`${DESC_BASE_URL}/${app}`).exec()
		r = await etcd.delete().key(`${APP_BASE_URL}/${app}`).exec()
		if (r.deleted === '0' && fullApp) {
			throw Error(`Cannot delete app ${app}`)
		}
		r = etcd.delete().all().prefix(`${SERVICE_BASE_URL}/${app}`).exec()
	} catch (err) {
		throw Error(`Cannot delete app ${app}`)
	}
}

/**
 * Stores a subscription relationship between a TELEGRAM chat and an app
 * @param {String} name the name of the app to subscribe to
 * @param {String} chatId the id of the chat identifying which chat wants to subscribe to the app identified by name
 * @returns {Promise<IPutResponse>}
 */
export function subscribeToApp (name, chatId) {
	return etcd.put(`/subscriptions/${name}/${chatId}`).value('').exec()
}

/**
 * Deletes a subscriptions relationship between a TELEGRAM chat and an app
 * @param {String} name the name of the app to subscribe to
 * @param {Stirng} chatId the id of the chat identifying which chat wants to unsubscribe to the app identified by name
 * @returns {Promise<IDeleteRangeResponse>}
 */
export function unsubscribeToApp (name, chatId) {
	return etcd.delete().all().prefix(`/subscriptions/${name}/${chatId}`).exec()
}

/**
 * Lists the existing subscriptions for a specific app
 * @param {String} name the name of the app to subscribe to
 * @returns {Promise<string[]>}
 */
export function listSubscriptions (name) {
	return etcd.getAll().prefix(`/subscriptions/${name}`).keys().then((subss) => {
		const chats = subss.map((sub) => sliceByIndex(sub))
		return new Promise((resolve) => {
			resolve(chats)
		})
	})
}

/**
 * Stores an app version for a given env. ex: dev, prod, etc.
 * @param {String} app the name of the app to add version
 * @param {String} env the env name
 * @param {String} version the version number
 * @returns {Promise<IPutResponse>}
 */
export function addVersionToApp (app, env, version) {
	return etcd.put(`${VERSION_URL}/${app}/${env}/${version}`).value('').exec()
}

/**
 * List all app versions by env
 * @param {String} app the name of the app to add version
 * @param {String} env the env name
 * @returns {Promise<IPutResponse>}
 */
export async function listVersions (app, env = null) {
	let search = `${VERSION_URL}/${app}`
	search = env ? `${VERSION_URL}/${app}/${env}` : search
	const versionsKeys = await etcd.getAll().prefix(search).keys()
	const versions = versionsKeys.reduce((obj, version) => {
		const res = version.split('/')
		const envName = res[res.length - 2]
		obj[envName] = res[res.length - 1]
		return obj
	}, {})
	return new Promise((resolve) => {
		resolve(versions)
	})
}

/**
 * Stores settings for a namespace
 * @param {Object} settings the settings object
 * @returns {Promise<IPutResponse>}
 */
export async function saveSettings (settings) {
	const path = `${SETTINGS_BASE_URL}/${settings.getNamespace()}`
	const keyExists = await etcd.getAll().prefix(`${path}`).keys()
	if (!keyExists || (Array.isArray(keyExists) && keyExists.length === 0)) {
		return etcd.put(`${path}`).value(JSON.stringify(settings)).exec()
	}
	throw Error('Duplicated settings')
}

/**
 * Load settings
 * @param {Object} settings the settings object
 * @returns {Promise<IPutResponse>}
 */
export async function loadSettings (namespace) {
	const path = namespace ? `${SETTINGS_BASE_URL}/${namespace}` : `${SETTINGS_BASE_URL}`
	const objects = await etcd.getAll().prefix(`${path}`).strings()
	const result = []
	for (const key of Object.keys(objects)) {
		const settings = new Settings()
		settings.dbToObj(JSON.parse(objects[key]))
		result.push(settings)
	}
	if (namespace) {
		return result[0]
	}
	return result
}

/**
 * Deletes a settings
 * @param {Object} settings to be deleted
 * @returns {Promise<IDeleteRangeResponse>}
 */
export function deleteSettings (settings) {
	const path = `${SETTINGS_BASE_URL}/${settings.getNamespace()}`
	return etcd.delete().all().prefix(path).exec()
}

/**
 * Deletes all data on Etcd, just for test porposes
 */
export function deleteAll () {
	return etcd.delete().all().exec()
}