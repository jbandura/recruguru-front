import { moduleForModel, test } from 'ember-qunit';

moduleForModel('user', 'Unit | Model | user');

test('it exists', function(assert) {
  let model = this.subject();
  assert.ok(!!model);
});

test('#isAdmin', function(assert) {
  let model = this.subject({
    role: 'admin'
  });
  assert.ok(model.get('isAdmin'));
});

test('isAdmin returns false when not admin', function(assert) {
  let model = this.subject({
    role: 'user'
  });
  assert.notOk(model.get('isAdmin'));
});
