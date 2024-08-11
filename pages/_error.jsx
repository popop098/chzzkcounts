import { useGlitch } from 'react-powerglitch'
export default function Custom404() {
    const glitch = useGlitch();
    return (
        <div className="flex flex-col items-center h-screen text-gray-200">
            <main className="flex h-full w-full flex-col items-center justify-center gap-5 p-24 bg-[#141517]">
                <div className="flex flex-col items-center">
                    <h1 className="text-6xl font-extrabold text-green-500" ref={glitch.ref}>ERROR</h1>
                    <h2 className="text-2xl">오류가 발생했습니다.</h2>
                </div>
            </main>
        </div>
    )
}