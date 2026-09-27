import { PAGE_MARK_REGEX } from "../config/constants.js";

export function normalizeContent(rawContent: string): string {
  rawContent = rawContent.replaceAll("\r\n", "\n");
  rawContent = rawContent.replaceAll("\r", "\n");
  rawContent = rawContent.replaceAll(PAGE_MARK_REGEX, "");
  return rawContent;
}
