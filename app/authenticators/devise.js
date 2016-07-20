import DeviseAuthenticator from 'ember-simple-auth/authenticators/devise';

export default DeviseAuthenticator.extend({
  serverTokenEndpoint: '/api/v1/sessions',
});
