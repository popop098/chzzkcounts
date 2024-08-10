import { useEffect, useRef, useState } from 'react';
import useInfoById from "@/hooks/useInfoById";
import Image from "next/image";
import {useRouter} from "next/router";
import {NextSeo} from "next-seo";
import dynamic from "next/dynamic";

const Odometer = dynamic(import('react-odometerjs'), {
    ssr: false,
    loading: () => 0
});

export default function CounterById({ id, color }) {
    const { data, isLoading, isError } = useInfoById(id);
    //const [textColor, setTextColor] = useState('gray-200');
    const [count, setCount] = useState(0);
    const router = useRouter();
    useEffect(() => {
        let interval;
        fetch(`/api/info?id=${id}`).then((res)=>res.json()).then((data)=>{
            setCount(data.followerCount);
        });
        interval = setInterval(() => {
            fetch(`/api/info?id=${id}`)
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
    }, []);
    return (
        <>
            <NextSeo
                title={`${data?.channelName}`}
                description={`${data?.channelName} 채널의 팔로워 수를 실시간으로 제공합니다.`}
                openGraph={{
                    title: `${data?.channelName} 실시간 팔로워 수`,
                    type: 'website',
                    locale: 'ko_KR',
                    url: 'https://chzzkcounts.vercel.app/',
                    siteName: '치지직 팔로워 라이브',
                }}
            />
            <div className={`overflow-hidden w-fit`}
                style={{
                    color: color
                }}>
                <div
                    className="flex flex-col items-center justify-center gap-5 w-fit">
                    <div className="flex flex-col items-center gap-5">
                        <div className="relative flex justify-center items-end">
                            {
                                data?.openLive && (
                                    <div className="absolute px-3 py-0.5 bg-red-700 rounded-lg -mb-3 text-gray-200">
                                        <span className="text-sm font-bold">LIVE</span>
                                    </div>
                                )
                            }
                            <Image src={data?.channelImageUrl} alt={data?.channelName} width={130} height={130}
                                   className={`rounded-full p-1 ${data?.openLive && "border-2 border-[#06d086]"} hover:cursor-pointer`}
                                   onClick={() => window.open('https://chzzk.naver.com/' + data.channelId)}
                                   loading="lazy"/>
                        </div>

                        <h2 className="text-5xl font-bold">{data?.channelName}</h2>
                    </div>
                    <div className={`font-extrabold sm:text-9xl text-8xl`}>
                        <Odometer value={count} format="(,ddd)" duration={2000}/>
                    </div>
                </div>
            </div>
        </>

    );
}

export async function getServerSideProps(context) {
    const {id} = context.params;
    const color = context.query.color || 'white';
    return {props: {id,color}};
}