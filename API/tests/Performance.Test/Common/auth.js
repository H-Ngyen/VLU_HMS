import http from 'k6/http';
import { BASE_URL, OWNER_EMAIL, OWNER_PASSWORD, ADMIN_TOKEN } from './config.js';

export function setupOwnerAuth() {
    const loginPayload = JSON.stringify({
        email: OWNER_EMAIL,
        password: OWNER_PASSWORD
    });

    const loginRes = http.post(`${BASE_URL}/identity/login`, loginPayload, {
        headers: { 'Content-Type': 'application/json' }
    });

    if (loginRes.status !== 200) {
        console.error(`Login failed! Status: ${loginRes.status}, Body: ${loginRes.body}`);
    }

    // .NET Identity API trả về JSON chứa trường accessToken
    const token = loginRes.json('accessToken');
    
    // Trả về object chứa token để k6 truyền xuống cho các Virtual Users (VUs)
    return { accessToken: token };
}

export function setupAdminAuth() {
    return { accessToken: ADMIN_TOKEN };
}

