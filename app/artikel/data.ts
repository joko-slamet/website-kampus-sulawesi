export type Article = {
  id: string;
  category: string;
  categoryColor: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  tag: string | null;
  tagColor: string | null;
  en: { title: string; excerpt: string };
};

export const allArticles: Article[] = [
  {
    id: 'tips-lulus-cepat',
    category: 'Tips Kuliah',
    categoryColor: '#0f2d6b',
    date: '1 Juni 2025',
    readTime: '5 menit',
    title: '7 Tips Lulus Tepat Waktu dengan IPK Tinggi di Kampus IT',
    excerpt: 'Banyak mahasiswa baru yang bingung bagaimana mengatur waktu antara kuliah, organisasi, dan kehidupan sosial. Berikut strategi terbukti dari alumni STIA Abdul Haris.',
    tag: 'Populer',
    tagColor: '#f5a623',
    en: {
      title: '7 Tips to Graduate on Time with a High GPA at an IT College',
      excerpt: 'Many new students struggle to balance academics, organizations, and social life. Here are proven strategies from STIA Abdul Haris alumni.',
    },
  },
  {
    id: 'prospek-kerja-it',
    category: 'Dunia IT',
    categoryColor: '#7c3aed',
    date: '30 Mei 2025',
    readTime: '6 menit',
    title: 'Prospek Kerja Lulusan Teknik Informatika di Era AI 2025',
    excerpt: 'Industri teknologi terus tumbuh. Pelajari profesi apa saja yang paling banyak dicari dan bagaimana mempersiapkan diri sejak semester pertama.',
    tag: 'Trending',
    tagColor: '#10b981',
    en: {
      title: 'Career Prospects for Informatics Graduates in the AI Era 2025',
      excerpt: 'The tech industry keeps growing. Discover the most in-demand roles and how to prepare yourself from your very first semester.',
    },
  },
  {
    id: 'beasiswa-mahasiswa-baru',
    category: 'Beasiswa',
    categoryColor: '#0891b2',
    date: '28 Mei 2025',
    readTime: '4 menit',
    title: 'Panduan Lengkap Beasiswa Mahasiswa Baru 2025 yang Wajib Kamu Tahu',
    excerpt: 'Ada beberapa jalur beasiswa yang tersedia untuk calon mahasiswa baru STIA Abdul Haris. Simak syarat, jadwal, dan cara mendaftarnya di sini.',
    tag: 'Baru',
    tagColor: '#ef4444',
    en: {
      title: 'Complete Scholarship Guide for New Students 2025 You Must Know',
      excerpt: 'Several scholarship pathways are available for prospective STIA Abdul Haris students. Check the requirements, schedule, and how to apply.',
    },
  },
  {
    id: 'karier-freelance',
    category: 'Karier',
    categoryColor: '#f5a623',
    date: '25 Mei 2025',
    readTime: '7 menit',
    title: 'Mulai Freelance Sejak Kuliah: Pengalaman Alumni yang Kini Raup Jutaan dari Laptop',
    excerpt: 'Alumni STIA berbagi cerita bagaimana mereka membangun portofolio dan mendapatkan klien pertama sejak duduk di bangku semester 3.',
    tag: null,
    tagColor: null,
    en: {
      title: 'Start Freelancing in College: Alumni Who Now Earn Millions from Their Laptop',
      excerpt: 'STIA alumni share how they built their portfolio and landed their first clients as early as their third semester.',
    },
  },
  {
    id: 'ai-untuk-mahasiswa',
    category: 'Dunia IT',
    categoryColor: '#7c3aed',
    date: '20 Mei 2025',
    readTime: '5 menit',
    title: 'AI Tools Gratis yang Wajib Digunakan Mahasiswa IT di 2025',
    excerpt: 'Dari coding assistant hingga riset otomatis — inilah daftar alat AI gratis yang bisa mempercepat proses belajar dan mengerjakan tugas kuliah.',
    tag: null,
    tagColor: null,
    en: {
      title: 'Free AI Tools Every IT Student Must Use in 2025',
      excerpt: 'From coding assistants to automated research — here is a list of free AI tools that can speed up your learning and assignments.',
    },
  },
  {
    id: 'kehidupan-kampus-sulawesi',
    category: 'Kehidupan Kampus',
    categoryColor: '#10b981',
    date: '15 Mei 2025',
    readTime: '4 menit',
    title: 'Seperti Apa Kehidupan Mahasiswa di Sulawesi? Ini Kata Mereka',
    excerpt: 'Dari kos-kosan, kantin favorit, hingga tempat nongkrong terbaik — panduan lengkap untuk kamu yang baru pertama kali kuliah di Sulawesi.',
    tag: null,
    tagColor: null,
    en: {
      title: 'What Is Student Life Like in Sulawesi? Here Is What They Say',
      excerpt: 'From boarding houses and favorite canteens to the best hangout spots — a complete guide for first-time students in Sulawesi.',
    },
  },
  {
    id: 'portofolio-mahasiswa',
    category: 'Karier',
    categoryColor: '#f5a623',
    date: '10 Mei 2025',
    readTime: '6 menit',
    title: 'Cara Membangun Portofolio IT yang Membuat HRD Melirikmu',
    excerpt: 'Portofolio bukan sekadar kumpulan project — ini adalah bukti kemampuan. Pelajari apa yang benar-benar dicari recruiter saat menilai portofolio fresh graduate.',
    tag: null,
    tagColor: null,
    en: {
      title: 'How to Build an IT Portfolio That Gets You Noticed by Recruiters',
      excerpt: 'A portfolio is more than a collection of projects — it is proof of your skills. Learn what recruiters actually look for when evaluating a fresh graduate.',
    },
  },
  {
    id: 'bidikmisi-2025',
    category: 'Beasiswa',
    categoryColor: '#0891b2',
    date: '8 Mei 2025',
    readTime: '5 menit',
    title: 'KIP Kuliah 2025: Cara Daftar, Syarat, dan Besaran Bantuan yang Diberikan',
    excerpt: 'Program KIP Kuliah memberikan bantuan biaya pendidikan hingga Rp 12 juta per semester. Pelajari cara mendaftar dan dokumen apa saja yang dibutuhkan.',
    tag: 'Populer',
    tagColor: '#f5a623',
    en: {
      title: 'KIP Kuliah 2025: How to Apply, Requirements, and Benefit Amount',
      excerpt: 'The KIP Kuliah program provides up to IDR 12 million per semester in education funding. Learn how to apply and what documents are needed.',
    },
  },
  {
    id: 'web-dev-roadmap',
    category: 'Dunia IT',
    categoryColor: '#7c3aed',
    date: '5 Mei 2025',
    readTime: '8 menit',
    title: 'Roadmap Belajar Web Development dari Nol hingga Siap Kerja',
    excerpt: 'Tidak perlu bingung harus mulai dari mana. Ikuti roadmap terstruktur ini — dari HTML dasar, JavaScript, hingga framework modern yang dipakai industri.',
    tag: null,
    tagColor: null,
    en: {
      title: 'Web Development Learning Roadmap from Zero to Job-Ready',
      excerpt: 'No need to wonder where to start. Follow this structured roadmap — from basic HTML and JavaScript to modern frameworks used in the industry.',
    },
  },
  {
    id: 'organisasi-kampus',
    category: 'Tips Kuliah',
    categoryColor: '#0f2d6b',
    date: '2 Mei 2025',
    readTime: '4 menit',
    title: 'Ikut Organisasi atau Fokus Nilai? Mahasiswa Baru Wajib Baca Ini',
    excerpt: 'Pertanyaan klasik yang selalu muncul di awal kuliah. Jawabannya bukan memilih salah satu — ini cara menyeimbangkan keduanya tanpa mengorbankan IPK.',
    tag: null,
    tagColor: null,
    en: {
      title: 'Join Organizations or Focus on Grades? New Students Must Read This',
      excerpt: 'A classic question that always comes up early in college. The answer is not choosing one — here is how to balance both without sacrificing your GPA.',
    },
  },
  {
    id: 'gaji-it-indonesia',
    category: 'Karier',
    categoryColor: '#f5a623',
    date: '28 Apr 2025',
    readTime: '5 menit',
    title: 'Berapa Gaji Programmer di Indonesia 2025? Ini Data Terbaru',
    excerpt: 'Data gaji terbaru dari berbagai sumber menunjukkan posisi IT masih menjadi salah satu yang paling kompetitif. Yuk cek apakah ekspektasimu sudah realistis.',
    tag: 'Trending',
    tagColor: '#10b981',
    en: {
      title: 'How Much Do Programmers Earn in Indonesia in 2025? Latest Data',
      excerpt: 'The latest salary data from multiple sources shows IT positions remain among the most competitive. Check whether your expectations are realistic.',
    },
  },
  {
    id: 'tips-skripsi-it',
    category: 'Tips Kuliah',
    categoryColor: '#0f2d6b',
    date: '22 Apr 2025',
    readTime: '7 menit',
    title: 'Bingung Pilih Judul Skripsi IT? Ini 15 Ide Topik yang Relevan di 2025',
    excerpt: 'Topik skripsi yang relevan dengan industri akan membuat penelitianmu lebih bermakna sekaligus memperkuat CV. Inilah 15 ide topik yang layak dipertimbangkan.',
    tag: null,
    tagColor: null,
    en: {
      title: "Stuck Choosing Your IT Thesis Topic? Here Are 15 Relevant Ideas for 2025",
      excerpt: 'An industry-relevant thesis topic makes your research more meaningful while boosting your CV. Here are 15 topic ideas worth considering.',
    },
  },
];

export const categories = [
  'Semua',
  'Tips Kuliah',
  'Dunia IT',
  'Karier',
  'Beasiswa',
  'Kehidupan Kampus',
];
