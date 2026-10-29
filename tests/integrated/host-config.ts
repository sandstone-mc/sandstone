/**
 * The host config the integrated test server must run with.
 *
 * `packtest: false` disables the CLI's built-in packtest mod — without
 * it, the CLI resolves the latest packtest from Modrinth (2.8.0 at the
 * time of writing) and installs it. `additionalMods` then pins the exact
 * jar the tests are written against.
 *
 * Both the test harness (`__setup.ts`) and the manual daemon launcher
 * (`scripts/test-server.ts`) must start the daemon with this config.
 * A daemon started with a different config installs a different packtest
 * jar, and the two end up side by side in `mods/` — where the higher
 * version wins, silently running the tests against the wrong mod.
 */
export const INTEGRATED_HOST_CONFIG = {
  mods: {
    packtest: false,
    additionalMods: [{
      url: 'https://github.com/sandstone-mc/packtest-mod/releases/download/2.7.0/packtest-2.7.0.jar',
    }],
  },
}
