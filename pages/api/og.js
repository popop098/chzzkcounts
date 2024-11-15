import { ImageResponse } from '@vercel/og';

export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    try{
        const {searchParams} = req.nextUrl
        const image = searchParams.get('image')
        const name = searchParams.get('name')
        const currentCount = searchParams.get('follower')
        const description = searchParams.get('description')
        return new ImageResponse(
            (
                <div
                    style={{
                        fontSize: 40,
                        color: '#e5e7eb',
                        background: '#141517',
                        width: '100%',
                        height: '100%',
                        padding: '50px 200px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image} alt={name} style={{
                            width: 200,
                            height: 200,
                            borderRadius: 100,
                            border: '4px solid #06d086',
                            padding: 5,
                        }}/>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                fontSize: 40,
                                fontWeight: 'bold',
                            }}>
                                {name}
                            </div>
                            <div style={{
                                fontSize: 20,
                            }}>
                                {description}
                            </div>
                            <div style={{
                                fontSize: 100,
                                fontWeight: 'bold',
                                color: '#06d086',
                                margin: '20px 0 0 0',
                            }}>
                                {Number(currentCount).toLocaleString('ko-KR')}
                            </div>
                            <div style={{
                                fontSize: 20,
                            }}>
                                팔로워
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e) {
        return new ImageResponse(
            (
                <div
                    style={{
                        fontSize: 40,
                        color: 'black',
                        background: 'white',
                        width: '100%',
                        height: '100%',
                        padding: '50px 200px',
                        textAlign: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    앗... 뭔가 잘못되었어요!
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    }

}