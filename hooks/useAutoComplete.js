import {useQuery} from "react-query";
import axios from "axios";

const getAutoCompleteChzzkChannel = async (q) => {
    const {data} = await axios.get('/api/auto-complete', {
        params: {q}
    });
    return data;
}

export default function useAutoComplete(q, options = {}) {
    return useQuery(["auto-complete", q], () => getAutoCompleteChzzkChannel(q), options);
}