# Ask Tony UI

Ask Tony UI renders model-generated dashboards and answers produced by the Ask Tony agent. The project is a Next.js app that streams plan, data, and widget updates from the Cursor agent runtime.

## Quick Start

1. Install prerequisites  
   - Node.js 18+  
   - Cursor Agent CLI (`curl https://cursor.com/install -fsS | bash` then `cursor-agent login`)
2. Clone and install  
   ```bash
   git clone git@github.com:eriknson/ask-tony-ai.git
   cd ask-tony-ai
   npm install
   ```
3. Run the dev server  
   ```bash
   npm run dev
   ```
   The app is available at http://localhost:3000.

## Configuration

- Copy `env.local.example` to `.env.local` and supply credentials for the Cursor API and optional integrations.
- Supported runtime models can be toggled per request with `?model=` (e.g. `?model=composer-1`, `?model=auto`, `?model=gpt-5`, `?model=sonnet-4.5`). Update `NEXT_PUBLIC_ALLOWED_MODELS` to expose additional models.

### Slack ingestion (optional)

Add these variables when enabling the Slack bot:

- `SLACK_APP_ID`
- `SLACK_CLIENT_ID`
- `SLACK_CLIENT_SECRET`
- `SLACK_SIGNING_SECRET`
- `SLACK_BOT_TOKEN`

Grant scopes `app_mentions:read`, `chat:write`, `reactions:write`, and `channels:history` (add `groups:history` for private channels). Configure **Event Subscriptions** to POST to `/api/slack/events` and subscribe to the `app_mention` bot event.

For local testing, run `npm run dev`, expose the site via a tunnel (e.g. `ngrok http 3000`), point the Slack request URL to the tunnel, then mention the bot to verify it returns a link to `/answer/<id>`.

## Troubleshooting

- Restart the shell after installing the Cursor CLI if commands are missing.
- Re-run `cursor-agent login` when authentication expires.
- Confirm `CURSOR_API_KEY` is present in the deployment environment when builds fail.
- Review hosting logs to ensure the prebuild step completed before reporting runtime issues.

## License

MIT
