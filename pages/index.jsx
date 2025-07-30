import { useState, useEffect, useRef, useCallback, memo } from "react";
import useSearch from "@/hooks/useSearch";
import Image from "next/image";
import { useRouter } from "next/router";
import { NextSeo, SocialProfileJsonLd } from "next-seo";
import useRecommend from "@/hooks/useRecommand";

// Reusable component for displaying a channel item
const ChannelListItem = memo(({ channel, imageSize = 60, showDescription = false }) => {
    const router = useRouter();

    const handleSelect = useCallback(() => {
        router.push("/counter/" + channel.channelName);
    }, [router, channel.channelName]);

    const handleImageClick = useCallback(() => {
        const channelId = channel.channelId || channel.id;
        window.open('https://chzzk.naver.com/' + channelId, '_blank');
    }, [channel.channelId, channel.id]);

    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
                <Image
                    src={channel.channelImageUrl || '/favicon.png'}
                    alt={channel.channelName}
                    width={imageSize}
                    height={imageSize}
                    className="rounded-full hover:cursor-pointer"
                    style={{ width: `${imageSize}px`, height: `${imageSize}px` }}
                    onClick={handleImageClick}
                    unoptimized
                />
                <div className="ml-4">
                    <h2 className="text-white font-bold">{channel.channelName}</h2>
                    {showDescription && channel.channelDescription && (
                        <p className="text-[#c9cedc]">{channel.channelDescription.length > 15 ? channel.channelDescription.slice(0, 15) + "..." : channel.channelDescription}</p>
                    )}
                </div>
            </div>
            <button
                className="bg-[#06d086] text-white rounded-3xl px-3 py-1 flex-none"
                onClick={handleSelect}>
                선택
            </button>
        </div>
    );
});
ChannelListItem.displayName = 'ChannelListItem';

const PopupComp = memo(() => {
    const [showPopup, setShowPopup] = useState(false);
    const [doNotShowAgain, setDoNotShowAgain] = useState(false);

    useEffect(() => {
        const noticePopupDoNotShow = localStorage.getItem("noticePopupDoNotShow");
        if (!noticePopupDoNotShow) {
            setShowPopup(true);
        }
    }, []);

    const closePopup = useCallback(() => {
        if (doNotShowAgain) {
            localStorage.setItem("noticePopupDoNotShow", "true");
        }
        setShowPopup(false);
    }, [doNotShowAgain]);

    if (!showPopup) return null;

    return (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50 px-3">
            <div className="bg-[#35383d] p-5 rounded-lg shadow-lg text-gray-200 max-w-md w-full">
                <h2 className="text-2xl md:text-3xl font-bold text-center">신규 도메인 안내</h2>
                <div className="p-2 bg-[#212325]/35 rounded-lg mt-2 font-light text-sm md:text-base">
                    <p>
                        안녕하세요. 신규 도메인에 대해 안내드립니다.<br/><br/>
                        현재 치지직 팔로워 라이브의 도메인이 변경되었습니다.<br/>
                        기존 <code className="text-red-500">chzzkcounts.vercel.app</code>에서 <code className="text-green-500">chzzkcounts.live</code>로 변경되었습니다.<br/>
                        이전 도메인으로 접속은 가능하나 자동으로 신규 도메인으로 리다이렉트 됩니다.<br/><br/>
                        조금 더 쉽고 기억하기 좋게 하고자 변경하게 되었으니 양해 바랍니다.<br/>
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
    );
});
PopupComp.displayName = 'PopupComp';

const PageHeader = memo(() => {
    const router = useRouter();
    return (
        <div className="flex flex-col items-center text-center px-4">
            <Image src={'/favicon.png'} alt={'logo'} width={100} height={100} quality={100} unoptimized/>
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
                <span className="text-emerald-400">치지직 팔로워 라이브</span>
            </h1>
            <div className="flex items-center gap-2 mt-4">
                <div
                    className="px-2 py-1 rounded-xl bg-gray-700 text-blue-600 text-sm hover:cursor-pointer hover:bg-gray-800 border-[0.1px] border-green-700"
                    onClick={() => window.open('https://github.com/popop098/chzzkcounts/blob/main/README.md', '_blank')}>
                    <p>안내 및 사용법</p>
                </div>
                <div
                    className="px-2 py-1 rounded-xl bg-gray-700 text-gray-200 text-sm hover:cursor-pointer hover:bg-gray-800 border-[0.1px] border-green-700"
                    onClick={() => router.push("/ovlyhelper")}>
                    <p>오버레이 생성</p>
                </div>
            </div>
        </div>
    );
});
PageHeader.displayName = 'PageHeader';

