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
    { duration: "5m", target: 130 },
    { duration: "10m", target: 130 },
    { duration: "5m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<700"],
    http_req_failed: ["rate<0.01"],
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
    "has items": (r) => JSON.parse(r.body).items !== undefined,
  });

  sleep(1);
}
