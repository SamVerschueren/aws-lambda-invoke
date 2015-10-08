import test from 'ava';
import AWS from 'aws-sdk';
import sinon from 'sinon';
import fn from './';

const lambda = fn(AWS).raw;

test('invoke rejects if name is not provided', async t => {
	try {
		await fn.invoke();
		t.fail();
	} catch (err) {
		t.pass();
	}
});

test.serial('invoke should have been called with the correct params', async t => {
	sinon.stub(fn.raw, 'invoke').yields(undefined, {Payload: '{"foo": "bar"}'});

	try {
		await fn.invoke('hello', {hello: 'world'});
		t.true(fn.raw.invoke.calledWith({
			FunctionName: 'hello',
			InvocationType: 'RequestResponse',
			Payload: '{"hello":"world"}'
		}));
	} finally {
		fn.raw.invoke.restore();
	}
});

test.serial('invoke returns the payload', async t => {
	sinon.stub(fn.raw, 'invoke').yields(undefined, {Payload: '{"foo": "bar"}'});

	try {
		const result = await fn.invoke('hello', {hello: 'world'});
		t.same(result, {foo: 'bar'});
	} finally {
		fn.raw.invoke.restore();
	}
});

test.serial('invoke rejects if the result has an errorMessage', async t => {
	sinon.stub(fn.raw, 'invoke').yields(undefined, {Payload: '{"errorMessage": "Could not connect."}'});

	try {
		await fn.invoke('hello', {hello: 'world'});
		t.fail();
	} catch (err) {
		t.is(err.message, 'Could not connect.');
	} finally {
		fn.raw.invoke.restore();
	}
});

test.serial('invoke returns the raw payload if it isn\'t json', async t => {
	sinon.stub(fn.raw, 'invoke').yields(undefined, {Payload: 'raw payload'});

	try {
		const result = await fn.invoke('hello');
		t.is(result, 'raw payload');
	} finally {
		fn.raw.invoke.restore();
	}
});

test('invokeAsync rejects if name is not provided', async t => {
	try {
		await fn.invokeAsync();
		t.fail();
	} catch (err) {
		t.pass();
	}
});

test.serial('invokeAsync should have been called with the correct params', async t => {
	sinon.stub(fn.raw, 'invoke').yields(undefined, {Payload: '{"foo": "bar"}'});

	try {
		await fn.invokeAsync('hello', {hello: 'world'});
		t.true(fn.raw.invoke.calledWith({
			FunctionName: 'hello',
			InvocationType: 'Event',
			Payload: '{"hello":"world"}'
		}));
	} finally {
		fn.raw.invoke.restore();
	}
});

test.serial('invokeAsync returns the raw result', async t => {
	sinon.stub(fn.raw, 'invoke').yields(undefined, {status: 'OK'});

	try {
		const result = await fn.invokeAsync('hello', {hello: 'world'});
		t.same(result, {status: 'OK'});
	} finally {
		fn.raw.invoke.restore();
	}
});
