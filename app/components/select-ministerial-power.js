import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

const defaultOption = { label: 'Alle bevoegdheden' };

export default class SelectMinisterialPowerComponent extends Component {
  @service store;

  @tracked options = [defaultOption];

  constructor() {
    super(...arguments);
    this.initOptions();
    this.args.onChange(defaultOption.id);
  }

  get selected() {
    if (this.args.selectedId && this.options) {
      return this.options.find((option) => option.id === this.args.selectedId);
    } else {
      return defaultOption;
    }
  }

  async initOptions() {
    let themes = await this.store.query('concept', {
      page: { size: 1000 },
      filter: {
        'in-scheme': {
          ':exact:label': `Thema's`,
        },
      },
    });
    const options = themes
      .map((theme) => ({
        id: theme.id,
        label: theme.label,
        count: null,
      }))
      .sort((a, b) => a.label > b.label);
    this.options = [defaultOption, ...options];
  }

  @action
  onChangeOption(selected) {
    if (this.args.selectedId !== selected.id) {
      this.args.onChange(selected.id);
    }
  }
}
