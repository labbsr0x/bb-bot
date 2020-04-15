const sinon = require('sinon');
const { listApps, addApp, rmApp, subscribeToApp, unsubscribeToApp, listSubscriptions, etcd} = require('../src/db');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
import db from '../dist-server/db'

chai.use(chaiAsPromised);
 
// Then either:
var expect = chai.expect;
// or:
var assert = chai.assert;

chai.should();

describe('Testing db handles', () => {
  afterEach(async () => {
    console.log('removing')
    await db.rmApp("teste1");
    await db.rmApp("teste2");
    await db.rmApp("teste3");
    await db.rmApp("teste4");
  });
  describe('addApp', async () => {
    it('should not return exception', async () => {
      return Promise.resolve(db.addApp(`teste1`, `http://teste.com`)).should.be.fulfilled;
    });
  });
  describe('addApp error', async () => {
    it('should return an exception', async () => {
      await db.addApp(`teste2`, `http://teste.com`);
      return Promise.resolve(db.addApp(`teste2`, `http://teste.com`)).should.rejectedWith(Error);
    });
  });
  describe('subscribeToApp', async () => {
    it('should not return exception', async () => {
      return Promise.resolve(subscribeToApp(`teste`, `12214545`)).should.be.fulfilled;
    });
  });
  describe('subscribeToApp', async () => {
    it('should return chatIds from subscriptions', async () => {
      return assert.eventually.equal(Promise.resolve(listSubscriptions("teste")), '12214545');
      // return Promise.resolve(listSubscriptions("teste")).should.eventually.equal(['12214545']);
    });
  });
  describe('unsubscribeToApp', async () => {
    it('should not return exception', async () => {
      return Promise.resolve(db.unsubscribeToApp(`teste`, `12214545`)).should.be.fulfilled;
    });
  });
  describe('rmApp', async () => {
    it('should exclude the app', async () => {
      return Promise.resolve(db.rmApp(`teste`)).should.be.fulfilled;
    });
  });
  describe('listApps', async () => {
    it('should list the apps', async () => {
      await addApp(`teste3`, `http://teste.com`);
      return assert.eventually.equal(db.listApps(), 'teste3');
      // return Promise.resolve(listApps()).should.eventually.equal([ 'teste' ]);
    });
  });
  describe('listApps error', async () => {
    it('should not list empty app name', async () => {
      await db.addApp(`teste4`, `http://teste.com`);
      await db.addApp(``, ``);
      return assert.eventually.equal(db.listApps(), 'teste4');
      // return Promise.resolve(listApps()).should.eventually.equal([ 'teste' ]);
    });
  });
});