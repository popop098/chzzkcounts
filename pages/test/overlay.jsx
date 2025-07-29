import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

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

const ProgressBarOverlay = ({ current, goal, color }) => {
    const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

    return (
        <div className="w-full max-w-2xl bg-transparent p-4 rounded-lg border-2 border-gray-700" style={{ color }}>
            <div className="flex flex-col items-center justify-center h-full gap-3">
                <h2 className="text-xl font-bold">팔로워 목표: {goal.toLocaleString()}</h2>
                <div className="w-full bg-gray-700 rounded-full h-8 border-2 border-gray-500">
                    <div className="bg-green-500 h-full rounded-full text-center font-bold text-lg flex items-center justify-center transition-all duration-500"
                         style={{ width: `${percentage}%` }}>
                        {percentage.toFixed(1)}%
                    </div>
                </div>
                <div className="text-2xl font-bold">
                    <span>{current.toLocaleString()} / {goal.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default function OverlayTestPage() {
    const [goal, setGoal] = useState(1000);
    const [currentFollowers, setCurrentFollowers] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const prevFollowersRef = useRef(currentFollowers);

    useEffect(() => {
        // Only trigger celebration when the follower count crosses the goal
        if (prevFollowersRef.current < goal && currentFollowers >= goal) {
            setShowCelebration(true);
            const timer = setTimeout(() => setShowCelebration(false), 8000); // Disappears after 8 seconds
            return () => clearTimeout(timer);
        }
    }, [currentFollowers, goal]);

    // Update the ref after the celebration check
    useEffect(() => {
        prevFollowersRef.current = currentFollowers;
    }, [currentFollowers]);

    const handleFollowerChange = (amount) => {
        setCurrentFollowers(prev => Math.max(0, prev + amount));
    };

    return (
        <div className="min-h-screen bg-[#141517] text-white flex flex-col items-center justify-center p-4 gap-8">
            <h1 className="text-4xl font-bold text-emerald-400">오버레이 테스트 페이지</h1>
            
            {showCelebration && <Celebration count={goal} />}

            <div className="w-full max-w-md flex flex-col items-center gap-4 p-6 bg-gray-800 rounded-xl border border-gray-700">
                <div className="w-full">
                    <label htmlFor="goalInput" className="block text-lg font-medium mb-2">목표 팔로워 수 설정:</label>
                    <input
                        id="goalInput"
                        type="number"
                        value={goal}
                        onChange={(e) => setGoal(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-md bg-gray-900 text-white border border-gray-600 focus:border-emerald-500 focus:outline-none"
                    />
                </div>
                <div className="w-full">
                    <p className="block text-lg font-medium mb-2">현재 팔로워: {currentFollowers.toLocaleString()}</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => handleFollowerChange(1)} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-bold">+1</button>
                        <button onClick={() => handleFollowerChange(-1)} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-bold">-1</button>
                        <button onClick={() => handleFollowerChange(10)} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-bold">+10</button>
                        <button onClick={() => handleFollowerChange(-10)} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-bold">-10</button>
                        <button onClick={() => handleFollowerChange(100)} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-bold">+100</button>
                        <button onClick={() => handleFollowerChange(-100)} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-bold">-100</button>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col items-center gap-4">
                <h2 className="text-2xl font-bold text-emerald-400">미리보기</h2>
                <ProgressBarOverlay current={currentFollowers} goal={goal} color="white" />
            </div>
        </div>
    );
}