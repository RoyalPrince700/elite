// mailtrap/mailtrap.config.js
import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

// Debug logging for Mailtrap configuration
console.log('🔧 Mailtrap Configuration Debug:');
console.log('  - MAILTRAP_TOKEN:', TOKEN ? `${TOKEN.substring(0, 8)}...` : 'NOT SET');
console.log('  - MAILTRAP_ENDPOINT:', ENDPOINT || 'NOT SET');
console.log('  - Environment file path:', path.resolve(__dirname, "../.env"));

if (!TOKEN || !ENDPOINT) {
  console.error('❌ Mailtrap configuration is incomplete!');
  console.error('   Please check your .env file and ensure MAILTRAP_TOKEN and MAILTRAP_ENDPOINT are set.');
}

const mailtrapClient = new MailtrapClient({
    endpoint: ENDPOINT,
    token: TOKEN,
});

const sender = {
    email: "noreply@eliteretoucher.com",
    name: "Eliteretoucher",
};

export { mailtrapClient, sender };
