import { Card } from "./ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, ZAxis } from "recharts";
import { BankData } from "./bankData";
import { TrendingUp, Activity } from "lucide-react";

interface TrendAnalysisProps {
  data: BankData[];
}

export function TrendAnalysis({ data }: TrendAnalysisProps) {
  // Prepare scatter plot data - Final Score vs Monthly Downloads
  const scatterData = data.map(bank => ({
    name: bank.name.length > 15 ? bank.name.substring(0, 15) + "..." : bank.name,
    oylikYuklanishlar: bank.lastMonthDownloads,
    yakuniyBall: bank.finalScore,
    z: bank.activityScore
  }));

  // Prepare trend data by final score ranges
  const scoreRanges = [
    { range: "90+", count: data.filter(b => b.finalScore >= 90).length, downloads: data.filter(b => b.finalScore >= 90).reduce((sum, b) => sum + b.lastMonthDownloads, 0) },
    { range: "75-90", count: data.filter(b => b.finalScore >= 75 && b.finalScore < 90).length, downloads: data.filter(b => b.finalScore >= 75 && b.finalScore < 90).reduce((sum, b) => sum + b.lastMonthDownloads, 0) },
    { range: "60-75", count: data.filter(b => b.finalScore >= 60 && b.finalScore < 75).length, downloads: data.filter(b => b.finalScore >= 60 && b.finalScore < 75).reduce((sum, b) => sum + b.lastMonthDownloads, 0) },
    { range: "40-60", count: data.filter(b => b.finalScore >= 40 && b.finalScore < 60).length, downloads: data.filter(b => b.finalScore >= 40 && b.finalScore < 60).reduce((sum, b) => sum + b.lastMonthDownloads, 0) },
    { range: "40-", count: data.filter(b => b.finalScore < 40).length, downloads: data.filter(b => b.finalScore < 40).reduce((sum, b) => sum + b.lastMonthDownloads, 0) }
  ];

  // Prepare comparison data (top 15 by final score)
  const topBanks = [...data].sort((a, b) => b.finalScore - a.finalScore).slice(0, 15);
  const comparisonData = topBanks.map((bank) => ({
    name: bank.name.length > 12 ? bank.name.substring(0, 12) + "..." : bank.name,
    yakuniyBall: bank.finalScore,
    faollik: bank.activityScore,
    reyting: bank.averageRating * 20 // Scale to 0-100
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scatter Plot */}
        <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-6 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-white">Foydalanuvchilar va Reytinglar Korrelyatsiyasi</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                type="number" 
                dataKey="oylikYuklanishlar" 
                name="Foydalanuvchilar"
                tick={{ fill: '#e5e7eb' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <YAxis 
                type="number" 
                dataKey="yakuniyBall" 
                name="Reyting"
                domain={[35, 100]}
                tick={{ fill: '#e5e7eb' }}
              />
              <ZAxis type="number" dataKey="z" range={[50, 400]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px'
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Scatter name="Banklar" data={scatterData} fill="#8b5cf6">
                {scatterData.map((entry, index) => (
                  <circle key={index} fill={`hsl(${entry.yakuniyBall * 2.5}, 70%, 50%)`} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </Card>

        {/* Rating Distribution Area Chart */}
        <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-6 hover:border-white/30 transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-white">Reyting Bo'yicha Taqsimot</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={scoreRanges} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="range" tick={{ fill: '#e5e7eb' }} />
              <YAxis yAxisId="left" tick={{ fill: '#e5e7eb' }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#e5e7eb' }} tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px'
                }}
              />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="count" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCount)" name="Banklar soni" />
              <Area yAxisId="right" type="monotone" dataKey="downloads" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" name="Foydalanuvchilar" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Growth Projection */}
      <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-6 hover:border-white/30 transition-all duration-300">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-white">Top 15 Banklar: Hozirgi va Prognoz Ko'rsatkichlari</h3>
        </div>
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <defs>
              <linearGradient id="colorYakuniy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorFaollik" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorReyting" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={120}
              tick={{ fill: '#e5e7eb', fontSize: 11 }}
            />
            <YAxis 
              tick={{ fill: '#e5e7eb' }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: number, name: string) => {
                if (name === "reyting") return [(value / 20).toFixed(1), "Reyting (5 dan)"];
                return [
                  name.toLowerCase().includes('faollik') || name.toLowerCase().includes('(%')
                    ? `${(value as number).toFixed(1)}%`
                    : (value as number).toFixed(1),
                  name
                ];
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line 
              type="monotone" 
              dataKey="yakuniyBall" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fill="url(#colorYakuniy)"
              name="Yakuniy ball"
              dot={{ fill: '#3b82f6', r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="faollik" 
              stroke="#10b981" 
              strokeWidth={3}
              fill="url(#colorFaollik)"
              name="Faollik (%)"
              dot={{ fill: '#10b981', r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="reyting" 
              stroke="#f59e0b" 
              strokeWidth={3}
              strokeDasharray="5 5"
              fill="url(#colorReyting)"
              name="Reyting (normallashtirilgan)"
              dot={{ fill: '#f59e0b', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}