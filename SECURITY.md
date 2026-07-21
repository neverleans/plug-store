# Security Policy

## Supported versions

PlugStore is pre-1.0. Security fixes are applied to the latest released minor version.

| Version | Supported |
|---|:---:|
| 0.1.x | ✅ |
| < 0.1 | ❌ |

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, use one of these private channels:

1. [Open a private security advisory](https://github.com/neverleans/plug-store/security/advisories/new)
   (preferred), or
2. Email **neverleans@gmail.com** with the subject line `SECURITY: PlugStore`.

Please include:

- The affected package and version
- A description of the issue and its potential impact
- Steps to reproduce, ideally with a minimal example
- Any suggested mitigation you have in mind

## What to expect

- **Acknowledgement** within 72 hours.
- **An initial assessment** within 7 days.
- **A fix or mitigation plan** communicated before any public disclosure.

We will credit you in the release notes for the fix unless you ask us not to.

## Scope

Because PlugStore renders storefronts and handles checkout hand-offs, we are especially
interested in reports covering:

- Cross-site scripting through product data, theme configuration, or search input
- Injection into WhatsApp or Pix payloads built by `useCheckout`
- Data leakage through the service worker cache
- Exposure of API keys passed to data providers or analytics injectors

Vulnerabilities in a consumer's own backend or in third-party payment providers are out
of scope, though we appreciate a heads-up if PlugStore makes such an issue easier to hit.
