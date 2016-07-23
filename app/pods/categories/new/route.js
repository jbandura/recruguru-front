import Ember from 'ember';
import { task } from 'ember-concurrency';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

const { Route, inject: { service } } = Ember;

export default Route.extend(AuthenticatedRouteMixin, {
  flashMessages: service(),
  session: service(),
  saveCategoryTask: task(function * (formData) {
    const category = this.store.createRecord('category', {
      title: formData.title,
      icon: formData.icon,
      userId: this.get('session.currentUser.id')
    });
    try {
      yield category.save();
      this.transitionTo('categories.index');
      this.get('flashMessages').success('Category was successfully created!');
    } catch (e) {
      this.get('flashMessages').danger('There was a problem - please try again later!');
    }
  }),
  actions: {
    createCategory(formData) {
      this.get('saveCategoryTask').perform(formData);
    }
  }
});
