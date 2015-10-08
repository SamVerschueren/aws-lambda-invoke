'use strict';

/**
 * Library that makes it easier to invoke lambda functions with promises.
 *
 * @author Sam Verschueren	  <sam.verschueren@gmail.com>
 * @since  29 Jul. 2015
 */

// module dependencies
var Promise = require('pinkie-promise');
var pify = require('pify');

/**
 * Initializes the library by creating a new AWS.Lambda object.
 *
 * @param {AWS}  AWS	 The AWS object.
 */
module.exports = function (AWS) {
	// Constructs a new lambda function
	module.exports.raw = new AWS.Lambda();

	// Return the exports object
	return module.exports;
};

/**
 * Invokes another lambda function synchronously. This means that the InvocationType is set
 * to `RequestResponse` and it will return after the called lambda function returns the result.
 *
 * @param  {string}	 name		The name of the lambda function to invoke.
 * @param  {object}	 payload	The payload that should be send to the lambda function.
 * @return {Promise}			The promise object.
 */
module.exports.invoke = function (name, payload) {
	if (!name) {
		// Reject if the name is not provided
		return Promise.reject(new Error('Please provide a name'));
	}

	// Build up the message params
	var params = {
		FunctionName: name,
		InvocationType: 'RequestResponse',
		Payload: JSON.stringify(payload)
	};

	return pify(this.raw.invoke.bind(this.raw), Promise)(params)
		.then(function (data) {
			var payload = data.Payload;

			try {
				// Try to parse the payload as JSON
				payload = JSON.parse(payload);
			} catch (err) {
				// Do nothing if the payload couln't be parsed
			}

			if (payload && payload.errorMessage) {
				// If the payload has an errorMessage, throw the error
				throw new Error(payload.errorMessage);
			}

			return payload;
		});
};

/**
 * Invokes another lambda function asynchronously. This means that the InvocationType is set
 * to `Event` and it will return after the invocation succeeded.
 *
 * @param  {string}	 name		The name of the lambda function to invoke.
 * @param  {object}	 payload	The payload that should be send to the lambda function.
 * @return {Promise}			The promise object.
 */
module.exports.invokeAsync = function (name, payload) {
	if (!name) {
		// Reject if the name is not provided
		return Promise.reject(new Error('Please provide a name'));
	}

	// Build up the message params
	var params = {
		FunctionName: name,
		InvocationType: 'Event',
		Payload: JSON.stringify(payload)
	};

	return pify(this.raw.invoke.bind(this.raw), Promise)(params);
};
