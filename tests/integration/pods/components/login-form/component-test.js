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

