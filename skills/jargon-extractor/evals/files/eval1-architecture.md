# Ingest Service Architecture

Incoming events land in the ingest queue before being processed by worker
pods. Each worker pod runs a sidecar that ships logs and metrics without
touching the worker's own codebase.

If a worker fails to process a message three times, it is routed to the
DLQ (dead-letter queue) for manual inspection rather than being retried
forever.

Workers apply backpressure by pausing consumption from the queue whenever
downstream latency crosses a threshold, which keeps the service from
falling over under load.
