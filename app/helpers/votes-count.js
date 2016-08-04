import Ember from 'ember';

export function votesCount(params, { votes, challenge }) {
  if(!votes) { return 0; }
  return votes.filter((vote) => {
    return parseInt(vote.get("challengeId")) === parseInt(challenge.get('id'));
  }).length;
}

export default Ember.Helper.helper(votesCount);
