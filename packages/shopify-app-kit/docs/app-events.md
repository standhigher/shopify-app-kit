# App Events

`shopifyAppEventsAdapter({ endpoint })` sends validated analytics events to a business backend endpoint.

It does not call Shopify App Events directly and does not accept secrets, bearer tokens, Admin API tokens, webhook secrets, or OAuth credentials.

Events only allow scalar attributes: strings, numbers, booleans, and null. Objects and arrays are rejected. `billing_event` requires `idempotencyKey` before adapter calls run.

Backend responsibilities:

- Authenticate the shop/session.
- Attach any required Shopify credentials.
- Enforce idempotency for billing events.
- Forward to Shopify App Events if the business app chooses to do so.