const SearchBar = () => {
    const [search, setSearch] = useState('');
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);
    const resultBoxRef = useRef(null);
    const router = useRouter();

    const {
        data: searchResult,
        isLoading: searchLoading,
        isError: searchIsError,
        error: searchError,
        isSuccess: searchIsSuccess
    } = useSearch(search, {
        enabled: focused && search.length > 0
    });

    const handleClickOutside = useCallback((event) => {
        if (inputRef.current && !inputRef.current.contains(event.target) && resultBoxRef.current && !resultBoxRef.current.contains(event.target)) {
            setFocused(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    const handleSearch = useCallback(() => {
        if (search.length >= 1) {
            router.push("/search?q=" + search);
        }
    }, [search, router]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === "Enter" && !searchLoading && !searchIsError && searchIsSuccess) {
            if (searchResult?.length >= 2) {
                router.push("/search?q=" + search);
            } else if (searchResult?.length === 1) {
                router.push("/counter/" + searchResult[0].channelName);
            }
        }
    }, [search, router, searchLoading, searchIsError, searchIsSuccess, searchResult]);

    const renderResults = () => {
        if (!focused || search.length < 1) return null;

        return (
            <div ref={resultBoxRef} className="absolute top-12 left-0 w-full bg-[#212325] rounded-xl max-h-64 overflow-y-scroll border-[0.1px] border-[#45bf8c]">
                {searchLoading && <p className="text-white p-4">로딩 중...</p>}
                {searchIsError && <p className="text-white p-4">에러 발생: {searchError.message}</p>}
                {searchIsSuccess && searchResult && searchResult.length > 0
                    ? searchResult.map((channel) => (
                        <div key={channel.id} className="px-4 md:px-8 py-3">
                            <ChannelListItem channel={channel} imageSize={40} showDescription={true} />
                        </div>
                    ))
                    : !searchLoading && <p className="text-white p-4">검색 결과가 없습니다.</p>
                }
            </div>
        );
    };

    return (
        <div className="relative w-full max-w-md px-4">
            <div ref={inputRef} className={`flex items-center bg-[#141517] rounded-3xl pr-2 pl-4 py-1 border-[0.1px] ${focused ? "border-[#45bf8c]" : "border-[#149962]"}`}>
                <input
                    className="text-[#c9cedc] w-full font-bold bg-[#141517] overflow-hidden overflow-ellipsis whitespace-nowrap outline-none"
                    placeholder="스트리머 검색"
                    type="search"
                    value={search}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused(true)}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="right-0 bg-[#06d086] text-white rounded-3xl px-3 py-1 flex-none mr-1" onClick={handleSearch}>
                    검색
                </button>
            </div>
            {renderResults()}
        </div>
    );
};

const RecommendedChannels = memo(() => {
    const {
        data: recommendData,
        isError: recommendIsErr,
        isLoading: recommendIsLoading,
        isSuccess: recommendIsSuccess
    } = useRecommend();

    const renderContent = () => {
        if (recommendIsLoading) return <p className="text-white">로딩 중...</p>;
        if (recommendIsErr) return <p className="text-white">에러 발생: {recommendData?.message}</p>;
        if (recommendIsSuccess && recommendData?.length > 0) {
            return recommendData.map((channel) => (
                <ChannelListItem key={channel.id} channel={channel} imageSize={60} />
            ));
        }
        return <p className="text-white">추천 채널이 없습니다.</p>;
    };

    return (
        <div className="flex flex-col items-center gap-5 w-full max-w-md mt-3 px-4">
            <h2 className="text-xl font-bold">
                <span className="text-emerald-400">추천 채널</span>
            </h2>
            <div className="flex flex-col justify-between w-full md:w-2/3 gap-4">
                {renderContent()}
            </div>
        </div>
    );
});
RecommendedChannels.displayName = 'RecommendedChannels';

const PageFooter = memo(() => (
    <footer className="flex flex-col items-center justify-center w-full h-24 bg-gray-700 border-t-[0.1px] border-red-700 px-4 text-center">
        <p className="text-sm text-gray-300">
            해당 사이트는 <span className="text-blue-600 hover:underline hover:cursor-pointer" onClick={() => window.open("https://github.com/popop098/chzzkcounts", "_blank")}>오픈소스</span>로 공개되어있습니다.
        </p>
        <p className="text-sm text-gray-300">해당 서비스는 치지직에서 서비스하지 않는 개인 서비스입니다.</p>
        <p className="text-sm text-blue-600 hover:underline hover:cursor-pointer" onClick={() => window.open("https://www.buymeacoffee.com/popop098", "_blank")}>
            개발자에게 커피 사주기 ☕️
        </p>
    </footer>
));
PageFooter.displayName = 'PageFooter';

export default function Home() {
    const router = useRouter();
    const canonicalUrl = `https://www.chzzkcounts.live${router.asPath}`;

    return (
        <>
            {/*<PopupComp />*/}
            <div className="flex flex-col min-h-screen bg-[#141517]">
                <NextSeo
                    title="메인 - 치지직 팔로워 라이브"
                    description="치지직(CHZZK) 스트리머의 팔로워 수를 실시간으로 확인하고, 채널 성장을 추적하세요. 실시간 팔로워 수, 그래프 등 다양한 정보를 제공합니다."
                    canonical={canonicalUrl}
                    additionalMetaTags={[{
                        name: 'keywords',
                        content: '치지직, chzzk, 팔로워, 라이브, 실시간, 카운터, 스트리머, 통계, 순위, 구독자',
                    }]}
                    openGraph={{
                        title: '메인 - 치지직 팔로워 라이브',
                        description: '치지직(CHZZK) 스트리머의 팔로워 수를 실시간으로 확인하세요.',
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
                <SocialProfileJsonLd
                    type="WebSite"
                    name="치지직 팔로워 라이브"
                    url="https://www.chzzkcounts.live"
                    sameAs={[
                        'https://github.com/popop098/chzzkcounts'
                    ]}
                />
                <main className="flex-grow flex flex-col items-center justify-center gap-5 p-4">
                    <PageHeader />
                    <SearchBar />
                    <RecommendedChannels />
                </main>
                <PageFooter />
            </div>
        </>
    );
}