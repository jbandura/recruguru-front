import { test } from 'qunit';
import moduleForAcceptance from 'recruguru-front/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'recruguru-front/tests/helpers/ember-simple-auth';
import { fillInBlurAcceptance } from 'recruguru-front/tests/helpers/ember-legit-forms';
import { Response } from 'ember-cli-mirage';

let application;
moduleForAcceptance('Acceptance | auth', {
  beforeEach() {
    application = this.application;
  }
});

test('it does not allow access for not logged in users', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/login');
  });
});

test('it allows access for authenticated users', function(assert) {
  authenticateSession(application);
  andThen(() => visit('/'));
  andThen(() => assert.equal(currentURL(), '/'));
});

test('it allows logging in', function(assert) {
  assert.expect(5);
  visit('/login');
  server.post('/sessions', function(_, request) {
    const [ password, login ] = decodeURIComponent(request.requestBody)
                                .replace(/user\[(email|password)\]=/g, '')
                                .split('&');
    assert.equal(password, 'foobarbaz');
    assert.equal(login, 'johndoe@example.com');
    assert.ok('api request got called');
    authenticateSession(application);
  });

  andThen(() => {
    fillInBlurAcceptance('.js-login', 'johndoe@example.com');
    fillInBlurAcceptance('.js-password', 'foobarbaz');
    click('button[type=submit]');
  });
  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.ok(find('.alert.alert-success').length, 'success message is displayed');
  });
});

test('it shows an error message when 500 returned from the server', function(assert) {
  assert.expect(1);
  visit('/login');
  server.post('/api/v1/sessions', function() {
    return new Response(500, {}, {errors: 'foo'});
  });

  andThen(() => {
    fillInBlurAcceptance('.js-login', 'johndoe@example.com');
    fillInBlurAcceptance('.js-password', 'foobarbaz');
    click('button[type=submit]');
  });
  andThen(() => {
    assert.ok(find('.alert.alert-danger').length, 'error message is displayed');
  });
});
