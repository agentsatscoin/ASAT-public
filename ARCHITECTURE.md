# ASAT Architecture

## Purpose

This document explains the ASAT system at a high level without exposing the private production implementation.

The intent is to help serious reviewers understand the structure, trust model, and operational direction.

---

## High-level system shape

ASAT is organized into a few core layers:

1. **Public protocol surface**
   - website
   - public positioning
   - public roadmap
   - public proof surfaces

2. **Operator layer**
   - wallet-linked participation
   - operator registration
   - task claiming
   - proof submission
   - participation persistence

3. **Review and reward layer**
   - submitted proof review
   - reward queue management
   - payout tracking
   - audit visibility

4. **Admin control layer**
   - guardian-authenticated admin access
   - passkey-based daily control
   - protected review and reward operations

5. **Critical security layer**
   - multi-guardian approval for sensitive actions
   - quorum-based decision model
   - audit logging
   - restricted operational control

---

## Design principles

### 1. Public clarity, private execution
The public system should make the protocol understandable without exposing the sensitive internal machinery.

### 2. Execution over narrative
The system is built around real operator actions:
- register
- claim
- submit
- review
- reward

### 3. Trust must compound
Trust should come from visible work, proof quality, consistency, and secure review processes.

### 4. Critical actions should not depend on one person
Sensitive actions should require quorum-style approval, not single-actor trust.

### 5. Security boundaries matter
The public surface can explain the model, but the operational internals should remain private.

---

## Public-facing components

The public-facing surface is designed to communicate:

- what ASAT is
- why proof-of-task matters
- how operator participation works
- where the protocol is going
- that the system is real and actively built

This layer is intentionally descriptive, not fully revealing.

---

## Operator flow

At a high level, the operator flow is:

1. wallet-linked entry
2. operator registration
3. task selection / claiming
4. proof submission
5. review
6. reward or rejection outcome
7. cumulative participation footprint

The operator layer is meant to create a durable signal of contribution.

---

## Admin model

The admin layer is not meant to be a public playground.

The intended model is:

- guardian-gated access
- passkey-secured session control
- explicit review/reward actions
- separate treatment for critical actions
- auditable security events

The operational goal is to reduce single-point trust and improve review discipline.

---

## Quorum model

Critical actions should require a multi-guardian approval threshold.

The purpose of quorum is to reduce the chance that:
- one compromised device
- one bad actor
- one rushed operator
- one exposed session

can unilaterally push through sensitive changes.

This is a protocol-trust decision, not just a UI decision.

---

## Audit model

The system is designed to preserve an audit trail around sensitive activity such as:

- guardian passkey lifecycle events
- review actions
- reward actions
- quorum actions
- administrative state changes

The public repo does not expose private audit internals, but the existence of an audit layer is central to the trust model.

---

## Security boundaries

The public repository does not include:
- private backend implementation
- admin routes
- operational secret handling
- session internals
- passkey storage details
- reward execution logic
- sensitive schema internals

That separation is intentional.

---

## Future direction

The long-term architecture direction includes:

- stronger operator reputation and trust surfaces
- deeper proof quality signals
- richer reward logic
- clearer public proof surfaces
- more mature coordination primitives

The core idea remains the same:

**work, proof, review, trust, coordination**
