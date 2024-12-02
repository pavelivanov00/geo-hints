'use client';

import dynamic from 'next/dynamic';

const WorldMap = dynamic(() => import('./WorldMap'), { ssr: false });

const Home: React.FC = () => {
    return (
        <div>
            <WorldMap />
        </div>
    );
};

export default Home;