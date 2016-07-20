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
        const msg = reason ? reason.errors : 'There was a problem while logging in';
        this.get('flashMessages').danger(msg);
      });
    }
  }
});
