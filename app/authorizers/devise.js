import DeviseAuthorizer from 'ember-simple-auth/authorizers/devise';
import Ember from 'ember';

const { isEmpty } = Ember;

export default DeviseAuthorizer.extend({
  authorize(data, block) {
    const tokenAttributeName = this.get('tokenAttributeName');
    const userToken          = data[tokenAttributeName];

    if (!isEmpty(userToken)) {
      block('Authorization', `Token ${userToken}`);
    }
  }
});
