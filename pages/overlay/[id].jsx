import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import useInfoById from '@/hooks/useInfoById';
import dynamic from 'next/dynamic';
import Image from "next/image";

const Odometer = dynamic(() => import('react-odometerjs'), {
    ssr: false,
    loading: () => <div>0</div>
});

const Celebration = ({ count }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="text-center text-white text-4xl md:text-6xl font-bold animate-bounce">
            🎉 축하합니다! {count.toLocaleString()} 팔로워 달성! 🎉
        </div>
    </div>
);

const DefaultOverlay = ({ data, color, live }) => (
    <div className="w-full h-full bg-transparent p-4 text-white" style={{ color }}>
        <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="relative">
                {live === 'y' && data?.openLive && (
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-600 rounded-full text-xs font-bold animate-pulse">LIVE</div>
                )}
                <Image src={data?.channelImageUrl || '/favicon.png'} alt={data?.channelName} width={80} height={80} className={`rounded-full ${live === 'y' && data?.openLive ? 'border-4 border-green-500' : ''}`} />
            </div>
            <h1 className="text-2xl font-bold">{data?.channelName}</h1>
            <div className="text-4xl font-extrabold">
                <Odometer value={data?.followerCount || 0} format="(,ddd)" />
            </div>
        </div>
    </div>
);

const ProgressBarOverlay = ({ data, goal, color }) => {
    const percentage = goal > 0 ? Math.min((data?.followerCount / goal) * 100, 100) : 0;

    return (
        <div className="w-full h-full bg-transparent p-4 text-white" style={{ color }}>
            <div className="flex flex-col items-center justify-center h-full gap-3">
                <h2 className="text-xl font-bold">팔로워 목표: {goal.toLocaleString()}</h2>
                <div className="w-full bg-gray-700 rounded-full h-8 border-2 border-gray-500">
                    <div className="bg-green-500 h-full rounded-full text-center font-bold text-lg flex items-center justify-center" style={{ width: `${percentage}%` }}>
                        {percentage.toFixed(1)}%
                    </div>
                </div>
                <div className="text-2xl font-bold">
                    <span>{data?.followerCount.toLocaleString()} / {goal.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default function Overlay() {
    const router = useRouter();
    const { id, type = 'default', goal = 1000, color = 'white', live = 'n' } = router.query;
    const { data } = useInfoById(id, { refreshInterval: 5000 });
    const [showCelebration, setShowCelebration] = useState(false);
    const prevFollowersRef = useRef(data?.followerCount);

    useEffect(() => {
        if (data && prevFollowersRef.current < goal && data.followerCount >= goal && type === 'progress') {
            setShowCelebration(true);
            const timer = setTimeout(() => setShowCelebration(false), 10000); // 10초 후 사라짐
            return () => clearTimeout(timer);
        }
    }, [data, goal, type]);

    useEffect(() => {
        if (data) {
            prevFollowersRef.current = data.followerCount;
        }
    }, [data]);

    if (!id) return <div>ID를 제공해야 합니다.</div>;

    return (
        <div className="absolute inset-0">
            {showCelebration && <Celebration count={goal} />}
            {type === 'progress'
                ? <ProgressBarOverlay data={data} goal={parseInt(goal)} color={color} />
                : <DefaultOverlay data={data} color={color} live={live} />
            }
        </div>
    );
}