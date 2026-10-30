# 大学毕业生家长调查问卷

手机优先的中文单页问卷，按提供的截图还原全部 25 题。纯 HTML/CSS/JavaScript，无构建和线上依赖。

网站：https://zslhentai.github.io/graduate-parent-survey/

## 开放收集前：只需配置 Formspree

1. 在 [Formspree](https://formspree.io/) 注册或登录你自己的个人账户，验证邮箱，新建项目和表单。
2. 复制表单的提交地址，格式为 `https://formspree.io/f/xxxxxxxx`。
3. 编辑仓库根目录的 `config.js`，把 `formspreeEndpoint` 的空字符串改成该地址，提交到 `main`。GitHub Pages 会自动更新。
4. 在 Formspree 的项目 Settings → Restrict to Domain 中填写 `zslhentai.github.io`（不带协议或路径）；若换域名，同步修改。该选项限制正常网页来源，不替代服务端反垃圾措施。
5. 使用自己的个人项目，不邀请团队成员，不添加共享结果、GitHub Issues、Google Sheets、Webhook 等输出集成。若只想在后台看答案，在 Workflow 中关闭邮件通知和转发动作，避免邮箱中出现答案副本。
6. 按 Formspree 当前界面启用合适的服务端垃圾过滤。当前页面没有 CAPTCHA 交互；若开启“必须完成 CAPTCHA”，需先接入对应控件并复测，不要直接开启后分发。
7. 使用明显标注“测试”的虚构答案实际提交一次，在 Formspree → 表单 → Submissions/Inbox 中确认收到全部 25 题（第 11 题拆为 4 个字段），再分享网站。

未填接收地址时，页面可浏览和填写，但显示“暂未开放提交”，不会向任何地方发送答案。仅设置形如上述地址且不代表激活成功，必须通过第 7 步验收。

`config.js` 中的表单地址是公开的写入入口，可以放在 GitHub；它不是读取权限。**不要放账户密码、API Key、私有访问令牌或答案。**

## GitHub Pages

仓库 Settings → Pages → Build and deployment：选择 **Deploy from a branch**，分支 **main**，目录 **/(root)**，保存。等待 Pages 构建完成，打开上述网址。根目录 `.nojekyll` 禁止不必要的 Jekyll 处理。

## 行为与隐私边界

- 25 题全部必填。年龄接受 1–120 的整数。第 11 题分别填写两个优点和两个缺点；其余开放题可填“不愿回答”或“暂无”。每个文本栏最多 2000 字符。
- 按完成的题目统计进度；空白字符不计入完成；漏填定位第一处错误；键盘可操作，输入字号不低于 16px。
- 点击提交前检查完成情况和知情勾选；提交中禁用按钮；只有 Formspree 返回成功确认才显示成功并清空页面答案。
- 网络、服务端拒绝、限额、无效返回、超时均保留本页内容。超时后可能已到达服务端，请先核对后台，避免重复提交；没有自动重试。
- 回答通过 HTTPS POST 直接发送至 Formspree；不使用 URL 参数承载回答，不读取答案 API，不写入 GitHub，不使用 localStorage/sessionStorage/cookie，不引入统计或广告脚本。
- 未提交内容只在当前页面内存中，刷新、关闭或微信回收页面可能丢失；浏览器支持时离开页面会提示。微信未必显示离开确认。
- 公众无法通过本网站读取其他人的回答。后台可见范围最终取决于你的 Formspree 账户、成员权限和输出集成；Formspree 作为托管服务商仍会处理数据，不能承诺服务商也无法访问。
- GitHub Pages 和 Formspree 在不同地区/微信网络中的可达性取决于实际网络，请用目标手机与微信实测。免费配额、保留期限和导出功能以当前账户方案为准。

## 本地预览

在本目录执行 `python -m http.server 8000 --bind 127.0.0.1`，然后打开 `http://127.0.0.1:8000`。不需要安装前端包。

## 官方资料

- [Formspree AJAX](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax)
- [Formspree 来源域名限制](https://help.formspree.io/articles/form-and-project-settings/restrict-to-domain)
- [GitHub Pages 发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
