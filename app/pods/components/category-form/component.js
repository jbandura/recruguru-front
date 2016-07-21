import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  rules: {
    title: 'required',
    icon: 'required'
  },
  formData: {
    title: null,
    icon: null
  }
});
