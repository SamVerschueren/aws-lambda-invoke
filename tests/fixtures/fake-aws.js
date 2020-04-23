'use strict';
const AWS = require('aws-sdk');
const sinon = require('sinon');

class Lambda {
	invoke(event) {
		return {
			promise: async () => {
				if (event.InvocationType === 'Event') {
					return Promise.resolve({status: 'OK'});
				}

				if (event.FunctionName === 'error-service') {
					return Promise.resolve({Payload: JSON.stringify({errorMessage: 'Could not connect.'})});
				}

				if (event.FunctionName === 'raw-service') {
					return Promise.resolve({Payload: 'raw payload'});
				}

				if (event.Payload === JSON.stringify({hello: 'world'})) {
					return Promise.resolve({Payload: JSON.stringify({foo: 'bar'})});
				}

				return Promise.resolve({});
			}
		};
	}
}
const lambda = new Lambda();

AWS.Lambda = function () {
	return lambda;
};

sinon.spy(lambda, 'invoke');

module.exports.lambda = lambda;
