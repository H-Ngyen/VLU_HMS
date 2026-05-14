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
    // 1
    // { duration: "2m", target: 100 },
    // { duration: "5m", target: 100 },
    
    
    // 3
    { duration: "2m", target: 250 },
    { duration: "5m", target: 250 },

    
    // 4
    { duration: "2m", target: 300 },
    { duration: "5m", target: 300 },
    
    // 2
    { duration: "2m", target: 350 },
    { duration: "5m", target: 350 },

    // 5
    { duration: "2m", target: 400 },
    { duration: "5m", target: 400 },
    
    // 6
    { duration: "2m", target: 450 },
    { duration: "5m", target: 450 },
    
    { duration: "2m", target: 0 },
  ],
  thresholds: {
    // http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.05"],
  },
};

export default function (data) {
  // const pageSize = getRandomAllowedPageSize();
  const pageSize = 20;
  const searchPhrase = Math.random() > 0.5 ? getRandomSearchPhrase() : "";
  
  const url = `${BASE_URL}/api/patients?PageSize=${pageSize}&PageNumber=1&SearchPhrase=${searchPhrase}`;

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
