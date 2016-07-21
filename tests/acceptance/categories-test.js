import { test } from 'qunit';
import moduleForAcceptance from 'recruguru-front/tests/helpers/module-for-acceptance';
let categories;
moduleForAcceptance('Acceptance | categories', {
  beforeEach() {
    categories = server.createList('category', 5);
    visit('/categories');
  }
});

test('route exists', function(assert) {
  visit('/categories');
  andThen(() => {
    assert.equal(currentRouteName(), 'categories.index');
  });
});

test('it displays a list of categories', function(assert) {
  server.createList('category', 5);
  visit('/categories');
  andThen(() => {
    assert.equal(find('.js-category').length, 5);
  });
});

