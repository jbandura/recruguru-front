import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('category-view', 'Integration | Component | category view', {
  integration: true
});

test('it shows title', function(assert) {
  this.set('model', Ember.Object.create({
    title: 'Title'
  }));
  this.render(hbs `{{challenge-view
    challenge=model
  }}`);

  assert.equal(this.$('.js-title').text().trim(), 'Title');
});

test('it shows content as markdown', function(assert) {
  this.set('model', Ember.Object.create({
    content: '# Content'
  }));
  this.render(hbs `{{challenge-view
    challenge=model
  }}`);

  assert.equal(this.$('.js-content').html().trim(), '<h1>Content</h1>');
});

test('it shows solution as markdown', function(assert) {
  this.set('model', Ember.Object.create({
    solution: '# Solution'
  }));
  this.render(hbs `{{challenge-view
    challenge=model
  }}`);

  assert.equal(this.$('.js-solution').html().trim(), '<h1>Solution</h1>');
});
