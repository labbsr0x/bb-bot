/* eslint-disable handle-callback-err */
/* eslint-disable no-unused-vars */
import app from '../dist-server/server'
import * as db from '../dist-server/db'

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
    await db.rmApp('teste1')
    await db.rmApp('teste2')
    await db.rmApp('teste3')
    await db.rmApp('teste4')
  })
  describe('Apps', async () => {
    it('should add app', async () => {
      const appTeste = { name: 'teste3', address: 'http://teste.com' }
      chai.request(app)
        .post('/add/app')
        .set('Content-Type', 'application/json')
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
        .send({ name: 'teste1' })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('status')
          res.body.status.should.be.eql('OK')
        })
    })
  })
  describe('Ips', async () => {
    it('Should add an ip', async () => {
      await db.addApp('teste1', 'http://teste.com')
      chai.request(app)
        .post('/add/ip')
        .set('Content-Type', 'application/json')
        .send({ app: 'teste1', ip: '127.0.0.1:8000' })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('status')
          res.body.status.should.be.eql('OK')
        })
    })
    it('Should list ips', async () => {
      await db.addApp('teste1', 'http://teste.com')
      const appName = 'teste1'
      chai.request(app)
        .get(`/list/ips/${appName}`)
        .set('Content-Type', 'application/json')
        .send()
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('status')
          res.body.status.should.be.eql('OK')
        })
    })
    it('Should remove ip', async () => {
      await db.addApp('teste1', 'http://teste.com')
      chai.request(app)
        .post('/remove/ip')
        .set('Content-Type', 'application/json')
        .send({ app: 'teste1', ip: 'http://teste.com' })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('status')
          res.body.status.should.be.eql('OK')
        })
    })
  })
  describe('Versions', async () => {
    it('Should add a version', async () => {
      await db.addApp('teste1', 'http://teste.com')
      chai.request(app)
        .post('/add/version')
        .set('Content-Type', 'application/json')
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
        .send()
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('status')
          res.body.status.should.be.eql('OK')
          res.body.should.have.property('result')
        })
    })
  })
  describe('Object app', async () => {
    it('Should add a full app', async () => {
      const appObj = {
        name: 'testserver7',
        desc: 'Testando salvar um app inteiro',
        namespace: '',
        ips: [
          '172.2.0.0:8000',
          '172.2.0.1:8000'
        ]

      }
      chai.request(app)
        .post('/app')
        .set('Content-Type', 'application/json')
        .send(appObj)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('status')
          res.body.status.should.be.eql('OK')
        })
    })
  })
  describe('Object settings', async () => {
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
