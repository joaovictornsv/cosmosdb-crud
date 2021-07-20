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
  let itemMock: sinon.SinonStub;

  let statusSpy: sinon.SinonSpy;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    statusSpy = sandbox.spy(responseMock, 'status');
  });

  afterEach(() => {
    sandbox.restore();
    requestMock.body = {};
    requestMock.params = {};
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

  describe('indexById', () => {
    beforeEach(() => {
      itemMock = sandbox.stub(usersCollection, 'item');
    });

    it('should return user successfully', async () => {
      requestMock.params = { id: 'mock-id' };

      itemMock.returns({
        read: () => ({ resource: userMock }),
      });

      const response = await userController.indexById(requestMock, responseMock);
      expect(response).to.have.property('id');
      expect(statusSpy.calledOnceWith(200)).to.be.equal(true);
    });

    it('should not return user if not exists and user with provided id', async () => {
      requestMock.params = { id: 'mock-id' };

      itemMock.returns({
        read: () => ({ resource: undefined }),
      });

      const response = await userController.indexById(requestMock, responseMock);
      expect(response).to.have.property('error').to.equal('User not found');
      expect(statusSpy.calledOnceWith(404)).to.be.equal(true);
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

  describe('delete', () => {
    beforeEach(() => {
      itemMock = sandbox.stub(usersCollection, 'item');
    });

    it('should delete user successfully', async () => {
      requestMock.params = { id: 'mock-id' };

      itemMock.returns({
        delete: () => {},
        read: () => ({ resource: userMock }),
      });

      const response = await userController.delete(requestMock, responseMock);
      expect(response).to.have.property('message').to.equal(`User with id ${requestMock.params.id} deleted`);
      expect(statusSpy.calledOnceWith(200)).to.be.equal(true);
    });

    it('should not delete user if not exists and user with provided id', async () => {
      requestMock.params = { id: 'mock-id' };

      itemMock.returns({
        read: () => ({ resource: undefined }),
      });

      const response = await userController.delete(requestMock, responseMock);
      expect(response).to.have.property('error').to.equal('User not found');
      expect(statusSpy.calledOnceWith(404)).to.be.equal(true);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      itemMock = sandbox.stub(usersCollection, 'item');
    });

    it('should udpate user successfully with data provided in request body', async () => {
      requestMock.params = { id: 'mock-id' };
      requestMock.body = {
        name: 'new-name-mock',
        email: 'new-email-mock',
      };

      itemMock.returns({
        replace: (u: any) => ({ resource: u }),
        read: () => ({ resource: userMock }),
      });

      const response = await userController.update(requestMock, responseMock);
      expect(response).to.have.property('message').to.equal(`User with id ${requestMock.params.id} updated`);

      expect(response).to.have.property('user').to.have.property('name').to.equal('new-name-mock');
      expect(response).to.have.property('user').to.have.property('email').to.equal('new-email-mock');
      expect(statusSpy.calledOnceWith(200)).to.be.equal(true);
    });

    it('should udpate user successfully with no data provided', async () => {
      requestMock.params = { id: 'mock-id' };
      requestMock.body = undefined;

      itemMock.returns({
        replace: (u: any) => ({ resource: u }),
        read: () => ({ resource: userMock }),
      });

      const response = await userController.update(requestMock, responseMock);
      expect(response).to.have.property('message')
        .to.equal(`No data provided to update. User with id ${requestMock.params.id} remains unchanged`);

      expect(response).to.have.property('user').to.have.property('name').to.equal('name-mock');
      expect(response).to.have.property('user').to.have.property('email').to.equal('email-mock');
      expect(statusSpy.calledOnceWith(200)).to.be.equal(true);
    });

    it('should udpate user successfully with data provided but none fields', async () => {
      requestMock.params = { id: 'mock-id' };
      requestMock.body = {};

      itemMock.returns({
        replace: (u: any) => ({ resource: u }),
        read: () => ({ resource: userMock }),
      });

      const response = await userController.update(requestMock, responseMock);
      expect(response).to.have.property('message')
        .to.equal(`User with id ${requestMock.params.id} updated`);

      expect(response).to.have.property('user').to.have.property('name').to.equal('name-mock');
      expect(response).to.have.property('user').to.have.property('email').to.equal('email-mock');
      expect(statusSpy.calledOnceWith(200)).to.be.equal(true);
    });

    it('should not update user if not exists and user with provided id', async () => {
      requestMock.params = { id: 'mock-id' };

      itemMock.returns({
        read: () => ({ resource: undefined }),
      });

      const response = await userController.update(requestMock, responseMock);
      expect(response).to.have.property('error').to.equal('User not found');
      expect(statusSpy.calledOnceWith(404)).to.be.equal(true);
    });
  });
});
