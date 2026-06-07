import type { MetadataRoute } from 'next'
import { programs } from './data/programs'
import { allArticles } from './artikel/data'

const BASE_URL = 'https://stiaabdulharis.ac.id'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/artikel`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  const programRoutes: MetadataRoute.Sitemap = programs.map((p) => ({
    url: `${BASE_URL}/program/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  const articleRoutes: MetadataRoute.Sitemap = allArticles.map((a) => ({
    url: `${BASE_URL}/artikel/${a.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...programRoutes, ...articleRoutes]
}
