import { miniAuth } from 'miniapp-auth';
import { defaultSign } from 'mksign';

export const MODULE_NAME = 'mini-auth-v1';

let auth = null;

export function creatMiniAuth({ appid, env, url, appKey, appSecret } = { env: 'weapp' }) {
  if (auth) {
    return auth;
  }

  auth = miniAuth.create({
    appid,
    env,
    tokenReqConfig: {
      url,
      method: 'POST',
    },
  });

  auth.use('token', (ctx, next) => {
    const { jsCode } = ctx.tokenReqData;
    if (jsCode) {
      ctx.tokenReqData = {
        js_code: jsCode,
        sign: defaultSign({
          js_code: jsCode,
          app_key: appKey,
        }, [appSecret]),
        app_key: appKey,
      };
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
  let maxRetry = 3;

  return new Promise((resolve, reject) => {
    selfGetToken(0);
    function selfGetToken(retry) {
      auth
        .getToken(opts)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          if (retry >= maxRetry) {
            return reject(err);
          }
          if (err.errCode === 5001 || err.errCode === 5002) {
            selfGetToken(retry + 1);
          }
        });
    }
  });
};
