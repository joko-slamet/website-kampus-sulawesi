'use client';

import { useLanguage } from '../../i18n/LanguageContext';
import { getArticleContent } from '../content';
import ArticleBody from './ArticleBody';
import type { Article } from '../data';

export default function ArticleContent({ article }: { article: Article }) {
  const { lang } = useLanguage();
  const content = getArticleContent(article.id, lang);
  return <ArticleBody article={article} content={content} />;
}
