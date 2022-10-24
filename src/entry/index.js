import {
  createMiniAuth,
  getToken,
} from '../lib/index';

/**
 * 兼容typo的导出，在下个大版本号更新后可去除
 */
const creatMiniAuth = createMiniAuth;

export {
  createMiniAuth,
  creatMiniAuth,
  getToken,
};
