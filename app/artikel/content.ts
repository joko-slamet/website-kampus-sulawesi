export type Block =
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'ordered'; items: string[] }
  | { type: 'callout'; icon: string; text: string }
  | { type: 'divider' };

export const articleContent: Record<string, Block[]> = {
  'tips-lulus-cepat': [
    {
      type: 'paragraph',
      text: 'Lulus tepat waktu dengan IPK tinggi adalah impian setiap mahasiswa. Namun kenyataannya, banyak yang terjebak di antara tuntutan akademik, kegiatan organisasi, dan kehidupan sosial. Kabar baiknya — ini bukan hal mustahil, asalkan kamu punya strategi yang tepat.',
    },
    { type: 'heading', text: '1. Pahami Sistem SKS Sejak Awal' },
    {
      type: 'paragraph',
      text: 'Salah satu kesalahan terbesar mahasiswa baru adalah mengambil SKS terlalu sedikit di semester awal karena takut kewalahan, lalu panik di semester akhir. Idealnya, ambil 20–24 SKS di semester 1–4 ketika energimu masih penuh, dan kurangi di semester atas saat fokus ke skripsi.',
    },
    {
      type: 'callout',
      icon: '💡',
      text: 'Tip: Minta jadwal dan silabi dari kakak tingkat sebelum masa KRS. Pilih kombinasi mata kuliah yang tidak bentrok dan memiliki jadwal ujian terpisah.',
    },
    { type: 'heading', text: '2. Kuasai Teknik Belajar yang Efektif' },
    {
      type: 'paragraph',
      text: 'Belajar berjam-jam tanpa metode yang tepat justru kontraproduktif. Gunakan teknik Pomodoro (25 menit fokus, 5 menit istirahat), active recall, dan spaced repetition untuk materi yang membutuhkan hafalan.',
    },
    {
      type: 'list',
      items: [
        'Active recall: Tutup buku, coba ingat kembali apa yang baru dipelajari',
        'Mind mapping: Visualisasikan koneksi antar konsep',
        'Pomodoro technique: Sesi belajar terstruktur dengan jeda terjadwal',
        'Peer teaching: Jelaskan materi ke teman — jika kamu bisa mengajar, kamu benar-benar paham',
      ],
    },
    { type: 'heading', text: '3. Bangun Hubungan Baik dengan Dosen' },
    {
      type: 'paragraph',
      text: 'Ini sering diremehkan mahasiswa. Dosen yang mengenalmu bukan hanya memberi nilai lebih fair — mereka bisa jadi mentor, referensi kerja, bahkan pintu ke peluang penelitian berbayar. Aktif di kelas, datang ke konsultasi, dan jangan takut bertanya.',
    },
    { type: 'heading', text: '4. Prioritaskan Tugas dengan Matriks Eisenhower' },
    {
      type: 'paragraph',
      text: 'Tidak semua tugas punya urgensi yang sama. Kategorikan tugas ke dalam empat kuadran: penting & mendesak (kerjakan sekarang), penting & tidak mendesak (jadwalkan), tidak penting & mendesak (delegasikan jika bisa), tidak penting & tidak mendesak (eliminasi).',
    },
    {
      type: 'callout',
      icon: '⚠️',
      text: 'Jangan biarkan tugas "tidak mendesak tapi penting" (seperti review materi harian) selalu digeser oleh hal-hal yang terasa mendesak tapi tidak bernilai tinggi.',
    },
    { type: 'heading', text: '5. Jaga Kesehatan Fisik dan Mental' },
    {
      type: 'paragraph',
      text: 'Mahasiswa yang sakit tidak bisa belajar. Tidur minimal 7 jam, makan teratur, dan olahraga ringan 3x seminggu bukan kemewahan — ini investasi performa akademik. Burnout adalah pembunuh IPK yang paling sering diabaikan.',
    },
    { type: 'heading', text: '6. Manfaatkan Sumber Daya Kampus Maksimal' },
    {
      type: 'paragraph',
      text: 'Perpustakaan, laboratorium, sesi bimbingan akademik, pusat karier — semua ini ada dan gratis. Mahasiswa yang memanfaatkan fasilitas kampus secara optimal memiliki keunggulan signifikan dibanding yang hanya datang saat ujian.',
    },
    { type: 'heading', text: '7. Rencanakan Skripsi Sejak Semester 5' },
    {
      type: 'paragraph',
      text: 'Skripsi adalah penyebab utama keterlambatan kelulusan. Mulailah membaca jurnal dan mencari topik sejak semester 5. Di semester 6, coba ajukan proposal awal ke dosen yang kamu minati sebagai pembimbing. Kamu akan jauh lebih tenang di semester 7–8.',
    },
    { type: 'divider' },
    {
      type: 'callout',
      icon: '🎓',
      text: 'Ingat: lulus tepat waktu bukan tentang menjadi mahasiswa yang paling sibuk, tapi yang paling terorganisir. Mulai dari sekarang, satu langkah kecil setiap hari.',
    },
  ],

  'prospek-kerja-it': [
    {
      type: 'paragraph',
      text: 'Di tengah gejolak ekonomi global, satu industri yang terus tumbuh adalah teknologi. Laporan LinkedIn Work Intelligence 2025 menyebutkan bahwa permintaan talenta IT di Asia Tenggara naik 34% dibanding tahun sebelumnya. Bagi lulusan Teknik Informatika, ini adalah kabar terbaik yang bisa mereka dengar.',
    },
    { type: 'heading', text: 'Profesi IT Paling Dicari di 2025' },
    {
      type: 'list',
      items: [
        'AI/ML Engineer — gaji rata-rata Rp 15–30 juta/bulan untuk level junior-mid',
        'Backend Developer (Node.js, Go, Python) — permintaan naik 45% YoY',
        'Cloud Engineer (AWS, GCP, Azure) — hampir setiap perusahaan migrasi ke cloud',
        'Cybersecurity Analyst — kebutuhan melonjak seiring maraknya ancaman siber',
        'Data Analyst / Data Scientist — perusahaan kecil pun mulai data-driven',
        'Mobile Developer (Android/iOS/Flutter) — penetrasi smartphone terus meningkat',
      ],
    },
    {
      type: 'callout',
      icon: '📊',
      text: 'Data Jobstreet Indonesia Q1 2025: lowongan IT tumbuh 41% YoY, sementara supply talenta hanya tumbuh 18%. Ini artinya gap yang menguntungkan pencari kerja IT.',
    },
    { type: 'heading', text: 'Dampak AI terhadap Karier IT' },
    {
      type: 'paragraph',
      text: 'Banyak yang khawatir AI akan menggantikan programmer. Kenyataannya justru sebaliknya — AI menciptakan lebih banyak peran baru. Yang berubah adalah jenis skill yang dibutuhkan. Developer yang bisa berkolaborasi dengan AI tools (GitHub Copilot, Cursor, dll) jauh lebih produktif, bukan digantikan.',
    },
    { type: 'subheading', text: 'Skill yang Tetap Relevan di Era AI:' },
    {
      type: 'list',
      items: [
        'System design & arsitektur software',
        'Problem solving & computational thinking',
        'Pemahaman bisnis & domain knowledge',
        'Kemampuan komunikasi dan presentasi teknis',
        'Debugging & code review yang efektif',
      ],
    },
    { type: 'heading', text: 'Cara Mempersiapkan Diri Sejak Semester Pertama' },
    {
      type: 'ordered',
      items: [
        'Kuasai 1 bahasa pemrograman secara mendalam sebelum melompat ke yang lain',
        'Bangun portofolio GitHub aktif — minimal 3 project bermakna',
        'Ikuti kompetisi hackathon atau programming contest minimal 2x setahun',
        'Magang di semester 5-6, bahkan part-time di semester sebelumnya',
        'Pelajari satu cloud platform (AWS Free Tier tersedia gratis)',
        'Aktif di komunitas tech lokal — Sulawesi Tech Community, dll',
      ],
    },
    {
      type: 'callout',
      icon: '🚀',
      text: 'Alumni STIA Abdul Haris yang aktif berportofolio rata-rata mendapat pekerjaan 3 bulan sebelum wisuda. Mulailah hari ini.',
    },
  ],

  'beasiswa-mahasiswa-baru': [
    {
      type: 'paragraph',
      text: 'Biaya kuliah tidak harus menjadi penghalang pendidikanmu. STIA Abdul Haris Makassar menyediakan berbagai jalur beasiswa yang bisa meringankan hingga membebaskan seluruh biaya pendidikanmu. Berikut panduan lengkapnya.',
    },
    { type: 'heading', text: '1. KIP Kuliah (Kartu Indonesia Pintar Kuliah)' },
    {
      type: 'paragraph',
      text: 'Program pemerintah ini memberikan bantuan biaya pendidikan penuh plus biaya hidup bulanan. KIP Kuliah adalah beasiswa paling komprehensif yang tersedia.',
    },
    {
      type: 'list',
      items: [
        'Biaya pendidikan: ditanggung penuh (hingga Rp 12 juta/semester)',
        'Biaya hidup: Rp 700.000–1.400.000/bulan tergantung klaster daerah',
        'Syarat utama: masuk kategori keluarga tidak mampu (berdasarkan DTKS)',
        'Pendaftaran: melalui kip-kuliah.kemdikbud.go.id',
      ],
    },
    {
      type: 'callout',
      icon: '📅',
      text: 'Jadwal KIP Kuliah 2025: Pendaftaran akun dibuka Februari–Juni 2025. Segera daftarkan dirimu sebelum menutup!',
    },
    { type: 'heading', text: '2. Beasiswa Prestasi Akademik STIA' },
    {
      type: 'paragraph',
      text: 'Khusus untuk mahasiswa baru dengan nilai rapor atau UTBK yang menonjol. Tidak memerlukan syarat ekonomi.',
    },
    {
      type: 'list',
      items: [
        'Potongan SPP 50% untuk peringkat 1–10 di jurusan',
        'Potongan SPP 25% untuk peringkat 11–25',
        'Syarat: nilai rata-rata rapor kelas 10–12 minimal 85',
        'Evaluasi setiap semester — pertahankan IPK ≥ 3.50',
      ],
    },
    { type: 'heading', text: '3. Beasiswa Daerah 3T (Terdepan, Terluar, Tertinggal)' },
    {
      type: 'paragraph',
      text: 'STIA bekerjasama dengan Pemda beberapa kabupaten di Sulawesi untuk memberikan beasiswa penuh bagi putra-putri daerah 3T yang berprestasi.',
    },
    { type: 'heading', text: 'Tips Agar Beasiswamu Diterima' },
    {
      type: 'ordered',
      items: [
        'Lengkapi semua dokumen — SKTM, KK, ijazah, transkrip nilai',
        'Tulis essay motivasi yang jujur dan spesifik, bukan generik',
        'Daftar lebih dari satu jalur beasiswa sekaligus',
        'Hubungi Bagian Kemahasiswaan STIA untuk konsultasi gratis',
        'Jangan tunggu semester berjalan — daftar sebelum masuk kuliah',
      ],
    },
    {
      type: 'callout',
      icon: '📞',
      text: 'Butuh bantuan? Hubungi Bagian Kemahasiswaan STIA Abdul Haris di WA: 0811-XXXX-XXXX (Senin–Jumat, 08.00–16.00 WITA).',
    },
  ],
};

