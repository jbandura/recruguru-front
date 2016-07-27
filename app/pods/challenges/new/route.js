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
  model() {
    return hash({
      categories: this.store.findAll('category')
    });
  },
  saveChallengeTask: task(function * (formData) {
    const challenge = this.store.createRecord('challenge', formData);
    try {
      yield challenge.save();
      this.transitionTo('challenges.index');
      this.get('flashMessages').success('Challenge was succesfully created');
    } catch(e) {
      this.get('flashMessages').danger('There was a problem. Please try again later.');
    }
  }),

  actions: {
    onSubmit(formData) {
      this.get('saveChallengeTask').perform(formData);
    }
  }
});
