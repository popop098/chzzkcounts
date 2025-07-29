import { useState, useEffect, useCallback, useMemo } from "react";
import { NextSeo, HowToJsonLd } from "next-seo";
import { useCopyToClipboard } from "react-use";
import dynamic from "next/dynamic";

const Odometer = dynamic(() => import('react-odometerjs'), {
    ssr: false,
    loading: () => <div>0</div>
});

const isValidHexFormat = (input) => /^[a-f0-9]{32}$/i.test(input);

const useOverlayGenerator = () => {
    const [channelId, setChannelId] = useState("");
    const [color, setColor] = useState("white");
    const [live, setLive] = useState("n");
    const [type, setType] = useState('default');
    const [goal, setGoal] = useState(1000);

    const generatedUrl = useMemo(() => {
        const params = new URLSearchParams();
        params.append('type', type);
        params.append('color', color);
        if (type === 'default') {
            params.append('live', live);
        } else if (type === 'progress') {
            params.append('goal', goal);
        }
        return `https://www.chzzkcounts.live/overlay/${channelId}?${params.toString()}`;
    }, [channelId, color, live, type, goal]);

    const isFormValid = useMemo(() => {
        if (!isValidHexFormat(channelId)) return false;
        if (type === 'progress' && (isNaN(goal) || goal <= 0)) return false;
        return true;
    }, [channelId, type, goal]);

    return { channelId, setChannelId, color, setColor, live, setLive, type, setType, goal, setGoal, generatedUrl, isFormValid };
};

