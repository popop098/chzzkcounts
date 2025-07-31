import useSearch from "@/hooks/useSearch";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
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
    const canonicalUrl = `https://www.chzzkcounts.live/search?q=${encodeURIComponent(q)}`;

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
                title={`'${q}' 검색 결과`}
                description={`'${q}'에 대한 치지직 채널 검색 결과입니다. 실시간 팔로워 수를 확인하세요.`}
                canonical={canonicalUrl}
                openGraph={{
                    title: `'${q}' 검색 결과 - 치지직 팔로워 라이브`,
                    description: `'${q}'에 대한 채널 검색 결과입니다.`,
                    type: 'website',
                    locale: 'ko_KR',
                    url: canonicalUrl,
                    siteName: '치지직 팔로워 라이브',
                    images: [
                        {
                            url: 'https://www.chzzkcounts.live/favicon.png',
                            width: 512,
                            height: 512,
                            alt: '치지직 팔로워 라이브 로고',
                        }
                    ]
                }}
            />
            <main className="flex min-h-full max-h-fit w-full flex-col items-center gap-5 p-4 md:p-24 bg-[#141517] space-y-5">
                <div className="w-full md:w-auto px-5 py-2 rounded-xl bg-gray-700 text-gray-200 text-xl hover:cursor-pointer text-center"
                     onClick={() => router.back()}>
                    ◀ 이전
                </div>
                <h1 className={`text-3xl md:text-4xl text-white text-center`}>&apos;<span className="text-emerald-400">{q}</span>&apos; 검색 결과</h1>
                <div className="relative w-full max-w-md px-4">
                    <div ref={inputRef}
                         className={`flex items-center bg-[#141517] rounded-3xl pr-2 pl-4 py-1 border-[0.1px] ${focused ? "border-[#06d086]" : "border-[#4d4d4d]"}`}>
                        <input
                            ref={inputRef}
                            className="text-[#c9cedc] w-full font-bold bg-[#141517] overflow-hidden overflow-ellipsis whitespace-nowrap outline-none"
                            placeholder="스트리머 검색"
                            type="search"
                            defaultValue={q}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    router.push("/search?q=" + keyword);
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
                                 className="absolute top-12 left-0 w-full bg-[#212325] rounded-xl max-h-64 overflow-y-scroll z-10">
                                {
                                    isLoading && <p className="text-white p-4">로딩 중...</p>
                                }
                                {
                                    isError && <p className="text-white p-4">에러 발생: {error.message}</p>
                                }
                                {
                                    isSuccess && data && data.length > 0 ? data.map((channel) => (
                                        <div key={channel.id} className="flex items-center justify-between px-4 md:px-8 py-3 hover:bg-gray-700 cursor-pointer"
                                             onClick={() => router.push("/counter/" + channel.channelName)}>
                                            <div className="flex items-center gap-2">
                                                <Image src={channel.channelImageUrl || '/favicon.png'}
                                                       alt={channel.channelName}
                                                       width={40} height={40}
                                                       className="rounded-full w-[40px] h-[40px]"
                                                       quality={100}/>
                                                <div className="ml-4">
                                                    <h2 className="text-white font-bold">{channel.channelName}</h2>
                                                    <p className="text-[#c9cedc]">{channel.channelDescription.length > 15 ? channel.channelDescription.slice(0, 15) + "..." : channel.channelDescription}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )) : !isLoading && <p className="text-white p-4">검색 결과가 없습니다.</p>
                                }
                            </div>
                        )
                    }
                </div>
                <div className="flex flex-col gap-5 w-full max-w-md px-4 overflow-y-auto">
                    {
                        initialResult && initialResult.length > 0 ? initialResult.map((channel) => (
                            <div key={channel.channelId} className="flex items-center justify-between gap-5 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer"
                                 onClick={() => router.push("/counter/" + channel.channelName)}>
                                <div className="flex items-center gap-4">
                                    <Image src={channel.channelImageUrl || '/favicon.png'}
                                           alt={channel.channelName}
                                           width={50}
                                           height={50}
                                           className="rounded-full w-[50px] h-[50px]"
                                           quality={100}/>
                                    <div>
                                        <h2 className="text-white font-bold text-lg">{channel.channelName}</h2>
                                        <p className="text-[#c9cedc]">{channel.followerCount.toLocaleString()}명 팔로워</p>
                                    </div>
                                </div>
                                <button className="bg-[#06d086] text-white rounded-3xl px-4 py-2 flex-none">
                                    선택
                                </button>
                            </div>
                        )) : <p className="text-white text-center">검색 결과가 없습니다.</p>
                    }
                </div>
            </main>
            <footer className="flex items-center justify-center w-full py-2 bg-gray-700">
                <p className="text-center text-gray-300 text-sm">해당 사이트는 <span
                    className="text-blue-600 hover:underline hover:cursor-pointer"
                    onClick={() => window.open("https://github.com/popop098/chzzkcounts", "_blank")}>오픈소스</span>로
                    공개되어있습니다.</p>
            </footer>
        </div>
    );
}

export async function getServerSideProps({query}) {
    import {ChzzkClient} from "chzzk";
    const {q} = query;
    if (!q || q.trim() === "") {
        return { props: { q: "", initialResult: [] } };
    }
    try {
        const client = new ChzzkClient();
        const result = await client.search.channels(q);
        return {
            props: {
                q,
                initialResult: result.channels.slice(0,20)
            }
        }
    } catch (e) {
        console.error("Search API error:", e);
        return {
            props: {
                q,
                initialResult: []
            }
        }
    }
}