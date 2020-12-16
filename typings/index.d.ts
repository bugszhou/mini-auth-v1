declare class MiniAuth<ID> {
  constructor(options?: IMiniAuthOptions);
  on: (eventName: string, evtData: Record<string, any>) => void;
  private getTokenReturn: ID;
}

interface IMiniAuthOptions {
  /**
   * 小程序appid
   */
  appid: string;
  /**
   * 根据jscode获取session_key的接口
   */
  url: string;
  /**
   * 接口签名key
   */
  appKey: string;
  /**
   * 接口签名code
   */
  appCode: string;
  /**
   * 使用环境：
   * 微信小程序：weapp
   * 支付宝小程序：aliapp
   */
  env: "weapp" | "aliapp";
  /**
   * 请求时携带的headers
   */
  headers?: {
    [key: string]: string;
  }
}

interface IMiniAuthGetTokenOptions {
  isRefresh: boolean;
}

interface IGetTokenReturn<IReturnData> {
  /**
   * 缓存的数据
   */
  data: IReturnData
  /**
   * 缓存有效时间，单位毫秒
   * 默认：6800000毫秒
   */
  expires: number;
  /**
   * 过期时间点，单位毫秒
   */
  expirationTime: number;
}

declare module "mini-auth-v1" {
  export function creatMiniAuth<ID>(options: IMiniAuthOptions): MiniAuth<ID>;
  export const getToken: <IReturnData>(opts?: IMiniAuthGetTokenOptions) => Promise<IGetTokenReturn<IReturnData>>;
}