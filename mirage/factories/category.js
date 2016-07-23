import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  title(i) { return `TestName ${i}`; },
  icon: 'example-icon'
});
