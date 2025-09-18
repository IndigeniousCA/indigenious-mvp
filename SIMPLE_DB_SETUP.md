# 🎯 Simple Database Setup Guide

## Step 1: Find the SQL File

The file is in your project folder:
```
Indigenious_MVP/
  └── supabase/
      └── migrations/
          └── 001_simplified_schema.sql  ← THIS FILE
```

**How to get the contents:**

### Option A: From your computer
1. Open Finder (Mac) or File Explorer (Windows)
2. Go to your Indigenious_MVP folder
3. Open: supabase → migrations → 001_simplified_schema.sql
4. Select all text (Cmd+A or Ctrl+A)
5. Copy (Cmd+C or Ctrl+C)

### Option B: From VS Code
1. Open VS Code
2. Open the file: `supabase/migrations/001_simplified_schema.sql`
3. Select all text (Cmd+A or Ctrl+A)
4. Copy (Cmd+C or Ctrl+C)

### Option C: From Terminal
```bash
cd /Users/Jon/Indigenious_MVP
cat supabase/migrations/001_simplified_schema.sql
```
Then copy all the output.

## Step 2: Run in Supabase

1. **Go to your Supabase SQL Editor:**
   https://app.supabase.com/project/vpdamevzejawthwlcfvv/sql

2. **You'll see a page with:**
   - Left sidebar with "SQL Editor"
   - Main area with a text box
   - Green "RUN" button at bottom right

3. **Clear any existing text** in the SQL editor

4. **Paste** your copied SQL (Cmd+V or Ctrl+V)

5. **Click the green "RUN" button**

6. **You should see:**
   ```
   Success. No rows returned
   ```

## Step 3: Verify It Worked

1. **In the same SQL editor, clear the text**

2. **Paste this verification query:**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```

3. **Click RUN**

4. **You should see these tables:**
   - aggregated_rfqs
   - audit_log
   - businesses
   - partnership_requests
   - rfq_interests
   - users
   - verification_codes

## That's It! 🎉

Your database is now set up. The app can now:
- Create users
- Store business information
- Handle partnerships
- Track RFQs

## Troubleshooting

**"relation already exists" error?**
- The tables are already created! You're good to go.

**"permission denied" error?**
- Make sure you're logged into Supabase
- Check you're in the right project

**Can't find the file?**
- Make sure you're in the Indigenious_MVP folder
- The file path is: `supabase/migrations/001_simplified_schema.sql`

## Next Steps
Now you can test registration at:
https://indigenious-mvp.vercel.app/en/auth/register