import {useQuery} from "react-query";
import axios from "axios";

const getRecommendChzzkChannel = async () => {
    const { data } = await axios.get("/api/recommend");
    return data;
}

export default function useRecommend() {
    return useQuery("recommend", getRecommendChzzkChannel);
}