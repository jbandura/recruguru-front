import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  title(i) { return `Title ${i}`; },
  content(i) { return `Content ${i}`; },
  solution(i) { return `Solution ${i}`; },
  userId: 5
});
