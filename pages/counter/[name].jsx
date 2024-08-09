import { useEffect, useRef, useState } from 'react';
import useInfo from "@/hooks/useInfo";
import {CountUp} from "countup.js";
import Image from "next/image";
import {useRouter} from "next/router";
import {NextSeo} from "next-seo";

export default function Counter({ name }) {
    const { data, isLoading, isError } = useInfo(name);
    const [textColor, setTextColor] = useState('gray-200');
    const router = useRouter();
    useEffect(() => {
        let interval;
        let prevCount = 0;
        let countup;
        fetch(`/api/info?name=${name}`).then((res)=>res.json()).then((data)=>{
            countup = new CountUp("countEl", data.followerCount,{
                startVal: 0,
                duration: 5
            });
            countup.start();
            prevCount = data.followerCount;
        });
        interval = setInterval(() => {
            fetch(`/api/info?name=${name}`)
                .then((res)=>res.json()).then((data)=>{
                    const currentCount = data.followerCount;
                    if(currentCount !== prevCount){
                        /*
                         setTextColor가 먹는것같긴한데 색상변경이 안먹음
                         */
                        if(currentCount > prevCount){
                            console.log(`[${data.channelName}] ${prevCount} -> ${currentCount} (↑ ${currentCount-prevCount})`);
                            setTextColor('green-500');
                        } else {
                            console.log(`[${data.channelName}] ${prevCount} -> ${currentCount} (↓ ${prevCount-currentCount})`);
                            setTextColor('red-500');
                        }
                        prevCount = currentCount;
                        countup.update(currentCount);
                        setTimeout(()=>{
                            setTextColor('gray-200');
                        }, 2500);
                    }
            });
        }, 5000);
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
            <div className="h-screen bg-[#141517] overflow-hidden p-5">
                <div className="w-full px-5 py-1 rounded-xl bg-gray-700 text-gray-200 text-xl hover:cursor-pointer"
                     onClick={() => router.back()}>
                    ◀ 이전
                </div>
                <div
                    className="flex flex-col h-full items-center justify-center gap-5 p-24 text-gray-200">
                    <div className="flex flex-col items-center gap-3">
                        <Image src={data?.channelImageUrl} alt={data?.channelName} width={130} height={130}
                               className="rounded-full font-bold border-2 p-1 border-[#06d086] hover:cursor-pointer"
                               onClick={()=>window.open('https://chzzk.naver.com/'+data.channelId)}/>
                        <h2 className="text-5xl font-bold">{data?.channelName}</h2>
                    </div>
                    <span id="countEl" className={`font-extrabold sm:text-9xl text-8xl text-${textColor}`}>0</span>
                </div>
            </div>
        </>

    );
}

export async function getServerSideProps(context) {
    const {name} = context.params;
    return {props: {name}};
}