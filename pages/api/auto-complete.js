import {ChzzkClient} from "chzzk";
export default async function handler(req, res) {
    const {q} = req.query;
    const client = new ChzzkClient();
    const result = await client.search.autoComplete(q);
    res.status(200).json(result);
}