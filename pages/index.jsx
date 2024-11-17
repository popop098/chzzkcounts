import { useState, useEffect, useRef } from "react";
import useSearch from "@/hooks/useSearch";
import Image from "next/image";
import { useRouter } from "next/router";
import {NextSeo} from "next-seo";
import useRecommend from "@/hooks/useRecommand";

const PopupComp = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [doNotShowAgain, setDoNotShowAgain] = useState(false);

    useEffect(() => {
        const noticePopupDoNotShow = localStorage.getItem("noticePopupDoNotShow");
        if (!noticePopupDoNotShow) {
            setShowPopup(true);
        }
    }, []);

    const closePopup = () => {
        if (doNotShowAgain) {
            localStorage.setItem("noticePopupDoNotShow", "true");
        }
        setShowPopup(false);
    };
    return (
        showPopup && (
            <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50 px-3">
                <div className="bg-[#35383d] p-5 rounded-lg shadow-lg text-gray-200">
                    <h2 className="text-3xl font-bold text-center">신규 도메인 안내</h2>
                    <div className="p-2 bg-[#212325]/35 rounded-lg mt-2 font-light">
                        <p>
                            안녕하세요. 신규 도메인에 대해 안내드립니다.
                            <br/>
                            <br/>
                            현재 치지직 팔로워 라이브의 도메인이 변경되었습니다.
                            <br/>
                            기존 <code className="text-red-500">chzzkcounts.vercel.app</code>에서 <code className="text-green-500">chzzkcounts.live</code>로 변경되었습니다.
                            <br/>
                            이전 도메인으로 접속은 가능하나 자동으로 신규 도메인으로 리다이렉트 됩니다.
                            <br/>
                            <br/>
                            조금 더 쉽고 기억하기 좋게 하고자 변경하게 되었으니 양해 바랍니다.
                            <br/>
                            감사합니다.
                        </p>
                    </div>
                    <div className="mt-4">
                        <input
                            type="checkbox"
                            id="doNotShowAgain"
                            checked={doNotShowAgain}
                            onChange={(e) => setDoNotShowAgain(e.target.checked)}
                        />
                        <label htmlFor="doNotShowAgain" className="ml-2">더이상 보지 않기</label>
                    </div>
                    <button
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-xl w-full"
                        onClick={closePopup}
                    >
                        닫기
                    </button>
                </div>
            </div>
        )
    );
}


