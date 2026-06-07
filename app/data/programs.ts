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
    id: 'adm-negara',
    icon: '🏛️',
    badge: 'Unggulan',
    badgeColor: '#0f2d6b',
    name: 'Ilmu Administrasi Negara',
    degree: 'S1 — 4 Tahun',
    accreditation: 'Terakreditasi',
    description:
      'Mempersiapkan lulusan yang kompeten di bidang tata kelola pemerintahan, kebijakan publik, dan manajemen administrasi negara berbasis digitalisasi untuk kemajuan sektor publik.',
    highlights: ['Kebijakan Publik', 'Manajemen Pemerintahan', 'Administrasi Digital', 'Pelayanan Publik'],
    color: '#0f2d6b',
    bgGradient: 'linear-gradient(135deg, #0f2d6b 0%, #1a4aad 100%)',
    alumni: 'Lulusan Aktif',
    status: 'aktif',
  },
  {
    id: 'adm-niaga',
    icon: '💼',
    badge: 'Populer',
    badgeColor: '#10b981',
    name: 'Ilmu Administrasi Niaga',
    degree: 'S1 — 4 Tahun',
    accreditation: 'Terakreditasi',
    description:
      'Membekali mahasiswa dengan keahlian administrasi bisnis berbasis digital, manajemen organisasi, dan kewirausahaan untuk menghadapi tantangan dunia usaha modern yang dinamis.',
    highlights: ['Manajemen Bisnis', 'Administrasi Digital', 'Kewirausahaan', 'Manajemen SDM'],
    color: '#065f46',
    bgGradient: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
    alumni: 'Lulusan Aktif',
    status: 'aktif',
  },
];
