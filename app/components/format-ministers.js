import Component from '@ember/component';
import EmberObject, { computed } from '@ember/object';
import { A, isArray } from '@ember/array';
import { sort } from '@ember/object/computed';

const regexVlaamseMinister = /^(VM van).*/i;
const regexMinisterPresident = /^(Minister-president).*/i;

const formatMinisterTitle = function(title) {
  let fmtTitle = title || '';
  if (regexVlaamseMinister.test(fmtTitle))
    return 'minister';
  else if (regexMinisterPresident.test(fmtTitle))
    return 'minister-president';
  else
    return fmtTitle;
};

export default Component.extend({
  tagName: '',

  titles: computed('searchResult.mandateeTitles', function() {
    const titles = this.searchResult.mandateeTitles;
    return isArray(titles) ? titles : [titles];
  }),
  names: computed('searchResult.mandateeNames', function() {
    const names = this.searchResult.mandateeNames;
    return isArray(names) ? names : [names];
  }),
  mandatees: computed('titles', 'names', function() {
    const mandatees = A();
    for (let i = 0; i < this.names.length; i++) {
      const title = formatMinisterTitle(this.titles[i]);
      const mandatee = EmberObject.create({
        title,
        name: this.names[i],
        priority: title == 'minister-president' ? 2 : 1
      });
      mandatees.pushObject(mandatee);
    }
    return mandatees;
  }),
  mandateeSort: Object.freeze(['priority:desc', 'name']),
  sortedMandatees: sort('mandatees', 'mandateeSort')
});
