import { test } from 'qunit';
import moduleForAcceptance from 'recruguru-front/tests/helpers/module-for-acceptance';
import { authenticateSession } from 'recruguru-front/tests/helpers/ember-simple-auth';

let challenge;
moduleForAcceptance('Acceptance | show challenge', {
  beforeEach() {
    authenticateSession(this.application);
    challenge = server.create('challenge');
    visit(`/challenges/${challenge.id}`);
  }
});

test('route exists', function(assert) {
  assert.equal(currentRouteName(), 'challenges.show');
});

test('challlenge data is displayed', function(assert) {
  assert.equal(find('.js-title').text().trim(), challenge.title);
});

