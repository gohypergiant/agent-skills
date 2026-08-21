# New Engineer Onboarding

Welcome to the team. A few terms you'll hear a lot:

Messages are grouped into a consumer group, so only one worker in the
group processes a given message at a time.

Every request carries an idempotency key so retries don't cause the same
action to happen twice.

"Sidecar" gets used pretty loosely around here, not just for the logging
helper. People also call any small helper process running next to a
bigger one a sidecar.
