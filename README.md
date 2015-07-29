# aws-lambda-invoke

> Library that makes it easier to invoke lambda functions with promises.

## Installation

```bash
npm install --save aws-lambda-invoke
```

## Usage

### Sychronous

The `invoke` method calls the lambda function synchronously. This means that it will wait untill the called lambda function
returns a result or fails.

```javascript
var lambda = require('aws-lambda-invoke');

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
var lambda = require('aws-lambda-invoke');

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