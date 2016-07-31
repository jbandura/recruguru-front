import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { CanMixin } from 'ember-can';
import { task } from 'ember-concurrency';

const {
  Route,
  inject: { service },
  RSVP: { hash }
} = Ember;

export default Route.extend(AuthenticatedRouteMixin, CanMixin, {
  flashMessages: service(),
  model({ challenge_id }) {
    return hash({
      challenge: this.store.find('challenge', challenge_id),
      categories: this.store.findAll('category')
    });
  },

  afterModel() {
    if(!this.can('edit challenge', { model: this.modelFor('challenges/edit').challenge })) {
      this.transitionTo('challenges.index');
      this.get('flashMessages').danger('You do not have permissions to access this part of the aplication');
    }
  },

  updateChallengeTask: task(function * (challenge, formData){
    challenge.setProperties(formData);
    try {
      yield challenge.save();
      this.transitionTo('challenges.index');
      this.get('flashMessages').success('Changes were successfully saved!');
    } catch(e) {
      this.get('flashMessages').danger('There was an error. Please try again later.');
    }
  }),

  actions: {
    updateChallenge(formData) {
      const { challenge } = this.modelFor('challenges/edit');
      return this.get('updateChallengeTask').perform(challenge, formData);
    }
  }
});
