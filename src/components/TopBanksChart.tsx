import { Card } from "./ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { BankData } from "./bankData";
import { TrendingUp } from "lucide-react";

interface TopBanksChartProps {
  data: BankData[];
  platform?: "googlePlay" | "appStore";
}

export function TopBanksChart({
  data,
  platform = "googlePlay",
}: TopBanksChartProps) {
  // Yakuniy ball bo‘yicha kamayish tartibida saralab, TOP-15 ni olamiz
  const topBanks = [...data]
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, 15)
    .map((bank) => ({
      name:
        bank.name.length > 25
          ? bank.name.substring(0, 25) + "..."
          : bank.name,
      yakuniyBall: bank.finalScore,
      reyting: bank.averageRating,
      category: bank.category,
      // Tooltip’da ilova nomini ko‘rsatish uchun
      appLabel: (bank as any).appId ?? (bank as any).appName ?? "",
    }));

  const colors = [
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#10b981",
    "#f59e0b",
    "#06b6d4",
    "#6366f1",
    "#14b8a6",
    "#f97316",
    "#a855f7",
    "#ef4444",
    "#84cc16",
    "#06b6d4",
    "#f43f5e",
    "#8b5cf6",
  ];

  const platformTitle =
    platform === "appStore"
      ? "App Store: Yakuniy ball bo'yicha top 15 bank mobil ilovasi"
      : "Google Play: Yakuniy ball bo'yicha top 15 bank mobil ilovasi";

  return (
    <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-4 md:p-6 hover:border-white/30 transition-all duration-300">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
          <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
        </div>
        <h3 className="text-white text-sm md:text-base lg:text-lg">
          {platformTitle}
        </h3>
      </div>

      {/* Kichik ekranlarda label’lar sig‘ishi uchun gorizontal scroll */}
      <div className="overflow-x-auto scrollbar-visible">
        <div className="min-w-[640px]">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={topBanks}
              margin={{ top: 10, right: 20, left: 10, bottom: 70 }}
            >
              <defs>
                {colors.map((color, idx) => (
                  <linearGradient
                    key={idx}
                    id={`gradient${idx}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={color} stopOpacity={0.9} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.3} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />

              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={110}
                tick={{
                  fill: "#e5e7eb",
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />

              <YAxis
                tick={{ fill: "#e5e7eb", fontSize: 10 }}
                tickFormatter={(v) =>
                  `${typeof v === "number" ? v.toFixed(1) : v}%`
                }
                label={{
                  value: "Yakuniy ball (%)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#e5e7eb",
                  fontSize: 10,
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.95)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                }}
                labelStyle={{ color: "#fff", fontSize: 12 }}
                itemStyle={{ color: "#fff", fontSize: 12 }}
                labelFormatter={(label: any, payload: any[]) => {
                  const app =
                    payload &&
                    payload[0] &&
                    payload[0].payload
                      ? payload[0].payload.appLabel
                      : "";
                  return app ? `${label} — ${app}` : label;
                }}
                formatter={(value: number, name: string) => {
                  if (name === "yakuniyBall")
                    return [`${value.toFixed(1)}%`, "Yakuniy ball"];
                  if (name === "reyting")
                    return [value.toFixed(1), "Reyting"];
                  return [value, name];
                }}
              />

              <Bar dataKey="yakuniyBall" radius={[6, 6, 0, 0]} barSize={26}>
                {topBanks.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#gradient${index})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}