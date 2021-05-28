import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

const defaultOption = { label: 'Alle ministers' };
const mededelingOption = { id: 'vr', label: 'de Vlaamse Regering' };
const historicOption = { id: 'historic', label: 'Vorige ministers' };

export default class SelectPresentedByComponent extends Component {
  @service store;

  @tracked options = [defaultOption, mededelingOption, historicOption];
  @tracked historicOptions = [];
  @tracked isEnabledHistoricOption = false;

  constructor() {
    super(...arguments);
    this.initOptions();
    this.args.onChange(defaultOption.id);
  }

  async initOptions() {
    // Obtain unique list of current mandatees
    const currentGovernmentBodyArray = await this.store.query(
      'government-body',
      {
        page: { size: 1 },
        filter: {
          ':has:start-date': true,
          ':has-no:end-date': true,
          ':has:mandatees': true,
        },
        include: 'mandatees.person',
      }
    );
    const currentGovernmentBody = currentGovernmentBodyArray.firstObject;
    const currentMandatees = currentGovernmentBody
      ? await currentGovernmentBody.mandatees
      : [];
    const currentMandateesAndPersons = await Promise.all(
      currentMandatees.map(async (mandatee) => ({
        mandatee,
        person: await mandatee.person,
      }))
    );
    let options = [];
    for await (const { mandatee, person } of currentMandateesAndPersons) {
      let option = options.find((option) => option.id === person.id);
      if (!option) {
        options.push({
          id: person.id,
          position: mandatee.position,
          firstName: person.firstName,
          lastName: person.lastName,
          label: person.fullName,
        });
      }
    }
    options = options.sort((a, b) => a.position - b.position);

    const activePersonIds = options.map((option) => option.id);
    const allPersons = await this.store.query('person', {
      page: { size: 1000 },
    });
    const inactivePersons = allPersons.filter(
      (person) => !activePersonIds.includes(person.id)
    );
    let historicOptions = inactivePersons
      .map((person) => ({
        id: person.id,
        position: null,
        firstName: person.firstName,
        lastName: person.lastName,
        label: person.fullName,
      }))
      .sort((a, b) => a.lastName > b.lastName);

    this.options = [
      defaultOption,
      ...options,
      mededelingOption,
      historicOption,
    ];
    this.historicOptions = historicOptions;
  }

  get selected() {
    if (this.isEnabledHistoricOption) {
      return historicOption;
    } else {
      let id = this.args.selectedId;
      if (id && this.options) {
        let selected = this.options.find((option) => option.id === id);
        if (!selected) {
          return historicOption;
        } else {
          return selected;
        }
      } else {
        return defaultOption;
      }
    }
  }

  get selectedHistoric() {
    let id = this.args.selectedId;
    if (this.historicOptions) {
      return this.historicOptions.find((option) => option.id === id);
    } else {
      return null;
    }
  }

  @action
  onDidUpdate(element, [id]) {
    if (!id) {
      this.isEnabledHistoricOption = false;
    }
  }

  @action
  async onChangeOption(selected) {
    if (
      selected &&
      selected.id !== 'historic' &&
      this.args.selectedId !== selected.id
    ) {
      this.args.onChange(selected.id, selected.firstName, selected.lastName);
      this.isEnabledHistoricOption = false;
    } else if (selected && selected.id === 'historic') {
      this.isEnabledHistoricOption = true;
    }
  }

  @action
  async onChangeHistoricOption(selected) {
    if (selected && this.selectedId !== selected.id) {
      this.args.onChange(selected.id, selected.firstName, selected.lastName);
    }
  }
}
