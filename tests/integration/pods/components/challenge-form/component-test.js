import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import {
  fillInBlurIntegration,
  fillInTextareaIntegration
} from 'recruguru-front/tests/helpers/ember-legit-forms';

const validateRequired = (context, assert, fieldSelector, type = 'input') => {
  context.render(hbs `{{challenge-form onSubmit=(action onSubmit)}}`);
  fillInBlurIntegration(context, fieldSelector, '', type);
  assert.ok(context.$(fieldSelector).hasClass('has-error'), `${fieldSelector} should have error class`);
  fillInBlurIntegration(context, fieldSelector, 'Content', type);
  assert.notOk(context.$(fieldSelector).hasClass('has-error'), `${fieldSelector} should not have error class`);
};

moduleForComponent('challenge-form', 'Integration | Component | challenge form', {
  integration: true,
  beforeEach() {
    this.set('onSubmit', function() {});
  }
});

test('it shows markdown preview for content', function(assert) {
  this.render(hbs `{{challenge-form onSubmit=(action onSubmit)}}`);
  fillInTextareaIntegration(this, '.js-content', `# Title`);
  const htmlPreview = this.$('.js-content-preview').html().trim();
  assert.equal(htmlPreview, '<h1>Title</h1>');
});

test('it shows markdown preview for solution', function(assert) {
  this.render(hbs `{{challenge-form onSubmit=(action onSubmit)}}`);
  fillInTextareaIntegration(this, '.js-solution', `# Title`);
  const htmlPreview = this.$('.js-solution-preview').html().trim();
  assert.equal(htmlPreview, '<h1>Title</h1>');
});

test('it validates title input', function(assert) {
  this.render(hbs `{{challenge-form onSubmit=(action onSubmit)}}`);
  fillInBlurIntegration(this, '.js-title', '');
  assert.ok(this.$('.js-title').hasClass('has-error'));
  fillInBlurIntegration(this, '.js-title', 'Title');
  assert.notOk(this.$('.js-title').hasClass('has-error'));
});

test('it validates title input', function(assert) {
  validateRequired(this, assert, '.js-title');
});

test('it validates content input', function(assert) {
  validateRequired(this, assert, '.js-content', 'textarea');
});

test('it validates solution input', function(assert) {
  validateRequired(this, assert, '.js-solution', 'textarea');
});

test('it enables submit when all fields valid', function(assert) {
  this.render(hbs `{{challenge-form onSubmit=(action onSubmit)}}`);
  fillInBlurIntegration(this, '.js-title', '');
  fillInBlurIntegration(this, '.js-content', '', 'textarea');
  fillInBlurIntegration(this, '.js-solution', '', 'textarea');
  assert.ok(this.$('button[type=submit]').is(':disabled'), 'button should be disabled');
  fillInBlurIntegration(this, '.js-title', 'Title');
  fillInBlurIntegration(this, '.js-content', 'Content', 'textarea');
  fillInBlurIntegration(this, '.js-solution', 'Solution', 'textarea');
  assert.notOk(this.$('button[type=submit]').is(':disabled'), 'button should not be disabled');
});

test('when button clicked proper action gets fired', function(assert) {
  assert.expect(3);
  const title = 'Title';
  const content = 'content';
  const solution = 'solution';
  this.set('onSubmit', (formData) => {
    assert.equal(formData.title, title);
    assert.equal(formData.content, content);
    assert.equal(formData.solution, solution);
  });

  this.render(hbs `{{challenge-form onSubmit=(action onSubmit)}}`);
  fillInBlurIntegration(this, '.js-title', title);
  fillInBlurIntegration(this, '.js-content', content, 'textarea');
  fillInBlurIntegration(this, '.js-solution', solution, 'textarea');
  this.$('form').submit();
});
