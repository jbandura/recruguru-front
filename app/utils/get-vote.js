export function getVote(challenge, votes, user) {
  const userId = user.get('id');
  const challengeId = challenge.get('id');

  return votes.find((vote) => {
    return parseInt(vote.get('challengeId')) === parseInt(challengeId) &&
      parseInt(vote.get('userId')) === parseInt(userId);
  });
}
