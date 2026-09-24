import type { MetaData } from "../../types/type.js";
import { defaultDepartment, defaultRegion } from "../../config/constants.js";

export function processMetadata(contentArray: string[]): MetaData {
  const metadata: MetaData = { title: "", department: "", region: "" };
  let firstItem = 0;
  for (const item of contentArray) {
    if (item == "") {
      continue;
    }
    if (
      item.includes("title") ||
      item.includes("Title") ||
      item.includes("department") ||
      item.includes("Department") ||
      item.includes("region") ||
      item.includes("Region")
    ) {
      const data = item.split(":");
      if (data[0] && data[1]) {
        if (
          data[0] === "title" ||
          data[0] === "Title" ||
          data[0] === "department" ||
          data[0] === "Department" ||
          data[0] === "region" ||
          data[0] === "Region"
        ) {
          const key = data[0].toLowerCase() as keyof MetaData;
          metadata[key] = data[1]?.trim();
        }
      }
    } else if (firstItem === 0) {
      metadata["title"] = item;
      metadata["department"] = defaultDepartment;
      metadata["region"] = defaultRegion;
    }
    firstItem += 1;
  }
  return metadata;
}
