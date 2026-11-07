import fs from "fs";
import path from "path";
import type { AIWorkflowAppType } from "./typesForTest";

export function loadHtmlAndApp(): AIWorkflowAppType {
  const htmlPath = path.resolve(__dirname, "../index.html");
  const htmlContent = fs.readFileSync(htmlPath, "utf-8");

  // Extract body content to populate jsdom document
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    document.body.innerHTML = bodyMatch[1];
  } else {
    document.documentElement.innerHTML = htmlContent;
  }

  // Load app.js
  const appPath = path.resolve(__dirname, "../app.js");
  const appCode = fs.readFileSync(appPath, "utf-8");

  // Execute in current window context
  const fn = new Function(appCode);
  fn();

  return (window as unknown as { AIWorkflowApp: AIWorkflowAppType }).AIWorkflowApp;
}
