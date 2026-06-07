export type Lecturer = {
  name: string;
  qualifications: string;
};

export const lecturers: Record<string, Lecturer[]> = {
  'adm-negara': [
    { name: 'Sirajuddin', qualifications: 'S.IP., M.AP' },
    { name: 'Tuan Afero Harahap', qualifications: 'S.H., M.H' },
    { name: 'Erwin Agus', qualifications: 'S.Sos., M.M' },
    { name: 'Hasanuddin', qualifications: 'S.Sos., M.M' },
    { name: 'Rifqah Ramdhana Jufri', qualifications: 'S.Pd., M.Pd' },
    { name: 'Hasanuddin', qualifications: 'S.I.Kom., M.I.Kom' },
    { name: 'Andi Neneng Nurfausiah', qualifications: 'S.Pd., M.Pd' },
    { name: 'Andi Hamniza Kasturi', qualifications: 'S.H., M.Kn' },
    { name: 'Nur Khaerunnisah Ummu', qualifications: 'S.Pd., M.Pd' },
    { name: 'Idfi Dwi Lestari', qualifications: 'S.H., M.H' },
    { name: 'Yudhi Abdi Wibowo', qualifications: 'S.AP., M.Tr.AP' },
    { name: 'Muh Nasrun', qualifications: 'S.Pd., M.AP' },
    { name: 'Dr. Syahriar Tato', qualifications: 'M.Si' },
  ],
  'adm-niaga': [
    { name: 'Melisa Ayu Susilo', qualifications: 'SP., M.M' },
    { name: 'Andi Syamsul Rijal', qualifications: 'S.Ag., S.Sos., M.Kes.' },
    { name: 'Zulpriadi', qualifications: 'SE., M.M' },
    { name: 'Nurul Khusaimah D', qualifications: 'S.Pd., M.Pd' },
    { name: 'Sulfaedah Lestari', qualifications: 'S.Pd., M.Hum' },
    { name: 'Jihan Safira P', qualifications: 'S.Tr.Ak., M.AP' },
    { name: 'Eko Pramukti Wibowo', qualifications: 'S.E., M.S.M' },
    { name: 'Andi Abdul Rahman', qualifications: 'S.E., M.M' },
  ],
};

export function getInitials(name: string): string {
  const clean = name.replace(/^Dr\.\s*/i, '').trim();
  const parts = clean.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
