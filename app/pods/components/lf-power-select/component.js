import Ember from 'ember';
import LFInputMixin from 'ember-legit-forms/mixins/lf-input-mixin';

const { Component, isNone } = Ember;

export default Component.extend(LFInputMixin, {
  focusOut() {
    this.set('_edited', true);
    let value = isNone(this.get('_value')) ? this.get('property') : this.get('_value');
    this.validateField(value);
    this.showValidationState();
  },

  actions: {
    onChange(value) {
      this.set('_value', value);
      this.callUpdateHook(value);
      this.validateField(value);
      if (this.get('_edited')) {
        this.showValidationState();
      }
    }
  }
});
