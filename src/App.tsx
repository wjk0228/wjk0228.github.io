import { useEffect, useMemo, useRef, useState } from "react";
import {
  loadQuestions,
  parseQuestionFile,
  saveQuestions,
  searchQuestions,
  type Question,
} from "./lib/questionBank";

const typeFilters = ["全部", "单选题", "多选题", "判断题"];
const pageSize = 60;

export default function App() {
  const localQuestions = useMemo(() => loadQuestions(), []);
  const [questions, setQuestions] = useState<Question[]>(localQuestions);
  const [isCustomBank, setIsCustomBank] = useState(localQuestions.length > 0);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("全部");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [status, setStatus] = useState(localQuestions.length ? `已载入 ${localQuestions.length} 道本机题目` : "正在载入 2026 竞赛题库…");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (localQuestions.length) return;
    fetch(`${import.meta.env.BASE_URL}questions.json`)
      .then((response) => {
        if (!response.ok) throw new Error("题库数据载入失败");
        return response.json() as Promise<Question[]>;
      })
      .then((builtInQuestions) => {
        setQuestions(builtInQuestions);
        setStatus(`2026 竞赛题库 · 共 ${builtInQuestions.length} 道`);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "题库数据载入失败"));
  }, [localQuestions.length]);

  useEffect(() => setVisibleCount(pageSize), [query, typeFilter]);

  const results = useMemo(() => {
    const matched = searchQuestions(questions, query);
    return typeFilter === "全部" ? matched : matched.filter((question) => question.type === typeFilter);
  }, [questions, query, typeFilter]);

  const typeCounts = useMemo(() => questions.reduce<Record<string, number>>((counts, question) => {
    if (question.type) counts[question.type] = (counts[question.type] ?? 0) + 1;
    return counts;
  }, {}), [questions]);

  async function handleFile(file?: File) {
    if (!file) return;
    setError("");
    setStatus(`正在检查 ${file.name}…`);
    try {
      const imported = await parseQuestionFile(file);
      setQuestions(imported);
      setIsCustomBank(true);
      saveQuestions(imported);
      setStatus(`导入成功 · ${imported.length} 道题 · 已保存在此浏览器`);
    } catch (reason) {
      setStatus("导入未完成");
      setError(reason instanceof Error ? reason.message : "无法读取该文件。");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function restoreBuiltInBank() {
    saveQuestions([]);
    window.location.reload();
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="题库检索台首页">
          <span className="brand-mark">题</span><span>题库检索台</span>
        </a>
        <div className="privacy"><span /> 1100 道题已就绪 · 数据本地处理</div>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">2026 ONLINE KNOWLEDGE CONTEST</div>
        <h1>题目太多，<br /><em>搜到</em>就是答案。</h1>
        <p className="intro">2026 线上知识竞赛完整题库已内置。输入题干片段、选项或业务关键词，即刻定位答案与解析。</p>

        <div className="search-shell">
          <label htmlFor="search">搜索题库</label>
          <div className="search-row">
            <span className="search-icon">⌕</span>
            <input
              id="search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="输入题目或选项关键词…"
              autoComplete="off"
              enterKeyHint="search"
            />
            {query && <button className="clear-search" onClick={() => setQuery("")} aria-label="清空搜索">×</button>}
          </div>
          <div className="search-meta">
            <span>{query ? `找到 ${results.length} 道匹配题目` : status}</span>
            <span>空格可组合多个关键词</span>
          </div>
        </div>

        <div className="filter-bar" role="group" aria-label="按题型筛选">
          {typeFilters.map((type) => (
            <button key={type} className={typeFilter === type ? "active" : ""} onClick={() => setTypeFilter(type)}>
              {type}<small>{type === "全部" ? questions.length : typeCounts[type] ?? 0}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="workspace">
        <aside className="import-card">
          <span className="step">题库管理</span>
          <h2>更新题库</h2>
          <p>可直接导入与你提供的模板格式相同的 Excel，网站会自动读取单选、多选和判断题工作表。</p>
          <input ref={inputRef} className="file-input" type="file" accept=".xlsx,.xls,.json,.csv" onChange={(event) => handleFile(event.target.files?.[0])} />
          <button className="primary-button" onClick={() => inputRef.current?.click()}>选择题库文件 <span>↗</span></button>
          <div className="format-row"><span>XLSX</span><span>XLS</span><span>JSON</span><span>CSV</span></div>
          {error && <p className="error" role="alert">{error}</p>}
          {isCustomBank && <button className="text-button" onClick={restoreBuiltInBank}>恢复内置 2026 题库</button>}
        </aside>

        <section className="results" aria-live="polite">
          <div className="section-heading">
            <div><span className="step">搜索结果</span><h2>{query ? `“${query}”` : typeFilter === "全部" ? "全部题目" : typeFilter}</h2></div>
            <strong>{results.length}</strong>
          </div>

          <div className="result-list">
            {results.slice(0, visibleCount).map((question, index) => (
              <article className="question-card" key={question.id}>
                <div className="question-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="question-body">
                  <div className="badges">
                    {question.type && <span>{question.type}</span>}
                    {question.category && <span>{question.category}</span>}
                    {question.difficulty && <span>{question.difficulty}</span>}
                  </div>
                  <h3>{question.stem}</h3>
                  {!!question.options.length && <ul>{question.options.map((option) => <li key={option}>{option}</li>)}</ul>}
                  {(question.answer || question.explanation) && (
                    <details>
                      <summary>查看答案与解析</summary>
                      {question.answer && <p className="answer"><b>答案：</b>{question.answer}</p>}
                      {question.explanation && <p><b>解析：</b>{question.explanation}</p>}
                    </details>
                  )}
                </div>
              </article>
            ))}
            {!results.length && <div className="empty">没有找到匹配题目，试试缩短关键词或切换题型。</div>}
            {visibleCount < results.length && <button className="load-more" onClick={() => setVisibleCount((count) => count + pageSize)}>继续显示更多题目</button>}
          </div>
        </section>
      </section>

      <footer><span>题库检索台 · 2026 完整版</span><span>手机适配 / GitHub Pages Ready</span></footer>
    </main>
  );
}
