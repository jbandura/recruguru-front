import { getVote } from 'recruguru-front/utils/get-vote';
import { module, test } from 'qunit';
import Ember from 'ember';

module('Unit | Utils | get vote');

const user = Ember.Object.create({ id: 1 });

test('it works', function(assert) {
  const challenge = Ember.Object.create({ id: 1 });
  const votes = Ember.A([
    Ember.Object.create({ challengeId: 1, userId: user.get('id')}),
    Ember.Object.create({ challengeId: 1, userId: 2})
  ]);
  const result = getVote(challenge, votes, user);
  const expected = votes[0];
  assert.equal(result, expected);
});
