const ssbKeys = require('ssb-keys');
const RNFS = require('react-native-fs');
const path = require('path');

export type Callback<T> = (err: any, value?: T) => void;

exports.generate = ssbKeys.generate;

exports.signObj = ssbKeys.signObj;

exports.verifyObj = ssbKeys.verifyObj;

exports.box = ssbKeys.box;

exports.unbox = ssbKeys.unbox;

exports.load = function load(filename: string, cb: Callback<object>): void {
  RNFS.exists(filename).then((exists: boolean) => {
    if (exists) {
      return RNFS.readFile(filename, 'ascii').then(
        (fileContents: any) => {
          cb(null, JSON.parse(fileContents));
        },
        (err: any) => {
          cb(err);
        }
      );
    } else {
      cb(new Error('keys file ' + filename + ' does not exist'));
    }
  });
};

exports.loadSync = function loadSync(filename: never): void {
  throw new Error(
    'Synchronous calls such as loadSync are not supported in React Native'
  );
};

exports.create = function create(
  filename: string,
  curve: string | null,
  legacy: boolean,
  cb: Callback<object>
): void {
  if (typeof legacy === 'function') {
    cb = legacy;
    legacy = false;
  }
  if (typeof curve === 'function') {
    cb = curve;
    curve = null;
  }
  const generatedKeys = ssbKeys.generate(curve);
  const fileContents = JSON.stringify(generatedKeys, null, 2);
  RNFS.mkdir(path.dirname(filename))
    .then(() => RNFS.writeFile(filename, fileContents, 'ascii'))
    .catch((err: any) => {
      cb(err);
    })
    .then(() => {
      cb(null, generatedKeys);
    });
};

exports.createSync = function createSync(
  filename: never,
  curve: string | null,
  legacy: boolean
): void {
  throw new Error(
    'Synchronous calls such as createSync are not supported in React Native'
  );
};

exports.loadOrCreate = function(filename: string, cb: Callback<object>): void {
  exports.load(filename, function(err: any, keys: object) {
    if (!err) return cb(null, keys);
    exports.create(filename, cb);
  });
};

exports.loadOrCreateSync = function(filename: never): void {
  throw new Error(
    'Synchronous calls like loadOrCreateSync are not supported in React Native'
  );
};
