/* eslint-disable handle-callback-err */
/* eslint-disable no-unused-vars */
import app from '../dist-server/server'
import * as db from '../dist-server/db'
import App from '../dist-server/types/App'

const sinon = require('sinon')
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
const chaiHttp = require('chai-http')

chai.use(chaiAsPromised)
chai.use(chaiHttp)

// Then either:
var expect = chai.expect
// or:
var assert = chai.assert

chai.should()

describe('Testing API App handles', () => {
	afterEach(async () => {
		try {
			await db.deleteAll()
		} catch (err) {
			console.log('error', err)
		}
	})
	describe('Apps', async () => {
		it('should add app', async () => {
			const appTeste = { name: 'teste3', address: 'http://teste.com' }
			chai.request(app)
				.post('/add/app')
				.set('Content-Type', 'application/json')
				.auth('bot', 'bot')
				.send(appTeste)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('OK')
				})
		})
		it('should add app with desc', async () => {
			const appTeste = { name: 'teste4', address: 'http://teste.com', desc: 'Testando 3' }
			chai.request(app)
				.post('/add/app')
				.set('Content-Type', 'application/json')
				.auth('bot', 'bot')
				.send(appTeste)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('OK')
				})
		})
		it('should list the apps', async () => {
			await db.addApp('teste2', 'http://teste.com')
			chai.request(app)
				.get('/list/apps')
				.set('Content-Type', 'application/json')
				.auth('bot', 'bot')
				.send()
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('OK')
				})
		})
		it('should list the apps with desc', async () => {
			await db.addApp('teste2', 'http://teste.com')
			chai.request(app)
				.get('/list/apps?descApp=true')
				.set('Content-Type', 'application/json')
				.auth('bot', 'bot')
				.send()
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('OK')
				})
		})
		it('Should remove a app', async () => {
			await db.addApp('teste1', 'http://teste.com')
			chai.request(app)
				.post('/remove/app')
				.set('Content-Type', 'application/json')
				.auth('bot', 'bot')
				.send({ name: 'teste1' })
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('OK')
				})
		})
		it('Should not add an app using invalid authentication', async () => {
			const appTeste = { name: 'teste3', address: 'http://teste.com' }
			chai.request(app)
				.post('/add/app')
				.set('Content-Type', 'application/json')
				.auth('bot', 'inv')
				.send(appTeste)
				.end((err, res) => {
					res.should.have.status(400)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('Error')
				})
		})
		it('Should not list an app using invalid authentication', async () => {
			await db.addApp('teste2', 'http://teste.com')
			chai.request(app)
				.get('/list/apps')
				.set('Content-Type', 'application/json')
				.auth('bot', 'inv')
				.send()
				.end((err, res) => {
					res.should.have.status(400)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('Error')
				})
		})
		it('Should not remove an app using invalid authentication', async () => {
			await db.addApp('teste1', 'http://teste.com')
			chai.request(app)
				.post('/remove/app')
				.set('Content-Type', 'application/json')
				.auth('bot', 'inv')
				.send({ name: 'teste1' })
				.end((err, res) => {
					res.should.have.status(400)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('Error')
				})
		})
	})
	describe('Versions', async () => {
		it('Should add a version', async () => {
			await db.addApp('teste1', 'http://teste.com')
			chai.request(app)
				.post('/add/version')
				.set('Content-Type', 'application/json')
				.auth('bot', 'bot')
				.send({ app: 'teste1', env: 'prod', version: 'v0.1.0' })
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('OK')
				})
		})
		it('Should list versions', async () => {
			await db.addApp('teste1', 'http://teste.com')
			const appName = 'teste1'
			chai.request(app)
				.get(`/list/version/${appName}`)
				.set('Content-Type', 'application/json')
				.auth('bot', 'bot')
				.send()
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('OK')
					res.body.should.have.property('result')
				})
		})
		it('Should not add a version using invalid authentication', async () => {
			await db.addApp('teste1', 'http://teste.com')
			chai.request(app)
				.post('/add/version')
				.set('Content-Type', 'application/json')
				.auth('bot', 'inv')
				.send({ app: 'teste1', env: 'prod', version: 'v0.1.0' })
				.end((err, res) => {
					res.should.have.status(400)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('Error')
				})
		})
		it('Should not list versions using invalid authentication', async () => {
			await db.addApp('teste1', 'http://teste.com')
			const appName = 'teste1'
			chai.request(app)
				.get(`/list/version/${appName}`)
				.set('Content-Type', 'application/json')
				.auth('bot', 'inv')
				.send()
				.end((err, res) => {
					res.should.have.status(400)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('Error')
				})
		})
	})
	describe('Save app', async () => {
		it('Should add a full app', async () => {
			const appObj = {
				name: 'testserver7',
				desc: 'Testando salvar um app inteiro',
				ips: [
					'172.2.0.0:8000',
					'172.2.0.1:8000'
				]

			}
			chai.request(app)
				.post('/app')
				.set('Content-Type', 'application/json')
				.auth('bot', 'bot')
				.send(appObj)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('OK')
				})
		})
		it('Delete app', async () => {
			const appObj = {
				name: 'testserver8',
				desc: 'Testando salvar um app inteiro',
				ips: [
					'172.2.0.0:8000',
					'172.2.0.1:8000'
				]
			}
			const appOb = App.createApp(appObj)
			await db.addObjApp(appOb).catch(e => { throw e })
			chai.request(app)
				.delete('/app?name=testserver8')
				.set('Content-Type', 'application/json')
				.auth('bot', 'bot')
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('OK')
				})
		})
		it('Should not add a full app using invalid auth', async () => {
			const appObj = {
				name: 'testserver7',
				desc: 'Testando salvar um app inteiro',
				ips: [
					'172.2.0.0:8000',
					'172.2.0.1:8000'
				]

			}
			chai.request(app)
				.post('/app')
				.set('Content-Type', 'application/json')
				.auth('bot', 'inv')
				.send(appObj)
				.end((err, res) => {
					res.should.have.status(400)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('Error')
				})
		})
		it('Should not delete app using invalid auth', async () => {
			chai.request(app)
				.delete('/app')
				.set('Content-Type', 'application/json')
				.auth('bot', 'inv')
				.send({ name: 'testserver7' })
				.end((err, res) => {
					res.should.have.status(400)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('Error')
				})
		})
	})
	describe('Ips', async () => {
		it('Should add an ip to app', async () => {
			const appObj = {
				name: 'testserver8',
				desc: 'Testando salvar um app inteiro',
				ips: [
					'172.2.0.0:8000',
					'172.2.0.1:8000'
				]
			}
			const appOb = App.createApp(appObj)
			await db.addObjApp(appOb).catch(e => { throw e })
			const ip = '127.0.0.1:8000'
			await db.addApp('teste1', 'http://teste.com')
			chai.request(app)
				.patch('/app/ip')
				.set('Content-Type', 'application/json')
				.auth('bot', 'bot')
				.send({ name: appOb.getName(), ip: ip })
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('OK')
				})
		})
		it('Should remove ip', async () => {
			const appObj = {
				name: 'testserver9',
				desc: 'Testando salvar um app inteiro',
				ips: [
					'172.2.0.0:8000',
					'172.2.0.1:8000'
				]
			}
			const appOb = App.createApp(appObj)
			await db.addObjApp(appOb).catch(e => { throw e })
			const ip = '127.0.0.1:8000'
			await db.addApp(appOb.getName(), 'http://teste.com')
			chai.request(app)
				.delete('/app/ip')
				.set('Content-Type', 'application/json')
				.auth('bot', 'bot')
				.send({ name: appOb.getName(), ip: ip })
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('OK')
					res.body.should.have.property('result')
					res.body.result.should.be.an('object').have.property('_ips')
					res.body.result._ips.should.be.eql(['172.2.0.0:8000', '172.2.0.1:8000'])
				})
		})
		it('Should not add an ip to app using invalid authentication', async () => {
			const appObj = {
				name: 'testserver10',
				desc: 'Testando salvar um app inteiro',
				ips: [
					'172.2.0.0:8000',
					'172.2.0.1:8000'
				]
			}
			const appOb = App.createApp(appObj)
			await db.addObjApp(appOb).catch(e => { throw e })
			const ip = '127.0.0.1:8000'
			await db.addApp('teste1', 'http://teste.com')
			chai.request(app)
				.patch('/app/ip')
				.set('Content-Type', 'application/json')
				.auth('bot', 'inv')
				.send({ name: appOb.getName(), ip: ip })
				.end((err, res) => {
					res.should.have.status(400)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('Error')
				})
		})
		it('Should not remove ip using invalid authentication', async () => {
			const appObj = {
				name: 'testserver11',
				desc: 'Testando salvar um app inteiro',
				ips: [
					'172.2.0.0:8000',
					'172.2.0.1:8000'
				]
			}
			const appOb = App.createApp(appObj)
			await db.addObjApp(appOb).catch(e => { throw e })
			const ip = '127.0.0.1:8000'
			await db.addApp(appOb.getName(), 'http://teste.com')
			chai.request(app)
				.delete('/app/ip')
				.set('Content-Type', 'application/json')
				.auth('bot', 'inv')
				.send({ name: appOb.getName(), ip: ip })
				.end((err, res) => {
					res.should.have.status(400)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('Error')
				})
		})
	})
})
