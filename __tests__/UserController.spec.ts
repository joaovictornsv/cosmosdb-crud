import sinon from 'sinon';
import { expect } from 'chai';
import {
  afterEach, beforeEach, describe, it,
} from 'mocha';
import { UserController } from '../src/controllers/UserController';
import { usersCollection } from '../src/database';
import { requestMock } from './mocks/requestMock';
import { responseMock } from './mocks/responseMock';
import { userMock, usersMock } from './mocks/userMock';

const userController = new UserController();

describe('User Controller', () => {
  let sandbox: sinon.SinonSandbox;

  let createUserMock: sinon.SinonStub;
  let queryMock: sinon.SinonStub;

  let statusSpy: sinon.SinonSpy;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    statusSpy = sandbox.spy(responseMock, 'status');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('index', () => {
    beforeEach(() => {
      queryMock = sandbox.stub(usersCollection.items, 'query');
    });

    it('should return array of users', async () => {
      queryMock.returns({
        fetchAll: () => ({ resources: usersMock }),
      });

      const response = await userController.index(requestMock, responseMock);
      expect(response).to.have.length(2);
      expect(response[0]).to.have.property('id');
      expect(statusSpy.calledOnceWith(200)).to.be.equal(true);
    });
  });

  describe('create', () => {
    beforeEach(() => {
      queryMock = sandbox.stub(usersCollection.items, 'query');
      createUserMock = sandbox.stub(usersCollection.items, 'create');
    });

    it('should be create user sucessfully', async () => {
      createUserMock.returns({ resource: userMock });
      queryMock.returns({
        fetchAll: () => ({ resources: [] }),
      });

      requestMock.body = {
        name: 'name-mock',
        email: 'email-mock',
      };

      const response = await userController.create(requestMock, responseMock);

      expect(response).to.have.property('id');
      expect(statusSpy.calledOnceWith(201)).to.be.equal(true);
    });

    it('should not be create user if name or email not provided', async () => {
      requestMock.body = {
        name: 'name-mock',
      };

      const response = await userController.create(requestMock, responseMock);

      expect(response).to.have.property('error').to.be.equal('Provide name and email');
      expect(statusSpy.calledOnceWith(400)).to.be.equal(true);
    });

    it('should not be create user if already exists an user with the provided email', async () => {
      queryMock.returns({
        fetchAll: () => ({ resources: [userMock] }),
      });

      requestMock.body = {
        name: 'name-mock',
        email: 'email-mock',
      };

      const response = await userController.create(requestMock, responseMock);

      expect(response).to.have.property('error').to.be.equal('User with this email already exists');
      expect(statusSpy.calledOnceWith(400)).to.be.equal(true);
    });
  });
});
