import useSearch from "@/hooks/useSearch";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {ChzzkClient} from "chzzk";
import {NextSeo} from "next-seo";
export default function Search({q,initialResult}) {
    const [keyword, setKeyword] = useState(q);
    const [focused, setFocused] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState(keyword);
    const {data, isLoading, isError, error, isSuccess} = useSearch(debouncedSearch,{
        enabled: focused && debouncedSearch.length > 0
    });
    const inputRef = useRef();
    const resultBoxRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(keyword);
        }, 800);

        return () => {
            clearTimeout(handler);
        };
    }, [keyword]);
    useEffect(() => {
        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target) && resultBoxRef.current && !resultBoxRef.current.contains(event.target)) {
                setFocused(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [inputRef]);
    useEffect(() => {
        inputRef.current.focus();
    }, []);

    return (
        <div className="flex flex-col items-center h-screen">
            <NextSeo
                title="검색"
                description="실시간으로 팔로워 수를 확인하고 싶은 채널을 검색하세요."
                openGraph={{
                    title: '검색',
                    type: 'website',
                    locale: 'ko_KR',
                    url: 'https://chzzkcounts.vercel.app/',
                    siteName: '치지직 팔로워 라이브',
                }}
            />
            <main className="flex h-full max-h-fit w-full flex-col items-center gap-5 p-24 bg-[#141517] space-y-5">
                <div className="w-fit px-5 py-1 rounded-xl bg-gray-700 text-gray-200 text-xl hover:cursor-pointer"
                     onClick={() => router.back()}>
                    ◀ 이전
                </div>
                <h1 className={`text-4xl text-white`}>치지직 팔로워 라이브</h1>
                <div className="relative w-96">
                    <div ref={inputRef}
                         className={`flex items-center bg-[#141517] rounded-3xl pr-2 pl-4 py-1 border-[0.1px] ${focused ? "border-[#06d086]" : "border-[#4d4d4d]"}`}>
                        <input
                            className="text-[#c9cedc] w-full font-bold bg-[#141517] overflow-hidden overflow-ellipsis whitespace-nowrap outline-none"
                            placeholder="스트리머 검색"
                            type="search"
                            defaultValue={q}
                            onKeyDown={(e) => {
                                try {
                                    if (e.key === "Enter" && data.length >= 2) router.push("/search?q=" + keyword);
                                    else if(e.key==="Enter"&&data.length===1) router.push("/counter/"+keyword);
                                } catch (e) {
                                    router.push("/search?q=" + search);
                                }
                            }}
                            onFocus={() => setFocused(true)}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button className="right-0 bg-[#06d086] text-white rounded-3xl px-3 py-1 flex-none mr-1"
                                onClick={() => {
                                    if (keyword.length >= 1) router.push("/search?q=" + keyword);
                                }}>
                            검색
                        </button>
                    </div>
                    {
                        focused && (
                            <div ref={resultBoxRef}
                                 className="absolute top-12 left-0 w-full bg-[#212325] rounded-xl max-h-64 overflow-y-scroll">
                                {
                                    isLoading && <p className="text-white p-4">로딩 중...</p>
                                }
                                {
                                    isError && <p className="text-white p-4">에러 발생: {error.message}</p>
                                }
                                {
                                    !isLoading && !isError && isSuccess && data && data.length >= 1 ? data.map((channel) => (
                                        <div key={channel.id} className="flex items-center justify-between px-8 py-3">
                                            <div className="flex items-center gap-2">
                                                <Image src={channel.channelImageUrl !== null && channel.channelImageUrl}
                                                       alt={channel.name} width={40} height={40}
                                                       className="rounded-full hover:cursor-pointer w-[40px] h-[40px]"
                                                       onClick={() => window.open('https://chzzk.naver.com/' + channel.channelId)}/>
                                                <div className="ml-4">
                                                    <h2 className="text-white font-bold">{channel.channelName}</h2>
                                                    <p className="text-[#c9cedc]">{channel.channelDescription.length > 15 ? channel.channelDescription.slice(0, 15) + "..." : channel.channelDescription}</p>
                                                </div>
                                            </div>
                                            <button className="bg-[#06d086] text-white rounded-3xl px-3 py-1 flex-none"
                                                    onClick={() => router.push("/counter/" + channel.channelName)}>
                                                선택
                                            </button>
                                        </div>
                                    )) : <p className="text-white p-4">검색 결과가 없습니다.</p>
                                }
                            </div>
                        )
                    }
                </div>
                <div className="flex flex-col gap-5 w-96 overflow-y-scroll overflow-x-hidden">
                    {
                        initialResult && initialResult.length >= 1 ? initialResult.map((channel) => (
                            <div key={channel.id} className="flex items-center justify-between gap-5">
                                <div className="flex items-center gap-2">
                                    <Image src={channel.channelImageUrl !== null && channel.channelImageUrl}
                                           alt={channel.name} width={40} height={40}
                                           className="rounded-full hover:cursor-pointer w-[40px] h-[40px]"
                                           onClick={() => window.open('https://chzzk.naver.com/' + channel.channelId)}/>
                                    <div>
                                        <h2 className="text-white font-bold">{channel.channelName}</h2>
                                        <p className="text-[#c9cedc]">{channel.channelDescription.length > 15 ? channel.channelDescription.slice(0, 15) + "..." : channel.channelDescription}</p>
                                    </div>
                                </div>
                                <button className="bg-[#06d086] text-white rounded-3xl px-3 py-1"
                                        onClick={() => router.push("/counter/" + channel.channelName)}>
                                    선택
                                </button>
                            </div>
                        )) : <p className="text-white">검색 결과가 없습니다.</p>
                    }
                </div>
            </main>
            <footer className="flex items-center justify-center w-full py-1 bg-gray-700">
                <p className="text-center text-gray-300">해당 사이트는 <span
                    className="text-blue-600 hover:underline hover:cursor-pointer"
                    onClick={() => window.open("https://github.com/popop098/chzzkcounts", "_blank")}>오픈소스</span>로
                    공개되어있습니다.</p>
            </footer>
        </div>
    );

}

export async function getServerSideProps({query}) {
    const {q} = query;
    const client = new ChzzkClient();
    const result = await client.search.channels(q);
    return {
        props: {
            q: q || "",
            initialResult: result.channels
        }
    }
}