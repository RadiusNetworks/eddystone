// jshint node: true
// We need this so chai `expect` statements don't throw an error.
// jshint expr: true
'use strict';

import chai, {expect} from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import {EddystoneAdvertisement} from '../../lib/eddystone-advertisement.js';
// jshint ignore:end

describe('EddystoneAdvertisement', () => {
  // Tell platform.js we are running tests.
  before(() => global._eddystone_test = true);
  // Remove global.
  after(() => global._eddystone_test = undefined);

  describe('constructor()', () => {
    it('Check URL assignment', () => {
      let id = 100;
      let type = 'url';
      let url = 'http://www.example.com';
      let tx_power = -10;
      let adv = new EddystoneAdvertisement(
        id, {
          type: type,
          url: url,
          advertisedTxPower: tx_power
        },
        {} /* platform */);
      // URL members
      expect(adv.id).to.eql(id);
      expect(adv.type).to.eql(type);
      expect(adv.url).to.eql(url);
      expect(adv.advertisedTxPower).to.eql(tx_power);
      expect(adv._platform).to.eql({});
      // UID members
      expect(adv.namespace).to.be.undefined;
      expect(adv.instance).to.be.undefined;
      // iBeacon members
      expect(adv.uuid).to.be.undefined;
      expect(adv.major).to.be.undefined;
      expect(adv.minor).to.be.undefined;
    });
    it('Check UID assignment', () => {
      let id = 100;
      let type = 'uid';
      let tx_power = -10;
      let namespace = [1,2,3,4,5,6,7,8,9,0];
      let instance = [1,2,3,4,5,6];
      let adv = new EddystoneAdvertisement(
        id, {
          type: type,
          advertisedTxPower: tx_power,
          namespace: namespace,
          instance: instance
        },
        {} /* platform */);
      // UID members
      expect(adv.id).to.eql(id);
      expect(adv.type).to.eql(type);
      expect(adv.advertisedTxPower).to.eql(tx_power);
      expect(adv.namespace).to.eql(namespace);
      expect(adv.instance).to.eql(instance);
      // URL members
      expect(adv.url).to.be.undefined;
      // iBeacon members
      expect(adv.uuid).to.be.undefined;
      expect(adv.major).to.be.undefined;
      expect(adv.minor).to.be.undefined;
    });
    it('Check iBeacon assignment', () => {
      let id = 100;
      let type = 'ibeacon';
      let tx_power = -10;
      let uuid = [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6];
      let major = [1,2];
      let minor = [1,2];
      let adv = new EddystoneAdvertisement(
        id, {
          type: type,
          advertisedTxPower: tx_power,
          uuid: uuid,
          major: major,
          minor:minor
        },
        {} /* platform */);
      // iBeacon members
      expect(adv.id).to.eql(id);
      expect(adv.type).to.eql(type);
      expect(adv.advertisedTxPower).to.eql(tx_power);
      expect(adv.uuid).to.eql(uuid);
      expect(adv.major).to.eql(major);
      expect(adv.major).to.eql(minor);
      // URL members
      expect(adv.url).to.be.undefined;
      // UID members
      expect(adv.namespace).to.be.undefined;
      expect(adv.instance).to.be.undefined;
    });
  });

  describe('unregisterAdvertisement()', () => {
    it('Unregistering fails', () => {
      let advertisement = new EddystoneAdvertisement(100 /* id */, {
        type: 'url',
        url: 'https://www.example.com/',
        advertisedTxPower: -10
      }, {});
      let error = new Error('Failed');
      advertisement._platform.unregisterAdvertisement = sinon.stub().returns(Promise.reject(error));
      return expect(advertisement.unregisterAdvertisement()).to.be.rejectedWith(error);
    });

    it('Unregistering succeeds', () => {
      let advertisement = new EddystoneAdvertisement(100 /* id */, {
        type: 'url',
        url: 'https://www.example.com/',
        advertisedTxPower: -10
      }, {});
      advertisement._platform.unregisterAdvertisement = sinon.stub().returns(
        Promise.resolve());
      return expect(advertisement.unregisterAdvertisement()).to.be.fulfilled;
    });
  });
});
