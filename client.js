// ==UserScript==
// @name         AI API Connector
// @description  Connect AI platforms to WebSocket API server
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @author       Your Name
// @match        https://chatgpt.com/*
// @match        https://gemini.google.com/*
// @match        https://poe.com/*
// @match        https://kimi.moonshot.cn/*
// @match        https://chatglm.cn/*
// @match        https://yiyan.baidu.com/*
// @match        https://tongyi.aliyun.com/*
// @match        https://qianwen.aliyun.com/*
// @match        https://claude.ai/*
// @match        https://chat.deepseek.com/*
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(async function() {
    'use strict';
    
    let isRunning = true;
    let AI = "ChatGPT";
    const host = location.host;
    
    // 确定当前AI平台
    if (host === 'chatgpt.com') {
        AI = "ChatGPT";
    } else if (host === 'gemini.google.com') {
        AI = "Gemini";
    } else if (host === 'poe.com') {
        AI = "Poe";
    } else if (host === 'kimi.moonshot.cn') {
        AI = "Kimi";
    } else if (host === "chatglm.cn") {
        AI = "Chatglm";
    } else if (host === 'yiyan.baidu.com') {
        AI = "Yiyan";
    } else if (host === 'tongyi.aliyun.com' || host === 'qianwen.aliyun.com') {
        AI = "Tongyi";
    } else if (host.includes("claude")) {
        AI = "Claude";
    } else if (host === 'chat.deepseek.com') {
        AI = "DeepSeek";
    }

    // WebSocket连接和重连逻辑
    let ws = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000;

    const connectWebSocket = () => {
        ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log('Connected to WebSocket server');
            reconnectAttempts = 0;
            // 注册AI平台
            ws.send(JSON.stringify({
                type: 'register',
                ai: AI
            }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'message') {
                    // 接收到消息，设置到输入框并发送
                    setText(data.text);
                }
            } catch (error) {
                console.error('Failed to parse message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
            if (isRunning && reconnectAttempts < maxReconnectAttempts) {
                reconnectAttempts++;
                console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
                setTimeout(connectWebSocket, reconnectDelay);
            }
        };
    };

    connectWebSocket();

    // 设置输入框文本并发送
    const setText = async (text) => {
        const dispatchInput = (selector) => {
            const inputNode = document.querySelector(selector);
            if (!inputNode) return;

            inputNode.value = text;
            try {
                inputNode.innerHTML = text.split("\n").map(i => `<p>${i}</p>`).join("\n");
            } catch {}

            const event = new Event('input', { bubbles: true });
            inputNode.dispatchEvent(event);
        };

        // 根据不同AI平台设置选择器
        if (AI === "ChatGPT") {
            dispatchInput('#prompt-textarea');
        } else if (AI === "Gemini") {
            dispatchInput('textarea[placeholder="Enter a prompt here"]');
        } else if (AI === "Claude") {
            dispatchInput('textarea[placeholder="Message Claude…"]');
        } else if (AI === "Poe") {
            dispatchInput('.ChatMessageInputView_textInput__Aervw');
        } else if (AI === "Kimi") {
            dispatchInput('.chat-input-box');
        } else if (AI === "Chatglm") {
            dispatchInput('.chat-input');
        } else if (AI === "Yiyan") {
            dispatchInput('#searchbox');
        } else if (AI === "Tongyi") {
            dispatchInput('.ant-input');
        } else if (AI === "DeepSeek") {
            dispatchInput('.input-box textarea');

        // 模拟点击发送按钮
        setTimeout(() => {
            const button = document.querySelector('button[type="submit"]');
            if (button) button.click();
        }, 100);
    };

    // 监听AI响应
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            // 根据不同AI平台获取响应文本
            let responseText = "";
            let isDone = false;

            if (AI === "ChatGPT") {
                const outputEle = [...document.querySelectorAll('.group')].slice(-1)[0];
                if (outputEle) {
                    isDone = !outputEle.querySelector('.result-streaming');
                    responseText = outputEle.querySelector('.markdown').textContent;
                }
            } else if (AI === "Gemini") {
                const outputEle = [...document.querySelectorAll('.conversation-container')].slice(-1)[0];
                if (outputEle) {
                    isDone = Boolean(outputEle.querySelector(".complete"));
                    responseText = outputEle.querySelector(".markdown").textContent;
                }
            } else if (AI === "Poe") {
                const outputEle = document.querySelector('.ChatMessage_botMessageBubble__CPGMI');
                if (outputEle) {
                    isDone = !outputEle.querySelector('.ChatMessage_streamingDots__mvi6u');
                    responseText = outputEle.textContent;
                }
            } else if (AI === "Kimi") {
                const outputEle = document.querySelector('.chat-message-item.assistant');
                if (outputEle) {
                    isDone = !outputEle.querySelector('.loading-dots');
                    responseText = outputEle.querySelector('.message-content').textContent;
                }
            } else if (AI === "Chatglm") {
                const outputEle = document.querySelector('.chat-message.assistant');
                if (outputEle) {
                    isDone = !outputEle.querySelector('.typing-animation');
                    responseText = outputEle.querySelector('.message-content').textContent;
                }
            } else if (AI === "Yiyan") {
                const outputEle = document.querySelector('.answer-content');
                if (outputEle) {
                    isDone = !outputEle.querySelector('.typing-cursor');
                    responseText = outputEle.textContent;
                }
            } else if (AI === "Tongyi") {
                const outputEle = document.querySelector('.chat-message.assistant');
                if (outputEle) {
                    isDone = !outputEle.querySelector('.typing');
                    responseText = outputEle.querySelector('.message-text').textContent;
                }
            } else if (AI === "DeepSeek") {
                const outputEle = document.querySelector('.message-item.assistant');
                if (outputEle) {
                    isDone = !outputEle.querySelector('.loading-animation');
                    responseText = outputEle.querySelector('.message-content').textContent;
                }
            }

            if (responseText) {
                ws.send(JSON.stringify({
                    type: 'response',
                    ai: AI,
                    text: responseText,
                    isDone: isDone
                }));
            }
        }
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    } // 修复缺失的右花括号，用于闭合 setText 函数
})(); // 修复自执行函数的闭合
