import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  REVIEW_PROMPT_TEMPLATE,
  DEBUG_PROMPT_TEMPLATE,
  OPTIMIZE_PROMPT_TEMPLATE,
  TESTS_PROMPT_TEMPLATE,
  CHAT_PROMPT_TEMPLATE
} from "../utils/promptTemplates.js";

function parseCleanJson(rawText) {
  if (!rawText) return null;

  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (innerErr) {
        console.error("Regex JSON extraction failed:", innerErr.message);
      }
    }
    throw new Error("AI returned malformed output. Please try again.");
  }
}

class AIService {
  constructor() {
    this.providerName = "Google Gemini";
    this.supportedModels = [
      "gemini-3.6-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-pro-latest",
      "gemini-2.5-flash",
      "gemini-pro"
    ];
  }

  hasValidKey() {
    const apiKey = process.env.GEMINI_API_KEY;
    return Boolean(apiKey && apiKey.trim() !== "" && apiKey !== "your_gemini_api_key_here");
  }

  getAIClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!this.hasValidKey()) {
      throw new Error(
        "GEMINI_API_KEY is missing in server/.env. Please configure your Gemini API key to activate live LLM inference."
      );
    }
    return new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(promptText, isJsonMode = true) {
    const genAI = this.getAIClient();
    let lastError = null;

    for (const modelName of this.supportedModels) {
      try {
        const modelConfig = { model: modelName };
        if (isJsonMode) {
          modelConfig.generationConfig = { responseMimeType: "application/json" };
        }

        const model = genAI.getGenerativeModel(modelConfig);
        const result = await model.generateContent(promptText);
        const response = await result.response;
        const text = response.text();

        console.log(`Successfully generated content with Gemini model: ${modelName}`);
        return isJsonMode ? parseCleanJson(text) : text;
      } catch (err) {
        console.warn(`Model ${modelName} call failed (${err.message}). Trying next candidate...`);
        lastError = err;
      }
    }

    throw new Error(`Gemini AI service error: ${lastError?.message || "Failed to generate content."}`);
  }

  async reviewCode(code, language) {
    try {
      const prompt = REVIEW_PROMPT_TEMPLATE(code, language);
      return await this.generateResponse(prompt, true);
    } catch (err) {
      if (!this.hasValidKey()) return this.getMockReview(code, language);
      throw err;
    }
  }

  async debugCode(code, language, errorMessage) {
    try {
      const prompt = DEBUG_PROMPT_TEMPLATE(code, language, errorMessage);
      return await this.generateResponse(prompt, true);
    } catch (err) {
      if (!this.hasValidKey()) return this.getMockDebug(code, language);
      throw err;
    }
  }

  async optimizeCode(code, language) {
    try {
      const prompt = OPTIMIZE_PROMPT_TEMPLATE(code, language);
      return await this.generateResponse(prompt, true);
    } catch (err) {
      if (!this.hasValidKey()) return this.getMockOptimize(code, language);
      throw err;
    }
  }

  async generateTests(code, language) {
    try {
      const prompt = TESTS_PROMPT_TEMPLATE(code, language);
      return await this.generateResponse(prompt, true);
    } catch (err) {
      if (!this.hasValidKey()) return this.getMockTests(code, language);
      throw err;
    }
  }

  async askChat(code, language, userQuestion) {
    try {
      const prompt = CHAT_PROMPT_TEMPLATE(code, language, userQuestion);
      const answerText = await this.generateResponse(prompt, false);
      return { answer: answerText };
    } catch (err) {
      if (!this.hasValidKey()) {
        return {
          answer: `[DEMO MODE]\n\nBased on your ${language} code:\nHere is a response to: "${userQuestion}"`
        };
      }
      throw err;
    }
  }

  getMockReview(code, language) {
    return {
      score: 68,
      summary: `[DEMO MODE] Code review for ${language} snippet completed. Identified several memory leaks, unhandled promises/exceptions, and suboptimal complexity.`,
      metrics: {
        maintainability: "Medium",
        performance: "Needs Work",
        security: "Warning"
      },
      issues: [
        {
          id: "issue-1",
          title: "Unhandled Resource Leak / Async Error",
          severity: "Critical",
          category: "Security",
          lineNumber: "Line 4-12",
          explanation: "Asynchronous network or I/O calls do not enclose operations in try/catch blocks or cleanup file descriptors.",
          recommendation: "Wrap async calls in try/catch blocks and ensure resource releases inside a finally block."
        }
      ]
    };
  }

  getMockDebug(code, language) {
    return {
      summary: `[DEMO MODE] Detected logic & runtime bugs in ${language} source code.`,
      bugsIdentified: [
        {
          title: "Null / Undefined Pointer Dereference",
          rootCause: "Accessing property on object before validating non-null status.",
          problematicSnippet: "let data = response.data.items[0]; return data.id;",
          explanation: "If `items` is empty array `items[0]` evaluates to undefined, causing TypeError crash.",
          solution: "Use optional chaining `response.data?.items?.[0]?.id` or explicit length check."
        }
      ],
      fixedCode: `// Fixed ${language} Code\n${code}`,
      preventionTips: ["Always check boundary conditions before array indexing."]
    };
  }

  getMockOptimize(code, language) {
    return {
      summary: `[DEMO MODE] Refactored ${language} code to improve asymptotic complexity.`,
      timeComplexityBefore: "O(N^2)",
      timeComplexityAfter: "O(N)",
      spaceComplexityBefore: "O(N)",
      spaceComplexityAfter: "O(1)",
      performanceImprovements: ["Replaced nested lookup with hash map."],
      readabilityImprovements: ["Extracted magic numbers."],
      maintainabilityImprovements: ["Added explicit type definitions."],
      optimizedCode: `// Optimized ${language} Implementation\n${code}`
    };
  }

  getMockTests(code, language) {
    return {
      summary: `[DEMO MODE] Automated test suite generated for ${language}.`,
      framework: language === "python" ? "pytest" : "Jest",
      testCases: [
        {
          type: "Normal",
          title: "Valid input payload processing",
          description: "Ensures the main function executes cleanly.",
          input: "{ id: 101 }",
          expectedOutput: "200 Success Response",
          codeSnippet: "expect(processInput({ id: 101 })).toBe(true);"
        }
      ],
      fullTestFile: `// Automated Test Suite for ${language}`
    };
  }
}

export const aiService = new AIService();
