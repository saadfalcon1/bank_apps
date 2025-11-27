import { Card } from "./ui/card";
import { Building2, Users, Star, TrendingUp, Award, Target } from "lucide-react";
import { motion } from "motion/react";

interface StatsCardsProps {
  totalBanks: number;
  totalRaters: number;
  averageRating: number;
  topRating: number;
  totalDownloads: number;
  averageFinalScore: number;
}

export function StatsCards({ totalBanks, totalRaters, averageRating, topRating, totalDownloads, averageFinalScore }: StatsCardsProps) {
  const stats = [
    {
      title: "Jami bank ilovalari",
      value: totalBanks.toLocaleString(),
      icon: Building2,
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      iconColor: "text-blue-400",
      bgGlow: "bg-blue-500/20",
      detail: "O'zbekistondagi barcha bank ilovalari"
    },
    {
      title: "Umumiy baho berganlar",
      value: (totalRaters / 1000000).toFixed(2) + "M",
      icon: Users,
      gradient: "from-purple-500 via-purple-600 to-pink-500",
      iconColor: "text-purple-400",
      bgGlow: "bg-purple-500/20",
      detail: "Jami baho bergan foydalanuvchilar"
    },
    {
      title: "O'rtacha reyting",
      value: averageRating.toFixed(2),
      icon: Star,
      gradient: "from-yellow-500 via-yellow-600 to-orange-500",
      iconColor: "text-yellow-400",
      bgGlow: "bg-yellow-500/20",
      detail: "5 yulduzdan"
    },
    {
      title: "Eng yuqori yakuniy ball",
      value: topRating.toFixed(2),
      icon: Award,
      gradient: "from-green-500 via-green-600 to-emerald-500",
      iconColor: "text-green-400",
      bgGlow: "bg-green-500/20",
      detail: "A'lo daraja"
    },
    {
      title: "Oylik yuklanishlar",
      value: (totalDownloads / 1000).toFixed(1) + "K",
      icon: TrendingUp,
      gradient: "from-orange-500 via-orange-600 to-red-500",
      iconColor: "text-orange-400",
      bgGlow: "bg-orange-500/20",
      detail: "Oxirgi oydagi yuklanishlar"
    },
    {
      title: "O'rtacha yakuniy ball",
      value: averageFinalScore.toFixed(1),
      icon: Target,
      gradient: "from-indigo-500 via-indigo-600 to-purple-500",
      iconColor: "text-indigo-400",
      bgGlow: "bg-indigo-500/20",
      detail: "100 ballik tizimda"
    }
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
            <Card className="relative backdrop-blur-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-6 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden group">
              {/* Animated glow effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-500`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-white mb-2">{stat.title}</p>
                    <h3 className="text-white mb-1">{stat.value}</h3>
                    <p className="text-xs text-gray-200">{stat.detail}</p>
                  </div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg relative`}>
                    <div className={`absolute inset-0 ${stat.bgGlow} blur-xl opacity-50`}></div>
                    <Icon className={`w-6 h-6 text-white relative z-10`} />
                  </div>
                </div>
                
                {/* Progress bar animation */}
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