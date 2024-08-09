import {ChzzkClient} from "chzzk";
export default async function handler(req, res) {
    const {name} = req.query;
    const client = new ChzzkClient();
    const result = await client.search.channels(name);
    res.status(200).json(result.channels[0]);
}