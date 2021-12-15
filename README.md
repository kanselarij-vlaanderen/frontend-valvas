# frontend-valvas

Frontend of the Valvas application. See also [app-valvas](https://github.com/kanselarij-vlaanderen/app-valvas).

This README outlines the details of collaborating on this Ember application.
A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone https://github.com/kanselarij-vlaanderen/frontend-valvas.git` this repository
* `cd frontend-publieksontsluiting`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint`
* `npm run lint:fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

#### VO header/footer widget details

Test environment:
```
environment:
  EMBER_VO_HEADER_WIDGET_URL: "https://tni.widgets.burgerprofiel.dev-vlaanderen.be/api/v1/widget/3bcc4b26-e216-489c-8f11-cd9299f08199"
  EMBER_VO_FOOTER_WIDGET_URL: "https://tni.widgets.burgerprofiel.dev-vlaanderen.be/api/v1/widget/7eed3599-96aa-435b-bc43-fe13d2fc0531"
```

Production environment:
```
environment:
  EMBER_VO_HEADER_WIDGET_URL: "https://prod.widgets.burgerprofiel.vlaanderen.be/api/v1/widget/9e21cea6-b1a6-48fe-9322-8296c138b24b"
  EMBER_VO_FOOTER_WIDGET_URL: "https://prod.widgets.burgerprofiel.vlaanderen.be/api/v1/widget/f2907451-e337-41f2-9740-ab421226fdad"
```

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
