const sinon = require('sinon');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

import app from '../dist-server/server'
let chaiHttp = require('chai-http');
import * as db from '../dist-server/db'


chai.use(chaiAsPromised);
chai.use(chaiHttp)
 
// Then either:
var expect = chai.expect;
// or:
var assert = chai.assert;

chai.should();

describe('Testing API handles', () => {
  afterEach(async () => {
    console.log('removing')
    await db.rmApp("teste1");
    await db.rmApp("teste2");
    await db.rmApp("teste3");
    await db.rmApp("teste4");
  });
  describe('addApp', async () => {
    it('should add app', async () => {
      let appTeste = {name: 'teste3', address: 'http://teste.com'}
      chai.request(app)
        .post('/add/app')
        .set('Content-Type', 'application/json')
        .send(appTeste)
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('status');
              res.body.status.should.be.eql("OK");
        });
    });
    it('should add app with desc', async () => {
      let appTeste = {name: 'teste4', address: 'http://teste.com', desc: 'Testando 3'}
      chai.request(app)
        .post('/add/app')
        .set('Content-Type', 'application/json')
        .send(appTeste)
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('status');
              res.body.status.should.be.eql("OK");
        });
    });
  });
  // describe('addApp error', async () => {
  //   it('should return an exception', async () => {
  //     await db.addApp(`teste2`, `http://teste.com`);
  //     return Promise.resolve(db.addApp(`teste2`, `http://teste.com`)).should.rejectedWith(Error);
  //   });
  // });
  // describe('subscribeToApp', async () => {
  //   it('should not return exception', async () => {
  //     return Promise.resolve(db.subscribeToApp(`teste`, `12214545`)).should.be.fulfilled;
  //   });
  // });
  // describe('subscribeToApp', async () => {
  //   it('should return chatIds from subscriptions', async () => {
  //     return assert.eventually.equal(Promise.resolve(db.listSubscriptions("teste")), '12214545');
  //     // return Promise.resolve(listSubscriptions("teste")).should.eventually.equal(['12214545']);
  //   });
  // });
  // describe('unsubscribeToApp', async () => {
  //   it('should not return exception', async () => {
  //     return Promise.resolve(db.unsubscribeToApp(`teste`, `12214545`)).should.be.fulfilled;
  //   });
  // });
  // describe('rmApp', async () => {
  //   it('should exclude the app', async () => {
  //     return Promise.resolve(db.rmApp(`teste`)).should.be.fulfilled;
  //   });
  // });
  // describe('List app', async () => {
  //   it('should list the apps', async () => {
  //     await db.addApp(`teste2`, `http://teste.com`);
  //     chai.request(app)
  //       .post('/list/apps')
  //       .set('Content-Type', 'application/json')
  //       .send()
  //       .end((err, res) => {
  //             res.should.have.status(200);
  //             res.body.should.be.a('object');
  //             res.body.should.have.property('status');
  //             res.body.status.should.be.eql("OK");
  //       });
  //   });
  // });
  describe('Remove Apps', async () => {
    it('Should remove a app', async () => {
      await db.addApp(`teste1`, `http://teste.com`);
      chai.request(app)
        .post('/remove/app')
        .set('Content-Type', 'application/json')
        .send({name: 'teste1'})
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('status');
              res.body.status.should.be.eql("OK");
        });
    });
  });
  describe('Ips', async () => {
    it('Should add an ip', async () => {
      await db.addApp(`teste1`, `http://teste.com`);
      chai.request(app)
        .post('/add/ip')
        .set('Content-Type', 'application/json')
        .send({app: 'teste1', ip: '127.0.0.1:8000'})
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('status');
              res.body.status.should.be.eql("OK");
        });
    });
    it('Should list ips', async () => {
      await db.addApp(`teste1`, `http://teste.com`);
      let appName = 'teste1'
      chai.request(app)
        .get(`/list/ips/${appName}`)
        .set('Content-Type', 'application/json')
        .send()
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('status');
              res.body.status.should.be.eql("OK");
        });
    });
    it('Should remove ip', async () => {
      await db.addApp(`teste1`, `http://teste.com`);
      chai.request(app)
        .post(`/remove/ip`)
        .set('Content-Type', 'application/json')
        .send({app: 'teste1', ip: `http://teste.com`})
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('status');
              res.body.status.should.be.eql("OK");
        });
    });
  });
  // describe('listApps error', async () => {
  //   it('should not list empty app name', async () => {
  //     await db.addApp(`teste4`, `http://teste.com`);
  //     await db.addApp(``, ``);
  //     return assert.eventually.equal(db.listApps(), 'teste4');
  //     // return Promise.resolve(listApps()).should.eventually.equal([ 'teste' ]);
  //   });
  // });
  // describe('addVersion', async () => {
  //   it('should not return exception', async () => {
  //     return Promise.resolve(db.addVersionToApp(`teste1`, 'prod', 'v0.1.0')).should.be.fulfilled;
  //   });
  // });
  // describe('listVersions', async () => {
  //   it('should list the apps', async () => {
  //     await db.addVersionToApp(`teste2`, 'prod', 'v0.1.0');
  //     await db.addVersionToApp(`teste2`, 'dev', 'v0.0.9');
  //     console.log('list version', db.listVersions('teste2'))
  //     return assert.eventually.deepEqual(db.listVersions('teste2'), {'prod': 'v0.1.0', 'dev': 'v0.0.9'});
  //   });
  // });
});