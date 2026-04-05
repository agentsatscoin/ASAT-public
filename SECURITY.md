# ASAT Security

## Purpose

This document explains the ASAT security philosophy at a high level without exposing sensitive implementation details.

It is intentionally public-safe.

---

## Security principles

### 1. Sensitive operations should not be public code
Not every implementation detail belongs in a public repository.

Security-sensitive internals remain private by design.

### 2. Daily control and critical control are different
Routine administrative access and critical system actions should not be treated the same way.

### 3. Strong authentication should be modern
Passkeys and strong user verification are preferred over weak password-based patterns.

### 4. Critical actions should require quorum
High-impact changes should require multiple trusted guardians rather than a single actor.

### 5. Auditability matters
Security-sensitive events should leave a reviewable trail.

---

## High-level security model

The intended model includes:

- passkey-gated guardian access
- session hardening
- controlled admin surfaces
- quorum approval for critical actions
- audit visibility around sensitive events
- minimized public exposure of internals

---

## What is intentionally private

This public repository does not expose:

- session signing internals
- secret material
- credential storage details
- private admin APIs
- exact database schema for sensitive flows
- reward-control internals
- incident-handling internals
- recovery implementation details

This is deliberate and should not be interpreted as absence of design.

---

## Authentication philosophy

The system direction favors:

- phishing-resistant authentication
- stronger device/user verification
- reduced dependency on memorized secrets
- smaller blast radius for routine access
- explicit separation between login and critical execution authority

---

## Quorum philosophy

Some actions should not be possible with one click from one person.

The quorum layer exists to reduce:
- single-operator failure
- compromised device risk
- accidental high-impact changes
- rushed administrative behavior

---

## Public disclosure boundaries

We want the public to understand that the system is serious.

We do **not** want to hand attackers a map of:
- exact defensive controls
- exact recovery paths
- exact storage layout
- exact operational assumptions

That is why this document stays conceptual and disciplined.

---

## Operational stance

The correct security posture is:

- expose enough to establish credibility
- hide enough to preserve safety
- document philosophy publicly
- keep sensitive machinery private

---

## Security note

No public document should be treated as a complete description of production controls.

This repository is a public trust surface, not a full disclosure of internal security implementation.
