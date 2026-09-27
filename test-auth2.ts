import { MoodleRestClient } from './src/core/moodle/MoodleRestClient';
import { getAuthRepository } from './src/app/api/auth/_factory';
import { AppRole } from './src/core/rbac/AppRole';
import { TenantStatus } from '@prisma/client';

async function test() {
  try {
    const { getAuthController } = await import('./src/app/api/auth/_factory');
    const controller = getAuthController();
    
    // Simulate Request
    const req = new Request('http://moodle.local/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'host': 'moodle.local' },
      body: JSON.stringify({ username: 'admin', password: 'Moodle123!' })
    });
    
    const res = await controller.login(req);
    console.log('Status:', res.status);
    console.log('Body:', await res.text());
  } catch(e) {
    console.error('Error:', e);
  }
}
test();
