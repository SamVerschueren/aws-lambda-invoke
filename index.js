'use strict';

/**
 * Library that makes it easier to invoke lambda functions with promises.
 *
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  29 Jul. 2015
 */

// module dependencies
var Q = require('q');

(function() {

    /**
     * Initializes the library by creating a new AWS.Lambda object.
     *
     * @param {AWS}  AWS     The AWS object.
     */
    module.exports = function(AWS) {
        // Constructs a new lambda function
        module.exports.raw = new AWS.Lambda();

        // Return the exports object
        return module.exports;
    };

    /**
     * Invokes another lambda function synchronously. This means that the InvocationType is set
     * to `RequestResponse` and it will return after the called lambda function returns the result.
     *
     * @param  {string}     name        The name of the lambda function to invoke.
     * @param  {object}     payload     The payload that should be send to the lambda function.
     * @return {Promise}                The promise object.
     */
    module.exports.invoke = function(name, payload) {
        var lambda = this.raw;

        return Q.promise(function(resolve, reject) {
            if(!name) {
                // If the function is undefined, just resolve
                throw new Error('Please provide a name')
            }

            // Build up the message params
            var params = {
                FunctionName: name,
                InvocationType: 'RequestResponse',
                Payload: JSON.stringify(payload)
            };

            // Invoke another lambda function
            lambda.invoke(params, function(err, data) {
                if(err) {
                    // Reject if something went wrong
                    return reject(err);
                }

                try {
                    // Try to parse the payload to JSON
                    resolve(JSON.parse(data.Payload));
                }
                catch(e) {
                    // Return the raw payload if it isn't JSON
                    resolve(data.Payload);
                }
            })
        });
    };

    /**
     * Invokes another lambda function asynchronously. This means that the InvocationType is set
     * to `Event` and it will return after the invocation succeeded.
     *
     * @param  {string}     name        The name of the lambda function to invoke.
     * @param  {object}     payload     The payload that should be send to the lambda function.
     * @return {Promise}                The promise object.
     */
    module.exports.invokeAsync = function(name, payload) {
        var lambda = this.raw;

        return Q.promise(function(resolve, reject) {
            if(!name) {
                // If the function is undefined, just resolve
                throw new Error('Please provide a name')
            }

            // Build up the message params
            var params = {
                FunctionName: name,
                InvocationType: 'Event',
                Payload: JSON.stringify(payload)
            };

            // Invoke another lambda function
            lambda.invoke(params, function(err, data) {
                if(err) {
                    // Reject if something went wrong
                    return reject(err);
                }

                // Resolve if everything went well
                resolve();
            })
        });
    };
})();