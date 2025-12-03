import { Card } from "./ui/card";
import { Building2, Users, Star, TrendingUp, Award, Trophy } from "lucide-react";
import { motion } from "motion/react";

interface StatsCardsProps {
  totalBanks: number;
  totalRaters: number;
  averageRating: number;
  topRating: number;
  totalDownloads: number;
  averageFinalScore: number;
  platform?: "googlePlay" | "appStore";
  topBankName?: string;
}

export function StatsCards({
  totalBanks,
  totalRaters,
  averageRating,
  topRating,
  totalDownloads,
  platform = "googlePlay",
  topBankName,
}: StatsCardsProps) {
  const prefix = platform === "googlePlay" ? "Google Play" : "App Store";

  const stats = [
    {
      title: `${prefix}: Jami bank ilovalari soni`,
      value: totalBanks.toLocaleString() + " ta",
      icon: Building2,
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      detail: "",
    },
    {
      title: `${prefix}: Jami baho bergan foydalanuvchilar soni`,
      value: (totalRaters / 1000000).toFixed(1) + " M",
      icon: Users,
      gradient: "from-purple-500 via-purple-600 to-pink-500",
      detail: "",
    },
    {
      title: `${prefix}: Bank mobil ilovalarining o’rtacha reyting bahosi`,
      value: averageRating.toFixed(1),
      icon: Star,
      gradient: "from-yellow-500 via-yellow-600 to-orange-500",
      detail: "5 (yulduzlik tizimda)",
    },
    {
      title: `${prefix}: Eng yuqori yakuniy ball olgan bank mobil ilovasi`,
      value: topRating.toFixed(1),
      icon: Trophy, // ←←← KUBOK SHU YERGA QO'YILDI
      gradient: "from-green-500 via-green-600 to-emerald-500",
      detail:
        topBankName && topBankName.trim().length > 0
          ? topBankName
          : "A'lo daraja",
    },
    {
      title: `${prefix}: Oylik yuklanishlar soni`,
      value: (totalDownloads / 1000000).toFixed(1) + " M",
      icon: TrendingUp,
      gradient: "from-orange-500 via-orange-600 to-red-500",
      detail: "Noyabr oyidagi yuklanishlar soni",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative backdrop-blur-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-6 hover:bg-white/15 transition-all duration-500 md:hover:scale-105 hover:shadow-2xl overflow-hidden group">

              <div
                className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-500`}
              ></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-white mb-2">{stat.title}</p>

                    {/* TOP BANK LARGE NAME */}
                    {stat.title.includes("Eng yuqori") && (
                      <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
                        {stat.detail}
                      </h3>
                    )}

                    {/* BADGE */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl mb-2">
                      <span className="text-white font-semibold text-lg leading-none">
                        {stat.value}
                      </span>
                    </div>

                    {stat.detail &&
                      !stat.title.includes("Eng yuqori") && (
                        <p className="text-xs text-gray-300">{stat.detail}</p>
                      )}
                  </div>

                  {/* ICON */}
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg relative`}
                  >
                    <div
                      className="absolute inset-0 bg-white/10 blur-xl opacity-50"
                    ></div>
                    <Icon className="w-6 h-6 text-white relative z-10" />
                  </div>
                </div>

                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${stat.gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 1 }}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
