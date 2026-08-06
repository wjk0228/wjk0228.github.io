import { useEffect, useMemo, useState } from "react";
import {
  getOptionKey,
  resolveAnswers,
  searchQuestions,
  type Question,
} from "./lib/questionBank";

const typeFilters = ["全部", "单选题", "多选题", "判断题"];
const pageSize = 60;
const bankDefinitions = {
  operations: { name: "运营知识题库", file: "questions.json" },
  attachment4: { name: "附件4竞赛题库", file: "attachment4-questions.json" },
} as const;
type BankId = keyof typeof bankDefinitions;

export default function App() {
  const [banks, setBanks] = useState<Record<BankId, Question[]>>({ operations: [], attachment4: [] });
  const [activeBank, setActiveBank] = useState<BankId>("operations");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("全部");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [status, setStatus] = useState("正在载入竞赛题库…");
  const [error, setError] = useState("");
  const questions = banks[activeBank];
  const activeBankName = bankDefinitions[activeBank].name;

  useEffect(() => {
    Promise.all(Object.entries(bankDefinitions).map(async ([id, bank]) => {
      const response = await fetch(`${import.meta.env.BASE_URL}${bank.file}`);
      if (!response.ok) throw new Error(`${bank.name}载入失败`);
      return [id, await response.json() as Question[]] as const;
    }))
      .then((loadedBanks) => {
        const nextBanks = Object.fromEntries(loadedBanks) as Record<BankId, Question[]>;
        setBanks(nextBanks);
        setStatus(`${bankDefinitions.operations.name} · 共 ${nextBanks.operations.length} 道`);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "题库数据载入失败"));
  }, []);

  useEffect(() => setVisibleCount(pageSize), [query, typeFilter]);

  const results = useMemo(() => {
    const matched = searchQuestions(questions, query);
    return typeFilter === "全部" ? matched : matched.filter((question) => question.type === typeFilter);
  }, [questions, query, typeFilter]);

  const typeCounts = useMemo(() => questions.reduce<Record<string, number>>((counts, question) => {
    if (question.type) counts[question.type] = (counts[question.type] ?? 0) + 1;
    return counts;
  }, {}), [questions]);

  function switchBank(bank: BankId) {
    setActiveBank(bank);
    setQuery("");
    setTypeFilter("全部");
    setStatus(`${bankDefinitions[bank].name} · 共 ${banks[bank].length} 道`);
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="题库检索台首页">
          <span className="brand-mark">题</span><span>题库检索台</span>
        </a>
        <div className="privacy"><span /> 当前题库：{activeBankName}</div>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">2026 ONLINE KNOWLEDGE CONTEST</div>
        <h1>题目太多，<br /><em>搜到</em>就是答案。</h1>
        <p className="intro">两个竞赛题库均已内置。先选择题库标签，再输入题干片段或选项关键词，即刻定位正确答案；不同题库之间不会混合搜索。</p>

        <nav className="bank-tabs" aria-label="切换题库">
          {(Object.keys(bankDefinitions) as BankId[]).map((bankId) => (
            <button key={bankId} className={activeBank === bankId ? "active" : ""} onClick={() => switchBank(bankId)}>
              <span>{bankDefinitions[bankId].name}</span><small>{banks[bankId].length || "载入中"}</small>
            </button>
          ))}
        </nav>

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

      <section className="workspace single-bank-layout">
        <section className="results" aria-live="polite">
          <div className="section-heading">
            <div><span className="step">搜索结果</span><h2>{query ? `“${query}”` : typeFilter === "全部" ? "全部题目" : typeFilter}</h2></div>
            <strong>{results.length}</strong>
          </div>

          <div className="result-list">
            {results.slice(0, visibleCount).map((question, index) => {
              const resolvedAnswers = resolveAnswers(question);
              const correctKeys = new Set(resolvedAnswers.map((answer) => answer.key));
              const answerText = resolvedAnswers.map((answer) => answer.text).join("；");

              return <article className="question-card" key={question.id}>
                <div className="question-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="question-body">
                  <div className="badges">
                    {question.type && <span>{question.type}</span>}
                    {question.category && <span>{question.category}</span>}
                    {question.difficulty && <span>{question.difficulty}</span>}
                  </div>
                  <h3>{question.stem}</h3>
                  {question.answer && (
                    <div className="answer-callout">
                      <span className="answer-label">应选</span>
                      <div>
                        <strong>{resolvedAnswers.length ? resolvedAnswers.map((answer) => answer.key).join("、") : question.answer}</strong>
                        <p>{answerText || question.answer}<small>考试选项乱序时，以此答案内容为准</small></p>
                      </div>
                    </div>
                  )}
                  {!!question.options.length && (
                    <ul className="option-list">
                      {question.options.map((option, optionIndex) => {
                        const isCorrect = correctKeys.has(getOptionKey(option, optionIndex));
                        return <li className={isCorrect ? "correct-option" : ""} key={option}>
                          {isCorrect && <span className="correct-mark" aria-label="正确答案">✓</span>}
                          <span>{option}</span>
                        </li>;
                      })}
                    </ul>
                  )}
                  {question.explanation && (
                    <details className="explanation">
                      <summary>需要时查看解析</summary>
                      <p>{question.explanation}</p>
                    </details>
                  )}
                </div>
              </article>;
            })}
            {!results.length && <div className="empty">没有找到匹配题目，试试缩短关键词或切换题型。</div>}
            {error && <div className="empty" role="alert">{error}</div>}
            {visibleCount < results.length && <button className="load-more" onClick={() => setVisibleCount((count) => count + pageSize)}>继续显示更多题目</button>}
          </div>
        </section>
      </section>

      <footer><span>题库检索台 · 2026 完整版</span><span>手机适配 / GitHub Pages Ready</span></footer>
    </main>
  );
}
