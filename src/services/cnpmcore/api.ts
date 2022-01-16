// @ts-ignore
/* eslint-disable */
import { request } from "umi";
import gravatar from "gravatar";

const REGISTRY = process.env.CNPM_REGISTRY ?? "https://r.cnpmjs.org";
const CURRENT_USER_TOKEN = "CURRENT_USER_TOKEN";
const CURRENT_USER = "CURRENT_USER";

function getCurrentUser() {
  const userString = localStorage.getItem(CURRENT_USER);
  if (!userString) return null;
  return JSON.parse(userString) as API.CurrentUser;
}

function updateCurrentUser(user: API.CurrentUser) {
  if (!user) {
    localStorage.removeItem(CURRENT_USER);
    return;
  }
  localStorage.setItem(
    CURRENT_USER,
    JSON.stringify({
      ...getCurrentUser(),
      ...user,
    })
  );
}

/** 获取当前的用户 */
export async function currentUser(options?: { [key: string]: any }) {
  const token = localStorage.getItem(CURRENT_USER_TOKEN);
  if (!token) return { data: undefined };
  const result = await request<API.CurrentUser>(
    `${REGISTRY}/-/npm/v1/user`,
    {
      method: "GET",
      ...(options || {}),
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
  if (result.email) {
    result.avatar = gravatar.url(result.email, { protocol: 'https' });
    updateCurrentUser(result);
  }
  return { data: result };
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  const token = localStorage.getItem(CURRENT_USER_TOKEN);
  localStorage.clear();
  if (!token) return;

  return request<Record<string, any>>(`${REGISTRY}/-/user/token/${token}`, {
    method: "DELETE",
    ...(options || {}),
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}

/** 登录接口 POST /api/login/account */
export async function login(
  body: API.LoginParams,
  options?: { [key: string]: any }
) {
  // return request<API.LoginResult>('/api/login/account', {
  // 需要一个全局变量来指定 endpoint
  let token = localStorage.getItem(CURRENT_USER_TOKEN);
  if (token) {
    return { ok: true, token };
  }
  const result = await request<API.LoginResult>(
    `${REGISTRY}/-/user/org.couchdb.user:${body.username}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        type: "user",
        name: body.username,
        password: body.password,
      },
      ...(options || {}),
    }
  );
  if (result.token) {
    localStorage.setItem(CURRENT_USER_TOKEN, result.token);
  }
  return result;
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>("/api/notices", {
    method: "GET",
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any }
) {
  return request<API.RuleList>("/api/rule", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>("/api/rule", {
    method: "PUT",
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>("/api/rule", {
    method: "POST",
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>("/api/rule", {
    method: "DELETE",
    ...(options || {}),
  });
}
