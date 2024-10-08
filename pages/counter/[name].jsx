import { useEffect, useState } from 'react';
import useInfo from "@/hooks/useInfo";
import Image from "next/image";
import {useRouter} from "next/router";
import {NextSeo} from "next-seo";
import dynamic from "next/dynamic";

const Odometer = dynamic(() => import('react-odometerjs'), {
    ssr: false,
    loading: () => <div>0</div>
});

export default function Counter({ name }) {
    const { data, isLoading, isError } = useInfo(name);
    //const [textColor, setTextColor] = useState('gray-200');
    const [count, setCount] = useState(0);
    const router = useRouter();
    useEffect(() => {
        let interval;
        fetch(`/api/info?name=${name}`).then((res)=>res.json()).then((data)=>{
            setCount(data.followerCount);
        });
        interval = setInterval(() => {
            fetch(`/api/info?name=${name}`)
                .then((res)=>res.json()).then((data)=>{
                    const currentCount = data.followerCount;
                    setCount((prevState) => {
                        //const change = currentCount - prevState;
                        //console.log(`[${data.channelName}] ${prevState} -> ${currentCount} (${change > 0 ? '↑' : '↓'} ${Math.abs(change)})`);
                        //setTextColor(change > 0 ? 'green-500' : 'red-500');
                        if(currentCount === prevState) return prevState;
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
                            url: data?.channelImageUrl || 'https://chzzkcounts.vercel.app/favicon.png',
                            width: 512,
                            height: 512,
                            alt: '치지직 팔로워 라이브',
                        }
                    ]
                }}
            />
            <div className="h-screen bg-[#141517] overflow-hidden p-5">
                <div className="w-full px-5 py-1 rounded-xl bg-gray-700 text-gray-200 text-xl hover:cursor-pointer"
                     onClick={() => router.back()}>
                    ◀ 이전
                </div>
                <div
                    className="flex flex-col h-full items-center justify-center gap-5 text-gray-200">
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
            </div>
        </>

    );
}

export async function getServerSideProps(context) {
    const {name} = context.params;
    return {props: {name}};
}