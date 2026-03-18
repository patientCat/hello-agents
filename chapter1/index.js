// ============================================
// 从零开始构建Agent框架 - 第一章：基础架构
// ============================================

import 'dotenv/config';  // 加载.env文件到process.env
import OpenAI from 'openai';

// 调试：查看环境变量是否加载成功
const apiKey = process.env.OPENAI_API_KEY || 'your-api-key-here';
const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
console.log('🔑 API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : '未设置');
console.log('🌐 Base URL:', baseURL);

// 1. 初始化OpenAI客户端
const client = new OpenAI({
    apiKey,
    baseURL
});

// 4. Agent核心类
class SimpleThinkAgent {
    constructor(client, model = 'deepseek-chat') {
        this.client = client;
        this.model = model;
        this.messages = [];
    }

    // 运行Agent
    async think(userMessage) {
        // 添加用户消息
        this.messages.push({
            role: 'user',
            content: userMessage
        });

        /*
        // 同步
        let response = await this.client.chat.completions.create({
          model: this.model,
          messages: this.messages,
        });
        return response.choices[0].message.content;
        */
        // 流式
        let response = await this.client.chat.completions.create({
            model: this.model,
            messages: this.messages,
            stream: true
        });

        let fullContent = '';
        for await (const chunk of response) {
            fullContent += chunk.choices[0]?.delta?.content || '';
        }
        return fullContent;
    }
}

// 5. 使用示例
async function main() {
    console.log('🤖 Agent启动...\n');

    const agent = new SimpleThinkAgent(client);

    // 示例：计算保险分红
    const userQuery = `
    hello, what's your name
  `;

    console.log('用户问题:', userQuery);

    const answer = await agent.think(userQuery);
    console.log('\n🤖 Agent回复:', answer);
}

main().catch(console.error);
