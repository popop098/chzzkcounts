// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import {ChzzkClient} from "chzzk";
export default async function handler(req, res) {
  const chzzkApiUrl = "https://api.chzzk.naver.com/service/v1/home/recommendation-channels";
  const resp = await fetch(chzzkApiUrl,{
    method:"GET",
    headers:{
      "Accept":"application/json",
      "Connection":"keep-alive",
    }
  });
  console.log(resp);
    const data = await resp.json();
    res.status(200).json(data);
}
