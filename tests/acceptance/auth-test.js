import { test } from 'qunit';
import moduleForAcceptance from 'recruguru-front/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'recruguru-front/tests/helpers/ember-simple-auth';

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

