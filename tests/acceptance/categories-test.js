import { test } from 'qunit';
import moduleForAcceptance from 'recruguru-front/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'recruguru-front/tests/helpers/ember-simple-auth';
import Ember from 'ember';

let categories;
const userId = 3;

moduleForAcceptance('Acceptance | categories', {
  beforeEach() {
    authenticateSession(this.application, { currentUser: Ember.Object.create({
      id: userId,
      isAdmin: false
    })});
    categories = server.createList('category', 5, { userId: 5 });
    server.create('category', { userId });
    visit('/categories');
  }
});

test('route exists', function(assert) {
  assert.equal(currentRouteName(), 'categories.index');
});

test('it displays a list of categories', function(assert) {
  assert.equal(find('.js-category').length, 6);
});

test('clicking on edit category takes me to edit route', function(assert) {
  click('.js-category:nth(5) .js-edit-btn');
  andThen(() => {
    assert.equal(currentRouteName(), 'categories.edit');
  });
});

test('edit button is shown only for the owned resources', function(assert) {
  assert.notOk(find('.js-category:nth(3) .js-edit-btn').length);
  assert.ok(find('.js-category:nth(5) .js-edit-btn').length);
});

