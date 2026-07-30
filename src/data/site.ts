export const site = {
  title: 'Kun 的个人知识库',
  shortTitle: 'Kun / PKB',
  description:
    '沉淀开发技术、考试备考、银行与金融专业知识，以及对市场和科技趋势的长期观察。',
  author: 'Kun',
  domain: 'https://blog.wjkun.cn',
};

export const navItems = [
  { label: '知识库', href: '/knowledge/' },
  { label: '技术成长', href: '/technology/' },
  { label: '考试学习', href: '/study/' },
  { label: '金融知识', href: '/finance/' },
  { label: '观察分享', href: '/insights/' },
];

export const contentPath: Record<string, string> = {
  notes: 'notes',
  exams: 'exams',
  articles: 'articles',
  projects: 'projects',
  roadmaps: 'roadmaps',
  glossary: 'glossary',
};

export const collectionLabel: Record<string, string> = {
  notes: '知识笔记',
  exams: '考试学习',
  articles: '观察文章',
  projects: '项目复盘',
  roadmaps: '学习路线',
  glossary: '术语词条',
};

export const statusLabel: Record<string, string> = {
  seedling: '初步记录',
  growing: '持续完善',
  evergreen: '长期维护',
  archived: '历史归档',
  'time-sensitive': '时效内容',
};

export const domainLabel: Record<string, string> = {
  technology: '技术成长',
  study: '考试学习',
  finance: '金融知识',
  insights: '观察分享',
  general: '通用知识',
};

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
