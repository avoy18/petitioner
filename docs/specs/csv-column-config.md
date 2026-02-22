# CSV column config (human spec)

## Goal

Let users customize CSV exports for a petition:
- **Hide columns**
- **Rename column headers**
- **Replace cell values** via mappings (e.g. `"0"` → `"No"`)

This config is used for both:
- The **preview** shown in the Export modal
- The **downloaded CSV**

## How it works (high level)

- The Export modal sends the current config as `csv_column_config` in the **preview** and **export** requests.
- The stored meta (`_petitioner_csv_column_config`) is used to **prefill** the editor UI; the Export modal should send a config every time so the backend doesn’t need to read meta during export.

## Scope

### v1 (static)
- Hide columns (`overrides.hidden`)
- Override header labels (`overrides.label`)
- Map values (`overrides.mappings`: exact match on raw value → mapped value)

### v2 (dynamic, later)
- Support `{{field_id}}` placeholders in `mapped_value` (e.g. `{{fname}} {{lname}}`)

## Non-goals / constraints

- **No column reordering** (order stays as in allowed fields)
- v1 mappings are **literal only** (no `{{...}}` resolution)

## Persistence

Persisted like other petition edit fields:
- Meta key: `_petitioner_csv_column_config`
- One value per petition (form_id = post ID)
- No dedicated save/load API endpoint

## Validation (v1)

- PHPUnit tests are the primary validation.
- Optional: manual/Postman requests to preview/export endpoints.

## Behavior rules

- Only fields from `AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS` are eligible, and `custom_properties` is excluded.
- Column order is the `ALLOWED_FIELDS` order minus hidden columns.
- Mapping is **string equality**, first match wins.
- Output values must still be protected against CSV injection (use the existing CSV sanitizer).

## Example config (reference)

```json
[
  { "id": "id", "label": "Id", "overrides": { "hidden": true } },
  { "id": "fname", "label": "First name", "overrides": { "label": "First Name" } },
  { "id": "newsletter", "label": "Newsletter", "overrides": {
    "mappings": [
      { "raw_value": "0", "mapped_value": "No" },
      { "raw_value": "1", "mapped_value": "Yes" }
    ]
  } }
]
```

