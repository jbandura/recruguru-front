import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  rules: {
    login: 'required|email',
    password: 'required|min(8)'
  },
  formData: {
    login: null,
    password: null
  }
});
