import 'dotenv/config';
import { sendWelcomeEmail, sendSubscriptionRequestReceiptEmail, sendAdminNotificationEmail, sendInvoiceEmail, sendSubscriptionActivatedEmail, sendChatNotificationToUser, sendChatNotificationToAdmin, sendPayPerImageActivatedEmail, sendDeliverableNotificationEmail } from '../mailtrap/emails.js';

function parseArgs(argv) {
  const args = {
    to: 'test@example.com',
    name: 'Test User',
    template: 'subscription', // subscription | welcome | admin | invoice | activated | chat-user | chat-admin | ppi-activated | deliverables
    plan: 'Gold Plan',
    cycle: 'monthly', // monthly | yearly
    amount: '197',
    currency: 'USD', // USD | NGN
    company: '',
    contact: '',
    type: 'New Subscription Request',
    requestId: '',
    start: '',
    end: '',
    // invoice specific
    invoiceNumber: '',
    invDate: '',
    invDue: '',
    invStatus: 'sent',
    itemDesc: 'Service fee',
    itemQty: '1',
    itemPrice: '100',
    itemsJson: '',
    // chat specific
    msg: 'Hello! This is a test message.',
    admin: 'Admin',
    chatId: '',
    chatUrl: '',
    dashboardUrl: '',
    // pay-per-image specific
    serviceName: 'Portrait Retouching',
    qty: '10',
    unit: '20',
    total: '200'
  };
  // Positional args support: node script.js <email> <name>
  if (argv[2] && !argv[2].startsWith('--')) {
    args.to = argv[2];
  }
  if (argv[3] && !argv[3].startsWith('--')) {
    args.name = argv[3];
  }
  for (let i = 2; i < argv.length; i++) {
    const part = argv[i];
    if (part === '--template' && argv[i + 1]) { args.template = argv[i + 1]; i++; continue; }
    if (part.startsWith('--template=')) { args.template = part.split('=')[1]; continue; }
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
    if (part === '--plan' && argv[i + 1]) { args.plan = argv[i + 1]; i++; continue; }
    if (part.startsWith('--plan=')) { args.plan = part.split('=')[1]; continue; }
    if (part === '--cycle' && argv[i + 1]) { args.cycle = argv[i + 1]; i++; continue; }
    if (part.startsWith('--cycle=')) { args.cycle = part.split('=')[1]; continue; }
    if (part === '--amount' && argv[i + 1]) { args.amount = argv[i + 1]; i++; continue; }
    if (part.startsWith('--amount=')) { args.amount = part.split('=')[1]; continue; }
    if (part === '--currency' && argv[i + 1]) { args.currency = argv[i + 1]; i++; continue; }
    if (part.startsWith('--currency=')) { args.currency = part.split('=')[1]; continue; }
    if (part === '--company' && argv[i + 1]) { args.company = argv[i + 1]; i++; continue; }
    if (part.startsWith('--company=')) { args.company = part.split('=')[1]; continue; }
    if (part === '--contact' && argv[i + 1]) { args.contact = argv[i + 1]; i++; continue; }
    if (part.startsWith('--contact=')) { args.contact = part.split('=')[1]; continue; }
    if (part === '--type' && argv[i + 1]) { args.type = argv[i + 1]; i++; continue; }
    if (part.startsWith('--type=')) { args.type = part.split('=')[1]; continue; }
    if (part === '--requestId' && argv[i + 1]) { args.requestId = argv[i + 1]; i++; continue; }
    if (part.startsWith('--requestId=')) { args.requestId = part.split('=')[1]; continue; }
    if (part === '--start' && argv[i + 1]) { args.start = argv[i + 1]; i++; continue; }
    if (part.startsWith('--start=')) { args.start = part.split('=')[1]; continue; }
    if (part === '--end' && argv[i + 1]) { args.end = argv[i + 1]; i++; continue; }
    if (part.startsWith('--end=')) { args.end = part.split('=')[1]; continue; }
    // invoice args
    if (part === '--invoiceNumber' && argv[i + 1]) { args.invoiceNumber = argv[i + 1]; i++; continue; }
    if (part.startsWith('--invoiceNumber=')) { args.invoiceNumber = part.split('=')[1]; continue; }
    if (part === '--invDate' && argv[i + 1]) { args.invDate = argv[i + 1]; i++; continue; }
    if (part.startsWith('--invDate=')) { args.invDate = part.split('=')[1]; continue; }
    if (part === '--invDue' && argv[i + 1]) { args.invDue = argv[i + 1]; i++; continue; }
    if (part.startsWith('--invDue=')) { args.invDue = part.split('=')[1]; continue; }
    if (part === '--invStatus' && argv[i + 1]) { args.invStatus = argv[i + 1]; i++; continue; }
    if (part.startsWith('--invStatus=')) { args.invStatus = part.split('=')[1]; continue; }
    if (part === '--itemDesc' && argv[i + 1]) { args.itemDesc = argv[i + 1]; i++; continue; }
    if (part.startsWith('--itemDesc=')) { args.itemDesc = part.split('=')[1]; continue; }
    if (part === '--itemQty' && argv[i + 1]) { args.itemQty = argv[i + 1]; i++; continue; }
    if (part.startsWith('--itemQty=')) { args.itemQty = part.split('=')[1]; continue; }
    if (part === '--itemPrice' && argv[i + 1]) { args.itemPrice = argv[i + 1]; i++; continue; }
    if (part.startsWith('--itemPrice=')) { args.itemPrice = part.split('=')[1]; continue; }
    if (part === '--itemsJson' && argv[i + 1]) { args.itemsJson = argv[i + 1]; i++; continue; }
    if (part.startsWith('--itemsJson=')) { args.itemsJson = part.split('=')[1]; continue; }
    // chat args
    if (part === '--msg' && argv[i + 1]) { args.msg = argv[i + 1]; i++; continue; }
    if (part.startsWith('--msg=')) { args.msg = part.split('=')[1]; continue; }
    if (part === '--admin' && argv[i + 1]) { args.admin = argv[i + 1]; i++; continue; }
    if (part.startsWith('--admin=')) { args.admin = part.split('=')[1]; continue; }
    if (part === '--chatId' && argv[i + 1]) { args.chatId = argv[i + 1]; i++; continue; }
    if (part.startsWith('--chatId=')) { args.chatId = part.split('=')[1]; continue; }
    if (part === '--chatUrl' && argv[i + 1]) { args.chatUrl = argv[i + 1]; i++; continue; }
    if (part.startsWith('--chatUrl=')) { args.chatUrl = part.split('=')[1]; continue; }
    if (part === '--dashboardUrl' && argv[i + 1]) { args.dashboardUrl = argv[i + 1]; i++; continue; }
    if (part.startsWith('--dashboardUrl=')) { args.dashboardUrl = part.split('=')[1]; continue; }
    // ppi args
    if (part === '--service' && argv[i + 1]) { args.serviceName = argv[i + 1]; i++; continue; }
    if (part.startsWith('--service=')) { args.serviceName = part.split('=')[1]; continue; }
    if (part === '--qty' && argv[i + 1]) { args.qty = argv[i + 1]; i++; continue; }
    if (part.startsWith('--qty=')) { args.qty = part.split('=')[1]; continue; }
    if (part === '--unit' && argv[i + 1]) { args.unit = argv[i + 1]; i++; continue; }
    if (part.startsWith('--unit=')) { args.unit = part.split('=')[1]; continue; }
    if (part === '--total' && argv[i + 1]) { args.total = argv[i + 1]; i++; continue; }
    if (part.startsWith('--total=')) { args.total = part.split('=')[1]; continue; }
  }
  return args;
}