export const articleContentEn: Record<string, Block[]> = {
  'tips-lulus-cepat': [
    { type: 'paragraph', text: 'Graduating on time with a high GPA is every student\'s dream. In reality, many get caught between academic demands, organizational activities, and social life. The good news — it is not impossible, as long as you have the right strategy.' },
    { type: 'heading', text: '1. Understand the Credit System from Day One' },
    { type: 'paragraph', text: 'One of the biggest mistakes new students make is taking too few credits early out of fear of being overwhelmed, then panicking in later semesters. Ideally, take 20–24 credits in semesters 1–4 when your energy is high, and reduce in upper semesters when focusing on your thesis.' },
    { type: 'callout', icon: '💡', text: 'Tip: Ask senior students for class schedules and syllabi before enrollment. Choose subject combinations that do not clash and have separate exam dates.' },
    { type: 'heading', text: '2. Master Effective Study Techniques' },
    { type: 'paragraph', text: 'Studying for hours without the right method is counterproductive. Use the Pomodoro Technique (25 minutes focus, 5 minutes break), active recall, and spaced repetition for material that requires memorization.' },
    { type: 'list', items: ['Active recall: Close your book and try to remember what you just studied', 'Mind mapping: Visualize connections between concepts', 'Pomodoro technique: Structured study sessions with scheduled breaks', 'Peer teaching: Explain material to a friend — if you can teach it, you truly understand it'] },
    { type: 'heading', text: '3. Build Good Relationships with Lecturers' },
    { type: 'paragraph', text: 'This is often underestimated. Lecturers who know you not only grade you more fairly — they can become mentors, work references, and even doors to paid research opportunities. Be active in class, attend consultations, and do not be afraid to ask questions.' },
    { type: 'heading', text: '4. Prioritize Tasks with the Eisenhower Matrix' },
    { type: 'paragraph', text: 'Not all assignments carry the same urgency. Categorize tasks into four quadrants: important & urgent (do now), important & not urgent (schedule), not important & urgent (delegate if possible), not important & not urgent (eliminate).' },
    { type: 'heading', text: '5. Maintain Physical and Mental Health' },
    { type: 'paragraph', text: 'A sick student cannot study. Sleeping at least 7 hours, eating regularly, and light exercise 3 times a week are not luxuries — they are investments in academic performance. Burnout is the most commonly ignored GPA killer.' },
    { type: 'heading', text: '6. Plan Your Thesis from Semester 5' },
    { type: 'paragraph', text: 'The thesis is the leading cause of delayed graduation. Start reading journals and searching for topics from semester 5. In semester 6, try submitting a preliminary proposal to a lecturer you want as your supervisor. You will be far more at ease in semesters 7–8.' },
    { type: 'divider' },
    { type: 'callout', icon: '🎓', text: 'Remember: graduating on time is not about being the busiest student, but the most organized one. Start today — one small step at a time.' },
  ],
  'prospek-kerja-it': [
    { type: 'paragraph', text: 'Amid global economic turbulence, one industry that keeps growing is technology. LinkedIn\'s Work Intelligence Report 2025 states that demand for IT talent in Southeast Asia rose 34% compared to the previous year. For Informatics graduates, this is the best news they could hear.' },
    { type: 'heading', text: 'Most In-Demand IT Roles in 2025' },
    { type: 'list', items: ['AI/ML Engineer — average salary IDR 15–30 million/month for junior-mid level', 'Backend Developer (Node.js, Go, Python) — demand up 45% YoY', 'Cloud Engineer (AWS, GCP, Azure) — almost every company is migrating to cloud', 'Cybersecurity Analyst — demand surging with rising cyber threats', 'Data Analyst / Data Scientist — even small companies are going data-driven', 'Mobile Developer (Android/iOS/Flutter) — smartphone penetration keeps growing'] },
    { type: 'callout', icon: '📊', text: 'Jobstreet Indonesia Q1 2025: IT job postings grew 41% YoY, while talent supply only grew 18%. This means a favorable gap for IT job seekers.' },
    { type: 'heading', text: 'Impact of AI on IT Careers' },
    { type: 'paragraph', text: 'Many worry that AI will replace programmers. The reality is actually the opposite — AI is creating more new roles. What is changing is the type of skills required. Developers who can collaborate with AI tools (GitHub Copilot, Cursor, etc.) are far more productive, not replaced.' },
    { type: 'subheading', text: 'Skills That Remain Relevant in the AI Era:' },
    { type: 'list', items: ['System design & software architecture', 'Problem solving & computational thinking', 'Business understanding & domain knowledge', 'Technical communication and presentation skills', 'Effective debugging & code review'] },
    { type: 'heading', text: 'How to Prepare from Your First Semester' },
    { type: 'ordered', items: ['Master 1 programming language deeply before jumping to another', 'Build an active GitHub portfolio — at least 3 meaningful projects', 'Participate in hackathons or programming contests at least twice a year', 'Intern in semester 5-6, or even part-time earlier', 'Learn one cloud platform (AWS Free Tier is available for free)', 'Be active in local tech communities'] },
    { type: 'callout', icon: '🚀', text: 'STIA Abdul Haris alumni who actively build portfolios typically get hired 3 months before graduation. Start today.' },
  ],
  'beasiswa-mahasiswa-baru': [
    { type: 'paragraph', text: 'Tuition costs should not be a barrier to your education. STIA Abdul Haris Makassar provides various scholarship pathways that can reduce or fully cover your education costs. Here is a complete guide.' },
    { type: 'heading', text: '1. KIP Kuliah (Smart Indonesia Card for Higher Education)' },
    { type: 'paragraph', text: 'This government program provides full education funding plus monthly living allowances. KIP Kuliah is the most comprehensive scholarship available.' },
    { type: 'list', items: ['Education costs: fully covered (up to IDR 12 million/semester)', 'Living costs: IDR 700,000–1,400,000/month depending on region cluster', 'Main requirement: classified as underprivileged family (based on DTKS)', 'Registration: through kip-kuliah.kemdikbud.go.id'] },
    { type: 'callout', icon: '📅', text: 'KIP Kuliah 2025 Schedule: Account registration opens February–June 2025. Register before it closes!' },
    { type: 'heading', text: '2. STIA Academic Achievement Scholarship' },
    { type: 'paragraph', text: 'Exclusively for new students with outstanding report card or UTBK scores. No economic requirements.' },
    { type: 'list', items: ['50% tuition discount for rank 1–10 in the department', '25% tuition discount for rank 11–25', 'Requirement: average report card score of at least 85 for grades 10–12', 'Evaluated each semester — maintain GPA ≥ 3.50'] },
    { type: 'heading', text: '3. 3T Region Scholarship (Frontier, Outermost, Underdeveloped)' },
    { type: 'paragraph', text: 'STIA cooperates with several district governments in Sulawesi to provide full scholarships for outstanding young people from 3T regions.' },
    { type: 'heading', text: 'Tips to Get Your Scholarship Approved' },
    { type: 'ordered', items: ['Complete all documents — SKTM, family card, diploma, transcripts', 'Write an honest and specific motivation essay, not generic', 'Apply for more than one scholarship pathway at the same time', 'Contact the STIA Student Affairs Office for free consultation', 'Do not wait until the semester starts — apply before enrollment'] },
    { type: 'callout', icon: '📞', text: 'Need help? Contact the STIA Abdul Haris Student Affairs Office at WA: 0811-XXXX-XXXX (Monday–Friday, 08:00–16:00 WITA).' },
  ],
};

export function hasArticleContent(id: string): boolean {
  return id in articleContent;
}

export function getArticleContent(id: string, lang: 'id' | 'en' = 'id'): Block[] {
  const contentMap = lang === 'en' ? articleContentEn : articleContent;
  return (
    contentMap[id] ?? [
      {
        type: 'paragraph',
        text: lang === 'en'
          ? 'Full content for this article is being written. Stay tuned for the latest updates from the STIA Abdul Haris Makassar team.'
          : 'Konten lengkap artikel ini sedang dalam proses penulisan. Pantau terus untuk update terbaru dari tim STIA Abdul Haris Makassar.',
      },
      {
        type: 'callout',
        icon: '🔔',
        text: lang === 'en'
          ? 'Want this article sooner? Contact us via WhatsApp and we will prioritize it.'
          : 'Ingin artikel ini segera hadir? Hubungi kami melalui WhatsApp dan kami akan memprioritaskannya.',
      },
    ]
  );
}
