import Session from 'ember-simple-auth/services/session';
import Ember from 'ember';

const { computed, inject: { service } } = Ember;

export default Session.extend({
  store: service(),
  currentUser: computed('data.authenticated', function() {
    if(this.get('data.authenticated.currentUser')) {
      // for tests
      return this.get('data.authenticated.currentUser');
    }
    return this.get('store').createRecord(
      'user',
      JSON.parse(this.get('data.authenticated.user'))
    );
  })
});
