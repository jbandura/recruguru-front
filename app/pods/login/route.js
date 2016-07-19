import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

const { Route, inject: { service } } = Ember;

export default Route.extend(UnauthenticatedRouteMixin, {
  flashMessages: service(),
  actions: {
    login(formData) {
      let { login, password } = formData;
      this.get('session').authenticate('authenticator:devise', login, password).then(() => {
        this.get('flashMessages').success('Logged in successfully!');
      }).catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      });
    }
  }
});
