import { useEffect, useState, memo, useCallback } from 'react';
import Image from "next/image";
import { useRouter } from "next/router";
import { NextSeo, SocialProfileJsonLd } from "next-seo";
import dynamic from "next/dynamic";
import { Line } from 'react-chartjs-2';
import { CategoryScale, LinearScale, PointElement, LineElement, Chart } from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

// Dynamically import Odometer to avoid SSR issues
const Odometer = dynamic(() => import('react-odometerjs'), {
    ssr: false,
    loading: () => <div>0</div>
});

// Helper to generate Open Graph image URL
const generateOgImage = ({ channelName, followerCount, channelImageUrl, channelDescription }) => {
    const mainUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.chzzkcounts.live';
    const u = new URL(`${mainUrl}/api/og`);
    u.searchParams.append('name', channelName);
    u.searchParams.append('follower', followerCount);
    u.searchParams.append('image', channelImageUrl);
    u.searchParams.append('description', channelDescription);
    // u.searchParams.append('v', Date.now().toString());
    return u.href;
};

// Custom hook for managing follower chart data
const useFollowerChart = (name, initialFollowerCount) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: '팔로워 수',
            data: [],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
        }]
    });
    const [count, setCount] = useState(initialFollowerCount);

    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`/api/info?name=${name}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.followerCount) {
                        const currentCount = data.followerCount;
                        const currentTime = new Date().toLocaleTimeString();

                        setCount(currentCount);
                        setChartData((prevState) => {
                            if (prevState.labels.includes(currentTime)) return prevState;

                            const newLabels = [...prevState.labels, currentTime].slice(-25);
                            const newData = [...prevState.datasets[0].data, currentCount].slice(-25);

                            return {
                                labels: newLabels,
                                datasets: [{
                                    ...prevState.datasets[0],
                                    data: newData,
                                }]
                            };
                        });
                    }
                })
                .catch(err => console.error("Failed to fetch follower data:", err));
        }, 2000);

        return () => clearInterval(interval);
    }, [name]);

    return { count, chartData };
};

const CounterHeader = memo(({ data }) => {
    const router = useRouter();
    const handleBack = useCallback(() => router.back(), [router]);
    const handleChannelLink = useCallback(() => {
        if (data?.channelId) {
            window.open(`https://chzzk.naver.com/${data.channelId}`)
        }
    }, [data?.channelId]);

    return (
        <div className="w-full px-4">
            <div
                className="w-full px-5 py-2 rounded-xl bg-gray-700 text-gray-200 text-lg md:text-xl hover:cursor-pointer border-[0.1px] border-red-700 mb-6 md:mb-10 text-center"
                onClick={handleBack}>
                ◀ 이전
            </div>
            <div className="flex flex-col items-center gap-4">
                <div className="relative flex justify-center items-end">
                    {data?.openLive && (
                        <div className="absolute px-3 py-0.5 bg-red-700 rounded-lg -mb-3 animate-pulse">
                            <span className="text-sm font-bold">LIVE</span>
                        </div>
                    )}
                    <Image
                        src={data?.channelImageUrl || '/favicon.png'}
                        alt={data?.channelName || 'Channel Image'}
                        width={130}
                        height={130}
                        className={`rounded-full p-1 w-[100px] h-[100px] md:w-[130px] md:h-[130px] ${data?.openLive ? "border-2 border-[#06d086]" : ""} hover:cursor-pointer`}
                        onClick={handleChannelLink}
                        priority
                        unoptimized
                    />
                </div>
                <h2 className="font-bold text-2xl md:text-4xl text-center">
                    {data?.channelName}
                </h2>
            </div>
        </div>
    );
});
CounterHeader.displayName = 'CounterHeader';

const FollowerCount = memo(({ count }) => (
    <div className="font-extrabold text-5xl md:text-7xl lg:text-9xl text-center">
        <Odometer value={count} format="(,ddd)" duration={1000} />
    </div>
));
FollowerCount.displayName = 'FollowerCount';

const FollowerChart = memo(({ chartData }) => {
    const options = {
        animation: true,
        maintainAspectRatio: false,
        scales: {
            x: { display: false },
            y: {
                ticks: {
                    display: true,
                    color: 'rgb(126,126,126)',
                    stepSize: 1,
                },
                title: { display: false },
                suggestedMin: Math.min(...chartData.datasets[0].data) - 1,
                suggestedMax: Math.max(...chartData.datasets[0].data) + 1,
            }
        },
        plugins: { legend: { display: false } }
    };

    return (
        <div className="w-full h-48 md:h-64 lg:h-80 mt-6">
            <Line data={chartData} options={options} />
        </div>
    );
});
FollowerChart.displayName = 'FollowerChart';

export default function Counter({ name, initialData }) {
    const { count, chartData } = useFollowerChart(name, initialData?.followerCount);
    const router = useRouter();
    const canonicalUrl = `https://www.chzzkcounts.live${router.asPath}`;

    if (!initialData) {
        return <div className="text-white text-center p-10">채널을 찾을 수 없습니다.</div>;
    }

    const { channelName, channelDescription, channelImageUrl, followerCount, openLive } = initialData;

    return (
        <>
            <NextSeo
                title={`${channelName} - 실시간 팔로워 수`}
                description={`${channelName} 채널의 실시간 팔로워 수와 통계를 확인하세요. ${channelDescription}`}
                canonical={canonicalUrl}
                themeColor={'#06d086'}
                additionalMetaTags={[{
                    name: 'keywords',
                    content: `치지직, chzzk, ${channelName}, 팔로워, 라이브, 실시간, 카운터, 스트리머, 통계`,
                }]}
                twitter={{ 
                    cardType: 'summary_large_image',
                 }}
                openGraph={{
                    title: `${channelName} - 실시간 팔로워 수`, 
                    description: `${channelName} 채널의 실시간 팔로워 수와 통계를 확인하세요.`,
                    url: canonicalUrl,
                    type: 'website',
                    locale: 'ko_KR',
                    site_name: '치지직 팔로워 라이브',
                    images: [{
                        url: generateOgImage(initialData),
                        width: 1200,
                        height: 630,
                        alt: `${channelName} 실시간 팔로워 수`, 
                    }],
                }}
            />
            <SocialProfileJsonLd
                type="Person"
                name={channelName}
                url={canonicalUrl}
                sameAs={[
                    `https://chzzk.naver.com/${initialData.channelId}`
                ]}
            />
            <div className="min-h-screen bg-[#141517] p-4 md:p-5 text-gray-200 flex flex-col">
                <CounterHeader data={initialData} />
                <main className="flex-grow flex flex-col items-center justify-center gap-4 md:gap-5">
                    <FollowerCount count={count} />
                    <FollowerChart chartData={chartData} />
                </main>
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const { name } = context.params;
    const mainUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://www.chzzkcounts.live';
    try {
        const res = await fetch(`${mainUrl}/api/info?name=${encodeURIComponent(name)}`);
        if (!res.ok) {
            return { props: { name, initialData: null } };
        }
        const initialData = await res.json();
        return { props: { name, initialData } };
    } catch (error) {
        console.error("Error in getServerSideProps:", error);
        return { props: { name, initialData: null } };
    }
}