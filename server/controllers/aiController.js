import { aiService } from "../services/aiService.js";

const MAX_CODE_LENGTH = 50000;

function validateCodeInput(code, language, res) {
  if (!code || typeof code !== "string" || code.trim().length === 0) {
    res.status(400).json({ error: "Source code cannot be empty." });
    return false;
  }
  if (code.length > MAX_CODE_LENGTH) {
    res.status(400).json({
      error: `Code payload exceeds maximum size limit of ${MAX_CODE_LENGTH} characters.`
    });
    return false;
  }
  if (!language || typeof language !== "string") {
    res.status(400).json({ error: "Programming language is required." });
    return false;
  }
  return true;
}

export const reviewCodeHandler = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    if (!validateCodeInput(code, language, res)) return;

    const result = await aiService.reviewCode(code, language);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export const debugCodeHandler = async (req, res, next) => {
  try {
    const { code, language, errorMessage } = req.body;
    if (!validateCodeInput(code, language, res)) return;

    const result = await aiService.debugCode(code, language, errorMessage || "");
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export const optimizeCodeHandler = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    if (!validateCodeInput(code, language, res)) return;

    const result = await aiService.optimizeCode(code, language);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export const generateTestsHandler = async (req, res, next) => {
  try {
    const { code, language } = req.body;
    if (!validateCodeInput(code, language, res)) return;

    const result = await aiService.generateTests(code, language);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export const chatHandler = async (req, res, next) => {
  try {
    const { code, language, userQuestion } = req.body;
    if (!validateCodeInput(code, language, res)) return;

    if (!userQuestion || typeof userQuestion !== "string" || userQuestion.trim().length === 0) {
      return res.status(400).json({ error: "User question cannot be empty." });
    }

    const result = await aiService.askChat(code, language, userQuestion);
    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export const healthCheckHandler = (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_gemini_api_key_here");
  return res.json({
    status: "ok",
    service: "CodePilot AI API",
    provider: "Google Gemini",
    apiKeyConfigured: hasKey,
    timestamp: new Date().toISOString()
  });
};
