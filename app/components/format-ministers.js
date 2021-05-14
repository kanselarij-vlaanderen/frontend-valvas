import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';

export default class FormatMinistersComponent extends Component {
  tagName = '';
  @tracked mandatees;

  get sortedMandatees() {
    if (this.mandatees) {
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
