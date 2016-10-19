'use strict';
const AWS = require('aws-sdk');
const pify = require('pify');
const parse = require('parse-aws-lambda-name');

module.exports.raw = new AWS.Lambda();

module.exports.invoke = (name, payload) => {
	if (!name) {
		return Promise.reject(new TypeError('Please provide a name'));
	}

	const parsed = parse(name);

	if (!parsed) {
		return Promise.reject(new Error('Please provide a valid function name'));
	}

	const params = {
		FunctionName: parsed.functionName,
		InvocationType: 'RequestResponse',
		Payload: JSON.stringify(payload)
	};

	if (parsed.qualifier) {
		params.Qualifier = parsed.qualifier;
	}

	return pify(this.raw.invoke.bind(this.raw))(params)
		.then(data => {
			let payload = data.Payload;

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

module.exports.invokeAsync = (name, payload) => {
	if (!name) {
		return Promise.reject(new Error('Please provide a name'));
	}

	const parsed = parse(name);

	if (!parsed) {
		return Promise.reject(new Error('Please provide a valid function name'));
	}

	const params = {
		FunctionName: parsed.functionName,
		InvocationType: 'Event',
		Payload: JSON.stringify(payload)
	};

	if (parsed.qualifier) {
		params.Qualifier = parsed.qualifier;
	}

	return pify(this.raw.invoke.bind(this.raw), Promise)(params);
};
