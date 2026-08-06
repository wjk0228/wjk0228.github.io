export type Question = {
  id: string;
  stem: string;
  options: string[];
  type?: string;
  typeCode?: string;
  difficulty?: string;
  tags?: string[];
  answer?: string;
  explanation?: string;
  category?: string;
};

const FIELD_ALIASES = {
  stem: ["stem", "question", "title", "题干", "题目", "题干（必填）"],
  options: ["options", "choices", "选项"],
  answer: ["answer", "答案", "correctAnswer", "客观题答案（必填）"],
  explanation: ["explanation", "analysis", "解析", "题目解析（选填）"],
  category: ["category", "subject", "章节", "分类", "科目", "学科(必填)", "学科（必填）"],
  tags: ["tags", "tag", "标签", "标签(必填)", "标签（必填）"],
  type: ["type", "题型", "类型编号（必填）"],
  difficulty: ["difficulty", "难度", "难度系数（00-02）\n(必填)"],
} as const;

type UnknownRecord = Record<string, unknown>;

function pick(record: UnknownRecord, aliases: readonly string[]) {
  for (const alias of aliases) {
    if (record[alias] !== undefined && record[alias] !== null) return record[alias];
  }
}

function normalizeOptions(value: unknown, record: UnknownRecord): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    return value.split(/\s*[|；;]\s*/).map((item) => item.trim()).filter(Boolean);
  }

  return ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    .map((key) => ({ key, value: record[`选项${key}`] ?? record[key] ?? record[key.toLowerCase()] }))
    .filter((item) => item.value !== undefined && item.value !== null && String(item.value).trim())
    .map((item) => `${item.key}. ${String(item.value).trim()}`);
}

function normalizeRecord(record: UnknownRecord, index: number): Question | null {
  const stem = pick(record, FIELD_ALIASES.stem);
  if (!stem || !String(stem).trim()) return null;

  const typeCode = normalizeCode(pick(record, FIELD_ALIASES.type));
  const difficultyCode = normalizeCode(pick(record, FIELD_ALIASES.difficulty));
  return {
    id: String(record.id ?? record.ID ?? `${typeCode || "q"}-${index + 1}`),
    stem: String(stem).trim(),
    options: normalizeOptions(pick(record, FIELD_ALIASES.options), record),
    typeCode,
    type: ({ "00": "单选题", "01": "多选题", "02": "不定项选择题", "03": "判断题", "04": "填空题", "05": "简答题" } as Record<string, string>)[typeCode ?? ""] ?? stringOrUndefined(pick(record, FIELD_ALIASES.type)),
    difficulty: ({ "00": "简单", "01": "中等", "02": "困难" } as Record<string, string>)[difficultyCode ?? ""] ?? difficultyCode,
    tags: stringOrUndefined(pick(record, FIELD_ALIASES.tags))?.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean),
    answer: stringOrUndefined(pick(record, FIELD_ALIASES.answer)),
    explanation: stringOrUndefined(pick(record, FIELD_ALIASES.explanation)),
    category: stringOrUndefined(pick(record, FIELD_ALIASES.category)),
  };
}

function normalizeCode(value: unknown) {
  const normalized = stringOrUndefined(value);
  return normalized && /^\d$/.test(normalized) ? normalized.padStart(2, "0") : normalized;
}

function stringOrUndefined(value: unknown) {
  return value === undefined || value === null || String(value).trim() === ""
    ? undefined
    : String(value).trim();
}

function parseCsv(text: string): UnknownRecord[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"' && quoted && text[i + 1] === '"') {
      field += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field.trim());
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);

  const [headers, ...data] = rows;
  if (!headers) return [];
  return data.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])),
  );
}

export async function parseQuestionFile(file: File): Promise<Question[]> {
  let records: unknown;
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith(".xlsx") || lowerName.endsWith(".xls")) {
    const XLSX = await import("xlsx");
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
    records = workbook.SheetNames
      .filter((name) => !name.includes("说明"))
      .flatMap((name) => XLSX.utils.sheet_to_json<UnknownRecord>(workbook.Sheets[name], { defval: null }));
  } else {
    const text = (await file.text()).replace(/^\uFEFF/, "");
    if (lowerName.endsWith(".json")) {
    const parsed = JSON.parse(text) as unknown;
    records = Array.isArray(parsed)
      ? parsed
      : typeof parsed === "object" && parsed !== null
        ? (parsed as UnknownRecord).questions ?? (parsed as UnknownRecord).data
        : undefined;
    } else if (lowerName.endsWith(".csv")) {
      records = parseCsv(text);
    } else {
      throw new Error("请选择 Excel、JSON 或 CSV 题库文件。");
    }
  }

  if (!Array.isArray(records)) throw new Error("未找到题目列表，请检查文件结构。");
  const questions = records
    .map((item, index) =>
      typeof item === "object" && item !== null
        ? normalizeRecord(item as UnknownRecord, index)
        : null,
    )
    .filter((item): item is Question => item !== null);

  if (!questions.length) throw new Error("没有识别到题干字段，请提供题库样例以完成适配。");
  return questions;
}

export function searchQuestions(questions: Question[], rawQuery: string) {
  const terms = rawQuery.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return questions;

  return questions.filter((question) => {
    const haystack = [
      question.stem,
      ...question.options,
      question.answer,
      question.explanation,
      question.category,
      question.type,
      question.difficulty,
      ...(question.tags ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLocaleLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

const STORAGE_KEY = "question-bank-search:v1";

export function loadQuestions(): Question[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Question[];
  } catch {
    return [];
  }
}

export function saveQuestions(questions: Question[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
}
