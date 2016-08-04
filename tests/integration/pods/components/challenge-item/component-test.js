import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import { $hook } from 'ember-hook';

moduleForComponent('challenge-item', 'Integration | Component | challenge item', {
  integration: true,
  beforeEach() {
    this.register('service:session', Ember.Service.extend({
      currentUser: Ember.Object.create({
        isAdmin: true
      })
    }));
  }
});

test('it renders', function(assert) {
  assert.ok(true);
  const challenge = Ember.Object.create({
    id: 1
  });
  this.setProperties({
    challenge,
    votes: Ember.A([
      Ember.Object.create({
        userId: 3,
        challengeId: challenge.id
      })
    ]),
    onDeleteChallenge: function() {},
    onUpvote: function() {},
    onRevokeVote: function() {},
  });
  this.render(hbs `{{challenge-item
    challenge=challenge
    votes=votes
    onDeleteChallenge=onDeleteChallenge
    onUpvote=onUpvote
    onRevokeVote=onRevokeVote
  }}`);

  assert.ok(true);
  assert.equal($hook('votes-count').text().trim(), '1');
  this.set('votes', Ember.A([
    Ember.Object.create({
      userId: 3,
      challengeId: challenge.id
    }),
    Ember.Object.create({
      userId: 4,
      challengeId: challenge.id
    })
  ]));
  assert.equal($hook('votes-count').text().trim(), '2');
});

