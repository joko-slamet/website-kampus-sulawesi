export default function SchemaOrg() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    '@id': 'https://stiaabdulharis.ac.id/#organization',
    name: 'STIA YPA-AH "Abdul Haris" Makassar',
    alternateName: 'STIA Abdul Haris Makassar',
    url: 'https://stiaabdulharis.ac.id',
    logo: {
      '@type': 'ImageObject',
      url: 'https://stiaabdulharis.ac.id/logo.png',
    },
    image: 'https://stiaabdulharis.ac.id/hero-campus.png',
    description:
      'Sekolah Tinggi Ilmu Administrasi terakreditasi BAIK oleh BAN-PT di Makassar, Sulawesi Selatan. Menyelenggarakan program S1 Ilmu Administrasi Negara dan S1 Ilmu Administrasi Niaga sejak 2004.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Makassar',
      addressRegion: 'Sulawesi Selatan',
      addressCountry: 'ID',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Program Studi',
      itemListElement: [
        { '@type': 'Course', name: 'S1 Ilmu Administrasi Negara', url: 'https://stia-abdulharis.ac.id/program/adm-negara' },
        { '@type': 'Course', name: 'S1 Ilmu Administrasi Niaga', url: 'https://stia-abdulharis.ac.id/program/adm-niaga' },
      ],
    },
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://stiaabdulharis.ac.id/#website',
    url: 'https://stiaabdulharis.ac.id',
    name: 'STIA YPA-AH "Abdul Haris" Makassar',
    publisher: { '@id': 'https://stiaabdulharis.ac.id/#organization' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  )
}
