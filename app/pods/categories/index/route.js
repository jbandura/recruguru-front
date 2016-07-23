import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { task } from 'ember-concurrency';

const { Route } = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  model() {
    return this.store.findAll('category');
  },

  destroyCategoryTask: task(function * (category) {
    yield category.destroyRecord();
  }),

  actions: {
    onDeleteCategory(category) {
      return this.get('destroyCategoryTask').perform(category);
    }
  }
});
