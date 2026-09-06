# 小说吐槽大会

## Render Deployment

1. 将项目推送到 GitHub。
2. 在 Render 创建 **Web Service** 并连接该仓库。
3. Build Command 设置为 `npm install`。
4. Start Command 设置为 `npm start`。
5. 在 Render 环境变量中设置一个私密的 `ADMIN_KEY`。
6. 部署完成后：手机打开 `https://YOUR_DOMAIN/live`；平板打开 `https://YOUR_DOMAIN/admin` 并输入管理员控制码。

Render 会自动提供 `PORT`。本地未设置 `PORT` 时，服务继续使用 `5173`。
