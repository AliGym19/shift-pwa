# Shift Tracker

A single-file PWA for logging delivery shifts, computing actual-vs-paid hours, and generating weekly invoices.

- **On-device OCR** — drop a route screenshot and it's parsed locally with [Tesseract.js](https://tesseract.projectnaptha.com/) (vendored under `vendor/tesseract/`). No API key, works offline.
- **Invoicing** — weekly invoice with bonus / additional-pay columns, PDF export via jsPDF, share-sheet send (pick Gmail).
- **Offline-first** — service worker (`sw.js`) precaches the app shell and the OCR bundle.

All data lives in the browser's `localStorage` — nothing is sent to a server. The optional WhatsApp chat importer uses an Anthropic API key that the user enters at runtime and that is stored only on-device.

## Run locally

It's static — serve the folder over HTTP (a service worker won't register from `file://`):

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Hosted on Vercel as a static site (no build step). Pushes to `main` auto-deploy.

