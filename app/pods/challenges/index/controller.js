import Ember from 'ember';

const {
  computed,
  Controller,
  getProperties,
} = Ember;

const { alias } = computed;

export default Controller.extend({
  queryParams: ['category'],
  category: "all",
  categories: alias('model.categories'),
  selectedCategory: computed('category', function() {
    const { category, categories } = getProperties(this, 'category', 'categories');
    return categories.findBy('id', category);
  })
});
