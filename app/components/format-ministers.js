import Component from '@ember/component';
import { sort } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  mandateeSort: Object.freeze(['priority', 'legacyPriority']),
  sortedMandatees: sort('mandatees', 'mandateeSort')
});
