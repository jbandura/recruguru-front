import Ember from 'ember';

const {
  get,
  set,
  computed,
  Component,
  getProperties,
} = Ember;

export default Component.extend({
  filteredChallenges: computed('selectedCategory', 'challenges.[]', function() {
    const { selectedCategory, challenges } = getProperties(this, 'selectedCategory', 'challenges');
    if(!selectedCategory || selectedCategory === 'all') { return challenges; }
    const filteredChallenges = challenges.filter((c) => {
      return get(c, 'category.id') === get(selectedCategory, 'id');
    });
    return filteredChallenges;
  }),

  actions: {
    onChange(category) {
      get(this, 'onCategoryChange')(get(category, 'id'));
    }
  }
});
