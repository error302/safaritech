---
Task ID: 1
Agent: Main Agent
Task: Fix Vercel deployment for Safaritech website

Work Log:
- Cloned latest repo from GitHub (reset local to match origin/main)
- Identified root cause: workspace configuration in root package.json interfering with Vercel's rootDirectory build
- Found that apps/web/ had no package-lock.json, causing non-reproducible installs
- Found that vercel.json had rootDirectory AND Vercel dashboard likely also had rootDirectory set, causing double-application
- Simulated Vercel build locally from apps/web/ - confirmed build works
- Fixed root package.json: removed workspaces, removed preinstall script, removed conflicting dependencies
- Created package-lock.json for apps/web/ (self-contained standalone project)
- Updated vercel.json: removed rootDirectory (let dashboard control it), set framework to nextjs
- Updated GitHub Actions CI workflow to work from apps/web/
- Verified build works from fresh git clone in /tmp/
- Verified admin user seeded to database
- Pushed all changes to GitHub

Stage Summary:
- Build verified working locally from apps/web/ as standalone project
- Key fixes: removed workspace config, added apps/web/package-lock.json, simplified vercel.json
- User needs to verify Vercel dashboard settings (Root Directory = apps/web, environment variables set)
- Required env vars: DATABASE_URL, DATABASE_URL_POOLED, NEXTAUTH_SECRET, NEXTAUTH_URL
