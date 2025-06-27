import { Home, PlusCircle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FooterTabBar() {
  const router = useRouter();
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 z-50">
      <div className="flex justify-around items-center h-16">
        <button
          className="flex flex-col items-center text-gray-400 hover:text-blue-500 focus:outline-none"
          onClick={() => router.push('/')}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Explore</span>
        </button>
        <button
          className="flex flex-col items-center text-gray-400 hover:text-blue-500 focus:outline-none"
          onClick={() => router.push('/create')}
        >
          <PlusCircle size={24} />
          <span className="text-xs mt-1">Create</span>
        </button>
        <button
          className="flex flex-col items-center text-gray-400 hover:text-blue-500 focus:outline-none"
          onClick={() => router.push('/profile')}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
}
