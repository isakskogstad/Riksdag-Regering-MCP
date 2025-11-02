-- ============================================================================
-- REGERINGSKANSLIET TABLES - ROW COUNT VERIFICATION SCRIPT
-- ============================================================================
-- Backup: 2025-11-01 21:38:47 UTC
-- Purpose: Verify all 26 tables match expected row counts
-- ============================================================================

-- Run this script to verify current database state matches backup
-- Expected total: 21,896 rows across all 26 tables

SELECT
  'VERIFICATION REPORT' as report_type,
  NOW() as verification_time;

-- ============================================================================
-- SECTION 1: CRITICAL TABLES (Top 5 - 12,297 rows)
-- ============================================================================

SELECT
  'regeringskansliet_pressmeddelanden' as table_name,
  COUNT(*) as current_rows,
  2995 as expected_rows,
  COUNT(*) - 2995 as difference,
  CASE
    WHEN COUNT(*) = 2995 THEN '✓ OK'
    WHEN COUNT(*) > 2995 THEN '⚠ MORE ROWS'
    ELSE '✗ MISSING ROWS'
  END as status
FROM regeringskansliet_pressmeddelanden

UNION ALL

SELECT
  'regeringskansliet_propositioner',
  COUNT(*),
  2892,
  COUNT(*) - 2892,
  CASE
    WHEN COUNT(*) = 2892 THEN '✓ OK'
    WHEN COUNT(*) > 2892 THEN '⚠ MORE ROWS'
    ELSE '✗ MISSING ROWS'
  END
FROM regeringskansliet_propositioner

UNION ALL

SELECT
  'regeringskansliet_departementsserien',
  COUNT(*),
  2240,
  COUNT(*) - 2240,
  CASE
    WHEN COUNT(*) = 2240 THEN '✓ OK'
    WHEN COUNT(*) > 2240 THEN '⚠ MORE ROWS'
    ELSE '✗ MISSING ROWS'
  END
FROM regeringskansliet_departementsserien

UNION ALL

SELECT
  'regeringskansliet_lagradsremiss',
  COUNT(*),
  2192,
  COUNT(*) - 2192,
  CASE
    WHEN COUNT(*) = 2192 THEN '✓ OK'
    WHEN COUNT(*) > 2192 THEN '⚠ MORE ROWS'
    ELSE '✗ MISSING ROWS'
  END
FROM regeringskansliet_lagradsremiss

UNION ALL

SELECT
  'regeringskansliet_sou',
  COUNT(*),
  1978,
  COUNT(*) - 1978,
  CASE
    WHEN COUNT(*) = 1978 THEN '✓ OK'
    WHEN COUNT(*) > 1978 THEN '⚠ MORE ROWS'
    ELSE '✗ MISSING ROWS'
  END
FROM regeringskansliet_sou

UNION ALL

-- ============================================================================
-- SECTION 2: HIGH PRIORITY TABLES (5 tables - 5,421 rows)
-- ============================================================================

SELECT
  'regeringskansliet_artiklar',
  COUNT(*),
  1328,
  COUNT(*) - 1328,
  CASE WHEN COUNT(*) = 1328 THEN '✓ OK' WHEN COUNT(*) > 1328 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_artiklar

UNION ALL

SELECT
  'regeringskansliet_skrivelse',
  COUNT(*),
  1253,
  COUNT(*) - 1253,
  CASE WHEN COUNT(*) = 1253 THEN '✓ OK' WHEN COUNT(*) > 1253 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_skrivelse

UNION ALL

SELECT
  'regeringskansliet_dagordningar',
  COUNT(*),
  1001,
  COUNT(*) - 1001,
  CASE WHEN COUNT(*) = 1001 THEN '✓ OK' WHEN COUNT(*) > 1001 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_dagordningar

UNION ALL

SELECT
  'regeringskansliet_rapporter',
  COUNT(*),
  930,
  COUNT(*) - 930,
  CASE WHEN COUNT(*) = 930 THEN '✓ OK' WHEN COUNT(*) > 930 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_rapporter

UNION ALL

SELECT
  'regeringskansliet_regeringsuppdrag',
  COUNT(*),
  909,
  COUNT(*) - 909,
  CASE WHEN COUNT(*) = 909 THEN '✓ OK' WHEN COUNT(*) > 909 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_regeringsuppdrag

UNION ALL

-- ============================================================================
-- SECTION 3: MEDIUM PRIORITY TABLES (8 tables - 3,108 rows)
-- ============================================================================

SELECT
  'regeringskansliet_kommittedirektiv',
  COUNT(*),
  553,
  COUNT(*) - 553,
  CASE WHEN COUNT(*) = 553 THEN '✓ OK' WHEN COUNT(*) > 553 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_kommittedirektiv

UNION ALL

SELECT
  'regeringskansliet_faktapromemoria',
  COUNT(*),
  536,
  COUNT(*) - 536,
  CASE WHEN COUNT(*) = 536 THEN '✓ OK' WHEN COUNT(*) > 536 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_faktapromemoria

UNION ALL

SELECT
  'regeringskansliet_internationella_overenskommelser',
  COUNT(*),
  533,
  COUNT(*) - 533,
  CASE WHEN COUNT(*) = 533 THEN '✓ OK' WHEN COUNT(*) > 533 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_internationella_overenskommelser

UNION ALL

