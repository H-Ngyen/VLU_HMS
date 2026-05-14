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
    { duration: "10s", target: 10 },
    { duration: "30s", target: 500 },
    { duration: "2m", target: 500 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<4000"],
    http_req_failed: ["rate<0.05"], 
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
