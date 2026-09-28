# The Games Bunker Membership Management

A functional front-end prototype for managing The Games Bunker memberships and EPOS barcode discounts.

## Features

- Membership records with Active / Inactive status
- Tier support: Pilar, Sentinel, Paladin, Paragon
- Physical card preview with real Code 128 barcodes
- EPOS scan field that accepts barcode, card number, or membership ID
- Valid / inactive membership verification
- Paladin/Paragon discount handling in the UI
- Renew and activate/deactivate actions
- Search and member selection
- Local browser persistence via `localStorage`
- Uses the supplied GTB logo and Joshua Clark mock profile image

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints in your terminal.

## Build

```bash
npm run build
npm run preview
```

## GitHub repository

Create a new repository, unzip this project, then:

```bash
git init
git add .
git commit -m "Initial Games Bunker membership app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Demo barcode

Joshua Clark's demo barcode is:

`5063012470018`

The EPOS scan box also accepts `GB-P-001247`.

## Production notes

This repository is a working client-side prototype. Before real deployment, replace localStorage with an authenticated backend/database, add staff roles, server-side validation, audit logging, EPOS API authentication, GDPR/privacy controls, and payment/subscription integration.
