'use strict';
var AWS = require('aws-sdk');
var Promise = require('pinkie-promise');
var pify = require('pify');
var parse = require('parse-aws-lambda-name');

module.exports.raw = new AWS.Lambda();

module.exports.invoke = function (name, payload) {
	if (!name) {
		return Promise.reject(new TypeError('Please provide a name'));
	}

	var parsed = parse(name);

	if (!parsed) {
		return Promise.reject(new Error('Please provide a valid function name'));
	}

	var params = {
		FunctionName: parsed.functionName,
		InvocationType: 'RequestResponse',
		Payload: JSON.stringify(payload)
	};

	if (parsed.qualifier) {
		params.Qualifier = parsed.qualifier;
	}

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

	var parsed = parse(name);

	if (!parsed) {
		return Promise.reject(new Error('Please provide a valid function name'));
	}

	var params = {
		FunctionName: parsed.functionName,
		InvocationType: 'Event',
		Payload: JSON.stringify(payload)
	};

	if (parsed.qualifier) {
		params.Qualifier = parsed.qualifier;
	}

	return pify(this.raw.invoke.bind(this.raw), Promise)(params);
};
