import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';

module(
  'Integration | Modifier | did-intersect without mocks',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      this.enterStub = () => {};
      this.exitStub = () => {};
      this.maxEnter = 1;
      this.maxExit = 1;

      this.observerManagerService = this.owner.lookup(
        'service:ember-scroll-modifiers@observer-manager',
      );
    });

    test('MEMORY: it removes elements from the registry on modifier cleanup', async function (assert) {
      for (let index = 0; index < 10; index++) {
        await render(
          hbs`<div {{did-intersect onEnter=this.enterStub onExit=this.exitStub}}>
          <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
        </div>`,
        );
      }
      let title = encodeURI(document.title);
      let response = await fetch(`/detect_memory_leak?title=${title}`);

      let json = await response.json();

      let error = json.error;
      let hasLeaks = json.leakedClasses && json.leakedClasses.length;
      let hasIgnoredLeaks =
        json.ignoredLeakedClasses && json.ignoredLeakedClasses.length;

      if (error) {
        throw new Error(error);
      }

      if (hasLeaks) {
        console[shouldFail ? 'error' : 'warn'](
          LEAKED_CLASSES +
            json.leakedClasses
              .map(([name, count]) => `${name} ${count}x`)
              .join('\n') +
            '\n',
        );

        for (const error of json.leakedClasses) {
          assert.false(
            shouldFail ? true : false,
            `${DETECTION}: ${error[0]} ${shouldFail ? '' : IGNORED}`,
          );
        }
      }

      if (hasIgnoredLeaks) {
        console.warn(
          LEAKED_IGNORED_CLASSES +
            json.ignoredLeakedClasses
              .map(([name, count]) => `${name} ${count}x ${IGNORED}`)
              .join('\n') +
            '\n',
        );

        for (const warning of json.ignoredLeakedClasses) {
          assert.false(false, `${warning[0]} ${warning[1]}x ${IGNORED}`);
        }
      }

      if (!hasLeaks && !hasIgnoredLeaks) {
        console.log(NO_DETECTION);
        assert.false(false, NO_DETECTION);
      }
      console.log(response);

      assert.ok(true);
    });
  },
);
