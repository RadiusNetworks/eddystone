(() => {
  'use strict';

  /**
   * @module ibeacon
   * @typicalname ibeacon
   */

  const IBEACON_ID = require('./eddystone-advertisement.js').IBEACON_ID;

  /**
     iBeacon Frame type.
     @private
     @constant {number}
     @default
   */
  const IBEACON_PREAMBLE = 0x0215;

  const UUID_LENGTH = 16;
  const MAJOR_MINOR_LENGTH = 2;

  const HEX_REGEX = /[0-9a-f]/i;

  /**
     This class provides helper functions that relate to iBeacon.
     @alias module:ibeacon
   */
  class IBeacon {
    /**
       Constructs a valid iBeacon manufacturer data from a Tx Power value, uuid,
       major and minor.
       @param {number} advertisedTxPower The Tx Power included in the service data.
       @param {number[]|string} uuid The uuid to advertise.
       @param {number[]|number} major The major to advertise.
       @param {number[]|number} minor The minor to advertise.
       @returns {number[]} The manufacturer data.
     */
    static constructManufacturerData(uuid, major, minor, advertisedTxPower) {
      // Check that it's a valid Tx Power.
      if (advertisedTxPower < -100 || advertisedTxPower > 20) {
        throw new Error('Invalid Tx Power value: ' + advertisedTxPower + '.');
      }
      let base_frame = IBeacon.getByteArray(IBEACON_PREAMBLE, 2);
      Array.prototype.push.apply(base_frame, IBeacon._getUuidByteArray(uuid));
      Array.prototype.push.apply(base_frame, IBeacon._getMajorMinorByteArray(major));
      Array.prototype.push.apply(base_frame, IBeacon._getMajorMinorByteArray(minor));
      Array.prototype.push.apply(base_frame, IBeacon._getAdvertisedTxPowerArray(advertisedTxPower));
      return base_frame;
    }

    /**
       Validates the given array of bytes or converts the hex string into an array of bytes.
       @param {number[]|string} value The value to encode.
       @throws {TypeError} If |value| is not an array or a string.
       @throws {Error} If |value| contains out-of-range numbers or characters.
       @returns {number[]} Array of bytes.
    */
    static getByteArray(value, expected_length) {
      if (typeof value === 'string') {
        // A hex string is twice as long as the byte array it represents.
        let str_expected_length = expected_length * 2;
        return IBeacon._encodeString(value, str_expected_length);
      }
      if (typeof value === 'number') {
        return IBeacon._encodeNumber(value, expected_length);
      }
      if (Array.isArray(value)) {
        return IBeacon._validateByteArray(value, expected_length);
      }
      throw new TypeError('Only string or array are supported');
    }

    static getHexString(bytes) {
      let hex_string = '';
      for (let i = 0; i < bytes.length; i++) {
        if (bytes[i] > 0xFF) {
          throw new Error('Invalid value \'' + bytes[i] + '\' at index ' + i + '.');
        }
        hex_string = hex_string.concat((bytes[i] >>> 4).toString(16));
        hex_string = hex_string.concat((bytes[i] & 0xF).toString(16));
      }
      return hex_string;
    }

    static _getUuidByteArray(uuid) {
      return IBeacon.getByteArray(uuid, UUID_LENGTH);
    }

    static _getMajorMinorByteArray(majorMinor) {
      return IBeacon.getByteArray(majorMinor, MAJOR_MINOR_LENGTH);
    }

    static _getAdvertisedTxPowerArray(advertisedTxPower) {
      if (advertisedTxPower < -100 || advertisedTxPower > 20) {
        throw new Error('Invalid Tx Power value: ' + advertisedTxPower + '.');
      }
      return [(advertisedTxPower + 256)];
    }

    static _encodeString(str, expected_length) {
      if (expected_length % 2 !== 0) {
        throw new Error('expected_length should be an even number.');
      }
      if (str.length !== expected_length) {
        throw new Error('Expected length to be: ' + expected_length + '. ' +
                        'But was: ' + str.length  + '. Remember a hex string is twice ' +
                        'as long as the number of bytes desired.');
      }
      let bytes = [];
      for (let i = 0; i < str.length; i += 2) {
        if (!HEX_REGEX.test(str[i])) {
          throw new Error('Invalid character \'' + str[i] + '\' at index ' + i);
        }
        if (!HEX_REGEX.test(str[i + 1])) {
          throw new Error('Invalid character \'' + str[i + 1] + '\' at index ' + (i + 1));
        }
        bytes.push(parseInt(str.substr(i, 2), 16));
      }
      return bytes;
    }

    static _encodeNumber(num, expected_length) {
      if (typeof num !== 'number') {
        throw new Error('Input not a number: ' + num);
      }
      if (num < 0 || num > 65535) {
        throw new Error('major and minor must be between 0 and 65535.');
      }
      let str;
      // Convert number to string and pad with zeros
      str = ('0000' + num.toString(16)).substr(-(MAJOR_MINOR_LENGTH*2));
      // A hex string is twice as long as the byte array it represents.
      let str_expected_length = expected_length * 2;
      return IBeacon._encodeString(str, str_expected_length);
    }

    static _validateByteArray(arr, expected_length) {
      if (arr.length !== expected_length) {
        throw new Error('Expected length to be: ' + expected_length + '. ' +
                        'But was: ' + arr.length + '.');
      }
      for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] !== 'number') {
          throw new Error('Unexpected value \'' + arr[i] + '\' at index ' + i + '.');
        }
        if (!(arr[i] >= 0x00 && arr[i] <= 0xFF)) {
          throw new Error('Unexpected value \'' + arr[i] + '\' at index ' + i + '.');
        }
      }
      return arr;
    }
  }
  module.exports = IBeacon;
})();
