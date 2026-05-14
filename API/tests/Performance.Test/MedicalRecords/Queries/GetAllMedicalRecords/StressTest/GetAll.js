import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL } from "../../../../Common/config.js";
import { setupAdminAuth } from "../../../../Common/auth.js";
import {
  getRandomAllowedPageSize,
  getRandomSearchPhrase,
} from "../../../../Common/helpers.js";

export function setup() {
  return setupAdminAuth();
}

export const options = {
  stages: [
    { duration: "2m", target: 200 },
    { duration: "5m", target: 200 },
    { duration: "2m", target: 250 },
    { duration: "5m", target: 250 },
    { duration: "2m", target: 300 },
    { duration: "5m", target: 300 },
    { duration: "2m", target: 0 },
  ],
  thresholds: {
    // http_req_duration: ["p(95)<1200"],
    http_req_failed: ["rate<0.05"],
  },
};

export default function (data) {
  const pageSize = getRandomAllowedPageSize();
  const searchPhrase = Math.random() > 0.5 ? getRandomSearchPhrase() : "";
  const recordType = Math.random() > 0.5 ? (Math.floor(Math.random() * 2) + 1) : "";
  
  const url = `${BASE_URL}/api/medical-records?PageSize=${pageSize}&PageNumber=1&SearchPhrase=${searchPhrase}&RecordType=${recordType}`;

  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.accessToken}`,
    },
  };

  const res = http.get(url, params);

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
