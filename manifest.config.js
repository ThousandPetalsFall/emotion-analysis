export default {
  name: '情绪分析',
  appid: '__UNI__EMOTION_ANALYSIS',
  description: 'AI 驱动的情绪识别与分析工具',
  versionName: '1.0.0',
  versionCode: '100',
  transformPx: false,
  mpWeixin: {
    appid: 'wx________', // 替换为实际小程序 AppID
    setting: {
      urlCheck: false,
      es6: true,
      postcss: true,
      minified: true
    },
    usingComponents: true,
    permission: {
      'scope.chooseMessage': {
        desc: '用于选择图片进行情绪分析'
      }
    }
  }
}
