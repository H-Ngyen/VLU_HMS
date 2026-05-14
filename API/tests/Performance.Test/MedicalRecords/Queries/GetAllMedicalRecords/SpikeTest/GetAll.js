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
    { duration: "1m", target: 1000 },
    { duration: "2m", target: 1000 },
    { duration: "1m", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.1"],
  },
};

export default function (data) {
  const pageSize = getRandomAllowedPageSize();
  const searchPhrase = Math.random() > 0.5 ? getRandomSearchPhrase() : "";
  
  const url = `${BASE_URL}/api/medical-records?PageSize=${pageSize}&PageNumber=1&SearchPhrase=${searchPhrase}`;

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

  sleep(0.5);
}
