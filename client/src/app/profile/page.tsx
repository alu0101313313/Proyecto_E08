import AppHeader from '@/app/components/collection/AppHeader'; // Header global
import ProfileCard from '@/app/components/ProfileCard';

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      
      {/* Header Global */}
      <AppHeader />

      {/* Contenido Centrado */}
      <main className="grow flex items-center justify-center p-6">
        <ProfileCard />
      </main>

    </div>
  );
}