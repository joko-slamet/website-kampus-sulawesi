'use client';

import { useLanguage } from '../../i18n/LanguageContext';
import { getArticleContent, hasArticleContent } from '../content';
import type { Block } from '../content';
import ArticleBody from './ArticleBody';
import type { ArticleForPage } from './page';

function markdownToBlocks(md: string): Block[] {
  const blocks: Block[] = [];
  const lines = md.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    if (line.startsWith('## ')) {
      blocks.push({ type: 'subheading', text: line.slice(3).trim() });
      i++;
      continue;
    }

    if (line.startsWith('# ')) {
      blocks.push({ type: 'heading', text: line.slice(2).trim() });
      i++;
      continue;
    }

    if (line === '---') {
      blocks.push({ type: 'divider' });
      i++;
      continue;
    }

    // Collect consecutive bullet lines into a list block
    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2).trim());
        i++;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    // Collect consecutive numbered lines into an ordered block
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, '').trim());
        i++;
      }
      blocks.push({ type: 'ordered', items });
      continue;
    }

    // Regular paragraph — strip markdown bold/italic markers
    const text = line.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');
    blocks.push({ type: 'paragraph', text });
    i++;
  }

  return blocks;
}

export default function ArticleContent({ article }: { article: ArticleForPage }) {
  const { lang } = useLanguage();

  let content: Block[];

  // Priority: DB content → static content.ts → excerpt fallback
  const dbContent = lang === 'en' ? (article.contentEn || article.content) : article.content;
  if (dbContent) {
    content = markdownToBlocks(dbContent);
  } else if (hasArticleContent(article.id)) {
    content = getArticleContent(article.id, lang);
  } else {
    const text = lang === 'en' ? (article.excerptEn || article.excerpt) : article.excerpt;
    content = text ? [{ type: 'paragraph', text }] : [];
  }

  return <ArticleBody article={article} content={content} />;
}
