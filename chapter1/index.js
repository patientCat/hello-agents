// ============================================
// 从零开始构建Agent框架 - 第一章：基础架构
// ============================================

import 'dotenv/config';  // 加载.env文件到process.env
import OpenAI from 'openai';

apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
console.log("apiKey=", apiKey)
// 1. 初始化OpenAI客户端
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
});

// 2. 定义工具（Tool）- Agent的"手"
const tools = [
  {
    type: 'function',
    function: {
      name: 'calculate_insurance_dividend',
      description: '计算保险分红金额',
      parameters: {
        type: 'object',
        properties: {
          principal: {
            type: 'number',
            description: '投保金额（元）'
          },
          years: {
            type: 'number',
            description: '投保年限'
          },
          rate: {
            type: 'number',
            description: '年度收益率（小数形式，如0.045表示4.5%）'
          },
          dividend_ratio: {
            type: 'number',
            description: '分红比例（小数形式，如0.7表示70%）'
          }
        },
        required: ['principal', 'years', 'rate', 'dividend_ratio']
      }
    }
  }
];

// 3. 工具执行函数
function calculateInsuranceDividend({ principal, years, rate, dividend_ratio }) {
  const totalReturn = principal * Math.pow(1 + rate, years);
  const dividend = (totalReturn - principal) * dividend_ratio;
  return {
    total_return: totalReturn.toFixed(2),
    dividend: dividend.toFixed(2),
    details: `投保${years}年，本金${principal}元，年化收益${(rate * 100).toFixed(1)}%，分红比例${(dividend_ratio * 100).toFixed(0)}%`
  };
}

// 4. Agent核心类
class SimpleAgent {
  constructor(client, model = 'gpt-4o-mini') {
    this.client = client;
    this.model = model;
    this.messages = [];
  }

  // 执行工具
  async executeTool(toolName, args) {
    const toolMap = {
      'calculate_insurance_dividend': calculateInsuranceDividend
    };
    
    const tool = toolMap[toolName];
    if (!tool) {
      throw new Error(`未知工具: ${toolName}`);
    }
    
    return tool(args);
  }

  // 运行Agent
  async run(userMessage) {
    // 添加用户消息
    this.messages.push({
      role: 'user',
      content: userMessage
    });

    // 第一次调用：让大模型决定是否使用工具
    let response = await this.client.chat.completions.create({
      model: this.model,
      messages: this.messages,
      tools: tools,
      tool_choice: 'auto'
    });

    const assistantMessage = response.choices[0].message;
    this.messages.push(assistantMessage);

    // 如果大模型决定调用工具
    if (assistantMessage.tool_calls) {
      for (const toolCall of assistantMessage.tool_calls) {
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments);
        
        console.log(`\n🔧 调用工具: ${toolName}`);
        console.log(`参数:`, toolArgs);
        
        // 执行工具
        const result = await this.executeTool(toolName, toolArgs);
        console.log(`结果:`, result);
        
        // 将工具结果返回给大模型
        this.messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result)
        });
      }

      // 第二次调用：让大模型基于工具结果生成最终回复
      response = await this.client.chat.completions.create({
        model: this.model,
        messages: this.messages
      });
      
      const finalMessage = response.choices[0].message;
      this.messages.push(finalMessage);
      
      return finalMessage.content;
    }

    // 如果不需要工具，直接返回
    return assistantMessage.content;
  }
}

// 5. 使用示例
async function main() {
  console.log('🤖 Agent启动...\n');
  
  const agent = new SimpleAgent(client);
  
  // 示例：计算保险分红
  const userQuery = `
    我有份分红险：
    - 投保金额: 100,000元
    - 投保年限: 5年
    - 年度收益率: 4.5%
    - 公司分红比例: 70%
    
    请帮我计算分红金额
  `;
  
  console.log('用户问题:', userQuery);
  
  const answer = await agent.run(userQuery);
  console.log('\n🤖 Agent回复:', answer);
}

main().catch(console.error);
