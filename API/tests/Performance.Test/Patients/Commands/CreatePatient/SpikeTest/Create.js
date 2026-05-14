import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from '../../../../Common/config.js';
import { setupAdminAuth } from '../../../../Common/auth.js';
import { generateValidPatientPayload } from '../../../../Common/helpers.js';

export function setup() {
    return setupAdminAuth();
}

export const options = {
    stages: [
        { duration: '10s', target: 10 }, //warm up
        { duration: '30s', target: 600 }, 
        { duration: '2m', target: 600 },  
        { duration: '30s', target: 0 },  
    ],
    thresholds: {
        http_req_failed: ['rate<0.05'],
    },
};

export default function (data) {
    const payload = JSON.stringify(generateValidPatientPayload());
    
    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.accessToken}`
        },
    };

    const res = http.post(`${BASE_URL}/api/patients`, payload, params);

    check(res, {
        'status is 201': (r) => r.status === 201,
    });

    sleep(1); 
}
