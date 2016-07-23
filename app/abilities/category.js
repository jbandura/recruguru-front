import { Ability } from 'ember-can';
import Ember from 'ember';

const { computed, inject: { service } } = Ember;

export default Ability.extend({
  session: service(),
  canEdit: computed('session.currentUser', function() {
    const user = this.get('session.currentUser');
    return user.isAdmin || user.id === this.get('model.userId');
  }),

  canDelete: computed('session.currentUser', function() {
    const user = this.get('session.currentUser');
    return user.isAdmin;
  })
});
