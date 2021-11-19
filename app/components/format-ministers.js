import Component from '@glimmer/component';

export default class FormatMinistersComponent extends Component {
  get sortedMandatees() {
    if (Array.isArray(this.args.mandatees)) {
      return this.args.mandatees.sort((a, b) => {
        return a.position - b.position;
      });
    } else {
      return [];
    }
  }
}
