import { test } from 'qunit';
import moduleForAcceptance from 'recruguru-front/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'recruguru-front/tests/helpers/ember-simple-auth';
import Ember from 'ember';

moduleForAcceptance('Acceptance | challenges', {
  beforeEach() {
    authenticateSession(this.application, { currentUser: Ember.Object.create({
      isAdmin: true
    })});
    server.createList('challenge', 5);
    visit('/challenges');
  }
});

test('route exists', function(assert) {
  assert.equal(currentRouteName(), 'challenges.index');
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

test('as a non admin I dont see any delete buttons', function(assert) {
  authenticateSession(this.application, { currentUser: Ember.Object.create({
    isAdmin: false
  })});
  visit('/challenges');

  andThen(() => {
    assert.equal(find('.js-challenge').length, 5);
    assert.notOk(find('.js-delete-btn').length);
  });
});

test('as an admin I can see delete buttons', function(assert) {
  assert.ok(find('.js-delete-btn').length);
});

test('when clicking on delete button a proper request gets sent', function(assert) {
  assert.expect(1);
  const challengeToDelete = server.db.challenges[0];
  server.del(`/challenges/${challengeToDelete.id}`, () => {
    assert.ok(true, 'request gets sent');
  });
  triggerEvent('.js-delete-btn:nth(0)', 'mousedown');
});
