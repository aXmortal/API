const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const wss = new WebSocket.Server({ port: 8080 });

// 存储WebSocket连接和对应的AI平台信息
const connections = new Map();

// WebSocket连接处理
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'register') {
        // 注册新的AI连接
        connections.set(data.ai, ws);
        console.log(`New connection registered for ${data.ai}`);
      } else if (data.type === 'response') {
        // 处理AI响应
        const responseData = {
          ai: data.ai,
          text: data.text,
          isDone: data.isDone
        };
        // 这里可以添加响应处理逻辑
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    // 清理断开的连接
    for (const [ai, conn] of connections.entries()) {
      if (conn === ws) {
        connections.delete(ai);
        console.log(`Connection closed for ${ai}`);
        break;
      }
    }
  });
});

// API路由
app.post('/api/chat', async (req, res) => {
  const { ai, message } = req.body;
  const ws = connections.get(ai);

  if (!ws) {
    return res.status(404).json({ error: `No connection found for ${ai}` });
  }

  try {
    ws.send(JSON.stringify({
      type: 'message',
      text: message
    }));
    res.json({ status: 'message sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// 获取可用的AI列表
app.get('/api/available', (req, res) => {
  const available = Array.from(connections.keys());
  res.json({ available });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});