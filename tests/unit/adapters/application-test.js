import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:application', 'Unit | Adapter | application');

test('it has proper namespace', function(assert) {
  let adapter = this.subject();
  assert.equal(adapter.namespace, '/api/v1');
});
