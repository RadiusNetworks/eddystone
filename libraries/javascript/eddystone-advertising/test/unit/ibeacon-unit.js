// jshint node: true
// We need this so chai `expect` statements don't throw an error.
// jshint expr: true
'use strict';

import chai, {expect} from 'chai';
import IBeacon from '../../lib/ibeacon.js';

describe('IBeacon', () => {
  describe('getByteArray()', () => {
    it('Invalid type', () => {
      expect(() => IBeacon.getByteArray({}, 5)).to.throw(TypeError);
    });
    it('Valid String', () => {
      expect(IBeacon.getByteArray('FF00', 2)).to.eql([0xFF, 0]);
    });
    it('Invalid String', () => {
      expect(() => IBeacon.getByteArray('GGGG', 2)).to.throw(Error);
    });
    it('Valid Number', () => {
      expect(IBeacon.getByteArray(1, 2)).to.eql([0, 0x01]);
    });
    it('Invalid Number', () => {
      expect(() => IBeacon.getByteArray(65536, 2)).to.throw(Error);
    });
    it('Valid byte array', () => {
      expect(IBeacon.getByteArray([1, 2, 3, 4], 4)).to.eql([1, 2, 3, 4]);
    });
    it('Invalid byte array', () => {
      expect(() => IBeacon.getByteArray([0xF00], 1)).to.throw(Error);
    });
  });
  describe('getHexString()', () => {
    it('Valid String', () => {
      expect(IBeacon.getHexString([0xFF])).to.eql('ff');
    });
    it('Invalid String', () => {
      expect(() => IBeacon.getHexString([0xF00])).to.throw(Error);
    });
  });
  describe('_getUuidByteArray()', () => {
    it('Valid String UUID', () => {
      expect(IBeacon._getUuidByteArray('0102030405060708090a0b0c0d0e0f10'))
        .to.eql([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
    });
    it('Invalid Length String UUID', () => {
      expect(() => IBeacon._getUuidByteArray('0102030405'))
        .to.throw(Error);
    });
    it('Valid Byte UUID', () => {
      expect(IBeacon._getUuidByteArray([1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6]))
        .to.eql([1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6]);
    });
    it('Invalid Length Byte UUID', () => {
      expect(() => IBeacon._getUuidByteArray([1,2,3,4]))
        .to.throw(Error);
    });
  });
  describe('_getMajorMinorByteArray()', () => {
    it('Valid Number Major/Minor', () => {
      expect(IBeacon._getMajorMinorByteArray(1)).to.eql([0,1]);
    });
    it('Invalid Number Major/Minor', () => {
      expect(() => IBeacon._getMajorMinorByteArray(-1)).to.throw(Error);
    });
    it('Valid Byte Array Major/Minor', () => {
      expect(IBeacon._getMajorMinorByteArray([1,2])).to.eql([1,2]);
    });
    it('Invalid Length Byte Array Major/Minor', () => {
      expect(() => IBeacon._getMajorMinorByteArray([1])).to.throw(Error);
    });
  });
  describe('_getAdvertisedTxPowerArray()', () => {
    it('Correct Advertised Tx Power', () => {
      expect(IBeacon._getAdvertisedTxPowerArray(-59)).to.eql([197]);
    });
    it('Invalid Advertised Tx Power', () => {
      expect(() => IBeacon._getAdvertisedTxPowerArray(100)).to.throw(Error);
    });
  });
  describe('_encodeString()', () => {
    it('Odd expected length', () => {
      expect(() => IBeacon._encodeString('012', 3)).to.throw(/length/);
    });
    it('Too Long String', () => {
      expect(() => IBeacon._encodeString('010203', 4)).to.throw(/length/);
    });
    it('Too Short String', () => {
      expect(() => IBeacon._encodeString('01', 4)).to.throw(/length/);
    });
    it('Correct Length String', () => {
      expect(IBeacon._encodeString('0102', 4)).to.eql([1,2]);
    });
    it('Invalid characters String', () => {
      expect(() => IBeacon._encodeString('010G', 4)).to.throw(/character/);
    });
    it('Valid String', () => {
      expect(IBeacon._encodeString('abcdef', 6)).eql([0xab, 0xcd, 0xef]);
    });
  });
  describe('_encodeNumber()', () => {
    it('Too Large Number', () => {
      expect(() => IBeacon._encodeNumber(65536, 2)).to.throw(/major/);
    });
    it('Too Small Number', () => {
      expect(() => IBeacon._encodeNumber(-1, 2)).to.throw(/major/);
    });
    it('Correct Number', () => {
      expect(IBeacon._encodeNumber(65535, 2)).to.eql([0xff,0xff]);
    });
    it('Invalid characters Number', () => {
      expect(() => IBeacon._encodeNumber('string', 2)).to.throw(/number/);
    });
    it('Valid Number', () => {
      expect(IBeacon._encodeNumber(1, 2)).eql([0, 0x01]);
    });
  });
  describe('_validateByteArray()', () => {
    it('Too long array', () => {
      expect(() => IBeacon._validateByteArray([1,2,3], 2)).to.throw(/length/);
    });
    it('Too short array', () => {
      expect(() => IBeacon._validateByteArray([1], 2)).to.throw(/length/);
    });
    it('Wrong type in array', () => {
      expect(() => IBeacon._validateByteArray([1, {}], 2)).to.throw(/value/);
    });
    it('Wrong value in array', () => {
      expect(() => IBeacon._validateByteArray([1, 0xF00], 2)).to.throw(/value/);
    });
  });
});
