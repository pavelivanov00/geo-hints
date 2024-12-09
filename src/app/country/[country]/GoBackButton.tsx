'use client';

import { useRouter } from 'next/navigation';

const GoBackButton = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      className="goBackButton"
      onClick={() => router.push('/')}
    >
      Go Back
    </button>
  );
};

export default GoBackButton;
