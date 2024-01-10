# @firebase/auth

This is the Firebase Authentication component of the Firebase JS SDK.

**This package is not intended for direct usage, and should only be used via the officially supported [firebase](https://www.npmjs.com/package/firebase) package.**

## Testing

The modular Auth SDK has both unit tests and integration tests, along with a
host of npm scripts to run these tests. The most important commands are:

| Command | Description |
| ------- | ----------- |
| `yarn test` | This will run lint, unit tests, and integration tests against the live environment|
| `yarn test:<platform>` | Runs all browser tests, unit and integration |
| `yarn test:<platform>:unit` | Runs only \<platform> unit tests |
| `yarn test:<platform>:unit:debug` | Runs \<platform> unit tests, auto-watching for file system changes |
| `yarn test:<platform>:integration` | Runs only integration tests against the live environment |
| `yarn test:<platform>:integration:local` | Runs all headless \<platform> integration tests against the emulator (more below) |
| `yarn test:browser:integration:prodbackend` | Runs TOTP MFA integration tests against the backend (more below) |

Where \<platform> is "browser" or "node". There are also cordova tests, but they
are not broken into such granular details. Check out `package.json` for more.

### Integration testing with the emulator

To test against the emulator, set up the Auth emulator
([instructions](https://firebase.google.com/docs/emulator-suite/connect_and_prototype)).
The easiest way to run these tests is to use the `firebase emulators:exec`
command
([documentation](https://firebase.google.com/docs/emulator-suite/install_and_configure#startup)).
You can also manually start the emulator separately, and then point the tests
to it by setting the `GCLOUD_PROJECT` and `FIREBASE_AUTH_EMULATOR_HOST`
environmental variables. In addition to the commands listed above, the below
commands also run various tests:

  * `yarn test:integration:local` — Executes Node and browser emulator
    integration tests, as well as the Selenium WebDriver tests
  
  * `yarn test:webdriver` — Executes only the Selenium WebDriver
    integration tests

Note - The webdriver tests require the Chrome webdriver to match the version of Chrome running locally.
In the CI environment, this is ensured using the environment variable [here.](https://github.com/firebase/firebase-js-sdk/blob/6e80a678fe0c31046860554cec0459a2be34d22b/.github/workflows/test-changed-auth.yml#L7)
When running locally, change the chromedriver version in [package.json](https://github.com/firebase/firebase-js-sdk/blob/6e80a678fe0c31046860554cec0459a2be34d22b/packages/auth/package.json#L124) to match your local Chrome version and run `yarn install`.


For example, to run all integration and WebDriver tests against the emulator,
you would simply execute the following command:

```sh
firebase emulators:exec --project foo-bar --only auth "yarn test:integration:local"
```

### Integration testing with the production backend

Currently, MFA TOTP and password policy tests only run against the production backend (since they are not supported on the emulator yet).
Running against the backend also makes it a more reliable end-to-end test.

The TOTP tests require the following email/password combination to exist in the project, so if you are running this test against your test project, please create this user:

'totpuser-donotdelete@test.com', 'password'

You also need to verify this email address, in order to use MFA. This can be done with a curl command like this:

```
curl   -H "Authorization: Bearer $(gcloud auth print-access-token)"   -H "Content-Type: application/json"   -H "X-Goog-User-Project: ${PROJECT_ID}"   -X POST https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode   -d     '{
      "email": "totpuser-donotdelete@test.com",
      "requestType": "VERIFY_EMAIL",
      "returnOobLink": true,
    }'
```

The password policy tests require a tenant configured with a password policy that requires all options to exist in the project.

If you are running this test against your test project, please create the tenant and configure the policy with the following curl command:

```
curl   -H "Authorization: Bearer $(gcloud auth print-access-token)"   -H "Content-Type: application/json"   -H "X-Goog-User-Project: ${PROJECT_ID}"   -X POST https://identitytoolkit.googleapis.com/v2/projects/${PROJECT_ID}/tenants   -d     '{
      "displayName": "passpol-tenant",
      "passwordPolicyConfig": {
        "passwordPolicyEnforcementState": "ENFORCE",
        "passwordPolicyVersions": [
          {
            "customStrengthOptions": {
              "minPasswordLength": 8,
              "maxPasswordLength": 24,
              "containsLowercaseCharacter": true,
              "containsUppercaseCharacter": true,
              "containsNumericCharacter": true,
              "containsNonAlphanumericCharacter": true
            }
          }
        ]
      }
    }'
```

Replace the tenant ID `passpol-tenant-d7hha` in [test/integration/flows/password_policy.test.ts](https://github.com/firebase/firebase-js-sdk/blob/master/packages/auth/test/integration/flows/password_policy.test.ts) with the ID for the newly created tenant. The tenant ID can be found at the end of the `name` property in the response and is in the format `passpol-tenant-xxxxx`.

### Selenium Webdriver tests

These tests assume that you have both Firefox and Chrome installed on your
computer and in your `$PATH`. The tests will error out if this is not the case.
The WebDriver tests talk to the emulator, but unlike the headless integration
tests, these run in a browser robot environment; the assertions themselves run
in Node. When you run these tests a small Express server will be started to
serve the static files the browser robot uses.
