import Promise from 'promise';
import { miniAuth } from 'miniapp-auth';
import sha256 from 'hash.js/lib/hash/sha/256';

export const MODULE_NAME = 'mini-auth-v1';

let auth = null;

export function creatMiniAuth({
  appid, env, url, appKey, appCode, headers,
} = { env: 'weapp' }) {
  if (auth) {
    return auth;
  }

  auth = miniAuth.create({
    appid,
    env,
    tokenReqConfig: {
      url,
      method: 'POST',
      headers,
    },
  });

  auth.use('token', (ctx, next) => {
    const { jsCode } = ctx.tokenReqData;
    if (jsCode) {
      ctx.setTokenReqConfig('Authorization-Sign', sha256().update(`${appKey}${JSON.stringify(jsCode)}${appCode}`).digest('hex'));
      if (typeof wx !== 'undefined' && wx) {
        ctx.tokenReqData = {
          js_code: jsCode,
          app_key: appKey,
        };
      }
      if (typeof my !== 'undefined' && my) {
        ctx.tokenReqData = {
          auth_code: jsCode,
          app_key: appKey,
        };
      }
    }
    next();
  });
  auth.use('afterToken', (ctx, next) => {
    const { data = {}, retcode, msg } = ctx.tokenResData.data;
    if (retcode === 200) {
      ctx.tokenResData = data;
      return next();
    }
    return next({
      retcode,
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
        .then(res => {
          resolve(res);
        })
        .catch(err => {
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
