import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('index', { path: '/' });
  this.route('login');
  this.route('categories', function() {
    this.route('index', { path: '/' });
    this.route('new');
    this.route('edit', { path: ':category_id/edit'});
  });
});

export default Router;
