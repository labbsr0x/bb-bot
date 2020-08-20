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

describe('Testing API handles', () => {
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
})
