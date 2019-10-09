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
  firstNames: computed('searchResult.mandateeFirstNames', function() {
    const names = this.searchResult.mandateeFirstNames;
    return isArray(names) ? names : [names];
  }),
  familyNames: computed('searchResult.mandateeFamilyNames', function() {
    const names = this.searchResult.mandateeFamilyNames;
    return isArray(names) ? names : [names];
  }),
  mandatees: computed('titles', 'firstNames', 'familyNames', function() {
    const mandatees = A();
    for (let i = 0; i < this.familyNames.length; i++) {
      const title = formatMinisterTitle(this.titles[i]);
      const mandatee = EmberObject.create({
        title,
        name: `${this.firstNames[i]} ${this.familyNames[i]}`,
        priority: title == 'minister-president' ? 2 : 1
      });
      mandatees.pushObject(mandatee);
    }
    return mandatees;
  }),
  mandateeSort: Object.freeze(['priority:desc', 'name']),
  sortedMandatees: sort('mandatees', 'mandateeSort')
});
