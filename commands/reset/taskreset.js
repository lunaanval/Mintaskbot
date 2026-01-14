const { SlashCommandBuilder, MessageFlags } = require("discord.js");

const lastMessageMap = new Map();

const Message = {
  morning: [
    "背伸びをしてみる",
    "窓を開けて朝日を取り込む",
    "朝の軽くストレッチをする",
    "新鮮な空気を吸いながら深呼吸する",
  ],
  daytime: [
    "温かい飲み物を飲む",
    "軽い散歩に出かける",
    "お気に入りの音楽を聴く",
  ],
  evening: [
    "休憩がてら背筋を伸ばしてみる",
    "軽くストレッチをする",
    "好きな本や漫画を読んでみる",
  ],
  night: [
    "遠くを見つめて目を休める",
    "軽くストレッチをする",
  ],
};

function pickRandomAvoidLast(arr, last) {
  
  if (!last) return arr[Math.floor(Math.random() * arr.length)];

  const filtered = arr.filter((m) => m !== last);

  const pool = filtered.length > 0 ? filtered : arr;

  return pool[Math.floor(Math.random() * pool.length)];
}

function getTimeBucketTokyo() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    hour: "numeric",
    hour12: false,
  }).formatToParts(new Date());

  const hourStr = parts.find((p) => p.type === "hour")?.value;
  const hour = Number(hourStr);

  if (!Number.isFinite(hour)) return "night";

  if (hour >= 5 && hour < 10) return "morning";   // 05-09
  if (hour >= 10 && hour < 16) return "daytime";  // 10-15
  if (hour >= 16 && hour < 21) return "evening";  // 16-20
  return "night";                                 // 21-04
}


module.exports = {
  data: new SlashCommandBuilder()
    .setName("reset")
    .setDescription("時間帯に合わせた気分転換の提案をします！"),

  async execute(interaction) {
    const bucket = getTimeBucketTokyo();
    const userId = interaction.user.id;

    const last = lastMessageMap.get(userId); 
    const msg = pickRandomAvoidLast(Message[bucket], last);

    lastMessageMap.set(userId, msg); 
    await interaction.reply({
      content: msg,
      flags: MessageFlags.Ephemeral,
    });
  },
};