SELECT
  'regeringskansliet_mr_granskningar',
  COUNT(*),
  359,
  COUNT(*) - 359,
  CASE WHEN COUNT(*) = 359 THEN '✓ OK' WHEN COUNT(*) > 359 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_mr_granskningar

UNION ALL

SELECT
  'regeringskansliet_informationsmaterial',
  COUNT(*),
  321,
  COUNT(*) - 321,
  CASE WHEN COUNT(*) = 321 THEN '✓ OK' WHEN COUNT(*) > 321 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_informationsmaterial

UNION ALL

SELECT
  'regeringskansliet_bistands_strategier',
  COUNT(*),
  302,
  COUNT(*) - 302,
  CASE WHEN COUNT(*) = 302 THEN '✓ OK' WHEN COUNT(*) > 302 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_bistands_strategier

UNION ALL

SELECT
  'regeringskansliet_tal',
  COUNT(*),
  247,
  COUNT(*) - 247,
  CASE WHEN COUNT(*) = 247 THEN '✓ OK' WHEN COUNT(*) > 247 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_tal

UNION ALL

SELECT
  'regeringskansliet_overenskommelser_avtal',
  COUNT(*),
  207,
  COUNT(*) - 207,
  CASE WHEN COUNT(*) = 207 THEN '✓ OK' WHEN COUNT(*) > 207 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_overenskommelser_avtal

UNION ALL

-- ============================================================================
-- SECTION 4: LOW PRIORITY TABLES (8 tables - 1,070 rows)
-- ============================================================================

SELECT
  'regeringskansliet_debattartiklar',
  COUNT(*),
  149,
  COUNT(*) - 149,
  CASE WHEN COUNT(*) = 149 THEN '✓ OK' WHEN COUNT(*) > 149 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_debattartiklar

UNION ALL

SELECT
  'regeringskansliet_arendeforteckningar',
  COUNT(*),
  138,
  COUNT(*) - 138,
  CASE WHEN COUNT(*) = 138 THEN '✓ OK' WHEN COUNT(*) > 138 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_arendeforteckningar

UNION ALL

SELECT
  'regeringskansliet_remisser',
  COUNT(*),
  122,
  COUNT(*) - 122,
  CASE WHEN COUNT(*) = 122 THEN '✓ OK' WHEN COUNT(*) > 122 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_remisser

UNION ALL

SELECT
  'regeringskansliet_uttalanden',
  COUNT(*),
  87,
  COUNT(*) - 87,
  CASE WHEN COUNT(*) = 87 THEN '✓ OK' WHEN COUNT(*) > 87 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_uttalanden

UNION ALL

SELECT
  'regeringskansliet_ud_avrader',
  COUNT(*),
  59,
  COUNT(*) - 59,
  CASE WHEN COUNT(*) = 59 THEN '✓ OK' WHEN COUNT(*) > 59 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_ud_avrader

UNION ALL

SELECT
  'regeringskansliet_regeringsarenden',
  COUNT(*),
  56,
  COUNT(*) - 56,
  CASE WHEN COUNT(*) = 56 THEN '✓ OK' WHEN COUNT(*) > 56 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_regeringsarenden

UNION ALL

SELECT
  'regeringskansliet_forordningsmotiv',
  COUNT(*),
  41,
  COUNT(*) - 41,
  CASE WHEN COUNT(*) = 41 THEN '✓ OK' WHEN COUNT(*) > 41 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_forordningsmotiv

UNION ALL

SELECT
  'regeringskansliet_sakrad',
  COUNT(*),
  18,
  COUNT(*) - 18,
  CASE WHEN COUNT(*) = 18 THEN '✓ OK' WHEN COUNT(*) > 18 THEN '⚠ MORE ROWS' ELSE '✗ MISSING ROWS' END
FROM regeringskansliet_sakrad

ORDER BY expected_rows DESC;

-- ============================================================================
-- SECTION 5: SUMMARY STATISTICS
-- ============================================================================

SELECT
  '--- SUMMARY ---' as table_name,
  NULL::bigint as current_rows,
  NULL::integer as expected_rows,
  NULL::bigint as difference,
  NULL::text as status;

WITH all_counts AS (
  SELECT COUNT(*) as cnt FROM regeringskansliet_pressmeddelanden UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_propositioner UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_departementsserien UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_lagradsremiss UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_sou UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_artiklar UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_skrivelse UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_dagordningar UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_rapporter UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_regeringsuppdrag UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_kommittedirektiv UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_faktapromemoria UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_internationella_overenskommelser UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_mr_granskningar UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_informationsmaterial UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_bistands_strategier UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_tal UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_overenskommelser_avtal UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_debattartiklar UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_arendeforteckningar UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_remisser UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_uttalanden UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_ud_avrader UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_regeringsarenden UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_forordningsmotiv UNION ALL
  SELECT COUNT(*) FROM regeringskansliet_sakrad
)
SELECT
  'TOTAL ROWS' as summary,
  SUM(cnt) as total_current_rows,
  21896 as total_expected_rows,
  SUM(cnt) - 21896 as total_difference,
  CASE
    WHEN SUM(cnt) = 21896 THEN '✓✓✓ ALL TABLES OK ✓✓✓'
    ELSE '✗✗✗ MISMATCH DETECTED ✗✗✗'
  END as overall_status
FROM all_counts;

-- ============================================================================
-- END OF VERIFICATION SCRIPT
-- ============================================================================
