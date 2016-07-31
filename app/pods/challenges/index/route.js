import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { task } from 'ember-concurrency';

const {
  Route,
  RSVP: { hash },
  inject: { service }
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  flashMessages: service(),
  session: service(),
  model() {
    return hash({
      challenges: this.store.findAll('challenge'),
      votes: this.store.findAll('challenge-vote')
    });
  },

  destroyChallengeTask: task(function * (challenge) {
    try {
      yield challenge.destroyRecord();
      this.get('flashMessages').success('Challenge was successfully deleted!');
    } catch(e) {
      this.get('flashMessages').danger('There was a problem. Please try again later.');
    }
  }),

  upvoteChallengeTask: task(function * (challengeId) {
    const userId = this.get('session.currentUser.id');
    const vote = this.store.createRecord('challenge-vote', { challengeId, userId });
    yield vote.save();
  }),

  actions: {
    onDeleteChallenge(challenge) {
      return this.get('destroyChallengeTask').perform(challenge);
    },

    onUpvoteChallenge(challenge) {
      return this.get('upvoteChallengeTask').perform(challenge.get('id'));
    }
  }
});
