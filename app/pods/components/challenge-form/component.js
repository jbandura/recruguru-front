import Ember from 'ember';

const {
  Component,
  computed,
  String: { w }
} = Ember;

export default Component.extend({
  challenge: null, //passed in
  formData: computed('challenge', function() {
    const challenge = this.get('challenge');
    if(!challenge) {
      return {
        title: '',
        content: '',
        challenge: '',
        category: null
      };
    }
    return challenge.getProperties(w('title content solution challenge category'));
  }),

  rules: {
    sharedValidations: {
      required: w('category title content solution')
    }
  }
});
