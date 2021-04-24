import Component from '@ember/component';
import { computed } from '@ember/object';

export default class FormatMinistersComponent extends Component {
  tagName = '';

  @computed('mandatees')
  get sortedMandatees() {
    if (!!this.mandatees) {
      return this.mandatees.sort((a, b) => {
        let pos_a = a.position || a.legacyPosition;
        let pos_b = b.position || b.legacyPosition;
        return pos_a - pos_b;
      });
    } else {
      return [];
    }
  }
}
