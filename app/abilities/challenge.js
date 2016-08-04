import ApplicationBaseAbility from 'recruguru-front/abilities/application-base';
import Ember from 'ember';

const { computed } = Ember;

export default ApplicationBaseAbility.extend({
  canVote: computed('session.currentUser', 'votes.[]', function() {
    const user = this.get('session.currentUser');
    const votes = this.get('votes');
    const challenge = this.get('model');
    const userVoted = votes.any((vote) => {
      return parseInt(vote.get('challengeId')) === parseInt(challenge.get('id')) &&
        parseInt(vote.get('userId')) === parseInt(user.id);
    });
    return !userVoted;
  })
});
