import {useQuery} from "react-query";
import axios from "axios";
const getSearchChzzkChannel = async (keyword) => {
    const { data } = await axios.get("/api/search", {
        params: {q: keyword}
    });
    return data;
}

export default function useSearch(keyword, options = {}) {
    return useQuery(["search", keyword], () => getSearchChzzkChannel(keyword), options);
}