import puppeteer from 'puppeteer';
import fs from 'fs';

const
  gopwInvokeAPI = 'https://zsdl.zj.sgcc.com.cn/zj_eqa/open/gopwInvoke', // 数据接口
  zsdlUrl = 'https://zsdl.zj.sgcc.com.cn/isg/app/gopwfront/pages/main/main.html'; // zsdl页面

// 重写decryptDes
export const setDecryptDes = async (page) => {
  await page.evaluate(() => {
    window.decryptDes = (c) => {
      window.gopwInvokeRes = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(c)
      }, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8);
      return window.gopwInvokeRes;
    }
  });
};

// 解析接口结果
export const getGopwInvokeRes = async (page, res) => {
  const response = await page.evaluate(async (r) => {
    await window.decryptDes(r.responseText || '');
    return JSON.parse(window.gopwInvokeRes || '{}');
  }, res);
  return response;
}

// 创建浏览器
export const createBrowser = async () => {
  const browser = await puppeteer.launch({
    defaultViewport: null,
    headless: false,
    ignoreHTTPSErrors: true,
    args: ['--start-maximized', '--ignore-https-errors'],
  });
  const page = await browser.newPage();
  await page.goto(zsdlUrl);
  // 开发环境下快速登录
  if (process.env.DEV) {
    await setDecryptDes(page);
    // 点击到登录页面
    const goToLoginBtnDom = await page.waitForXPath('/html/body/div[1]/div[1]/div[1]/div/div[2]/span[2]');
    await goToLoginBtnDom.click();

    // 监听登录页面验证码接口
    await page.waitForResponse(gopwInvokeAPI);

    // 登录
    const
      userNameDom = await page.waitForXPath('/html/body/div[1]/div[2]/div/div[2]/div/div[1]/form/div[1]/div/div/div[1]/input'),
      passwordDom = await page.waitForXPath('/html/body/div[1]/div[2]/div/div[2]/div/div[1]/form/div[2]/div/div/div/input'),
      codeDom = await page.waitForXPath('/html/body/div[1]/div[2]/div/div[2]/div/div[1]/form/div[3]/div[1]/div/div/div/input');

    const code = await page.evaluate(() => JSON.parse(window.gopwInvokeRes || '{}')?.randomCode || '');
    await userNameDom.focus();
    await userNameDom.type('13506780199');
    await passwordDom.focus();
    await passwordDom.type('Zrjya!1229');
    await codeDom.focus();
    await codeDom.type(code);
  }
  return { loginPage: page, loginBrowser: browser };
};

// 创建窗口
export const creatPage = async (browser, cookies, storage) => {
  // 创建一个匿名的浏览器上下文
  const taskBrowserContext = await browser.createIncognitoBrowserContext();
  // 在一个原生的上下文中创建一个新页面
  const taskPage = await taskBrowserContext.newPage();
  // 打开首页
  await taskPage.goto(zsdlUrl);
  await setCookies(taskPage, cookies, storage);
  await taskPage.reload();
  await setDecryptDes(taskPage);
  await taskPage.waitForSelector('#home > div.cards > div > div');
  // 设置下载路径、自动下载
  const client = await taskPage.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: 'download/xls',
  });
  await taskPage.waitForTimeout(1000);
  return { taskBrowserContext, taskPage };
};

// 存储 cookies
export const getCookies = async (loginPage) => {
  // 监听登录成功进入首页
  const cookies = await loginPage.cookies();
  const storage = await loginPage.evaluate(() => {
    return {
      userAgent: navigator.userAgent,
      localStorage: JSON.parse(JSON.stringify(window.localStorage)),
      sessionStorage: JSON.parse(JSON.stringify(window.sessionStorage)),
    }
  });
  global.login.cookies = cookies;
  global.login.local = local;
};

// 获取 cookies
export const setCookies = async (page, cookies, local) => {
  await page.setBypassCSP(true);
  await page.setCookie(...cookies);
  await page.setUserAgent(local.userAgent);
  await page.evaluate((local) => {
    Object.keys(local.localStorage || {})?.forEach(n => {
      localStorage.setItem(n, local.localStorage[n] || '');
    })
    Object.keys(local.sessionStorage || {})?.forEach(n => {
      sessionStorage.setItem(n, local.sessionStorage[n] || '');
    })
  }, local);
};

// 跳转页面
export const goToPage = async (page, targetMenus = []) => {
  const menus = await page.$$('#main > div.header > div.nav > div > div');
  for (let i = 0; i < menus?.length; i++) {
    const text = await page.evaluate((el) => el.textContent, menus[i]);
    if (text.trim() === targetMenus[0]) {
      await menus[i].click();
      await page.waitForTimeout(1000);
      break;
    }
  }
  if (targetMenus?.length === 1) return;
  await page.waitForSelector('#eleSales > div > div.left');
  await page.waitForTimeout(1000);

  const childMenus = await page.$$('#eleSales > div > div.left > div.menu-container');
  for (let tmInd = 1; tmInd < targetMenus?.length; tmInd++) {
    for (let cmInd = 0; cmInd < childMenus?.length; cmInd++) {
      const childMenuText = await page.evaluate((el) => el.textContent, childMenus[cmInd]);
      if (childMenuText.trim() === targetMenus[tmInd]) {
        await childMenus[cmInd].click();
        break;
      }
    }
  }
};

// 等待文件出现
export const waitForFile = async ({ filePath, fileName, isUpload, page }) => {
  return new Promise((resolve) => {
    let isFile = false, interval = null;
    interval = setInterval(async () => {
      fs.stat(`${filePath}/${fileName}`, (_, stats) => {
        isFile = stats?.isFile();
      })
      if (isFile) {
        if (isUpload) {
          const MENU = {
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            zip: 'application/zip',
            rar: 'application/x-rar-compressed'
          };

          const type = MENU[fileName.split('.')[1]];
          const file = page.evaluate(({ f, path, name, t }) => new File([f.readFileSync(path)], name, t ? { t } : {}), { fs, filePath, fileName, type });
          const res = await request('/annex/annex/upLoadFiles', {
            method: 'POST',
            requestType: 'formdata',
            data: { file, fileName }
          });
          // if (res?.statusCode !== this.$HTTP_CODE.SUCCESS) {
          //   this.logFn(`上传失败-${res?.message}`);
          // }
          // await this.$q.electron.ipcRenderer.send('setS3FileId', { fileName, res });
        }
        resolve(isFile);
        clearInterval(interval);
        interval = null;
      }
    }, 1000);
  });
};

// 设置输入框的值
export const setInputVal = async (page, input, value = '', isEnter = true) => {
  await input.focus();
  await input.click({ clickCount: 2 });
  await page.waitForTimeout(1000);
  await page.keyboard.press('Backspace');
  await input.type(String(value || ''));
  isEnter && await page.keyboard.press('Enter');
}
