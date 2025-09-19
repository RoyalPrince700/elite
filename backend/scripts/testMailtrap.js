import 'dotenv/config';
import { sendWelcomeEmail } from '../mailtrap/emails.js';

function parseArgs(argv) {
  const args = { to: 'test@example.com', name: 'Test User' };
  // Positional args support: node script.js <email> <name>
  if (argv[2] && !argv[2].startsWith('--')) {
    args.to = argv[2];
  }
  if (argv[3] && !argv[3].startsWith('--')) {
    args.name = argv[3];
  }
  for (let i = 2; i < argv.length; i++) {
    const part = argv[i];
    if (part === '--to' && argv[i + 1]) {
      args.to = argv[i + 1];
      i++;
      continue;
    }
    if (part.startsWith('--to=')) {
      args.to = part.split('=')[1];
      continue;
    }
    if (part === '--name' && argv[i + 1]) {
      args.name = argv[i + 1];
      i++;
      continue;
    }
    if (part.startsWith('--name=')) {
      args.name = part.split('=')[1];
      continue;
    }
  }
  return args;
}

async function main() {
  try {
    const { to, name } = parseArgs(process.argv);
    console.log('📧 Testing Mailtrap welcome email...');
    console.log('  → Recipient:', to);
    console.log('  → Name     :', name);

    await sendWelcomeEmail(to, name);
    console.log('✅ Test email sent. Check your Mailtrap inbox.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to send test email:', error?.message || error);
    process.exit(1);
  }
}

main();


