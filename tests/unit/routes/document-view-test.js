import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | document-view', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:document-view');
    assert.ok(route);
  });
});
