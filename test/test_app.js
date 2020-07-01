/* eslint-disable no-unused-vars */
import App from '../dist-server/types/App'
import Settings from '../dist-server/types/Settings'
const sinon = require('sinon')
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
const assertArrays = require('chai-arrays')
chai.use(assertArrays)
chai.use(chaiAsPromised)

// Then either:
var expect = chai.expect
// or:
var assert = chai.assert

chai.should()

describe('Testing app handles', () => {
	describe('Apps', async () => {
		it('add by name', async () => {
			const app = new App()
			const settings = new Settings('etcd.default')
			/* eslint-disable no-template-curly-in-string */
			settings.setTemplate('{canal}/{ambiente}-{componente}')
			/* eslint-disable no-template-curly-in-string */
			const data = {
				canal: 'web',
				ambiente: 'prod',
				componente: 'teste'
			}
			app.setName(data, settings)
			assert.equal('web/prod-teste', app.getName())
		})
		it('add ip', async () => {
			const app = new App()
			const settings = new Settings('etcd.default')
			/* eslint-disable no-template-curly-in-string */
			/* eslint-disable no-template-curly-in-string */
			app.setName('teste', settings)
			app.setIps('192.0.0.1:9090')
			app.setIps('192.0.0.1:9091')
			app.setIps('192.0.0.1:9090')
			assert.isArray(app.getIps(), 'is not a array')
			expect(['192.0.0.1:9090', '192.0.0.1:9091']).to.be.equalTo(app.getIps())
		})
	})
})
