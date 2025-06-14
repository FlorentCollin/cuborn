# Refactoring Plan: Separate Table Definition from Service

**Goal:** Move the `vehicleStatusTable` definition and its associated Zod schemas out of `vehicle-status.service.ts` into a dedicated file to improve separation of concerns.

**Steps:**

1.  **Create Directory:**
    *   Create a new directory: `src/core/tables`

2.  **Create Table Definition File:**
    *   Create a new file: `src/core/tables/vehicle-status.table.ts`

3.  **Move Table and Schemas:**
    *   Cut the `vehicleStatusTable` constant definition from `src/core/services/vehicle-status.service.ts`.
    *   Cut the Zod schemas (`VehicleStatusTableSelectSchema`, `VehicleStatusTableInsertSchema`, `BatteryLevelHistoryInputSchema`) from `src/core/services/vehicle-status.service.ts`.
    *   Paste the table definition and the Zod schemas into `src/core/tables/vehicle-status.table.ts`.
    *   Ensure all necessary imports (like `sqliteTable`, `text`, `integer`, `sql`, `z`, `createInsertSchema`, `createSelectSchema`) are present in the new file.
    *   Export `vehicleStatusTable`, `VehicleStatusTableSelectSchema`, `VehicleStatusTableInsertSchema`, and `BatteryLevelHistoryInputSchema` from `src/core/tables/vehicle-status.table.ts`.

4.  **Update Service Imports:**
    *   In `src/core/services/vehicle-status.service.ts`:
        *   Remove the moved table and schema definitions.
        *   Add import: `import { vehicleStatusTable, VehicleStatusTableSelectSchema, BatteryLevelHistoryInputSchema } from '../tables/vehicle-status.table';`
        *   Update type definitions/references that previously relied on the local `vehicleStatusTable` or schemas.
        *   Remove the `type DbConnection = typeof db;` alias and update constructor parameter `dbInstance: DbConnection` to `dbInstance: typeof db`.

5.  **Update DB Setup Imports:**
    *   In `src/core/db.ts`:
        *   Change the import path for `vehicleStatusTable` from `./services/vehicle-status.service` to `./tables/vehicle-status.table`.

6.  **Update Router Imports:**
    *   In `src/routers/vehicle-status.router.ts`:
        *   Change the import path for `BatteryLevelHistoryInputSchema` from `../core/services/vehicle-status.service` to `../core/tables/vehicle-status.table`.

7.  **Verify:**
    *   Run type checking (e.g., `bun tsc`) to ensure all imports resolve correctly and there are no type errors.
    *   Optionally, run the development server (`bun dev`) to confirm functionality.
