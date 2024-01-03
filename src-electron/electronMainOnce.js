import { ipcMain } from 'electron'
import { createBrowser, creatPage } from './utils'

export const creatWindowOnce = () => {
  ipcMain.on('creatLoginWindow', async (event) => {
    // 登录创建浏览器
    if (!!global.browserInfo.loginBrowser) {
      return event.sender.send('setNotify', { type: 'info', message: '已打开登录窗口，请登录！' });
    }
    const { loginPage, loginBrowser } = await createBrowser();
    global.browserInfo.loginBrowser = loginBrowser;
    const loginedPng = 'https://zsdl.zj.sgcc.com.cn/isg/app/gopwfront/assets/images/logout.png'
    await loginPage.on('response', async (response) => {
      const url = response.url();
      if (url.includes(loginedPng)) {
        /** 手动登录 */
        event.sender.send('loginedPowerGrid', '手动登录');
      }
      const status = (await response.json())?.responseText;
      /** 掉线 */
      if (status?.rtnCode === '22') {
        event.sender.send('outPowerGrid', '掉线');
      }
      if (status?.rtnCode === '0' && status?.rtnMsg === '退出成功') {
        event.sender.send('outPowerGrid', '掉线');
      }
    });
  });

  ipcMain.on('creatWindow', async (event, taskCode) => {
    // 创建新的窗口
    if (Object.keys(global.browserInfo.taskPage)?.includes(taskCode)) {
      return event.sender.send('setNotify', { type: 'info', message: '正在执行，请勿重复执行！' });
    }
    const { taskPage } = await creatPage();
    global.browserInfo.taskPage = { [taskCode]: taskPage };
    global.setLog('创建新窗口');

  });
}
