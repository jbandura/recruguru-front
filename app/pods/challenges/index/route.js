import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { task } from 'ember-concurrency';

const {
  Route,
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return this.store.findAll('challenge');
  },

  destroyChallengeTask: task(function * (challenge) {
    yield challenge.destroyRecord();
  }),

  actions: {
    onDeleteChallenge(challenge) {
      return this.get('destroyChallengeTask').perform(challenge);
    }
  }
});
