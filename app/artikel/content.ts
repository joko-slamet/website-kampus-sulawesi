type Block =
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
      text: 'Alumni STIMIK Nusantara yang aktif berportofolio rata-rata mendapat pekerjaan 3 bulan sebelum wisuda. Mulailah hari ini.',
    },
  ],

  'beasiswa-mahasiswa-baru': [
    {
      type: 'paragraph',
      text: 'Biaya kuliah tidak harus menjadi penghalang pendidikanmu. STIMIK Nusantara Sulawesi menyediakan berbagai jalur beasiswa yang bisa meringankan hingga membebaskan seluruh biaya pendidikanmu. Berikut panduan lengkapnya.',
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
    { type: 'heading', text: '2. Beasiswa Prestasi Akademik STIMIK' },
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
      text: 'STIMIK bekerjasama dengan Pemda beberapa kabupaten di Sulawesi untuk memberikan beasiswa penuh bagi putra-putri daerah 3T yang berprestasi.',
    },
    { type: 'heading', text: 'Tips Agar Beasiswamu Diterima' },
    {
      type: 'ordered',
      items: [
        'Lengkapi semua dokumen — SKTM, KK, ijazah, transkrip nilai',
        'Tulis essay motivasi yang jujur dan spesifik, bukan generik',
        'Daftar lebih dari satu jalur beasiswa sekaligus',
        'Hubungi Bagian Kemahasiswaan STIMIK untuk konsultasi gratis',
        'Jangan tunggu semester berjalan — daftar sebelum masuk kuliah',
      ],
    },
    {
      type: 'callout',
      icon: '📞',
      text: 'Butuh bantuan? Hubungi Bagian Kemahasiswaan STIMIK Nusantara di WA: 0811-XXXX-XXXX (Senin–Jumat, 08.00–16.00 WITA).',
    },
  ],
};

export function getArticleContent(id: string): Block[] {
  return (
    articleContent[id] ?? [
      {
        type: 'paragraph',
        text: 'Konten lengkap artikel ini sedang dalam proses penulisan. Pantau terus untuk update terbaru dari tim STIMIK Nusantara Sulawesi.',
      },
      {
        type: 'callout',
        icon: '🔔',
        text: 'Ingin artikel ini segera hadir? Hubungi kami melalui WhatsApp dan kami akan memprioritaskannya.',
      },
    ]
  );
}
