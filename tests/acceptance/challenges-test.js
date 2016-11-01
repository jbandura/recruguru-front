import { test } from 'qunit';
import moduleForAcceptance from 'recruguru-front/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'recruguru-front/tests/helpers/ember-simple-auth';
import Ember from 'ember';
import { Response } from 'ember-cli-mirage';
import { hook, $hook } from 'ember-hook';

const userId = 3;
let votedChallenge;
let challenge;
let category;

const authAndVisit = (app, userData, callback = function() {}) => {
  authenticateSession(app, { currentUser: Ember.Object.create(userData)});
  server.createList('challenge', 5, { userId: 5 });
  category = server.create('category');
  challenge = server.create('challenge', { category_id: category.id });

  votedChallenge = server.create('challenge', { userId });
  server.createList('challenge-vote', 5, { challengeId: votedChallenge.id });
  callback();
  visit('/challenges');
};

moduleForAcceptance('Acceptance | challenges');

test('route exists', function(assert) {
  authAndVisit(this.application, { id: userId, isAdmin: true });
  andThen(() => assert.equal(currentRouteName(), 'challenges.index'));
});

test('it displays a list of challenges', function(assert) {
  authAndVisit(this.application, { id: userId, isAdmin: true });
  andThen(() => assert.equal(find('.js-challenge').length, 7));
});

test('it displays a show link', function(assert) {
  authAndVisit(this.application, { id: userId, isAdmin: true });
  andThen(() => assert.equal(find('.js-challenge .js-show').length, 7));
});

test('it displays a create new link', function(assert) {
  authAndVisit(this.application, { id: userId, isAdmin: true });
  andThen(() => assert.ok(find('.js-add').length));
});

test('as a non admin I dont see any delete buttons', function(assert) {
  authAndVisit(this.application, { isAdmin: false });
  andThen(() => {
    assert.equal(find('.js-challenge').length, 7);
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
    assert.equal(find('.js-edit-btn').length, 7);
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

test('upvoting a challenge fires a proper action', function(assert) {
  assert.expect(2);
  authAndVisit(this.application, { id: userId, isAdmin: true });
  server.post('/challenge_votes', (db, request) => {
    const vote = JSON.parse(request.requestBody).challenge_vote;
    assert.equal(vote.user_id, userId);
    assert.equal(vote.challenge_id, server.db.challenges[0].id);
  });
  andThen(() => {
    click('.js-upvote-btn:nth(0)');
  });
});

test('it properly displays a list of votes for given challenge', function(assert) {
  authAndVisit(this.application, { id: userId, isAdmin: true });

  andThen(() => {
    const votesAmount = find(`${hook('votes-count')}:nth(6)`).text().trim();
    assert.equal(votesAmount, "5");
  });
});

test('it doesnt allow voting twice for the same challenge for given user', function(assert) {
  authAndVisit(this.application, { id: userId, isAdmin: true }, function() {
    server.create('challenge-vote', { userId, challengeId: votedChallenge.id});
  });

  andThen(() => {
    const voteBtn = find(`.js-challenge:nth(6) ${hook('revoke-vote')}`);
    assert.ok(voteBtn.length);
  });
});

test('when user voted on a challenge another click will revoke the vote', function(assert) {
  let vote;
  authAndVisit(this.application, { id: userId, isAdmin: true }, function() {
    vote = server.create('challenge-vote', { userId, challengeId: votedChallenge.id});
  });

  server.del(`/challenge_votes/${vote.id}`, () => {
    assert.ok(true, 'request was fired');
  });

  andThen(() => {
    click(`.js-challenge:nth(6) ${hook('revoke-vote')}`);
  });
});

test('when user votes/revokes vote the amount of votes gets updated', function(assert) {
  assert.expect(3);
  authAndVisit(this.application, { id: userId, isAdmin: true });

  andThen(() => {
    assert.equal(find(`${hook('votes-count')}:nth(0)`).text().trim(), '0');
    click('.js-upvote-btn:nth(0)');
  });
  andThen(() => {
    assert.equal(find(`${hook('votes-count')}:nth(0)`).text().trim(), '1');
    click(`${hook('revoke-vote')}:nth(0)`);
  });
  andThen(() => {
    assert.equal(find(`${hook('votes-count')}:nth(0)`).text().trim(), '0');
  });
});

test('when category selected a proper query param is applied', function(assert) {
  authAndVisit(this.application, { id: userId, isAdmin: true });
  const category = server.db.categories[0];

  andThen(() => {
    selectChoose('.js-category', category.title);
  });
  andThen(() => {
    const [ , categoryId ] = currentURL().split('=');
    assert.equal(
      categoryId,
      category.id
    );
    assert.equal(
      find($hook('challenge-item')).length,
      1
    );
  });
});
