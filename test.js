import test from 'ava';
import sinon from 'sinon';
import m from './';

function stub(result) {
	sinon.stub(m.raw, 'invoke').yields(undefined, result);
}

test.afterEach(() => {
	if (m.raw.invoke.restore) {
		m.raw.invoke.restore();
	}

	if (m.raw.invokeAsync.restore) {
		m.raw.invokeAsync.restore();
	}
});

test('invoke rejects if name is not provided', async t => {
	t.throws(m.invoke(), 'Please provide a name');
});

test.serial('invoke should have been called with the correct params', async t => {
	stub({Payload: '{"foo": "bar"}'});

	await m.invoke('hello', {hello: 'world'});

	t.same(m.raw.invoke.firstCall.args[0], {
		FunctionName: 'hello',
		InvocationType: 'RequestResponse',
		Payload: '{"hello":"world"}'
	});
});

test.serial('invoke version should have been called with the correct params', async t => {
	stub({Payload: '{"foo": "bar"}'});

	await m.invoke('hello:foo', {hello: 'world'});

	t.same(m.raw.invoke.firstCall.args[0], {
		FunctionName: 'hello',
		Qualifier: 'foo',
		InvocationType: 'RequestResponse',
		Payload: '{"hello":"world"}'
	});
});

test.serial('invoke returns the payload', async t => {
	stub({Payload: '{"foo": "bar"}'});

	const result = await m.invoke('hello', {hello: 'world'});
	t.same(result, {foo: 'bar'});
});

test.serial('invoke rejects if the result has an errorMessage', async t => {
	stub({Payload: '{"errorMessage": "Could not connect."}'});

	t.throws(m.invoke('hello', {hello: 'world'}), 'Could not connect.');
});

test.serial('invoke returns the raw payload if it isn\'t json', async t => {
	stub({Payload: 'raw payload'});

	t.is(await m.invoke('hello'), 'raw payload');
});

test('invokeAsync rejects if name is not provided', async t => {
	await t.throws(m.invokeAsync(), 'Please provide a name');
});

test.serial('invokeAsync should have been called with the correct params', async t => {
	stub({Payload: '{"foo": "bar"}'});

	await m.invokeAsync('hello', {hello: 'world'});

	t.same(m.raw.invoke.firstCall.args[0], {
		FunctionName: 'hello',
		InvocationType: 'Event',
		Payload: '{"hello":"world"}'
	});
});

test.serial('invokeAsync version should have been called with the correct params', async t => {
	stub({Payload: '{"foo": "bar"}'});

	await m.invokeAsync('hello:foo', {hello: 'world'});

	t.same(m.raw.invoke.firstCall.args[0], {
		FunctionName: 'hello',
		Qualifier: 'foo',
		InvocationType: 'Event',
		Payload: '{"hello":"world"}'
	});
});

test.serial('invokeAsync returns the raw result', async t => {
	stub({status: 'OK'});

	t.same(await m.invokeAsync('hello', {hello: 'world'}), {status: 'OK'});
});
