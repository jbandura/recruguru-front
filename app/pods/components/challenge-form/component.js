import Ember from 'ember';

const { Component, String: { w } } = Ember;

export default Component.extend({
  formData: {
    title: '',
    content: '',
    challenge: ''
  },
  rules: {
    sharedValidations: {
      required: w('title content solution')
    }
  }
});
