'use client';

import { useLanguage } from '../../i18n/LanguageContext';
import ArticleBody from './ArticleBody';

type Block =
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'ordered'; items: string[] }
  | { type: 'callout'; icon: string; text: string }
  | { type: 'divider' };
import type { ArticleForPage } from './page';

function stripInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1');
}

function markdownToBlocks(md: string): Block[] {
  const blocks: Block[] = [];
  const lines = md.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    if (line.startsWith('### ')) {
      blocks.push({ type: 'subheading', text: stripInline(line.slice(4).trim()) });
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push({ type: 'subheading', text: stripInline(line.slice(3).trim()) });
      i++;
      continue;
    }

    if (line.startsWith('# ')) {
      blocks.push({ type: 'heading', text: stripInline(line.slice(2).trim()) });
      i++;
      continue;
    }

    if (line === '---') {
      blocks.push({ type: 'divider' });
      i++;
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(stripInline(lines[i].trim().slice(2).trim()));
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(stripInline(lines[i].trim().replace(/^\d+\.\s/, '').trim()));
        i++;
      }
      blocks.push({ type: 'ordered', items });
      continue;
    }

    blocks.push({ type: 'paragraph', text: stripInline(line) });
    i++;
  }

  return blocks;
}

export default function ArticleContent({ article }: { article: ArticleForPage }) {
  const { lang } = useLanguage();

  const dbContent = lang === 'en' ? (article.contentEn || article.content) : article.content;

  let content: Block[];
  if (dbContent) {
    content = markdownToBlocks(dbContent);
  } else {
    const text = lang === 'en' ? (article.excerptEn || article.excerpt) : article.excerpt;
    content = text ? [{ type: 'paragraph', text }] : [];
  }

  return <ArticleBody article={article} content={content} />;
}
