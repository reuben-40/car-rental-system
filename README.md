# Golden Drive Fleet

Build a car rental booking system frontend for my school project named "La Squadra d'Oro Car Rental", inspired by the clean, modern style of https://www.otto.rentals/ and tailored for Kenya (KES currency, Nairobi pickup locations).

Only build the frontend, structured with clean TypeScript models, an Axios API client, and a realistic mock-data service that mirrors the FastAPI backend endpoints from the CMT210 project document so it connects seamlessly to the backend later.

Include:
1. Branded luxury/modern landing page with hero banner, date-range availability search widget, vehicle category filters, and featured cars.
2. Complete vehicle browsing and detail view with date overlap validation and live price quoting (subtotal, 16% VAT, 20% deposit, and optional add-ons like child seats, GPS, extra driver).
3. Customer booking flow with confirmation reference numbers, driver's license details, and "My Bookings" history with cancellation.
4. Comprehensive Admin Panel with KPI dashboard (cars on hire, monthly revenue, upcoming returns), fleet management (add/edit car, status toggles for maintenance), and booking operations (confirm, record pickup with mileage, record return).
5. Role-based authentication switcher (Customer vs. Admin) to easily test and demo both perspectives.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://golden-drive-fleet.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/15caddad-ab5e-4762-a54a-c92e85847cc0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
