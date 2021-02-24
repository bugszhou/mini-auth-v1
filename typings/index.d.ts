declare class MiniAuth<IData extends {}> {
  constructor(options?: IMiniAuthOptions);
  on: (eventName: string, evtData: Record<string, any>) => void;
  /**
   * 缓存有效时间
   * @param time - 毫秒
   */
  setTokenExpires(time: number): void;
  /**
   * 获取缓存data中的数据
   * @param key - 固定值"token"
   */
  getDataFromStorage(key: "token"): IGetTokenReturn<IData>;
  /**
   * 更新缓存data的值
   * @param key - 固定值"token"
   * @param data - any;缓存数据
   */
  set2Storage(key: "token", data: IData): void;
  /**
   * 获取Token数据，遇到网络问题不会重试
   * @param opts - object
   */
  getToken(opts?: IMiniAuthGetTokenOptions): Promise<IGetTokenReturn<IData>>;
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
  /**
   * 是否强制刷新，默认值为false
   * 
   * true - 先删除缓存数据，然后重新获取js-code，请求服务端获取最新数据
   * 
   * false - 从缓存获取数据，如果缓存中的数据过期了，将执行值为true的步骤
   */
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
  export function creatMiniAuth<IReturnData>(options: IMiniAuthOptions): MiniAuth<IReturnData>;
  /**
   * 获取Token数据，遇到网络问题请求失败，会重试3次
   * @param opts - object
   */
  export const getToken: <IReturnData>(opts?: IMiniAuthGetTokenOptions) => Promise<IGetTokenReturn<IReturnData>>;
}