import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  rules: {
    login: 'required',
    password: 'required'
  },
  formData: {
    login: null,
    password: null
  }
});
