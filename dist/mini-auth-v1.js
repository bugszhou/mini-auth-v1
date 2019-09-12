(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('promise'), require('miniapp-auth'), require('mksign')) :
  typeof define === 'function' && define.amd ? define(['exports', 'promise', 'miniapp-auth', 'mksign'], factory) :
  (global = global || self, (function () {
    var current = global['mini-auth-v1'];
    var exports = global['mini-auth-v1'] = {};
    factory(exports, global.Promise, global.miniappAuth, global.mksign);
    exports.noConflict = function () { global['mini-auth-v1'] = current; return exports; };
  }()));
}(this, function (exports, Promise, miniappAuth, mksign) { 'use strict';

  Promise = Promise && Promise.hasOwnProperty('default') ? Promise['default'] : Promise;

  var auth=null;function creatMiniAuth(){var _ref=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{env:"weapp"},appid=_ref.appid,env=_ref.env,url=_ref.url,appKey=_ref.appKey,appCode=_ref.appCode,headers=_ref.headers;return auth?auth:(auth=miniappAuth.miniAuth.create({appid:appid,env:env,tokenReqConfig:{url:url,method:"POST",headers:headers}}),auth.use("token",function(ctx,next){var jsCode=ctx.tokenReqData.jsCode;jsCode&&("undefined"!=typeof wx&&wx&&(ctx.tokenReqData={js_code:jsCode,sign:mksign.defaultSign({js_code:jsCode,app_key:appKey},[appCode]),app_key:appKey}),"undefined"!=typeof my&&my&&(ctx.tokenReqData={auth_code:jsCode,sign:mksign.defaultSign({auth_code:jsCode,app_key:appKey},[appCode]),app_key:appKey})),next();}),auth.use("afterToken",function(ctx,next){var _ctx$tokenResData$dat=ctx.tokenResData.data,_ctx$tokenResData$dat2=_ctx$tokenResData$dat.data,data=void 0===_ctx$tokenResData$dat2?{}:_ctx$tokenResData$dat2,retcode=_ctx$tokenResData$dat.retcode,msg=_ctx$tokenResData$dat.msg;return 200===retcode?(ctx.tokenResData=data,next()):next({retcode:retcode,msg:msg,data:data})}),auth)}function getToken(){var opts=0<arguments.length&&arguments[0]!==void 0?arguments[0]:{};return new Promise(function(resolve,reject){function selfGetToken(retry){auth.getToken(opts).then(function(res){resolve(res);})["catch"](function(err){5001===err.errCode||5002===err.errCode?retry>=3?reject(err):setTimeout(function(){selfGetToken(retry+1);},2e3):reject(err);});}selfGetToken(0);})}

  exports.creatMiniAuth = creatMiniAuth;
  exports.getToken = getToken;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=mini-auth-v1.js.map
