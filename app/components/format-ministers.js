import Component from '@glimmer/component';

export default class FormatMinistersComponent extends Component {
  get sortedMandatees() {
    if (Array.isArray(this.args.mandatees)) {
      return this.args.mandatees.sort((a, b) => {
        let pos_a = a.position || a.legacyPosition;
        let pos_b = b.position || b.legacyPosition;
        return pos_a - pos_b;
      });
    } else {
      return [];
    }
  }
}
