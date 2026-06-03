import type { Metadata } from 'next';
import ProgramManager from './ProgramManager';

export const metadata: Metadata = { title: 'Kelola Program Studi' };

export default function DashboardProgramPage() {
  return <ProgramManager />;
}
