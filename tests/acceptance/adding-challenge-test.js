import { test } from 'qunit';
import moduleForAcceptance from 'recruguru-front/tests/helpers/module-for-acceptance';
import { authenticateSession, invalidateSession } from 'recruguru-front/tests/helpers/ember-simple-auth';
import { fillInBlurAcceptance } from 'recruguru-front/tests/helpers/ember-legit-forms';
import { Response } from 'ember-cli-mirage';
import Ember from 'ember';

const authAndVisit = (app) => {
  authenticateSession(app, {
    currentUser: Ember.Object.create({
      isAdmin: false
    })
  });
  visit('/challenges/new');
};

moduleForAcceptance('Acceptance | adding challenge', {
  beforeEach() {
    server.createList('category', 5);
  }
});

test('route exists', function(assert) {
  authAndVisit(this.application);

  andThen(() => {
    assert.equal(currentRouteName(), 'challenges.new');
  });
});

test('route is protected', function(assert) {
  invalidateSession(this.application);
  visit('/challenges/new');
  andThen(() => assert.equal(currentRouteName(), 'login'));
});

test('inputs are displayed', function(assert){
  authAndVisit(this.application);

  andThen(() => {
    ['.js-title', '.js-content', '.js-solution'].forEach((input) => {
      assert.ok(find(input).length, `input ${input} exists`);
    });
  });
});

test('when form submitted proper request gets fired', function(assert) {
  assert.expect(4);
  const values = {
    title: 'Title',
    content: 'Content',
    solution: 'Solution'
  };
  authAndVisit(this.application);
  server.post('/challenges', (db, request) => {
    const data = JSON.parse(request.requestBody).challenge;
    assert.equal(data.title, values.title);
    assert.equal(data.content, values.content);
    assert.equal(data.solution, values.solution);
    assert.equal(data.category_id, server.db.categories[0].id);
  });
  andThen(() => {
    fillInBlurAcceptance(`.js-title`, values.title);
    ['solution', 'content'].forEach((field) => {
      fillInBlurAcceptance(`.js-${field}`, values[field], 'textarea');
    });
    selectChoose('.js-category', server.db.categories[0].title);
    click('button[type=submit]');
  });
});

test('when form submitted it redirects to main page with flash message', function(assert) {
  const values = {
    title: 'Title',
    content: 'Content',
    solution: 'Solution'
  };
  authAndVisit(this.application);
  andThen(() => {
    fillInBlurAcceptance(`.js-title`, values.title);
    ['solution', 'content'].forEach((field) => {
      fillInBlurAcceptance(`.js-${field}`, values[field], 'textarea');
    });
    selectChoose('.js-category', server.db.categories[0].title);
    click('button[type=submit]');
  });
  andThen(() => {
    assert.equal(currentRouteName(), 'challenges.index', 'it redirects to main page');
    assert.ok(find('.alert.alert-success').length, 'flash message is displayed');
  });
});

test('when server returns an error a proper message gets displayed', function(assert) {
  const values = {
    title: 'Title',
    content: 'Content',
    solution: 'Solution'
  };
  authAndVisit(this.application);
  server.post('/challenges', () => {
    return new Response(500, {}, { errors: 'Ups.' });
  });
  andThen(() => {
    fillInBlurAcceptance(`.js-title`, values.title);
    ['solution', 'content'].forEach((field) => {
      fillInBlurAcceptance(`.js-${field}`, values[field], 'textarea');
    });
    selectChoose('.js-category', server.db.categories[0].title);
    click('button[type=submit]');
  });
  andThen(() => {
    assert.equal(currentRouteName(), 'challenges.new', 'it stays on the form page');
    assert.ok(find('.alert.alert-danger').length, 'flash message is displayed');
  });
});

