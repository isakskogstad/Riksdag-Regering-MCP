#!/bin/bash

# Security Script: Clean Git History
# This script removes sensitive files from Git history
# WARNING: This will rewrite Git history!

echo "==================================="
echo "Git History Security Cleanup Script"
echo "==================================="
echo ""
echo "⚠️  WARNING: This script will rewrite Git history!"
echo "⚠️  All collaborators will need to re-clone the repository"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Operation cancelled."
    exit 0
fi

echo ""
echo "📋 Prerequisites:"
echo "1. Install BFG Repo-Cleaner if not already installed:"
echo "   brew install bfg"
echo "2. Make sure you have pushed all important changes"
echo "3. Inform all collaborators about this operation"
echo ""
read -p "Press Enter to continue..."

echo ""
echo "🔍 Checking for BFG installation..."
if ! command -v bfg &> /dev/null; then
    echo "❌ BFG is not installed. Please install it first:"
    echo "   brew install bfg"
    exit 1
fi
echo "✅ BFG is installed"

echo ""
echo "📁 Creating backup..."
cp -r .git .git-backup-$(date +%Y%m%d-%H%M%S)
echo "✅ Backup created"

echo ""
echo "🧹 Removing sensitive files from history..."

# Remove .env files
echo "  Removing .env files..."
bfg --delete-files .env --no-blob-protection

# Remove any other environment files
echo "  Removing other environment files..."
bfg --delete-files .env.local --no-blob-protection
bfg --delete-files .env.production --no-blob-protection
bfg --delete-files .env.development --no-blob-protection

echo ""
echo "🗑️  Cleaning up Git repository..."
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo ""
echo "✅ Git history cleaned!"
echo ""
echo "📝 Next steps:"
echo "1. Review the changes:"
echo "   git log --oneline -20"
echo ""
echo "2. Force push to remote (⚠️ DESTRUCTIVE):"
echo "   git push --force-with-lease origin main"
echo ""
echo "3. Rotate your Supabase API keys immediately:"
echo "   - Go to https://supabase.com/dashboard/project/kufkpsoygixjaotmadvw/settings/api"
echo "   - Generate new anon and service_role keys"
echo "   - Update your .env file with new keys"
echo "   - Update GitHub Secrets with new keys"
echo ""
echo "4. Notify all collaborators to:"
echo "   - Delete their local repository"
echo "   - Re-clone the repository"
echo "   - Update their .env files with new keys"
echo ""
echo "⚠️  IMPORTANT: The old keys are still compromised and should be considered public!"
echo "⚠️  Rotate them immediately to prevent unauthorized access!"