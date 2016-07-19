import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { fillInBlurIntegration } from 'recruguru-front/tests/helpers/ember-legit-forms';

const setup = (context, action) => {
  context.setProperties({
    onSubmit: action || function() {}
  });
  context.render(hbs`{{login-form onSubmit=(action onSubmit)}}`);
  return {
    $loginInput: context.$('.js-login input'),
    $passwordInput: context.$('.js-password input'),
    $submitInput: context.$('button[type=submit]')
  };
};

moduleForComponent('login-form', 'Integration | Component | login form', {
  integration: true
});

test('it renders', function(assert) {
  const { $loginInput, $passwordInput } = setup(this);
  assert.equal($loginInput.length, 1);
  assert.equal($passwordInput.length, 1);
});

test('when button clicked proper action gets fired', function(assert) {
  assert.expect(2);
  const onSubmit = (formData) => {
    assert.equal(formData.login, 'johndoe@example.com');
    assert.equal(formData.password, 'secretPassword');
  };
  setup(this, onSubmit);
  fillInBlurIntegration(this, '.js-login', 'johndoe@example.com');
  fillInBlurIntegration(this, '.js-password', 'secretPassword');
  this.$('form').trigger('submit');
});

test('it shows error if any of the fields blank', function(assert) {
  setup(this);
  fillInBlurIntegration(this, '.js-login', '');
  fillInBlurIntegration(this, '.js-password', '');
  assert.ok(this.$('.js-login').hasClass('has-error'), 'it shows error for login (blank)');
  assert.ok(this.$('.js-password').hasClass('has-error'), 'it shows error for password (blank)');
  fillInBlurIntegration(this, '.js-login', 'johnasdasd');
  assert.ok(
    this.$('.js-login').hasClass('has-error'),
    'it shows error for login (not email)'
  );
  fillInBlurIntegration(this, '.js-login', 'john@example.com');
  assert.notOk(
    this.$('.js-login').hasClass('has-error'),
    'it shows no errors when login field filled in correctly'
  );
  fillInBlurIntegration(this, '.js-password', 'foo');
  assert.ok(this.$('.js-password').hasClass('has-error'), 'it shows error when password shorter than 8 characters');
  fillInBlurIntegration(this, '.js-password', 'foobarbaz');
  assert.notOk(this.$('.js-password').hasClass('has-error'), 'it shows no errors when password form filled in correctly');
  assert.notOk(
    this.$('button[type=submit]').is(':disabled'),
    'if the form is properly filled in the submit btn is enabled'
  );
});
