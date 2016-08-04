import { test } from 'qunit';
import moduleForAcceptance from 'recruguru-front/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'recruguru-front/tests/helpers/ember-simple-auth';
import { fillInBlurAcceptance } from 'recruguru-front/tests/helpers/ember-legit-forms';
import Ember from 'ember';
import { Response } from 'ember-cli-mirage';

const authWithUser = (app, data) => {
  authenticateSession(app, { currentUser: Ember.Object.create(data) });
};

const visitEditChallengeAndThen = (callback) => {
  const category = server.create('category');
  const challenge = server.create('challenge', {
    category_id: category.id,
    content: '# Content',
    solution: '# Solution'
  });
  visit(`/challenges/${challenge.id}/edit`);

  andThen(() => callback());
};

moduleForAcceptance('Acceptance | editing challenge');

test('when accessing route by not logged in users I get redirected to login page', function(assert) {
  const challenge = server.create('challenge');
  visit(`/challenges/${challenge.id}/edit`);

  andThen(() => assert.equal(currentRouteName(), 'login'));
});

test('when accessing route without being admin or owner I get redirected to loging page', function(assert) {
  const userId = 3;
  const challenge = server.create('challenge', { userId: 5 });
  authWithUser(this.application, { id: userId, isAdmin: false });
  visit(`/challenges/${challenge.id}/edit`);

  andThen(() => assert.equal(currentRouteName(), 'challenges.index'));
});

test('route exists', function(assert) {
  authWithUser(this.application, { isAdmin: true });
  visitEditChallengeAndThen(function() {
    assert.equal(currentRouteName(), 'challenges.edit');
  });
});

test('fields get prefilled correctly', function(assert) {
  authWithUser(this.application, { isAdmin: true });
  visitEditChallengeAndThen(function() {
    const challenge = server.db.challenges[0];
    const title = find('.js-title input').val();
    const content = find('.js-content textarea').val();
    const solution = find('.js-solution textarea').val();
    const category = find('.ember-power-select-selected-item').text().trim();

    assert.equal(title, challenge.title);
    assert.equal(content, challenge.content);
    assert.equal(solution, challenge.solution);
    assert.equal(category, server.db.categories[0].title);
  });
});

test('markdown previews are displayed properly', function(assert) {
  authWithUser(this.application, { isAdmin: true });
  visitEditChallengeAndThen(function() {
    const contentPreview = find('.js-content-preview').html();
    const solutionPreview = find('.js-solution-preview').html();

    assert.equal(contentPreview.trim(), '<h1>Content</h1>');
    assert.equal(solutionPreview.trim(), '<h1>Solution</h1>');
  });
});

test('when clicking on submit proper request gets sent', function(assert) {
  assert.expect(4);
  const values = {
    title: 'New Title',
    content: 'New Content',
    solution: 'New Solution'
  };
  const category = server.create('category');
  server.create('category', { title: 'New Category '});
  const challenge = server.create('challenge', { category_id: category.id});
  server.put(`/challenges/${challenge.id}`, (db, request) => {
    const data = JSON.parse(request.requestBody).challenge;
    assert.equal(data.title, values.title);
    assert.equal(data.content, values.content);
    assert.equal(data.solution, values.solution);
    assert.equal(data.category_id, server.db.categories[1].id);
  });
  authWithUser(this.application, { isAdmin: true });
  visit(`/challenges/${challenge.id}/edit`);

  andThen(() => {
    fillInBlurAcceptance(`.js-title`, values.title);
    ['solution', 'content'].forEach((field) => {
      fillInBlurAcceptance(`.js-${field}`, values[field], 'textarea');
    });
    selectChoose('.js-category', server.db.categories[1].title);
    click('button[type=submit]');
  });
});

test('after successful save it redirects to index page with flash message', function(assert) {
  assert.expect(2);
  const values = {
    title: 'New Title',
    content: 'New Content',
    solution: 'New Solution'
  };
  const category = server.create('category');
  server.create('category', { title: 'New Category '});
  const challenge = server.create('challenge', { category_id: category.id});
  authWithUser(this.application, { isAdmin: true });
  visit(`/challenges/${challenge.id}/edit`);

  andThen(() => {
    fillInBlurAcceptance(`.js-title`, values.title);
    ['solution', 'content'].forEach((field) => {
      fillInBlurAcceptance(`.js-${field}`, values[field], 'textarea');
    });
    selectChoose('.js-category', server.db.categories[1].title);
    click('button[type=submit]');
  });

  andThen(() => {
    assert.equal(currentRouteName(), 'challenges.index');
    assert.ok(find('.alert.alert-success').length);
  });
});

test('when error occurs it shows error message', function(assert) {
  assert.expect(2);
  const values = {
    title: 'New Title',
    content: 'New Content',
    solution: 'New Solution'
  };
  const category = server.create('category');
  server.create('category', { title: 'New Category '});
  const challenge = server.create('challenge', { category_id: category.id});
  authWithUser(this.application, { isAdmin: true });
  server.put(`/challenges/${challenge.id}`, () => {
    return new Response(500, {}, { errors: 'ups.' });
  });
  visit(`/challenges/${challenge.id}/edit`);

  andThen(() => {
    fillInBlurAcceptance(`.js-title`, values.title);
    ['solution', 'content'].forEach((field) => {
      fillInBlurAcceptance(`.js-${field}`, values[field], 'textarea');
    });
    selectChoose('.js-category', server.db.categories[1].title);
    click('button[type=submit]');
  });

  andThen(() => {
    assert.equal(currentRouteName(), 'challenges.edit');
    assert.ok(find('.alert.alert-danger').length);
  });
});

