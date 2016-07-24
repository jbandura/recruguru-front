import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('challenge-list', 'Integration | Component | challenge list', {
  integration: true
});

test('it renders', function(assert) {
  this.set('model', Ember.A([
    Ember.Object.create({
      title: 'Example'
    })
  ]));
  this.render(hbs`{{challenge-list challenges=model}}`);
  assert.equal(
    this.$('.js-challenge:nth(0) .js-title').text().trim(),
    'Example',
    'it shows challenge title'
  );
});
