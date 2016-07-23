import Ember from 'ember';
import ENV from 'recruguru-front/config/environment';

const { Component, computed } = Ember;

export default Component.extend({
  isTesting: computed(function() {
    return ENV.environment === 'test';
  }),
  actions: {
    onDeleteCategory(category) {
      this.get('onDeleteCategory')(category);
    }
  }
});
