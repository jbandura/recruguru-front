import { test } from 'qunit';
import moduleForAcceptance from 'recruguru-front/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'recruguru-front/tests/helpers/ember-simple-auth';

moduleForAcceptance('Acceptance | challenges', {
  beforeEach() {
    authenticateSession(this.application);
    server.createList('challenge', 5);
    visit('/challenges');
  }
});

test('route exists', function(assert) {
  andThen(function() {
    assert.equal(currentRouteName(), 'challenges.index');
  });
});

test('it displays a list of challenges', function(assert) {
  assert.equal(find('.js-challenge').length, 5);
});

test('it displays a show link', function(assert) {
  assert.equal(find('.js-challenge .js-show').length, 5);
});

test('it displays a create new link', function(assert) {
  assert.ok(find('.js-add').length);
});

