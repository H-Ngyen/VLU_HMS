import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL } from "../../../../Common/config.js";
import { setupAdminAuth } from "../../../../Common/auth.js";
import { generateValidPatientPayload } from "../../../../Common/helpers.js";

export function setup() {
  return setupAdminAuth();
}

export const options = {
  stages: [
    // 1
    { duration: "1m", target: 100 },
    { duration: "5m", target: 100 },
    
    // 2
    { duration: "1m", target: 300 },
    { duration: "5m", target: 300 },
    
    // 3
    { duration: "1m", target: 400 },
    { duration: "5m", target: 400 },
    
    { duration: "5m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<4000"],
    http_req_failed: ["rate<0.05"],
  },
};

export default function (data) {
  const payload = JSON.stringify(generateValidPatientPayload());

  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.accessToken}`,
    },
  };

  const res = http.post(`${BASE_URL}/api/patients`, payload, params);

  check(res, {
    "status is 201": (r) => r.status === 201,
    "status is not 500": (r) => r.status !== 500, // Đảm bảo server không sập do quá tải
  });

  sleep(1);
}
