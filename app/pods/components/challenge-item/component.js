import Ember from 'ember';
import { votesCount } from 'recruguru-front/helpers/votes-count';

const {
  Component,
  computed,
  String: { w }
} = Ember;

export default Component.extend({
  classNames: w('js-challenge'),

  count: computed('votes.[]', 'challenge', function() {
    const count = votesCount([], this.getProperties('votes', 'challenge'));
    return count;
  })
});
