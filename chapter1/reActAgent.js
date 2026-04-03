// ============================================
// 从零开始构建Agent框架 - 第一章：基础架构
// ============================================

import 'dotenv/config';  // 加载.env文件到process.env
import OpenAI from 'openai';
import { search } from "./utils/search.js";

// 调试：查看环境变量是否加载成功
const apiKey = process.env.OPENAI_API_KEY || 'your-api-key-here';
const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
console.log('🔑 API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : '未设置');
console.log('🌐 Base URL:', baseURL);

// 初始化 SerpApi - search.js 已自动处理 API key

// 1. 初始化OpenAI客户端
const client = new OpenAI({
    apiKey,
    baseURL
});


// 4. Agent核心类
class LLMAgent {
    constructor(client, model = 'deepseek-chat') {
        this.client = client;
        this.model = model;
    }

    // 运行Agent
    async think(userMessage) {

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
            messages: userMessage,
            stream: true
        });

        let fullContent = '';
        for await (const chunk of response) {
            fullContent += chunk.choices[0]?.delta?.content || '';
        }
        console.log("response=", fullContent)
        return fullContent;
    }
}

/**
 *     def __init__(self):
        self.tools: Dict[str, Dict[str, Any]] = {}

    def registerTool(self, name: str, description: str, func: callable):
        """
        向工具箱中注册一个新工具。
        """
        if name in self.tools:
            print(f"警告:工具 '{name}' 已存在，将被覆盖。")
        self.tools[name] = {"description": description, "func": func}
        print(f"工具 '{name}' 已注册。")

    def getTool(self, name: str) -> callable:
        """
        根据名称获取一个工具的执行函数。
        """
        return self.tools.get(name, {}).get("func")

    def getAvailableTools(self) -> str:
        """
        获取所有可用工具的格式化描述字符串。
        """
        return "\n".join([
            f"- {name}: {info['description']}" 
            for name, info in self.tools.items()
        ])
 */

class ToolBox {
  constructor() {
    this.tools = new Map();
  }

  /**
   * 向工具箱中注册一个新工具。
   */
  registerTool(name, description, func) {
    if (this.tools.has(name)) {
      console.warn(`警告: 工具 '${name}' 已存在，将被覆盖。`);
    }
    this.tools.set(name, { description, func });
    console.log(`工具 '${name}' 已注册。`);
  }

  /**
   * 根据名称获取一个工具的执行函数。
   */
  getTool(name) {
    return this.tools.get(name)?.func;
  }

  /**
   * 获取所有可用工具的格式化描述字符串。
   */
  getAvailableTools() {
    let result = "";
    this.tools.forEach((info, name) => {
      result += `- ${name}: ${info.description}\n`;
    });
    return result.trim();
  }
}

class ReActAgent {
  constructor(llmAgent, toolExecutor, maxSteps = 5) {
    this.llmAgent = llmAgent;
    this.toolExecutor = toolExecutor;
    this.maxSteps = maxSteps;
    this.history = [];
  }

  // 解析 LLM 的输出，提取 Thought 和 Action
  _parseOutput(text) {
    // Thought: 匹配到 Action: 或文本末尾
    const thoughtMatch = text.match(/Thought:\s*(.*?)(?=\nAction:|$)/s);
    // Action: 匹配到文本末尾
    const actionMatch = text.match(/Action:\s*(.*?)$/s);
    const thought = thoughtMatch ? thoughtMatch[1].trim() : null;
    const action = actionMatch ? actionMatch[1].trim() : null;
    return { thought, action };
  }

  // 解析 Action 字符串，提取工具名称和输入
  _parseAction(actionText) {
    const match = actionText.match(/(\w+)\[(.*)\]/s);
    if (match) {
      return { toolName: match[1], toolInput: match[2] };
    }
    return { toolName: null, toolInput: null };
  }

  // 构建 prompt
  _buildPrompt(question) {
    const toolsDesc = this.toolExecutor.getAvailableTools();
    const historyStr = this.history.join("\n");
    return REACT_PROMPT_TEMPLATE
      .replace("{tools}", toolsDesc)
      .replace("{question}", question)
      .replace("{history}", historyStr);
  }

  // 运行 Agent
  async run(question) {
    this.history = [];
    let currentStep = 0;

    while (currentStep < this.maxSteps) {
      currentStep += 1;
      const prompt = this._buildPrompt(question);
      const messages = [{ role: "user", content: prompt }];

      // 调用 LLM
      const responseText = await this.llmAgent.think(messages)

      // console.log("think_response=", responseText)
      if (!responseText) {
        console.log("错误: LLM 未能返回有效响应。");
        break;
      }

      console.log(`[步骤 ${currentStep}] LLM 响应:`, responseText);

      // 解析输出
      const { thought, action } = this._parseOutput(responseText);
      if (thought) {
        this.history.push(`Thought: ${thought}`);
      }

      if (!action) {
        console.log("未找到有效的 Action，继续下一个循环。");
        continue;
      }

      // 解析 Action
      const { toolName, toolInput } = this._parseAction(action);
      console.log(`[步骤 ${currentStep}] 解析 Action: ${toolName}[${toolInput}]`);

      if (toolName === "Finish") {
        console.log("🎉 完成! 最终答案:", toolInput);
        return toolInput;
      }

      if (toolName && this.toolExecutor.getTool(toolName)) {
        // 执行工具
        const toolFunc = this.toolExecutor.getTool(toolName);
        const toolResult = await toolFunc(toolInput);
        this.history.push(`Action: ${toolName}[${toolInput}] => 结果: ${toolResult}`);
        console.log(`[步骤 ${currentStep}] 工具执行结果:`, toolResult);
      } else {
        console.log(`警告: 未找到工具 '${toolName}'`);
      }
    }

    console.log("达到最大步数限制，未找到最终答案。");
    return null;
  }
}
const REACT_PROMPT_TEMPLATE = `
请注意，你是一个有能力调用外部工具的智能助手。

可用工具如下:
{tools}

请严格按照以下格式进行回应:

Thought: 你的思考过程，用于分析问题、拆解任务和规划下一步行动。
Action: 你决定采取的行动，必须是以下格式之一:
- {{tool_name}}[{{tool_input}}]:调用一个可用工具。
- Finish[最终答案]:当你认为已经获得最终答案时。
- 当你收集到足够的信息，能够回答用户的最终问题时，你必须在Action:字段后使用 Finish[最终答案] 来输出最终答案。

现在，请开始解决以下问题:
Question: {question}
History: {history}`

// 5. 使用示例
async function main() {
    console.log('🤖 Agent启动...\n');

    const agent = new LLMAgent(client);

    const toolbox = new ToolBox();
    const tool_name = "Search"
    toolbox.registerTool(tool_name, "desc: this is a tool", search)

    /*
    console.log("\n--- 执行 Action: Search['英伟达最新的GPU型号是什么'] ---")
    const tool_input = "where is china"
    const toolFunc = toolbox.getTool(tool_name)
    if (toolFunc){
      const res = await toolbox.getTool(tool_name)(tool_input)
      console.log("结果是---", res)
    }else{
      console.log("no tools found")
    }
      */
    const reactAgent = new ReActAgent(agent, toolbox, 5)
    reactAgent.run("华为最新手机型号及主要卖点")
}

main().catch(console.error);
