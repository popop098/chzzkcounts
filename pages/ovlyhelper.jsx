import {useState,useEffect} from "react";
import {NextSeo} from "next-seo";
import {useCopyToClipboard} from "react-use";
import dynamic from "next/dynamic";
import Image from "next/image";
const Odometer = dynamic(() => import('react-odometerjs'), {
    ssr: false,
    loading: () => <div>0</div>
});
export default function OvlyHelper() {
    const [channelId, setChannelId] = useState("");
    const [color, setColor] = useState("white");
    const [random, setRandom] = useState(0);
    const [live, setLive] = useState("n");
    const [{value, error, noUserInteraction}, copyToClipboard] = useCopyToClipboard();
    const handleChannelIdInputChange = (e) => {
        setChannelId(e.target.value);
    }

    const handleColorInputChange = (e) => {
        setColor(e.target.value);
    }

    const isValidHexFormat = (input) => {
        const hexPattern = /^[a-f0-9]{32}$/i;
        return hexPattern.test(input);
    }
    useEffect(() => {
        let interval;
        setRandom(Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000);
        interval = setInterval(() => {
            setRandom(Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000);
        }, 7000);
        return () => clearInterval(interval);
    }, []);
    return(
        <div className="flex flex-col items-center h-screen">
            <NextSeo
                title="오버레이 헬퍼"
                description="오버레이를 생성하기 위한 헬퍼 페이지입니다."
                openGraph={{
                    title: '오버레이 헬퍼',
                    type: 'website',
                    locale: 'ko_KR',
                    url: 'https://chzzkcounts.vercel.app/ovlyhelper',
                    siteName: '치지직 팔로워 라이브',
                }}
            />
            <main
                className={`flex h-full w-full flex-col items-center justify-center gap-5 p-24 bg-[#141517] space-y-5`}>
                <div className="flex flex-col items-center space-y-4">
                    <h1 className={`text-4xl text-white`}>오버레이 헬퍼</h1>
                    {error
                        ? <div className="bg-red-500 text-white p-3 rounded-md flex flex-col items-center">
                            <p>오버레이 URL을 생성하는데 실패했습니다.</p>
                            <p>{error.message}</p>
                    </div>
                        : value && <div className="bg-green-500 text-white p-3 rounded-md flex flex-col items-center">
                            <p>오버레이 URL을 성공적으로 복사했습니다.</p>
                    </div>
                    }
                    <div className="flex flex-col items-center gap-5">
                        <div className="flex flex-col items-center gap-5">
                            <div className="flex flex-col items-center gap-1 w-full">
                                <input type="text" placeholder="채널 ID"
                                       value={channelId} onChange={handleChannelIdInputChange}
                                       className={`px-3 py-2 rounded-md bg-gray-700 text-gray-200 outline-none ${channelId.length >= 1 && !isValidHexFormat(channelId) ? 'outline-1 outline-red-600' : 'focus:outline-1 focus:outline-[#06d086]'} w-full`}/>
                                {
                                    channelId.length >= 1 && !isValidHexFormat(channelId) && (
                                        <p className="text-red-600">채널 ID가 올바르지 않습니다.</p>
                                    )
                                }
                                <p className="text-gray-200 text-xs">
                                    채널 ID는 {"'https://chzzk.naver.com/[이곳]'"}에 위치하고 있습니다.
                                </p>
                            </div>
                            <select value={color} defaultValue="white" onChange={handleColorInputChange} className="px-3 py-2 rounded-md bg-gray-700 text-gray-200 w-full">
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
                                <option value="white">흰색</option>
                            </select>
                            <div className="flex flex-col items-center gap-3 bg-gray-700 p-3 rounded-xl w-full">
                                <h1 className="text-xl font-bold text-gray-200">라이브 모드</h1>
                                <form className="flex flex-col text-gray-200">
                                    <div className="flex items-center gap-3">
                                        <input type="radio" id="live-y" name="live" value="y" onChange={(e) => setLive(e.target.value)}
                                                checked={live==="y"}/>
                                        <label htmlFor="live-y">예</label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" id="live-n" name="live" value="n" onChange={(e) => setLive(e.target.value)}
                                               checked={live==="n"}/>
                                        <label htmlFor="live-n">아니오</label>
                                    </div>
                                </form>
                            </div>
                            <div className="w-full h-1 bg-gray-700/50 rounded"/>
                            <h2 className="text-xl font-bold text-gray-200">미리보기</h2>
                            <div className="p-5 bg-gray-700 rounded-xl flex flex-col items-center justify-center w-full h-fit gap-3 "
                                 style={{
                                     color: color
                                 }}>
                                <div className="relative flex justify-center items-end">
                                    {
                                        live === "y" && (
                                            <div className="absolute px-1 bg-red-700 rounded-lg -mb-3 text-gray-200">
                                                <span className="text-xs font-bold">LIVE</span>
                                            </div>
                                        )
                                    }
                                    <div className={`rounded-full p-1 ${live === "y" && "border-2 border-[#06d086]"} w-16 h-16 bg-gray-800`}/>
                                </div>
                                <h1 className="text-xl font-bold">채널명</h1>
                                <Odometer value={random} format="(,ddd)" duration={5000} style={{
                                    fontSize: "1.875rem",
                                    lineHeight: "2.25rem",
                                    fontWeight: "800"
                                }}/>
                            </div>
                            <code className="px-3 py-5 max-w-sm overflow-x-scroll rounded-md bg-gray-700 text-gray-200">
                                {"https://chzzkcounts.vercel.app/overlay/" + (channelId.length >= 1 ? channelId : "") + (color.length >= 1 ? "?color=" + color : "") + (live === "y" ? "&live=y" : "&live=n")}
                            </code>
                            <button
                                onClick={() => copyToClipboard("https://chzzkcounts.vercel.app/overlay/" + (channelId.length >= 1 ? channelId : "") + (color.length >= 1 ? "?color=" + color : "") + (live === "y" ? "&live=y" : "&live=n"))}
                                className={`px-3 py-2 rounded-md ${!(channelId.length >= 1 && isValidHexFormat(channelId) && color.length >= 1) ? "bg-gray-800 hover:cursor-not-allowed":"bg-gray-700"} text-gray-200 w-full`}
                                disabled={!(channelId.length >= 1 && isValidHexFormat(channelId) && color.length >= 1)}>
                                {
                                    !(channelId.length >= 1 && isValidHexFormat(channelId) && color.length >= 1) ? "생성불가" : "생성"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}