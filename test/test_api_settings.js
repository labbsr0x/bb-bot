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
	describe('Save settings', async () => {
		it('Should add a full settings', async () => {
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
	})
})
