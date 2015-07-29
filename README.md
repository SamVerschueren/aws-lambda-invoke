# aws-lambda-invoke

> Library that makes it easier to invoke lambda functions with promises.

## Installation

```bash
npm install --save aws-lambda-invoke
```

## Usage

Load the library and pass in the `AWS` library.

```javascript
var AWS = require('aws-sdk'),
    lambda = require('aws-lambda-invoke')(AWS);
```

Why am I not embedding the `aws-sdk` in the library? This is because in AWS Lambda, the `aws-sdk` is globally available for you to use. By not
embedding the `aws-sdk` library, you can keep the footprint of the lambda build smaller.

### Sychronous

The `invoke` method calls the lambda function synchronously. This means that it will wait untill the called lambda function
returns a result or fails.

```javascript
// Invoke the function
lambda.invoke('MyLambdaFunction', {hello: 'world'})
    .then(function(result) {
        // Do something with the result of MyLambdaFunction
    })
    .catch(function(err) {
        // Something went wrong
    });
```

### Asynchronous

If you don't have to wait for the response of the lambda function you can use the `invokeAsync` method.

```javascript
// Invoke the function
lambda.invokeAsync('MyLambdaFunction', {hello: 'world'})
    .then(function() {
        // The MyLambdaFunction is invoked successfully
    })
    .catch(function(err) {
        // Something went wrong while invoke MyLambdaFunction
    });
```

## Contributors

- Sam Verschueren [<sam.verschueren@gmail.com>]

## License

MIT © Sam Verschueren