/* eslint-disable no-unused-vars */
import * as db from '../dist-server/db'
const sinon = require('sinon')
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

// Then either:
var expect = chai.expect
// or:
var assert = chai.assert

chai.should()

describe('Testing db handles', () => {
	afterEach(async () => {
		await db.rmApp('teste1')
		await db.rmApp('teste2')
		await db.rmApp('teste3')
		await db.rmApp('teste4')
		await db.rmApp('')
	})
	describe('addApp', async () => {
		it('should not return exception', async () => {
			return Promise.resolve(db.addApp('teste1', 'http://teste.com')).should.be.fulfilled
		})
	})
	describe('addApp error', async () => {
		it('should return an exception', async () => {
			await db.addApp('teste2', 'http://teste.com')
			return Promise.resolve(db.addApp('teste2', 'http://teste.com')).should.rejectedWith(Error)
		})
	})
	describe('subscribeToApp', async () => {
		it('should not return exception', async () => {
			return Promise.resolve(db.subscribeToApp('teste', '12214545')).should.be.fulfilled
		})
	})
	describe('subscribeToApp', async () => {
		it('should return chatIds from subscriptions', async () => {
			return assert.eventually.equal(Promise.resolve(db.listSubscriptions('teste')), '12214545')
			// return Promise.resolve(listSubscriptions("teste")).should.eventually.equal(['12214545']);
		})
	})
	describe('unsubscribeToApp', async () => {
		it('should not return exception', async () => {
			return Promise.resolve(db.unsubscribeToApp('teste', '12214545')).should.be.fulfilled
		})
	})
	describe('rmApp', async () => {
		it('should exclude the app', async () => {
			return Promise.resolve(db.rmApp('teste')).should.be.fulfilled
		})
	})
	describe('listApps', async () => {
		it('should list the apps', async () => {
			await db.addApp('teste3', 'http://teste.com')
			return assert.eventually.equal(db.listApps(), 'teste3')
			// return Promise.resolve(listApps()).should.eventually.equal([ 'teste' ]);
		})
	})
	describe('listApps error', async () => {
		it('should not list empty app name', async () => {
			await db.addApp('teste4', 'http://teste.com')
			await db.addApp('', '')
			return assert.eventually.equal(db.listApps(), 'teste4')
			// return Promise.resolve(listApps()).should.eventually.equal([ 'teste' ]);
		})
	})
	describe('addVersion', async () => {
		it('should not return exception', async () => {
			return Promise.resolve(db.addVersionToApp('teste1', 'prod', 'v0.1.0')).should.be.fulfilled
		})
	})
	describe('listVersions', async () => {
		it('should list the apps', async () => {
			await db.addVersionToApp('teste2', 'prod', 'v0.1.0')
			await db.addVersionToApp('teste2', 'dev', 'v0.0.9')
			return assert.eventually.deepEqual(db.listVersions('teste2'), { prod: 'v0.1.0', dev: 'v0.0.9' })
		})
	})
})
