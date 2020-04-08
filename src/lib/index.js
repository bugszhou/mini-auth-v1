import Promise from "promise";
import { miniAuth } from "miniapp-auth";
import sha256 from "hash.js/lib/hash/sha/256";

export const MODULE_NAME = "mini-auth-v1";

let auth = null;

export function creatMiniAuth(
  { appid, env, url, appKey, appCode, headers } = { env: "weapp" },
) {
  if (auth) {
    return auth;
  }

  const tokenReqConfig = {
    url,
    method: "POST",
    headers,
  };

  auth = miniAuth.create({
    appid,
    env,
    tokenReqConfig,
  });

  auth.use("token", (ctx, next) => {
    const { jsCode } = ctx.tokenReqData;
    if (jsCode) {
      if (typeof wx !== "undefined" && wx) {
        ctx.tokenReqData = {
          js_code: jsCode,
        };
      }
      if (typeof my !== "undefined" && my) {
        ctx.tokenReqData = {
          auth_code: jsCode,
        };
      }
      tokenReqConfig.headers["Authorization-Sign"] = sha256()
        .update(`${appKey}${JSON.stringify(ctx.tokenReqData)}${appCode}`)
        .digest("hex");
      auth.setTokenReqConfig("headers", tokenReqConfig.headers);
    }
    next();
  });
  auth.use("afterToken", (ctx, next) => {
    const {
      data = {},
      retcode,
      msg,
      code,
    } = ctx.tokenResData.data;
    if (retcode === 200 || code === 200) {
      ctx.tokenResData = data;
      return next();
    }
    return next({
      retcode: retcode || code,
      msg,
      data,
    });
  });

  return auth;
}

export function getToken(opts = {}) {
  const maxRetry = 3;

  return new Promise((resolve, reject) => {
    function selfGetToken(retry) {
      auth
        .getToken(opts)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          if (err.errCode === 5001 || err.errCode === 5002) {
            if (retry >= maxRetry) {
              reject(err);
            } else {
              setTimeout(() => {
                selfGetToken(retry + 1);
              }, 2000);
            }
          } else {
            reject(err);
          }
        });
    }
    selfGetToken(0);
  });
}