export default function Home() {
    const [search, setSearch] = useState('');
    const [focused, setFocused] = useState(false);
    const {
        data: recommendData,
        isError: recommendIsErr,
        isLoading: recommendIsLoading,
        isSuccess: recommendIsSuccess
    } = useRecommend();
    const inputRef = useRef(null);
    const resultBoxRef = useRef(null);
    const router = useRouter();
    const {
        data: searchResult,
        isLoading: searchLoading,
        error: searchError,
        isError: searchIsError,
        isSuccess: searchIsSuccess
    } = useSearch(search, {
        enabled: focused && search.length > 0
    });


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
        <>
            <PopupComp/>
            <div className="flex flex-col items-center h-screen">
                <NextSeo
                    title="메인"
                    description="치지직 팔로워 라이브는 치지직 채널의 팔로워 수를 실시간으로 제공합니다."
                    openGraph={{
                        title: '메인',
                        type: 'website',
                        locale: 'ko_KR',
                        url: 'https://www.chzzkcounts.live/',
                        siteName: '치지직 팔로워 라이브',
                        images: [
                            {
                                url: 'https://chzzkcounts.vercel.app/favicon.png',
                                width: 512,
                                height: 512,
                                alt: '치지직 팔로워 라이브',
                            }
                        ]
                    }}
                />
                <main
                    className={`flex h-full w-full flex-col items-center justify-center gap-5 bg-[#141517] space-y-5`}>
                    <div className="flex flex-col items-center">
                        <Image src={'/favicon.png'} alt={'logo'} width={100} height={100} quality={100} unoptimized/>
                        <h1 className={`text-white`}
                            style={{
                                fontSize:"clamp(2rem, 5vw, 3rem)"
                            }}><span className="text-[#991414]">치지직</span> <span className="text-blue-700">팔로워</span> <span className="text-[#991414]">라이브</span>
                        </h1>
                        <div className="flex items-center gap-2">
                            <div
                                className="px-2 py-1 rounded-xl bg-gray-700 text-blue-600 text-sm hover:cursor-pointer hover:bg-gray-800 border-[0.1px] border-red-700"
                                onClick={() => window.open('https://github.com/popop098/chzzkcounts/blob/main/README.md', '_blank')}>
                                <p>안내 및 사용법</p>
                            </div>
                            <div
                                className="px-2 py-1 rounded-xl bg-gray-700 text-gray-200 text-sm hover:cursor-pointer hover:bg-gray-800 border-[0.1px] border-blue-700"
                                onClick={() => router.push("/ovlyhelper")}>
                                <p>오버레이 생성</p>
                            </div>
                        </div>

                    </div>

                    <div className="relative w-96 mb-5">
                        <div ref={inputRef}
                             className={`flex items-center bg-[#141517] rounded-3xl pr-2 pl-4 py-1 border-[0.1px] ${focused ? "border-[#991414]" : "border-[#872a2a]"}`}>
                            <input
                                className="text-[#c9cedc] w-full font-bold bg-[#141517] overflow-hidden overflow-ellipsis whitespace-nowrap outline-none"
                                placeholder="스트리머 검색"
                                type="search"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !searchLoading && !searchError && searchIsSuccess) {
                                        if (searchResult?.length >= 2) {
                                            router.push("/search?q=" + search);
                                        } else if (searchResult?.length === 1) {
                                            router.push("/counter/" + searchResult[0].channelName);
                                        }
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
                        <div className="flex flex-col items-center gap-5 w-full mt-3">
                            <h2 className=" text-xl font-bold"><span className="text-blue-700">추천</span> <span className="text-[#991414]">채널</span></h2>
                            {
                                process.env.NODE_ENV === "production" && (
                                    <div className="flex flex-col justify-between w-2/3 gap-4">
                                        {
                                            recommendIsLoading && <p className="text-white">로딩 중...</p>
                                        }
                                        {
                                            recommendIsErr && <p className="text-white">에러 발생: {recommendData.message}</p>
                                        }
                                        {
                                            recommendIsSuccess && recommendData && recommendData.length >= 1 ? recommendData.map((channel) => (
                                                <div key={channel.id} className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <Image
                                                            src={channel.channelImageUrl !== null && channel.channelImageUrl}
                                                            alt={channel.channelName} width={60}
                                                            height={60}
                                                            className="rounded-full hover:cursor-pointer w-[60px] h-[60px]"
                                                            onClick={() => window.open('https://chzzk.naver.com/' + channel.id)}
                                                            unoptimized/>
                                                        <div className="ml-4">
                                                            <h2 className="text-white font-bold">{channel.channelName}</h2>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="bg-[#06d086] text-white rounded-3xl px-3 py-1 flex-none"
                                                        onClick={() => router.push("/counter/" + channel.channelName)}>
                                                        선택
                                                    </button>
                                                </div>
                                            )) : <p className="text-white">추천 채널이 없습니다.</p>
                                        }
                                    </div>
                                )
                            }
                        </div>
                        <div className="flex flex-col items-center gap-5">
                            {
                                focused && (
                                    <div ref={resultBoxRef}
                                         className="absolute top-12 left-0 w-full bg-[#212325] rounded-xl max-h-64 overflow-y-scroll border-[0.1px] border-[#991414]">
                                        {
                                            search.length >= 1 && searchLoading && <p className="text-white p-4">로딩 중...</p>
                                        }
                                        {
                                            search.length >= 1 && searchIsError &&
                                            <p className="text-white p-4">에러 발생: {searchError.message}</p>
                                        }
                                        {
                                            searchResult && searchResult.length >= 1 ? searchResult.map((channel) => (
                                                <div key={channel.id}
                                                     className="flex items-center justify-between px-8 py-3">
                                                    <div className="flex items-center">
                                                        <Image
                                                            src={channel.channelImageUrl !== null && channel.channelImageUrl}
                                                            alt={channel.channelName} width={40}
                                                            height={40}
                                                            className="rounded-full hover:cursor-pointer w-[40px] h-[40px]"
                                                            onClick={() => window.open('https://chzzk.naver.com/' + channel.channelId)}
                                                            unoptimized/>
                                                        <div className="ml-4">
                                                            <h2 className="text-white font-bold">{channel.channelName}</h2>
                                                            <p className="text-[#c9cedc]">{channel.channelDescription.length > 15 ? channel.channelDescription.slice(0, 15) + "..." : channel.channelDescription}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="bg-[#06d086] text-gray-50 rounded-3xl px-3 py-1 flex-none"
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
                    </div>
                </main>
                <footer className="flex flex-col items-center justify-center w-full h-24 bg-gray-700 border-t-[0.1px] border-red-700">
                    <p className="text-center text-gray-300">해당 사이트는 <span
                        className="text-blue-600 hover:underline hover:cursor-pointer"
                        onClick={() => window.open("https://github.com/popop098/chzzkcounts", "_blank")}>오픈소스</span>로
                        공개되어있습니다.</p>
                    <p className="text-center text-gray-300">해당 서비스는 치지직에서 서비스하지 않는 개인 서비스입니다.</p>
                    <p className="text-center text-blue-600 hover:underline hover:cursor-pointer"
                       onClick={() => window.open("https://www.buymeacoffee.com/popop098", "_blank")}>개발자에게 커피 사주기 ☕️</p>
                </footer>
            </div>
        </>


    );
}