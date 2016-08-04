import { votesCount } from 'recruguru-front/helpers/votes-count';
import { module, test } from 'qunit';
import Ember from 'ember';

module('Unit | Helper | votes count');

const vote = (challengeId) => {
  return Ember.Object.create({ challengeId });
};

test('it properly counts votes for given challenge', function(assert) {
  const votes = Ember.A([
    vote(5),
    vote(5),
    vote(5),
    vote(7)
  ]);
  const challenge = Ember.Object.create({
    id: 5
  });
  let result = votesCount([], { votes, challenge });
  assert.equal(result, 3);
});

test('it properly counts votes even when none', function(assert) {
  const votes = Ember.A([]);
  const challenge = Ember.Object.create({
    id: 5
  });
  let result = votesCount([], { votes, challenge });
  assert.equal(result, 0);
});

test('it returns 0 when votes undefined', function(assert) {
  const challenge = Ember.Object.create({
    id: 5
  });
  let result = votesCount([], { votes: undefined, challenge });
  assert.equal(result, 0);
});
