#!/bin/bash

# Supabase MCP Setup Script
echo "🚀 Setting up Supabase MCP for Claude Code"
echo ""
echo "You need a Supabase Access Token first:"
echo "1. Go to: https://app.supabase.com/account/tokens"
echo "2. Click 'Generate new token'"
echo "3. Name it: 'Claude Code MCP'"
echo "4. Copy the token"
echo ""
echo "Then run this command with your token:"
echo ""
echo "claude mcp add supabase -s local -e SUPABASE_ACCESS_TOKEN=YOUR_TOKEN_HERE -- npx -y @supabase/mcp-server-supabase@latest --project-ref=vpdamevzejawthwlcfvv"
echo ""
echo "After running, restart Claude Code to use the Supabase MCP!"