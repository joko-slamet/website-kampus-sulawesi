import type { MetadataRoute } from 'next'

const BASE_URL = 'https://stiaahmakassar.ac.id'
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/article`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  let programRoutes: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${API_URL}/api/programs`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const data = await res.json() as { id: string }[]
      programRoutes = data.map(p => ({
        url: `${BASE_URL}/program/${p.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      }))
    }
  } catch {
    // sitemap proceeds without programs if API is unavailable
  }

  let articleRoutes: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(`${API_URL}/api/articles?limit=200`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const data = await res.json() as { data: { id: string }[] }
      articleRoutes = data.data.map(a => ({
        url: `${BASE_URL}/article/${a.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      }))
    }
  } catch {
    // sitemap proceeds without articles if API is unavailable
  }

  return [...staticRoutes, ...programRoutes, ...articleRoutes]
}
