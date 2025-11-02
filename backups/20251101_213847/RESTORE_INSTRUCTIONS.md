# Regeringskansliet Tables Backup - Restore Instructions

**Backup Created:** 2025-11-01 21:38:47
**Total Tables:** 26
**Total Rows:** 21,896
**Backup Directory:** `/tmp/Riksdag-Regering.AI/backups/20251101_213847/`

## Critical Safety Backup

This backup was created before modifying the `local_files` JSONB column across all 26 Regeringskansliet tables.

---

## Verification Before Restore

**ALWAYS verify current data state before restoring:**

```sql
-- Check current row counts
SELECT
  'regeringskansliet_pressmeddelanden' as table_name,
  COUNT(*) as current_rows,
  2995 as backup_rows
FROM regeringskansliet_pressmeddelanden
UNION ALL
SELECT 'regeringskansliet_propositioner', COUNT(*), 2892
FROM regeringskansliet_propositioner;
-- (repeat for all tables)
```

---

## Full Database Restore (Nuclear Option)

**WARNING:** This will DELETE ALL DATA and restore from backup!

### Step 1: Backup Current State First
```bash
# Always create a safety backup before restoring
pg_dump -h [host] -U postgres -d postgres \
  --schema=public \
  --table='regeringskansliet_*' \
  > /tmp/pre-restore-backup-$(date +%Y%m%d_%H%M%S).sql
```

### Step 2: Restore from this backup
```bash
# If using SQL dump files (created separately)
psql -h [host] -U postgres -d postgres \
  < /tmp/Riksdag-Regering.AI/backups/20251101_213847/full_backup.sql
```

---

## Selective Column Restore

If you only need to restore the `local_files` column:

### Option A: Using JSONB backup data

```sql
-- Example for regeringskansliet_pressmeddelanden
UPDATE regeringskansliet_pressmeddelanden AS target
SET local_bilagor = backup.local_bilagor
FROM (
  -- INSERT backup data here from backup JSON files
  SELECT
    id,
    local_bilagor
  FROM backup_table
) AS backup
WHERE target.id = backup.id;
```

### Option B: Restore from pg_dump file

```bash
# Restore only specific columns using pg_restore with --column option
# (requires custom format dump)
```

---

## Individual Table Restore

To restore a single table without affecting others:

```sql
-- 1. Create temporary backup table
CREATE TABLE regeringskansliet_pressmeddelanden_backup_temp
AS SELECT * FROM regeringskansliet_pressmeddelanden;

-- 2. Truncate current table
TRUNCATE regeringskansliet_pressmeddelanden;

-- 3. Restore from SQL dump or backup data
\i /tmp/Riksdag-Regering.AI/backups/20251101_213847/regeringskansliet_pressmeddelanden_restore.sql

-- 4. Verify data
SELECT COUNT(*) FROM regeringskansliet_pressmeddelanden; -- Should be 2995

-- 5. Drop temp backup if all good
DROP TABLE regeringskansliet_pressmeddelanden_backup_temp;
```

---

## Row Count Verification

After any restore operation:

```sql
-- Run verification query
SELECT
  table_name,
  current_rows,
  backup_rows,
  CASE
    WHEN current_rows = backup_rows THEN '✓ OK'
    ELSE '✗ MISMATCH'
  END as status
FROM (
  SELECT
    'regeringskansliet_pressmeddelanden' as table_name,
    (SELECT COUNT(*) FROM regeringskansliet_pressmeddelanden) as current_rows,
    2995 as backup_rows
  UNION ALL
  SELECT
    'regeringskansliet_propositioner',
    (SELECT COUNT(*) FROM regeringskansliet_propositioner),
    2892
  -- Add all other tables...
) as verification
ORDER BY
  CASE
    WHEN status = '✗ MISMATCH' THEN 0
    ELSE 1
  END,
  table_name;
```

---

## PostgreSQL Backup Command Reference

### Full backup of all Regeringskansliet tables:
```bash
pg_dump -h [SUPABASE_HOST] \
  -U postgres \
  -d postgres \
  --schema=public \
  --table='regeringskansliet_*' \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists \
  > regeringskansliet_full_backup_20251101_213847.sql
```

### Backup only specific tables:
```bash
pg_dump -h [SUPABASE_HOST] \
  -U postgres \
  -d postgres \
  --table='regeringskansliet_pressmeddelanden' \
  --table='regeringskansliet_propositioner' \
  --table='regeringskansliet_sou' \
  --no-owner \
  --no-acl \
  > regeringskansliet_critical_tables_backup.sql
```

### Data-only backup (no schema):
```bash
pg_dump -h [SUPABASE_HOST] \
  -U postgres \
  -d postgres \
  --data-only \
  --schema=public \
  --table='regeringskansliet_*' \
  > regeringskansliet_data_only_backup.sql
```

---

## Emergency Rollback Procedure

If something goes wrong during the migration:

1. **STOP** all write operations immediately
2. Check data integrity:
   ```sql
   SELECT COUNT(*) FROM regeringskansliet_pressmeddelanden;
   SELECT COUNT(*) FROM regeringskansliet_propositioner;
   ```
3. Compare with backup row counts in `BACKUP_MANIFEST.json`
4. If mismatch detected, initiate restore procedure above
5. Verify RLS policies are still intact:
   ```sql
   SELECT tablename, policyname, permissive, roles, cmd
   FROM pg_policies
   WHERE tablename LIKE 'regeringskansliet_%';
   ```

---

## Backup File Checksums

Verify backup integrity using:

```bash
cd /tmp/Riksdag-Regering.AI/backups/20251101_213847/
sha256sum *.sql > checksums.sha256
sha256sum -c checksums.sha256  # Verify checksums
```

---

## Contact & Support

- **Backup Location:** `/tmp/Riksdag-Regering.AI/backups/20251101_213847/`
- **Backup Timestamp:** 2025-11-01T21:38:47Z
- **Tables Affected:** All 26 Regeringskansliet tables
- **Rows Affected:** 21,896 total rows

**ALWAYS TEST RESTORE ON DEVELOPMENT ENVIRONMENT FIRST!**
