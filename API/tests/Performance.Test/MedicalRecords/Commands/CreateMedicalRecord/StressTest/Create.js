import http from "k6/http";
import { sleep, check } from "k6";
import { BASE_URL } from "../../../../Common/config.js";
import { setupAdminAuth } from "../../../../Common/auth.js";
import {
  generateValidMedicalRecordPayload,
  thinkTimeRandom,
} from "../../../../Common/helpers.js";

export function setup() {
  return setupAdminAuth();
}

export const options = {
  stages: [
    // 1
    { duration: "1m", target: 50 },
    { duration: "5m", target: 50 },
    
    // 2
    { duration: "1m", target: 100 },
    { duration: "5m", target: 100 },
    
    // 3
    { duration: "1m", target: 200 },
    { duration: "5m", target: 200 },
    
    { duration: "5m", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"], // Slightly relaxed error rate for stress test
  },
};

export default function (data) {
  const patientId = Math.floor(Math.random() * 1000) + 1; // Assuming 1-1000 are valid patient IDs in the test DB
  const payload = JSON.stringify(generateValidMedicalRecordPayload());

  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.accessToken}`,
    },
  };

  const res = http.post(`${BASE_URL}/api/medical-records/${patientId}`, payload, params);

  check(res, {
    "status is 201": (r) => r.status === 201,
  });

  sleep(1);
}
