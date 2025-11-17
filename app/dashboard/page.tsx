import Navbar from '@/components/Navbar';
import { getSession } from '@/lib/auth/session';
import DashboardGrid from '@/components/DashboardGrid';

export default async function Dashboard() {
  const session = await getSession();
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={session?.username} />
      <DashboardGrid />
    </div>
  );
}
