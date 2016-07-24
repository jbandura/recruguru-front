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

  this.route('challenges', function() {
    this.route('index', { path: '/' });
    this.route('show', { path: ':challenge_id' });
    this.route('new');
  });
});

export default Router;
