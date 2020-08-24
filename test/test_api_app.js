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
			// await db.deleteAll()
			console.log('teste')
		} catch (err) {
			console.log('error', err)
		}
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
		it('Should add a full app with promster level', async () => {
			const appObj = {
				name: 'testserver13',
				desc: 'Testando salvar um app inteiro',
				ips: [
					'172.2.0.0:8000',
					'172.2.0.1:8000'
				],
				level: 2

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
					res.body.result._level.should.be.equals(2)
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
			await db.addObjApp(appOb)
			chai.request(app)
				.delete(`/app?name=${appOb.getName()}`)
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
				name: 'testserver10',
				desc: 'Testando salvar um app inteiro',
				ips: [
					'172.2.0.0:8000',
					'172.2.0.1:8000'
				]
			}
			const appOb = App.createApp(appObj)
			await db.addObjApp(appOb).catch(e => { throw e })
			const ip = '172.2.0.0:8000'
			await db.addApp(appOb.getName(), 'http://teste.com')
			chai.request(app)
				.delete(`/app/ip?name=${appOb.getName()}&ips=${ip}`)
				.set('Content-Type', 'application/json')
				.auth('bot', 'bot')
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('OK')
					res.body.should.have.property('result')
					res.body.result.should.be.an('object').have.property('_ips')
					res.body.result._ips.should.be.eql(['172.2.0.1:8000'])
				})
		})
		it('Should not add an ip to app using invalid authentication', async () => {
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
				name: 'testserver12',
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
