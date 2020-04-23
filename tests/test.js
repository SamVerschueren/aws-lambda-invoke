'use strict';
const test = require('ava');
const {lambda} = require('./fixtures/fake-aws');
const m = require('..');

test('invoke rejects if name is not provided', async t => {
	await t.throwsAsync(m.invoke(), {message: 'Please provide a name'});
});

test('invoke rejects if the result has an errorMessage', async t => {
	await t.throwsAsync(m.invoke('error-service', {hello: 'world'}), {message: 'Could not connect.'});
});

test('invokeAsync rejects if name is not provided', async t => {
	await t.throwsAsync(m.invokeAsync(), {message: 'Please provide a name'});
});

test('invoke should have been called with the correct params', async t => {
	await m.invoke('hello', {hello: 'world'});

	t.true(lambda.invoke.calledWith(
		{
			FunctionName: 'hello',
			InvocationType: 'RequestResponse',
			Payload: '{"hello":"world"}'
		}
	));
});

test('invoke version should have been called with the correct params', async t => {
	await m.invoke('hello:foo', {hello: 'world'});

	t.true(lambda.invoke.calledWith(
		{
			FunctionName: 'hello',
			Qualifier: 'foo',
			InvocationType: 'RequestResponse',
			Payload: '{"hello":"world"}'
		}
	));
});

test('invoke returns the payload', async t => {
	const result = await m.invoke('hello', {hello: 'world'});

	t.deepEqual(result, {foo: 'bar'});
});

test('invoke returns the raw payload if it is not json', async t => {
	const result = await m.invoke('raw-service');

	t.is(result, 'raw payload');
});

test('invokeAsync should have been called with the correct params', async t => {
	await m.invokeAsync('hello', {hello: 'world'});

	t.true(lambda.invoke.calledWith(
		{
			FunctionName: 'hello',
			InvocationType: 'Event',
			Payload: '{"hello":"world"}'
		}
	));
});

test('invokeAsync version should have been called with the correct params', async t => {
	await m.invokeAsync('hello:foo', {hello: 'world'});

	t.true(lambda.invoke.calledWith(
		{
			FunctionName: 'hello',
			Qualifier: 'foo',
			InvocationType: 'Event',
			Payload: '{"hello":"world"}'
		}
	));
});

test('invokeAsync returns the raw result', async t => {
	t.deepEqual(await m.invokeAsync('hello', {hello: 'world'}), {status: 'OK'});
});
