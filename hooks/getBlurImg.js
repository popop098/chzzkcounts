// getBlurImg.ts
import { getPlaiceholder } from "plaiceholder";

const getBlurImg = async (imgSrc) => {
    if (!imgSrc) {
        return '/favicon.png'; // 기본 이미지 반환
    }
    try {
        const buffer = await fetch(imgSrc).then(async (res) =>
            Buffer.from(await res.arrayBuffer())
        );
        const { base64 } = await getPlaiceholder(buffer, { size: 10 });
        return base64;
    } catch (e) {
        console.log(e);
        return '/favicon.png'
    }
};

export default getBlurImg;
