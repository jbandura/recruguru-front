import Ember from 'ember';

const { Component, String: { w } } = Ember;

export default Component.extend({
  formData: {
    title: '',
    content: '',
    challenge: '',
    category: null
  },
  rules: {
    sharedValidations: {
      required: w('title content solution')
    }
  }
});
