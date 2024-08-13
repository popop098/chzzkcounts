import {ChzzkClient} from "chzzk";
export default async function handler(req, res) {
  const client = new ChzzkClient();
  const result = await client.channel.recommendations();
  const modifiedResult = result.map((channel) => {
    return {
      id: channel.channelId,
      channelName: channel.channel.channelName,
      channelDescription: channel.channel.channelDescription,
      channelImageUrl: channel.channel.channelImageUrl,
      openLive: channel.streamer.openLive,
    };
  });
  res.status(200).json(modifiedResult.slice(0, 5));
}
