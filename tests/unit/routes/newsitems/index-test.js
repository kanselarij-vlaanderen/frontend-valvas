import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | newsitems/index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:newsitems/index');
    assert.ok(route);
  });
});