const OverlayForm = ({ generator }) => {
    const { channelId, setChannelId, color, setColor, live, setLive, type, setType, goal, setGoal } = generator;

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-full">
                <input 
                    type="text" 
                    placeholder="채널 ID" 
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                    className={`px-3 py-2 rounded-md bg-gray-800 text-gray-200 outline-none w-full border ${channelId.length > 0 && !isValidHexFormat(channelId) ? 'border-red-500' : 'border-gray-700 focus:border-emerald-500'}`}
                />
                {channelId.length > 0 && !isValidHexFormat(channelId) && (
                    <p className="text-red-500 text-xs mt-1">채널 ID 형식이 올바르지 않습니다. (32자 영문/숫자)</p>
                )}
                <p className="text-gray-400 text-xs mt-1">채널 페이지 URL의 `https://chzzk.naver.com/` 뒷부분이 채널 ID입니다.</p>
            </div>

            <div className="flex flex-col items-center gap-3 bg-gray-800 p-3 rounded-xl w-full border border-gray-700">
                <h3 className="text-lg font-bold text-emerald-400">오버레이 타입</h3>
                <div className="flex items-center gap-6 text-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="type" value="default" checked={type === 'default'} onChange={(e) => setType(e.target.value)} />
                        <span>기본</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="type" value="progress" checked={type === 'progress'} onChange={(e) => setType(e.target.value)} />
                        <span>프로그레스 바</span>
                    </label>
                </div>
            </div>

            {type === 'progress' && (
                <div className="w-full">
                    <input 
                        type="number" 
                        placeholder="목표 팔로워 수" 
                        value={goal}
                        onChange={(e) => setGoal(parseInt(e.target.value, 10))}
                        className="px-3 py-2 rounded-md bg-gray-800 text-gray-200 outline-none w-full border border-gray-700 focus:border-emerald-500"
                    />
                </div>
            )}

            <select value={color} onChange={(e) => setColor(e.target.value)} className="px-3 py-2 rounded-md bg-gray-800 text-gray-200 w-full border border-gray-700 focus:border-emerald-500">
                <option value="white">흰색</option>
                <option value="red">빨강</option>
                <option value="green">초록</option>
                <option value="blue">파랑</option>
                <option value="yellow">노랑</option>
                <option value="purple">보라</option>
                <option value="pink">분홍</option>
                <option value="orange">주황</option>
                <option value="cyan">청록</option>
                <option value="gray">회색</option>
                <option value="black">검정</option>
            </select>

            {type === 'default' && (
                <div className="flex flex-col items-center gap-3 bg-gray-800 p-3 rounded-xl w-full border border-gray-700">
                    <h3 className="text-lg font-bold text-emerald-400">라이브 표시</h3>
                    <div className="flex items-center gap-6 text-gray-200">
                        <label htmlFor="live-y" className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" id="live-y" name="live" value="y" onChange={(e) => setLive(e.target.value)} checked={live === "y"} />
                            <span>활성화</span>
                        </label>
                        <label htmlFor="live-n" className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" id="live-n" name="live" value="n" onChange={(e) => setLive(e.target.value)} checked={live === "n"} />
                            <span>비활성화</span>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

const OverlayPreview = ({ type, color, live, goal }) => {
    const [random, setRandom] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRandom(Math.floor(Math.random() * 90000) + 10000);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const percentage = goal > 0 ? Math.min((random / goal) * 100, 100) : 0;

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-center mb-2 text-emerald-400">미리보기</h2>
            <div className="p-5 bg-gray-800 rounded-xl flex flex-col items-center justify-center w-full h-fit gap-3 border border-gray-700"
                 style={{ color }}>
                {type === 'default' ? (
                    <>
                        <div className="relative flex justify-center items-end">
                            {live === "y" && (
                                <div className="absolute px-1.5 py-0.5 bg-red-600 rounded-lg -mb-3 text-white text-xs font-bold animate-pulse">
                                    LIVE
                                </div>
                            )}
                            <div className={`rounded-full p-1 ${live === "y" ? "border-2 border-emerald-500" : ""} w-16 h-16 bg-gray-900`} />
                        </div>
                        <h3 className="text-xl font-bold">채널명</h3>
                        <Odometer value={random} format="(,ddd)" duration={1000} style={{ fontSize: "1.875rem", lineHeight: "2.25rem", fontWeight: "800" }} />
                    </>
                ) : (
                    <div className="w-full flex flex-col items-center gap-3">
                        <h3 className="text-lg font-bold">팔로워 목표: {goal.toLocaleString()}</h3>
                        <div className="w-full bg-gray-700 rounded-full h-6 border-2 border-gray-600">
                            <div className="bg-emerald-500 h-full rounded-full text-center font-bold text-sm flex items-center justify-center" style={{ width: `${percentage}%` }}>
                                {percentage.toFixed(1)}%
                            </div>
                        </div>
                        <div className="text-lg font-bold">
                            <span>{random.toLocaleString()} / {goal.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const GeneratedUrl = ({ url, isValid }) => {
    const [state, copyToClipboard] = useCopyToClipboard();

    return (
        <div className="w-full flex flex-col gap-2">
            <code className="px-3 py-2 w-full overflow-x-auto rounded-md bg-gray-800 text-gray-300 border border-gray-700">
                {url}
            </code>
            <button
                onClick={() => copyToClipboard(url)}
                className={`px-3 py-2 rounded-md text-white w-full font-bold transition-colors ${!isValid ? "bg-gray-600 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
                disabled={!isValid}>
                {!isValid ? "생성 불가" : (state.value ? "복사 완료!" : "URL 복사")}
            </button>
            {state.error && <p className="text-red-500 text-sm text-center">복사에 실패했습니다.</p>}
        </div>
    );
};

export default function OvlyHelper() {
    const generator = useOverlayGenerator();
    const canonicalUrl = "https://www.chzzkcounts.live/ovlyhelper";

    return (
        <>
            <NextSeo
                title="오버레이 생성기 - 치지직 팔로워 라이브"
                description="방송 화면에 실시간 치지직 팔로워 수를 표시하는 오버레이 URL을 쉽게 생성하세요. 색상과 라이브 상태를 맞춤 설정할 수 있습니다."
                canonical={canonicalUrl}
                additionalMetaTags={[{
                    name: 'keywords',
                    content: '치지직, chzzk, 오버레이, 팔로워, 라이브, 카운터, 스트리머, 방송, OBS, XSplit',
                }]}
                openGraph={{
                    title: '오버레이 생성기',
                    description: '방송 화면에 실시간 팔로워 수를 표시하는 오버레이를 만드세요.',
                    url: canonicalUrl,
                    type: 'website',
                    locale: 'ko_KR',
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
            <HowToJsonLd
                name="치지직 팔로워 수 오버레이 생성 방법"
                description="다음 단계를 따라 방송 송출 프로그램(OBS, XSplit 등)에 사용할 실시간 팔로워 수 오버레이를 생성하세요."
                step={[
                    {   type: "HowToStep",
                        name: "채널 ID 입력",
                        text: "자신의 치지직 채널 ID를 입력합니다. 채널 ID는 채널 페이지 URL에서 확인할 수 있습니다.",
                    },
                    {   type: "HowToStep",
                        name: "오버레이 타입 선택",
                        text: "기본 오버레이 또는 팔로워 목표 프로그레스 바 오버레이 중 하나를 선택합니다.",
                    },
                    {   type: "HowToStep",
                        name: "세부 옵션 설정",
                        text: "선택한 오버레이 타입에 맞는 옵션(색상, 목표치, 라이브 표시 등)을 설정합니다.",
                    },
                    {   type: "HowToStep",
                        name: "URL 생성 및 복사",
                        text: "생성된 오버레이 URL을 복사 버튼을 눌러 복사합니다.",
                    },
                    {   type: "HowToStep",
                        name: "OBS/XSplit에 추가",
                        text: "사용하는 방송 프로그램(OBS, XSplit 등)의 브라우저 소스에 복사한 URL을 붙여넣습니다.",
                    },
                ]}
            />
            <main className="flex-grow flex items-center justify-center bg-[#141517] p-4">
                <div className="flex flex-col items-center space-y-6 bg-[#212325] p-6 rounded-2xl shadow-lg max-w-md w-full border border-gray-700">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-emerald-400 to-sky-500">오버레이 생성기</h1>
                    <OverlayForm generator={generator} />
                    <div className="w-full h-px bg-gray-700" />
                    <OverlayPreview type={generator.type} color={generator.color} live={generator.live} goal={generator.goal} />
                    <GeneratedUrl url={generator.generatedUrl} isValid={generator.isFormValid} />
                </div>
            </main>
        </>
    )
}