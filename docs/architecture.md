# Architecture

ReleasePulse uses a stateless REST API plus an SSE endpoint for live events. The API owns deployment lifecycle validation; the web client treats server state as authoritative and only keeps UI filters and connection state in Pinia.

Production approval is modeled as a state transition rather than a boolean flag so invalid transitions can be rejected centrally.
