import { adminDb } from './src/lib/firebase-admin.js';

async function test() {
    try {
        console.log('Testing adminDb connection...');
        const snap = await adminDb.collection('users').limit(1).get();
        console.log('✅ Connection successful. Found docs:', snap.size);
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
    }
}

test();
