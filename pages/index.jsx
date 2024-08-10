import { useState, useEffect, useRef } from "react";
import useSearch from "@/hooks/useSearch";
import Image from "next/image";
import { useRouter } from "next/router";
import {NextSeo} from "next-seo";

export default function Home() {
    const [search, setSearch] = useState('');
    const [focused, setFocused] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const inputRef = useRef(null);
    const resultBoxRef = useRef(null);
    const router = useRouter();
    const { data: searchResult, isLoading: searchLoading, error: searchError, isError: searchIsError } = useSearch(debouncedSearch, {
        enabled: focused && debouncedSearch.length > 0
    });

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 800);

        return () => {
            clearTimeout(handler);
        };
    }, [search]);

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
    }, [inputRef, resultBoxRef]);

    return (
        <div className="flex flex-col items-center h-screen">
            <NextSeo
                title="메인"
                description="치지직 팔로워 라이브는 치지직 채널의 팔로워 수를 실시간으로 제공합니다."
                openGraph={{
                    title: '메인',
                    type: 'website',
                    locale: 'ko_KR',
                    url: 'https://chzzkcounts.vercel.app/',
                    siteName: '치지직 팔로워 라이브',
                }}
            />
            <main
                className={`flex h-full w-full flex-col items-center justify-center gap-5 p-24 bg-[#141517] space-y-5`}>
                <h1 className={`text-4xl text-white`}>치지직 팔로워 라이브</h1>
                <div className="relative w-96">
                    <div ref={inputRef}
                         className={`flex items-center bg-[#141517] rounded-3xl px-4 py-1 border-[0.1px] ${focused ? "border-[#06d086]" : "border-[#4d4d4d]"}`}>
                        <input
                            className="text-[#c9cedc] w-full font-bold bg-[#141517] overflow-hidden overflow-ellipsis whitespace-nowrap outline-none"
                            placeholder="스트리머 검색"
                            type="search"
                            onKeyDown={(e) => {
                                try {
                                    if (e.key === "Enter" && searchResult.length >= 2) router.push("/search?q=" + search);
                                    else if(e.key==="Enter"&&searchResult.length===1) router.push("/counter/"+search);
                                } catch (e) {
                                    router.push("/search?q=" + search);
                                }
                            }}
                            onFocus={() => setFocused(true)}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="right-0 bg-[#06d086] text-white rounded-3xl px-3 py-1 flex-none mr-1"
                                onClick={() => {
                                    if (search.length >= 1) router.push("/search?q=" + search);
                                }}>
                            검색
                        </button>
                    </div>
                    {
                        focused && (
                            <div ref={resultBoxRef}
                                 className="absolute top-12 left-0 w-full bg-[#212325] rounded-xl max-h-64 overflow-y-scroll">
                                {
                                    searchLoading && <p className="text-white p-4">로딩 중...</p>
                                }
                                {
                                    searchIsError && <p className="text-white p-4">에러 발생: {searchError.message}</p>
                                }
                                {
                                    searchResult && searchResult.length > 1 ? searchResult.map((channel) => (
                                        <div key={channel.id} className="flex items-center justify-between px-8 py-3">
                                            <div className="flex items-center">
                                                <Image src={channel.channelImageUrl !== null && channel.channelImageUrl} alt={channel.name} width={40}
                                                       height={40}
                                                       className="rounded-full hover:cursor-pointer"
                                                        onClick={()=>window.open('https://chzzk.naver.com/'+channel.channelId)}/>
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
            </main>
            <footer className="flex items-center justify-center w-full h-10 bg-gray-700">
                <p className="text-center text-gray-300">해당 사이트는 <span className="text-blue-600 hover:underline hover:cursor-pointer" onClick={()=>window.open("https://github.com/popop098/chzzkcounts","_blank")}>오픈소스</span>로 공개되어있습니다.</p>
            </footer>
        </div>

    );
}