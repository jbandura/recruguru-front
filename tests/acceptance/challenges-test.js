import { test } from 'qunit';
import moduleForAcceptance from 'recruguru-front/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'recruguru-front/tests/helpers/ember-simple-auth';
import Ember from 'ember';
import { Response } from 'ember-cli-mirage';

const userId = 3;

const authAndVisit = (app, userData) => {
    authenticateSession(app, { currentUser: Ember.Object.create(userData)});
    server.createList('challenge', 5, { userId: 5 });
    server.create('challenge', { userId });
    visit('/challenges');
};

moduleForAcceptance('Acceptance | challenges');

test('route exists', function(assert) {
  authAndVisit(this.application, { id: userId, isAdmin: true });
  andThen(() => assert.equal(currentRouteName(), 'challenges.index'));
});

test('it displays a list of challenges', function(assert) {
  authAndVisit(this.application, { id: userId, isAdmin: true });
  andThen(() => assert.equal(find('.js-challenge').length, 6));
});

test('it displays a show link', function(assert) {
  authAndVisit(this.application, { id: userId, isAdmin: true });
  andThen(() => assert.equal(find('.js-challenge .js-show').length, 6));
});

test('it displays a create new link', function(assert) {
  authAndVisit(this.application, { id: userId, isAdmin: true });
  andThen(() => assert.ok(find('.js-add').length));
});

test('as a non admin I dont see any delete buttons', function(assert) {
  authAndVisit(this.application, { isAdmin: false });
  andThen(() => {
    assert.equal(find('.js-challenge').length, 6);
    assert.notOk(find('.js-delete-btn').length);
  });
});

test('as an admin I can see delete buttons', function(assert) {
  authAndVisit(this.application, { id: userId, isAdmin: true });
  andThen(() => assert.ok(find('.js-delete-btn').length));
});

test('as an admin I can see edit buttons for all challenges', function(assert) {
  authAndVisit(this.application, { id: userId, isAdmin: true });

  andThen(() => {
    assert.equal(find('.js-edit-btn').length, 6);
  });
});

test('as a user I can see edit buttons for my challenges', function(assert) {
  authAndVisit(this.application, { id: userId, isAdmin: false });

  andThen(() => {
    assert.equal(find('.js-edit-btn').length, 1);
  });
});

test('when clicking on delete button a proper request gets sent', function(assert) {
  assert.expect(1);
  authAndVisit(this.application, { id: userId, isAdmin: true });
  const challengeToDelete = server.db.challenges[0];
  server.del(`/challenges/${challengeToDelete.id}`, () => {
    assert.ok(true, 'request gets sent');
  });

  andThen(() => triggerEvent('.js-delete-btn:nth(0)', 'mousedown'));
});

test('after deleting of challenge a proper flash message is displayed', function(assert) {
  assert.expect(1);
  authAndVisit(this.application, { id: userId, isAdmin: true });

  andThen(() => triggerEvent('.js-delete-btn:nth(0)', 'mousedown'));
  andThen(() => assert.ok(find('.alert.alert-success').length) );
});

test('when error encountered while deleting a proper flash message is shown', function(assert) {
  assert.expect(1);
  authAndVisit(this.application, { id: userId, isAdmin: true });
  const challengeToDelete = server.db.challenges[0];
  server.del(`/challenges/${challengeToDelete.id}`, () => {
    return new Response(500, {}, {errors: 'ups'});
  });

  andThen(() => triggerEvent('.js-delete-btn:nth(0)', 'mousedown'));
  andThen(() => assert.ok(find('.alert.alert-danger').length) );
});

test('clicking on edit button takes me to edit route', function(assert) {
  authAndVisit(this.application, { id: userId, isAdmin: true });
  andThen(() => click('.js-edit-btn:nth(0)'));
  andThen(() => {
    assert.equal(currentRouteName(), 'challenges.edit');
  });
});
