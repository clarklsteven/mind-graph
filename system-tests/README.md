# System Tests

This workspace contains Playwright-based end-to-end tests for the `mind-graph` client UI.

## Setup

From the repo root:

```bash
npm install
```

Then install system test dependencies in the workspace if needed:

```bash
npm --workspace=system-tests install
```

## Run tests

Headless:

```bash
npm --workspace=system-tests run test
```

Headed:

```bash
npm --workspace=system-tests run test:headed
```

View the last HTML report:

```bash
npm --workspace=system-tests run test:report
```

## Notes

- The Playwright config starts the client preview server on `http://127.0.0.1:4173`.
- The sample smoke test verifies the homepage loads and the toolbar shows `Mind Graph`.
