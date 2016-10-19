# aws-lambda-invoke [![Build Status](https://travis-ci.org/SamVerschueren/aws-lambda-invoke.svg?branch=master)](https://travis-ci.org/SamVerschueren/aws-lambda-invoke)

> Invoke AWS Lambda functions with ease


## Installation

```
npm install --save aws-lambda-invoke
```


## Usage

Make sure the `aws-sdk` is available in the project. The SDK is not shipped with this library because it is globally available in AWS Lambda. By not embedding the
SDK, you can keep te footprint of the lambda build is small as possible.

### Sychronous

The `invoke` method calls the lambda function synchronously. This means that it will wait untill the called lambda function
returns a result or fails.

```js
const lambda = require('aws-lambda-invoke');

lambda.invoke('MyLambdaFunction', {hello: 'world'}).then(result => {
    console.log(result);
    //=> '{"foo": "bar"}'
});
```

Or with an alias

```js
const lambda = require('aws-lambda-invoke');

lambda.invoke('MyLambdaFunction:production', {hello: 'world'}).then(result => {
    console.log(result);
    //=> '{"foo": "baz"}'
});
```

### Asynchronous

If you don't have to wait for the response of the lambda function you can use the `invokeAsync` method.

```js
const lambda = require('aws-lambda-invoke');

lambda.invokeAsync('MyLambdaFunction', {hello: 'world'}).then(() => {
    // invoked successfully
});
```

### Raw Lambda

If you want to do something with the lambda object created in the `aws-lambda-invoke` library, you can because the lambda function is stored
in the `raw` property of the library.

```js
const lambda = require('aws-lambda-invoke');

const params = {
    FunctionName: 'MyLambdaFunction',
    Qualifier: 'my-alias',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify({hello: 'world'})
};

lambda.raw.invoke(params, (err, result) => {
    // handle the result
});
```


## API

### invoke(name, [payload])

Returns a promise that resolves the payload returned by the invoked lambda function.

### invokeAsync(name, [payload])

Returns a promise that resolves nothing.

#### name

*Required*<br>
Type: `string`

Name of the lambda function you want to invoke. You can append the `version` or `alias` to the name separated by a colon.

#### payload

Type: `object` `string`

Payload you want to send to the lambda function you are invoking.


## License

MIT © [Sam Verschueren](https://github.com/SamVerschueren)
