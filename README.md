# AI API Connector

一个用于连接多个AI平台的WebSocket API服务器和客户端脚本。该项目允许您通过统一的接口与多个AI平台进行交互。

## 功能特点

- 支持多个主流AI平台的连接
  - ChatGPT
  - Google Gemini
  - Poe
  - Kimi
  - ChatGLM
  - 百度文心一言
  - 阿里通义千问
  - Claude
  - DeepSeek

- 实时WebSocket通信
- 自动重连机制
- 跨平台支持

## 环境要求

- Node.js (建议版本 >= 14.0.0)
- 现代浏览器（支持WebSocket）
- Tampermonkey浏览器扩展

## 安装步骤

1. 克隆或下载项目代码

2. 安装依赖
```bash
npm install
```

3. 在Tampermonkey中安装客户端脚本
   - 打开Tampermonkey扩展
   - 创建新脚本
   - 将`client.js`的内容复制到新脚本中
   - 保存脚本

## 使用说明

### 启动服务器

1. 在项目目录下运行：
```bash
node server.js
```
服务器将在本地8080端口启动。

### 使用客户端

1. 确保服务器已经启动

2. 使用浏览器访问支持的AI平台网站（如ChatGPT、Gemini等）

3. Tampermonkey脚本会自动运行并连接到WebSocket服务器

4. 现在您可以通过WebSocket服务器与AI平台进行交互

## 工作原理

1. 服务器（server.js）
   - 创建WebSocket服务器
   - 管理客户端连接
   - 处理消息路由

2. 客户端脚本（client.js）
   - 自动识别当前AI平台
   - 建立WebSocket连接
   - 处理消息发送和接收
   - 自动重连机制

## 常见问题

1. **连接失败**
   - 确保服务器正在运行
   - 检查端口8080是否被占用
   - 确认防火墙设置

2. **脚本无法运行**
   - 确保Tampermonkey正确安装
   - 检查脚本是否正确安装
   - 确认浏览器兼容性

3. **消息发送失败**
   - 检查网络连接
   - 确认WebSocket连接状态
   - 查看浏览器控制台错误信息

## 注意事项

- 确保网络连接稳定
- 遵守各AI平台的使用条款
- 定期检查并更新脚本以适应平台变化

## 贡献

欢迎提交问题和改进建议！

## 许可证

MIT License