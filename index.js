'use strict';
var AWS = require('aws-sdk');
var Promise = require('pinkie-promise');
var pify = require('pify');

module.exports.raw = new AWS.Lambda();

module.exports.invoke = function (name, payload) {
	if (!name) {
		return Promise.reject(new Error('Please provide a name'));
	}

	var params = {
		FunctionName: name,
		InvocationType: 'RequestResponse',
		Payload: JSON.stringify(payload)
	};

	return pify(this.raw.invoke.bind(this.raw), Promise)(params)
		.then(function (data) {
			var payload = data.Payload;

			try {
				payload = JSON.parse(payload);
			} catch (err) {

			}

			if (payload && payload.errorMessage) {
				throw new Error(payload.errorMessage);
			}

			return payload;
		});
};

module.exports.invokeAsync = function (name, payload) {
	if (!name) {
		return Promise.reject(new Error('Please provide a name'));
	}

	var params = {
		FunctionName: name,
		InvocationType: 'Event',
		Payload: JSON.stringify(payload)
	};

	return pify(this.raw.invoke.bind(this.raw), Promise)(params);
};
