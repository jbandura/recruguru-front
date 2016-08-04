import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('ability:application-base', 'Unit | Ability | application-base');

test('it allows editing for the author', function(assert) {
  const ability = this.subject();
  ability.setProperties({
    model: Ember.Object.create({ userId: 3 }),
    session: {
      currentUser: Ember.Object.create({ id: 3, isAdmin: false })
    }
  });
  assert.ok(ability.get('canEdit'));
});

test('it doesnt allow editing for other users', function(assert) {
  const ability = this.subject();
  ability.setProperties({
    model: Ember.Object.create({ userId: 3 }),
    session: {
      currentUser: Ember.Object.create({ id: 5, isAdmin: false })
    }
  });
  assert.notOk(ability.get('canEdit'));
});

test('it allows editing of others items if youre admin', function(assert) {
  const ability = this.subject();
  ability.setProperties({
    model: Ember.Object.create({ userId: 3 }),
    session: {
      currentUser: Ember.Object.create({ id: 5, isAdmin: true })
    }
  });
  assert.ok(ability.get('canEdit'));
});

test('it allows deleting of items only for admins', function(assert) {
  const ability = this.subject();
  ability.setProperties({
    model: Ember.Object.create({ userId: 3 }),
    session: {
      currentUser: Ember.Object.create({ id: 5, isAdmin: true })
    }
  });
  assert.ok(ability.get('canDelete'), 'as admin I can delete category');
  ability.setProperties({
    model: Ember.Object.create({ userId: 3 }),
    session: {
      currentUser: Ember.Object.create({ id: 3, isAdmin: false })
    }
  });
  assert.notOk(ability.get('canDelete'), 'as non admin I cannot delete category');
});
