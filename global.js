// Inject node globals into React Native global scope.
global.Buffer = require('buffer').Buffer;
global.process = require('process');
global.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';

// Needed so that 'stream-http' chooses the right default protocol.
global.location = {
  protocol: 'file:',
};

global.crypto = {
  getRandomValues(byteArray) {
    for (let i = 0; i < byteArray.length; i++) {
      byteArray[i] = Math.floor(256 * Math.random());
    }
  },
};
