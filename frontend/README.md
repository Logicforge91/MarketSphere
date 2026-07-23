# MarketSphere Frontend

React static ecommerce UI based on the ShopHub design reference.

## Structure

- `src/pages` - page-level screens.
- `src/components` - reusable UI sections grouped by domain.
- `src/data/shopData.js` - static content used by the UI.
- `src/services/shopService.js` - API-ready service layer for later REST integration.
- `src/utils` - shared formatting helpers.

## Run

```bash
npm install
npm run dev
```

## REST API Integration Later

Replace static imports in `src/services/shopService.js` with `fetchFromApi("/your-endpoint")`, then call service methods from pages using `useEffect` or a data library such as TanStack Query.
