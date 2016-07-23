import Ember from 'ember';
import { task } from 'ember-concurrency';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { CanMixin } from 'ember-can';

const { Route, inject: { service } } = Ember;

export default Route.extend(AuthenticatedRouteMixin, CanMixin, {
  flashMessages: service(),
  model({ category_id }) {
    return this.store.find('category', category_id);
  },

  afterModel() {
    if(!this.can('edit category', { model: this.modelFor('categories/edit') })) {
      this.transitionTo('categories.index');
      this.get('flashMessages').danger('You do not have permissions to access this part of the aplication');
    }
  },

  updateCategoryTask: task(function * (model, formData) {
    model.setProperties(formData);
    try {
      yield model.save();
      this.transitionTo('categories.index');
      this.get('flashMessages').success('Changes were saved successfully!');
    } catch(e) {
      this.get('flashMessages').danger('There was a problem! Please try again later.');
    }
  }),

  actions: {
    onSubmit(formData) {
      const model = this.modelFor('categories/edit');
      return this.get('updateCategoryTask').perform(model, formData);
    }
  }
});
