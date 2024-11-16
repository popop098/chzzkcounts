import "@/styles/globals.css";
import "odometer/themes/odometer-theme-default.css"
import { QueryClient, QueryClientProvider} from 'react-query';
import {useState} from "react";
import {DefaultSeo} from "next-seo";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Snowfall from 'react-snowfall'
export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient())
  return <>
    <QueryClientProvider client={queryClient}>
        <Snowfall/>
        <Analytics />
        <SpeedInsights/>
      <DefaultSeo
        defaultTitle="치지직 팔로워 라이브"
        titleTemplate="치지직 팔로워 라이브 | %s"
        description="치지직 팔로워 라이브는 치지직 채널의 팔로워 수를 실시간으로 제공합니다."
        themeColor="#06d086"
        twitter={
            {
                cardType: 'summary_large_image',
            }
        }
        openGraph={{
          type: 'website',
          locale: 'ko_KR',
          url: 'https://chzzkcounts.vercel.app/',
          site_name: '치지직 팔로워 라이브',
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
      <Component {...pageProps} />
    </QueryClientProvider>
    </>
}
