import {useQuery} from "react-query";
import axios from "axios";

const getInfoChzzkChannel = async (name) => {
    const { data } = await axios.get("/api/info", {
        params: {name}
    });
    return data;
}

export default function useInfo(name, options = {}) {
    return useQuery(["info", name], () => getInfoChzzkChannel(name), options);
}