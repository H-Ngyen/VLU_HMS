import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL } from "../../../../Common/config.js";
import { setupAdminAuth } from "../../../../Common/auth.js";
import { extractIdsFromPagedResult } from "../../../../Common/helpers.js";

export function setup() {
  const auth = setupAdminAuth();
  
  // Get some valid IDs for testing
  const res = http.get(`${BASE_URL}/api/patients?PageSize=40`, {
    headers: { Authorization: `Bearer ${auth.accessToken}` }
  });
  
  const ids = extractIdsFromPagedResult(res);
  return { accessToken: auth.accessToken, ids: ids };
}

export const options = {
  stages: [
    { duration: "5m", target: 150 },
    { duration: "10m", target: 150 },
    { duration: "5m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<300"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function (data) {
  if (data.ids.length === 0) return;
  
  const id = data.ids[Math.floor(Math.random() * data.ids.length)];
  const url = `${BASE_URL}/api/patients/${id}`;

  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.accessToken}`,
    },
  };

  const res = http.get(url, params);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "has correct id": (r) => JSON.parse(r.body).id === id,
  });

  sleep(1);
}
