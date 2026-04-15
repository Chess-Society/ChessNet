
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env' });

const projectId = process.env.FB_PROJECT_ID || 'chessnet-2505';
const clientEmail = process.env.FB_CLIENT_EMAIL;
const privateKey = process.env.FB_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!clientEmail || !privateKey) {
  console.error("Missing credentials in .env");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey,
  }),
});

const db = getFirestore();
const uid = 'Vna69ACBY8TnxqyFY5HZejuyN5h1';

async function upgrade() {
  console.log(`Upgrading ${uid}...`);
  
  // 1. Update user settings
  await db.collection('users').doc(uid).set({
    settings: {
      plan: 'premium'
    }
  }, { merge: true });
  console.log("Settings updated.");

  // 2. Add subscription record
  await db.collection('user_subscriptions').doc(uid).set({
    plan_name: 'premium',
    status: 'active',
    updatedAt: new Date().toISOString()
  });
  console.log("Subscription updated.");
  
  process.exit(0);
}

upgrade().catch(err => {
  console.error(err);
  process.exit(1);
});
