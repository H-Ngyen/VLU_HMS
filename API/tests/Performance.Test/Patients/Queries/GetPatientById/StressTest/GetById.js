import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL } from "../../../../Common/config.js";
import { setupAdminAuth } from "../../../../Common/auth.js";
import { extractIdsFromPagedResult } from "../../../../Common/helpers.js";

export function setup() {
  const auth = setupAdminAuth();
  const res = http.get(`${BASE_URL}/api/patients?PageSize=40`, {
    headers: { Authorization: `Bearer ${auth.accessToken}` }
  });
  const ids = extractIdsFromPagedResult(res);
  return { accessToken: auth.accessToken, ids: ids };
}

export const options = {
  stages: [
    { duration: "2m", target: 150 },
    { duration: "5m", target: 150 },
    { duration: "2m", target: 300 },
    { duration: "5m", target: 300 },
    { duration: "2m", target: 500 },
    { duration: "5m", target: 500 },
    { duration: "2m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"],
    http_req_failed: ["rate<0.05"],
  },
};

export default function (data) {
  if (data.ids.length === 0) return;
  const id = data.ids[Math.floor(Math.random() * data.ids.length)];
  
  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.accessToken}`,
    },
  };

  const res = http.get(`${BASE_URL}/api/patients/${id}`, params);

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
