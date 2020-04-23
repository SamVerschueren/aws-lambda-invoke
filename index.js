'use strict';
const AWS = require('aws-sdk');
const parse = require('parse-aws-lambda-name');

module.exports.invoke = (name, payload) => {
	const lambda = new AWS.Lambda();

	if (!name) {
		return Promise.reject(new TypeError('Please provide a name'));
	}

	const parsed = parse(name);

	if (!parsed) {
		return Promise.reject(new Error('Please provide a valid function name'));
	}

	const parameters = {
		FunctionName: parsed.functionName,
		InvocationType: 'RequestResponse',
		Payload: JSON.stringify(payload)
	};

	if (parsed.qualifier) {
		parameters.Qualifier = parsed.qualifier;
	}

	return lambda.invoke(parameters).promise()
		.then(data => {
			let payload = data.Payload;

			try {
				payload = JSON.parse(payload);
			} catch (_) { }

			if (payload && payload.errorMessage) {
				throw new Error(payload.errorMessage);
			}

			return payload;
		});
};

module.exports.invokeAsync = (name, payload) => {
	const lambda = new AWS.Lambda();

	if (!name) {
		return Promise.reject(new Error('Please provide a name'));
	}

	const parsed = parse(name);

	if (!parsed) {
		return Promise.reject(new Error('Please provide a valid function name'));
	}

	const parameters = {
		FunctionName: parsed.functionName,
		InvocationType: 'Event',
		Payload: JSON.stringify(payload)
	};

	if (parsed.qualifier) {
		parameters.Qualifier = parsed.qualifier;
	}

	return lambda.invoke(parameters).promise();
};
