import { Card } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { BankData } from "./bankData";
import { Star } from "lucide-react";

interface RatingDistributionProps {
  data: BankData[];
  detailed?: boolean;
  // Platformaga qarab sarlavhani moslashtirish uchun ixtiyoriy prop
  platform?: "googlePlay" | "appStore";
}

export function RatingDistribution({ data, detailed = false, platform }: RatingDistributionProps) {
  // Calculate total ratings distribution
  const totalRatings = data.reduce((acc, bank) => {
    // Handle both rating formats: ratings.five or rating5
    const five = bank.ratings?.five ?? bank.rating5 ?? 0;
    const four = bank.ratings?.four ?? bank.rating4 ?? 0;
    const three = bank.ratings?.three ?? bank.rating3 ?? 0;
    const two = bank.ratings?.two ?? bank.rating2 ?? 0;
    const one = bank.ratings?.one ?? bank.rating1 ?? 0;
    
    acc.five += five;
    acc.four += four;
    acc.three += three;
    acc.two += two;
    acc.one += one;
    return acc;
  }, { five: 0, four: 0, three: 0, two: 0, one: 0 });

  const pieData = [
    // Ranglar maksimal darajada farqli bo'lishi uchun yangilandi:
    // 5⭐ → Yashil, 4⭐ → Siyan, 3⭐ → Sariq, 2⭐ → Binafsha, 1⭐ → Qizil
    { name: "", value: totalRatings.five, color: "#16a34a" }, // green-600
    { name: "", value: totalRatings.four, color: "#06b6d4" }, // cyan-500
    { name: "", value: totalRatings.three, color: "#f59e0b" }, // amber-500
    { name: "", value: totalRatings.two, color: "#a855f7" }, // purple-500
    { name: "", value: totalRatings.one, color: "#ef4444" }  // red-500
  ];

  // Pre-compute total count to avoid repeated reductions and guard divide-by-zero
  const totalCount = Object.values(totalRatings).reduce((a, b) => a + b, 0);

  // Sort by average rating in descending order (highest to lowest) for visual consistency
  const topRatedBanks = [...data]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 15)
    .map(bank => {
      const five = bank.ratings?.five ?? bank.rating5 ?? 0;
      const fiveStarPercent = bank.totalRaters > 0 
        ? (five / bank.totalRaters) * 100 
        : 0;
      // Diagrammada bank nomi emas, ilova nomi chiqishi uchun
      const appTitle = (bank as any)?.appId ?? (bank as any)?.appName ?? bank.name;
      return {
        // X o'qida bank nomini ko'rsatamiz (talab: bank nomini qo'shish va kattaroq qilish)
        name: bank.name.length > 15 ? bank.name.substring(0, 25) + "..." : bank.name,
        // Tooltip uchun qo'shimcha ma'lumot sifatida ilova nomini ko'rsatamiz
        appLabel: appTitle,
        yakuniyBall: bank.finalScore,
        reyting: bank.averageRating,
        percent: fiveStarPercent
      };
    });

  if (detailed) {
    const platformTitle = platform === "appStore"
      ? "App Store: Reyting bahosi eng yuqori bo’lgan TOP-15 bank mobil ilovasi"
      : platform === "googlePlay"
      ? "Google Play: Reyting bahosi eng yuqori bo’lgan TOP-15 bank mobil ilovasi"
      : "O'rtacha bahosi eng yuqori Top 15 bank";
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
              <Star className="w-5 h-5 text-green-400 fill-green-400" />
            </div>
            <h3 className="text-white">{platformTitle}</h3>
          </div>
          {/* Kichik ekranlarda etiketlar siqilib ketmasligi uchun gorizontal scroll qo'shildi */}
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
            <ResponsiveContainer width="100%" height={500}>
            <BarChart data={topRatedBanks} layout="horizontal" margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <defs>
                <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={130}
                tick={{ fill: '#e5e7eb', fontSize: 13, fontWeight: 700 }}
              />
              <YAxis 
                domain={[4.0, 5.0]}
                tick={{ fill: '#e5e7eb', fontSize: 11 }}
                tickFormatter={(v) => typeof v === 'number' ? v.toFixed(1) : v}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px'
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                labelFormatter={(label: any, payload: any[]) => {
                  const app = payload && payload[0] && payload[0].payload ? payload[0].payload.appLabel : '';
                  return app ? `${label} — ${app}` : label;
                }}
                formatter={(value: number) => {
                  // Tooltipda reyting yoniga ⭐ qo'shildi
                  return [`${value.toFixed(1)} ⭐`, "Reyting"];
                }}
              />
              <Bar dataKey="reyting" fill="url(#ratingGradient)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-6 hover:border-white/30 transition-all duration-300">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        </div>
        <h3 className="text-white">Jami baho bergan foydalanuvchilar taqsimoti</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend 
              verticalAlign="middle" 
              align="right"
              layout="vertical"
              formatter={(value, entry: any) => {
              const percentage = totalCount > 0 
                ? ((entry.payload.value / totalCount) * 100).toFixed(1) 
                : "0.0";
              return <span style={{ color: '#fff' }}>{`${value}: ${percentage}%`}</span>;
            }}
          />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                color: '#fff'
              }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: number) => [value.toLocaleString(), '']}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Rating bars */}
        <div className="space-y-4">
          {pieData.map((item, index) => {
            const percentage = totalCount > 0 ? (item.value / totalCount) * 100 : 0;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                    <span>{5 - index}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white">{percentage.toFixed(1)}%</span>
                    <span className="text-gray-200 text-sm w-24 text-right">{item.value.toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-xl">
                  <div 
                    className="h-full rounded-full transition-all duration-500 shadow-lg"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: item.color,
                      boxShadow: `0 0 10px ${item.color}50`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}