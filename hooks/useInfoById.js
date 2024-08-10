import {useQuery} from "react-query";
import axios from "axios";

const getInfoByIdChzzkChannel = async (id) => {
    const { data } = await axios.get("/api/info", {
        params: {id}
    });
    return data;
}

export default function useInfoById(id, options = {}) {
    return useQuery(["info", id], () => getInfoByIdChzzkChannel(id), options);
}