import {ChzzkClient} from "chzzk";
export default async function handler(req, res) {
    const {name,id} = req.query;
    const client = new ChzzkClient();
    switch (true) {
        case !!name:
            const nameResult = await client.search.channels(name);
            res.status(200).json(nameResult.channels[0]);
            break;
        case !!id:
            const idResult = await client.channel(id);
            res.status(200).json(idResult);
            break;
        default:
            res.status(400).json({ error: "Invalid query parameter" });
            break;
    }
}