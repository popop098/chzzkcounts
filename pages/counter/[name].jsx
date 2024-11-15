import { useEffect, useState } from 'react';
import useInfo from "@/hooks/useInfo";
import Image from "next/image";
import {useRouter} from "next/router";
import {NextSeo} from "next-seo";
import dynamic from "next/dynamic";
import { Line } from 'react-chartjs-2';
import { CategoryScale,LinearScale, PointElement, LineElement } from 'chart.js';
import { Chart } from 'chart.js';
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
const Odometer = dynamic(() => import('react-odometerjs'), {
    ssr: false,
    loading: () => <div>0</div>
});
Chart.register(CategoryScale, LinearScale, PointElement,LineElement);

const generateOgImage = ({channelName, followerCount, channelImageUrl, channelDescription}) => {
    const mainUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://chzzkcounts.live';
    const u = new URL(mainUrl + '/api/og');
    u.searchParams.append('name', channelName);
    u.searchParams.append('follower', followerCount);
    u.searchParams.append('image', channelImageUrl);
    u.searchParams.append('description', channelDescription);
    return u.href;
}

export default function Counter({ name }) {
    const { data, isLoading, isError } = useInfo(name);
    //const [textColor, setTextColor] = useState('gray-200');
    const [count, setCount] = useState(0);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: '팔로워 수',
                data: [],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
            }
        ]
    });
    const router = useRouter();
    useEffect(() => {
    let interval;
    interval = setInterval(() => {
        fetch(`/api/info?name=${name}`)
            .then((res) => res.json()).then((data) => {
                const currentCount = data.followerCount;
                const currentTime = new Date().toLocaleTimeString();
                setCount((prevState) => {
                    setChartData((prevStates) => {
                        if (prevStates.labels.includes(currentTime)) {
                            return prevStates;
                        }
                        const newLabels = [...prevStates.labels, currentTime].slice(-25);
                        const newData = {
                            labels: newLabels,
                            datasets: [
                                {
                                    ...prevStates.datasets[0],
                                    data: [...prevStates.datasets[0].data, currentCount].slice(-25)
                                }
                            ]
                        };
                        return newData;
                    });
                    return currentCount;
                });
            });
    }, 2000);
    return () => clearInterval(interval);
}, [name]);
    return (
        <>
            <NextSeo
                title={`${data?.channelName || name}`}
                description={`${data?.channelName || name} 채널의 팔로워 수를 실시간으로 제공합니다.`}
                openGraph={{
                    title: `${data?.channelName || name} 실시간 팔로워 수`,
                    type: 'website',
                    locale: 'ko_KR',
                    url: 'https://www.chzzkcounts.live/counter/'+data?.channelName || name,
                    siteName: '치지직 팔로워 라이브',
                    images: [
                        {
                          url: generateOgImage({
                                channelName: data?.channelName || name,
                                followerCount: count,
                                channelImageUrl: data?.channelImageUrl || 'https://chzzkcounts.vercel.app/favicon.png',
                                channelDescription: data?.channelDescription || '치지직 팔로워 라이브는 치지직 채널의 팔로워 수를 실시간으로 제공합니다.'
                            }),
                            width: 1200,
                            height: 630,
                            alt: '치지직 팔로워 라이브',
                        },
                        {
                            url: data?.channelImageUrl || 'https://chzzkcounts.vercel.app/favicon.png',
                            width: 512,
                            height: 512,
                            alt: '치지직 팔로워 라이브',
                        }
                    ]
                }}
            />
            <div className="h-full bg-[#141517] p-5">
                <div className="w-full px-5 py-1 rounded-xl bg-gray-700 text-gray-200 text-xl hover:cursor-pointer"
                     onClick={() => router.back()}>
                    ◀ 이전
                </div>
                <div
                    className="flex flex-col h-full items-center justify-center gap-5 text-gray-200 mt-10">
                    <div className="flex flex-col items-center gap-5">
                        <div className="relative flex justify-center items-end">
                            {
                                data?.openLive && (
                                    <div className="absolute px-3 py-0.5 bg-red-700 rounded-lg -mb-3 animate-pulse">
                                        <span className="text-sm font-bold">LIVE</span>
                                    </div>
                                )
                            }
                            <Image src={data?.channelImageUrl} alt={data?.channelName} width={130} height={130}
                                   className={`rounded-full p-1 w-[130px] h-[130px] ${data?.openLive && "border-2 border-[#06d086]"} hover:cursor-pointer`}
                                   onClick={() => window.open('https://chzzk.naver.com/' + data.channelId)}
                                   loading="lazy" unoptimized/>
                        </div>

                        <h2 className="font-bold"
                            style={{
                                fontSize: "clamp(2rem, 5vw, 4rem)",
                            }}>{data?.channelName}</h2>
                    </div>
                    <div className={`font-extrabold`}
                        style={{
                            fontSize: "clamp(4rem, 10vw, 9rem)",
                        }}>
                        <Odometer value={count} format="(,ddd)" duration={2000}/>
                    </div>
                </div>
                <div className="flex justify-center my-6 hidden sm:block">
                    <Line
                        width={100}
                        className={``}
                        height={17}
                        data={chartData}
                        options={{
                            animation: true,
                            scales: {
                                x: {
                                    title: {
                                        display: false,
                                    }
                                },
                                y: {
                                    ticks: {
                                        display: true,
                                        color: 'rgb(126,126,126)',
                                        stepSize: 1,
                                        callback: function(value) {
                                            return value;
                                        }
                                    },
                                    title: {
                                        display: false,
                                    },
                                    suggestedMin: Math.min(...chartData.datasets[0].data) - 1,
                                    suggestedMax: Math.max(...chartData.datasets[0].data) + 1,
                                }
                            },
                        }}
                    />
                </div>

            </div>
        </>

    );
}

export async function getServerSideProps(context) {
    const {name} = context.params;
    return {props: {name}};
}