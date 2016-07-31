import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { task } from 'ember-concurrency';

const {
  Route,
  inject: { service }
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  flashMessages: service(),
  model() {
    return this.store.findAll('challenge');
  },

  destroyChallengeTask: task(function * (challenge) {
    try {
      yield challenge.destroyRecord();
      this.get('flashMessages').success('Challenge was successfully deleted!');
    } catch(e) {
      this.get('flashMessages').danger('There was a problem. Please try again later.');
    }
  }),

  actions: {
    onDeleteChallenge(challenge) {
      return this.get('destroyChallengeTask').perform(challenge);
    }
  }
});
