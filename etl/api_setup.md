# data.gov.in API Key Setup

1. Go to https://data.gov.in/user/register
2. Register with your email
3. Go to https://data.gov.in/user/me/api-keys
4. Generate API key
5. Add to `.env.local`:
   ```
   DATAGOVIN_API_KEY=your-key-here
   ```
6. Add to GitHub secrets:
   ```
   gh secret set DATAGOVIN_API_KEY --body "your-key-here"
   ```

## Key TN datasets on data.gov.in

Search these on https://data.gov.in/catalogs to find resource IDs:

- `Tamil Nadu budget expenditure` — department-wise spend
- `Tamil Nadu schemes beneficiaries` — scheme reach data
- `Tamil Nadu health indicators` — NHM/NRHM stats

Once you have a resource ID, the API call is:
```
https://data.gov.in/api/datastore/resource.json?resource_id=<ID>&api-key=<KEY>&limit=50
```

## Status

- data.gov.in REST API requires registration (free, instant)
- Without a key the API returns 401/timeout from CI runners
- Current pipeline uses the web catalogue page as fallback
