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

describe('Testing API settings', () => {
	describe('Settings', async () => {
		it('Save settings', async () => {
			const settingsObj = {
				namespace: 'teste',
				etcd: 'localhot:2379',
				template: '{canal}/{ambiente}-{componente}'
			}
			chai.request(app)
				.post('/settings')
				.set('Content-Type', 'application/json')
				.send(settingsObj)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('OK')
				})
		})
		it('Get settings', async () => {
			chai.request(app)
				.get('/settings')
				.set('Content-Type', 'application/json')
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('OK')
					res.body.should.have.property('result')
					res.body.result.should.be.an('array')
				})
		})
		it('Delete settings', async () => {
			chai.request(app)
				.delete('/settings')
				.set('Content-Type', 'application/json')
				.send({ namespace: 'teste' })
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('status')
					res.body.status.should.be.eql('OK')
				})
		})
	})
})
