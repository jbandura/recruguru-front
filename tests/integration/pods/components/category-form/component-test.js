import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { fillInBlurIntegration } from 'recruguru-front/tests/helpers/ember-legit-forms';

moduleForComponent('category-form', 'Integration | Component | category form', {
  integration: true,
});

test('it validates the fields', function() {
  this.set('onSubmit', function() {});
  this.render(hbs`{{category-form onSubmit=(action onSubmit)}}`);
  fillInBlurIntegration(this, '.js-title', '');
  fillInBlurIntegration(this, '.js-icon', '');
  ok(this.$('button[type=submit]').is(':disabled'));
  ok(this.$('.js-title').hasClass('has-error'));
  ok(this.$('.js-icon').hasClass('has-error'));
  fillInBlurIntegration(this, '.js-title', 'Title');
  fillInBlurIntegration(this, '.js-icon', 'Icon');
  notOk(this.$('button[type=submit]').is(':disabled'));
  ok(this.$('.js-title').hasClass('has-success'));
  ok(this.$('.js-icon').hasClass('has-success'));
});

test('when submitted fires proper action', function(){
  expect(2);
  this.set('onSubmit', (formData) => {
    equal(formData.title, 'title');
    equal(formData.icon, 'icon');
  });
  this.render(hbs`{{category-form onSubmit=(action onSubmit)}}`);
  fillInBlurIntegration(this, '.js-title', 'title');
  fillInBlurIntegration(this, '.js-icon', 'icon');
  this.$('form').submit();
});
