import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('ability:challenge', 'Unit | Ability | challenge');

const setupModel = (id) => {
  return Ember.Object.create({ id });
};

const setupVotes = (attributes) => {
  return Ember.A(attributes.map((attr) => {
    return Ember.Object.create(attr);
  }));
};

const currentUser = Ember.Object.create({
  id: 1
});

test('doesnt allow for voting if user voted already', function(assert) {
  const ability = this.subject();
  const model = setupModel(1);

  ability.setProperties({
    model,
    session: { currentUser },
    votes: setupVotes([{
      userId: currentUser.get('id'),
      challengeId: model.get('id')
    }])
  });
  assert.notOk(ability.get('canVote'));
});

test('allows voting if user didnt yet vote', function(assert) {
  const ability = this.subject();
  const model = setupModel(1);

  ability.setProperties({
    model,
    session: { currentUser },
    votes: setupVotes([])
  });
  assert.ok(ability.get('canVote'));
});

test('reacts to change when votes aggregate gets changed', function(assert) {
  const ability = this.subject();
  const model = setupModel(1);

  ability.setProperties({
    model,
    session: { currentUser },
    votes: setupVotes([])
  });
  assert.ok(ability.get('canVote'));
  ability.get('votes').pushObject(Ember.Object.create({
      userId: currentUser.get('id'),
      challengeId: model.get('id')
  }));
  assert.notOk(ability.get('canVote'));
});

