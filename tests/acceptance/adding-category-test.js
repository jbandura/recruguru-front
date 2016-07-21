import { test } from 'qunit';
import { Response } from 'ember-cli-mirage';
import moduleForAcceptance from 'recruguru-front/tests/helpers/module-for-acceptance';
import { fillInBlurAcceptance } from 'recruguru-front/tests/helpers/ember-legit-forms';
import { authenticateSession } from 'recruguru-front/tests/helpers/ember-simple-auth';

const userId = 1;

moduleForAcceptance('Acceptance | adding a category', {
  beforeEach() {
    authenticateSession(this.application, { user_id: userId});
  }
});

test('going to add category page', function() {
  visit('/categories');
  andThen(() => click('.js-add-category'));
  andThen(() => {
    equal(currentRouteName(), 'categories.new');
  });
});

test('adding a new category', function() {
  expect(5);
  visit('/categories/new');
  server.post('/categories', (db, request) => {
    const category = JSON.parse(request.requestBody).category;
    equal(category.title, 'Category!');
    equal(category.icon, 'php');
    equal(category.user_id, userId);
  });
  andThen(() => {
    fillInBlurAcceptance('.js-title', 'Category!');
    fillInBlurAcceptance('.js-icon', 'php');
    click('button[type=submit]');
  });
  andThen(() => {
    equal(currentRouteName(), 'categories.index', 'it redirects after successful creation');
    ok(find('.alert.alert-success').length, 'it shows a success message');
  });
});

test('when error happens proper message is displayed', function() {
  visit('/categories/new');
  server.post('/categories', () => {
    return new Response(500, {}, { errors: 'Example error' });
  });
  andThen(() => {
    fillInBlurAcceptance('.js-title', 'Category!');
    fillInBlurAcceptance('.js-icon', 'php');
    click('button[type=submit]');
  });
  andThen(() => {
    ok(find('.alert.alert-danger').length, 'it shows a error message');
  });
});
