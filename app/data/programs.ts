export type Program = {
  id: string;
  icon: string;
  badge: string;
  badgeColor: string;
  name: string;
  degree: string;
  accreditation: string;
  description: string;
  highlights: string[];
  color: string;
  bgGradient: string;
  alumni: string;
  status: 'aktif' | 'nonaktif';
};

export const programs: Program[] = [
  {
    id: 'si',
    icon: '💻',
    badge: 'Favorit',
    badgeColor: '#f5a623',
    name: 'Sistem Informasi',
    degree: 'S1 — 4 Tahun',
    accreditation: 'Akreditasi A',
    description:
      'Pelajari desain sistem, analisis data, dan pengembangan solusi digital untuk bisnis modern. Lulusan siap kerja di perusahaan teknologi terkemuka.',
    highlights: ['Business Intelligence', 'Database Management', 'ERP Systems', 'Digital Transformation'],
    color: '#0f2d6b',
    bgGradient: 'linear-gradient(135deg, #0f2d6b 0%, #1a4aad 100%)',
    alumni: '2.800+',
    status: 'aktif',
  },
  {
    id: 'ti',
    icon: '⚙️',
    badge: 'Unggulan',
    badgeColor: '#10b981',
    name: 'Teknik Informatika',
    degree: 'S1 — 4 Tahun',
    accreditation: 'Akreditasi A',
    description:
      'Kuasai pemrograman, AI, machine learning, dan pengembangan software untuk membangun solusi teknologi masa depan.',
    highlights: ['Machine Learning', 'Cloud Computing', 'Software Engineering', 'Cybersecurity'],
    color: '#064e3b',
    bgGradient: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
    alumni: '3.100+',
    status: 'aktif',
  },
  {
    id: 'manj',
    icon: '📊',
    badge: 'Populer',
    badgeColor: '#7c3aed',
    name: 'Manajemen Informatika',
    degree: 'D3 — 3 Tahun',
    accreditation: 'Akreditasi B',
    description:
      'Program diploma intensif yang mencetak profesional siap kerja di bidang IT management, administrasi sistem, dan layanan teknologi.',
    highlights: ['IT Project Management', 'Network Administration', 'Technical Support', 'Digital Marketing'],
    color: '#4c1d95',
    bgGradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
    alumni: '4.200+',
    status: 'aktif',
  },
  {
    id: 'akun',
    icon: '📈',
    badge: 'Baru',
    badgeColor: '#dc2626',
    name: 'Komputerisasi Akuntansi',
    degree: 'D3 — 3 Tahun',
    accreditation: 'Akreditasi B',
    description:
      'Gabungkan keahlian akuntansi dengan teknologi informasi. Lulusan mahir menggunakan software akuntansi dan sistem keuangan digital.',
    highlights: ['Accounting Software', 'Financial Systems', 'Tax Automation', 'Audit Digital'],
    color: '#991b1b',
    bgGradient: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
    alumni: '1.900+',
    status: 'aktif',
  },
];
