import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import Ember from 'ember';

const { computed } = Ember;

export default Model.extend({
  role: attr('string'),

  isAdmin: computed('role', function() {
    return this.get('role') === 'admin';
  })
});
