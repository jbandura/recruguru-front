import { test } from 'qunit';
import moduleForAcceptance from 'recruguru-front/tests/helpers/module-for-acceptance';
import { fillInBlurAcceptance } from 'recruguru-front/tests/helpers/ember-legit-forms';
import { Response } from 'ember-cli-mirage';
import { authenticateSession } from 'recruguru-front/tests/helpers/ember-simple-auth';
import Ember from 'ember';

let category;
const userId = 3;

moduleForAcceptance('Acceptance | editing category', {
  beforeEach() {
    authenticateSession(this.application, { user_id: userId, currentUser: Ember.Object.create({
      id: userId,
      isAdmin: false
    })});
    category = server.create('category', { userId: userId });
    visit(`/categories/${category.id}/edit`);
  }
});

test('fields get prefilled correctly', function(assert) {
    const title = find('.js-title input').val();
    const icon = find('.js-icon input').val();

    assert.equal(title, category.title);
    assert.equal(icon, category.icon);
});

test('when pressing submit proper data get sent', function(assert) {
  assert.expect(2);
  const newTitle = 'New Title';
  const newIcon = 'new-icon';
  server.put(`/categories/${category.id}`, (db, request) => {
    const newData = JSON.parse(request.requestBody).category;
    assert.equal(newData.title, newTitle);
    assert.equal(newData.icon, newIcon);
  });
  fillInBlurAcceptance('.js-title', newTitle);
  fillInBlurAcceptance('.js-icon', newIcon);
  click('button[type=submit]');
});

test('when saving fails it displays proper message', function(assert) {
  const newTitle = 'New Title';
  const newIcon = 'new-icon';
  server.put(`/categories/${category.id}`, () => {
    return new Response(500, {}, {errors: 'Ups.'});
  });
  fillInBlurAcceptance('.js-title', newTitle);
  fillInBlurAcceptance('.js-icon', newIcon);
  click('button[type=submit]');
  andThen(() => {
    assert.ok(find('.alert.alert-danger').length, 'it displays error');
  });
});

test('when saving succeeds it redirects to categories path with message', function(assert) {
  const newTitle = 'New Title';
  const newIcon = 'new-icon';
  fillInBlurAcceptance('.js-title', newTitle);
  fillInBlurAcceptance('.js-icon', newIcon);
  click('button[type=submit]');

  andThen(() => {
    assert.equal(currentRouteName(), 'categories.index', 'it redirects to categories listing');
    assert.ok(find('.alert.alert-success').length, 'it shows success message');
  });
});

test('when trying to edit category not owned by the user error is displayed', function(assert){
  const otherUserId = 5;
  const notOwnedCategory = server.create('category', { user_id: otherUserId });
  visit(`/categories/${notOwnedCategory.id}/edit`);

  andThen(() => {
    assert.equal(currentRouteName(), 'categories.index');
    assert.ok(find('.alert.alert-danger').length, 'an error message is displayed');
  });
});
