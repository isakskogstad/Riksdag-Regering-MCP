# Critical Security Update - November 2025

## 🚨 Immediate Action Required

This document outlines critical security updates that have been implemented to protect sensitive API keys and credentials.

## Security Issues Addressed

### 1. Exposed API Keys (CRITICAL)
- **Issue**: Supabase API keys were hardcoded in source code and committed to Git
- **Files affected**:
  - `src/integrations/supabase/client.ts` (hardcoded credentials)
  - `.env` (exposed in Git history)
- **Status**: ✅ Fixed

### 2. Git History Contamination
- **Issue**: Sensitive files exist in Git history
- **Solution**: Created cleanup script in `scripts/clean-git-history.sh`
- **Status**: ⚠️ Requires manual execution

## Changes Implemented

### ✅ Completed Actions

1. **Updated Supabase Client Configuration**
   - Removed hardcoded credentials from `src/integrations/supabase/client.ts`
   - Now uses environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Added validation to ensure environment variables are present

2. **Removed .env from Git Tracking**
   - File removed from repository tracking
   - Already included in `.gitignore` for future protection

3. **Created Security Cleanup Script**
   - Location: `scripts/clean-git-history.sh`
   - Purpose: Remove sensitive files from entire Git history
   - Requires BFG Repo-Cleaner tool

4. **Verified Deployment Configuration**
   - GitHub Actions workflow correctly uses GitHub Secrets
   - No hardcoded values in CI/CD pipeline

## 🔴 Required Actions

### Step 1: Clean Git History (Repository Owner)
```bash
# Run the cleanup script
./scripts/clean-git-history.sh

# Force push to remote (after careful review)
git push --force-with-lease origin main
```

### Step 2: Rotate Supabase Keys (Immediately)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/kufkpsoygixjaotmadvw/settings/api)
2. Generate new keys:
   - New anon key
   - New service_role key (if used)
3. Update all references:
   - Local `.env` file
   - GitHub Secrets
   - Any deployed environments

### Step 3: Update GitHub Secrets
Go to repository Settings → Secrets and variables → Actions

Update these secrets with new values:
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`

### Step 4: Notify All Collaborators
All team members must:
1. Delete their local repository
2. Re-clone after history cleanup:
   ```bash
   git clone https://github.com/KSAklfszf921/Riksdag-Regering.AI.git
   ```
3. Create new `.env` file with updated keys

## Environment Setup

### Create `.env` file locally:
```bash
# Copy template
cp .env.example .env

# Edit with new values
VITE_SUPABASE_PROJECT_ID="kufkpsoygixjaotmadvw"
VITE_SUPABASE_PUBLISHABLE_KEY="[NEW_ANON_KEY_HERE]"
VITE_SUPABASE_URL="https://kufkpsoygixjaotmadvw.supabase.co"
```

## Prevention Measures

### Best Practices Now Enforced:
1. ✅ Environment variables for all sensitive data
2. ✅ `.env` files in `.gitignore`
3. ✅ GitHub Secrets for CI/CD
4. ✅ Validation for missing environment variables
5. ✅ Security documentation maintained

### Development Checklist:
- [ ] Never commit `.env` files
- [ ] Always use environment variables for API keys
- [ ] Review changes before committing (`git diff`)
- [ ] Use `git status` to check tracked files
- [ ] Keep `.env.example` updated with structure (not values)

## Security Monitoring

### Regular Audits:
- Check for exposed secrets: `git grep -i "api_key\|secret\|password\|token"`
- Verify `.env` is not tracked: `git ls-files | grep -E "\.env"`
- Review GitHub Secrets are up to date
- Monitor Supabase logs for unauthorized access

### Tools Recommended:
- [GitGuardian](https://www.gitguardian.com/) - Monitors for exposed secrets
- [Trivy](https://github.com/aquasecurity/trivy) - Security scanner
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/) - Git history cleaning

## Recovery Plan

If keys are compromised again:
1. Immediately rotate all affected keys
2. Review access logs in Supabase Dashboard
3. Check for unauthorized database changes
4. Run security audit on all data
5. Notify affected users if data was accessed

## Support

For questions or concerns about this security update:
- Create an issue in the repository
- Contact the repository owner
- Review Supabase security documentation

---

**Last Updated:** 2025-11-01
**Priority:** CRITICAL
**Required By:** All contributors

⚠️ **Note**: The old API keys should be considered compromised and public. Rotation is mandatory, not optional.