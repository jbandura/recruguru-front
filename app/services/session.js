import Session from 'ember-simple-auth/services/session';
import Ember from 'ember';

const { computed } = Ember;

export default Session.extend({
  currentUser: computed('data.authenticated', function() {
    if(this.get('data.authenticated.currentUser')) {
      // for tests
      return this.get('data.authenticated.currentUser');
    }
    return Ember.Object.create(JSON.parse(this.get('data.authenticated.user')));
  })
});
