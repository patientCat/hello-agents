import "dotenv/config";
import { getJson, config } from "serpapi";

/**
 * 基于 SerpApi 的网页搜索引擎工具
 * 智能解析搜索结果，优先返回直接答案或知识图谱信息
 */
export async function search(query) {
  console.log(`🔍 正在执行 [SerpApi] 网页搜索: ${query}`);

  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) {
    return "错误: SERPAPI_API_KEY 未在 .env 文件中配置。";
  }

  try {
    // 设置全局配置
    config.api_key = apiKey;

    // console.log("📡 正在请求 SerpApi...");
    const results = await getJson({
      engine: "google",
      q: query,
      gl: "cn",
      hl: "zh-cn",
    });

    // 打印完整返回结果用于调试
    // console.log("📦 SerpApi 返回结果:", JSON.stringify(results, null, 2));

    // 1. 优先寻找直接答案 (answer_box)
    if (results.answer_box?.answer) {
      return results.answer_box.answer;
    }

    // 2. 知识图谱描述
    if (results.knowledge_graph?.description) {
      return results.knowledge_graph.description;
    }

    // 3. 有机结果摘要
    if (results.organic_results && results.organic_results.length > 0) {
      const snippets = results.organic_results.slice(0, 3).map((res, i) => {
        const title = res.title || "";
        const snippet = res.snippet || "";
        const link = res.link ? `\n🔗 ${res.link}` : "";
        return `[${i + 1}] ${title}\n${snippet}${link}`;
      });
      return snippets.join("\n\n");
    }

    return `对不起，没有找到关于 "${query}" 的信息。`;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `搜索时发生错误: ${errorMessage}`;
  }
}