async function main() {
  try {
    const {
      to, name, template, plan, cycle, amount, currency, company, contact, type, requestId,
      start, end,
      invoiceNumber, invDate, invDue, invStatus, itemDesc, itemQty, itemPrice, itemsJson,
      msg, admin, chatId, chatUrl, dashboardUrl,
      serviceName, qty, unit, total
    } = parseArgs(process.argv);

    if (template === 'subscription') {
      console.log('📧 Testing Mailtrap subscription request receipt email...');
      console.log('  → Recipient   :', to);
      console.log('  → Name        :', name);
      console.log('  → Plan        :', plan);
      console.log('  → BillingCycle:', cycle);
      console.log('  → Amount      :', amount);
      console.log('  → Currency    :', currency);

      await sendSubscriptionRequestReceiptEmail(to, {
        fullName: name,
        planName: plan,
        billingCycle: cycle,
        amount: isNaN(Number(amount)) ? amount : Number(amount),
        currency,
        companyName: company,
        contactPerson: contact
      });
    } else if (template === 'admin') {
      console.log('📧 Testing Mailtrap admin notification email...');
      console.log('  → Recipient   :', to);
      console.log('  → Type        :', type);
      console.log('  → Plan        :', plan);
      console.log('  → BillingCycle:', cycle);
      console.log('  → Amount      :', amount);
      console.log('  → Currency    :', currency);

      const data = {
        requestId: requestId || `req_${Date.now()}`,
        createdAt: new Date().toISOString(),
        user: {
          id: `user_${Date.now()}`,
          email: `${name?.toLowerCase?.().replace(/\s+/g, '') || 'user'}@example.com`,
          fullName: name
        },
        plan: {
          id: plan?.toLowerCase?.().replace(/\s+/g, '-') || 'gold-plan',
          name: plan,
          monthlyPrice: isNaN(Number(amount)) ? amount : Number(amount)
        },
        billingCycle: cycle,
        currency,
        amount: isNaN(Number(amount)) ? amount : Number(amount),
        companyName: company,
        contactPerson: contact,
        phone: '+1 555-555-5555',
        address: { street: '123 Test St', city: 'Testville', state: 'TS', zipCode: '00000', country: 'USA' }
      };

      await sendAdminNotificationEmail(to, type, data);
    } else if (template === 'invoice') {
      console.log('📧 Testing Mailtrap invoice email...');
      console.log('  → Recipient   :', to);
      const parsedQty = isNaN(Number(itemQty)) ? 1 : Number(itemQty);
      const parsedPrice = isNaN(Number(itemPrice)) ? 0 : Number(itemPrice);
      let items = [];
      if (itemsJson) {
        try {
          const parsed = JSON.parse(itemsJson);
          if (Array.isArray(parsed)) {
            items = parsed.map((it) => ({
              description: it.description,
              quantity: Number(it.quantity) || 1,
              price: Number(it.price) || 0,
              total: (Number(it.quantity) || 1) * (Number(it.price) || 0)
            }));
          }
        } catch (e) {
          console.warn('⚠️  Failed to parse itemsJson, falling back to single item.');
        }
      }
      if (items.length === 0) {
        items = [{ description: itemDesc, quantity: parsedQty, price: parsedPrice, total: parsedQty * parsedPrice }];
      }
      const totalAmount = items.reduce((sum, it) => sum + (Number(it.total) || 0), 0);
      const invoiceData = {
        invoiceNumber: invoiceNumber || `INV-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).substring(2,6).toUpperCase()}`,
        date: invDate || new Date().toISOString().slice(0, 10),
        dueDate: invDue || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        status: invStatus || 'sent',
        items,
        totalAmount
      };
      await sendInvoiceEmail(to, invoiceData);
    } else if (template === 'activated') {
      console.log('📧 Testing Mailtrap subscription ACTIVATED email...');
      console.log('  → Recipient   :', to);
      console.log('  → Name        :', name);
      console.log('  → Plan        :', plan);
      console.log('  → BillingCycle:', cycle);
      console.log('  → Amount      :', amount);
      console.log('  → Currency    :', currency);

      const startDate = start ? new Date(start) : new Date();
      let endDate;
      const s = new Date(startDate);
      switch ((cycle || 'monthly').toLowerCase()) {
        case 'quarterly':
          endDate = new Date(s.getFullYear(), s.getMonth() + 3, s.getDate());
          break;
        case 'yearly':
          endDate = new Date(s.getFullYear() + 1, s.getMonth(), s.getDate());
          break;
        default:
          endDate = new Date(s.getFullYear(), s.getMonth() + 1, s.getDate());
      }
      const endOverride = end ? new Date(end) : null;

      await sendSubscriptionActivatedEmail(to, {
        fullName: name,
        planName: plan,
        billingCycle: cycle,
        currency,
        amount: isNaN(Number(amount)) ? amount : Number(amount),
        startDate,
        endDate: endOverride || endDate
      });
    } else if (template === 'chat-user') {
      console.log('📧 Testing chat notification to USER (admin reply)...');
      console.log('  → Recipient   :', to);
      console.log('  → Admin       :', admin);
      console.log('  → User Name   :', name);
      console.log('  → Message     :', msg);
      await sendChatNotificationToUser(to, {
        adminFullName: admin || 'Admin',
        userFullName: name || 'Customer',
        messageText: msg || 'Hello from Admin',
        chatUrl: chatUrl || process.env.USER_DASHBOARD_URL || 'https://www.eliteretoucher.com/dashboard',
        sentAt: new Date().toISOString()
      });
    } else if (template === 'chat-admin') {
      console.log('📧 Testing chat notification to ADMIN (user message)...');
      console.log('  → Recipient   :', to);
      console.log('  → User Name   :', name);
      console.log('  → Message     :', msg);
      await sendChatNotificationToAdmin(to, {
        userFullName: name || 'User',
        userEmail: `${(name || 'user').toLowerCase().replace(/\s+/g,'')}` + '@example.com',
        messageText: msg || 'Hello Admin',
        chatId: chatId || `chat_${Date.now()}`,
        dashboardUrl: dashboardUrl || process.env.ADMIN_DASHBOARD_URL || 'https://www.eliteretoucher.com/admin',
        sentAt: new Date().toISOString()
      });
    } else if (template === 'ppi-activated') {
      console.log('📧 Testing Pay-per-Image ACTIVATED email...');
      console.log('  → Recipient   :', to);
      console.log('  → Name        :', name);
      console.log('  → Service     :', serviceName);
      console.log('  → Quantity    :', qty);
      console.log('  → Unit Price  :', unit);
      console.log('  → Total Price :', total);
      console.log('  → Currency    :', currency);

      const qNum = isNaN(Number(qty)) ? 1 : Number(qty);
      const uNum = isNaN(Number(unit)) ? unit : Number(unit);
      const tNum = isNaN(Number(total)) ? total : Number(total);
      await sendPayPerImageActivatedEmail(to, {
        fullName: name,
        serviceName,
        quantity: qNum,
        currency,
        unitPrice: uNum,
        totalPrice: tNum,
        activatedAt: new Date().toISOString()
      });
    } else if (template === 'deliverables') {
      console.log('📧 Testing Mailtrap deliverables notification email...');
      console.log('  → Recipient   :', to);
      console.log('  → Name        :', name);
      console.log('  → Title       :', plan || 'Sample Deliverable');
      console.log('  → Description :', msg || 'This is a sample deliverable description.');
      console.log('  → Download URL:', dashboardUrl || 'https://example.com/download/sample-file.zip');
      console.log('  → Admin Name  :', admin || 'Admin User');

      await sendDeliverableNotificationEmail(to, {
        userFullName: name,
        title: plan || 'Sample Deliverable',
        description: msg || 'This is a sample deliverable description.',
        downloadUrl: dashboardUrl || 'https://example.com/download/sample-file.zip',
        dashboardUrl: 'https://www.eliteretoucher.com/dashboard?tab=downloads',
        adminName: admin || 'Admin User',
        createdAt: new Date().toISOString()
      });
    } else {
      console.log('📧 Testing Mailtrap welcome email...');
      console.log('  → Recipient:', to);
      console.log('  → Name     :', name);
      await sendWelcomeEmail(to, name);
    }

    console.log('✅ Test email sent. Check your Mailtrap inbox.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to send test email:', error?.message || error);
    process.exit(1);
  }
}

main();


