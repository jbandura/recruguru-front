import Session from 'ember-simple-auth/services/session';
import Ember from 'ember';

const { computed, inject: { service } } = Ember;

export default Session.extend({
  store: service(),
  currentUser: computed('data.authenticated', function() {
    if(this.get('data.authenticated.currentUser')) {
      // for tests
      return Ember.Object.create(this.get('data.authenticated.currentUser'));
    }
    return Ember.Object.create(
      JSON.parse(this.get('data.authenticated.user')).user
    );
  })
});
