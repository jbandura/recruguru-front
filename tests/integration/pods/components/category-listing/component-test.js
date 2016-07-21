import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('category-listing', 'Integration | Component | category listing', {
  integration: true
});

test('it renders', function() {
  this.render(hbs `{{category-listing}}`);
  ok(true);
});
