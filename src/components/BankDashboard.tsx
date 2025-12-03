import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Users, Star, BarChart3, Filter, Layers } from "lucide-react";
import { StatsCards } from "./StatsCards";
import { TopBanksChart } from "./TopBanksChart";
import { RatingDistribution } from "./RatingDistribution";
import { BanksTable } from "./BanksTable";
import { CombinedPlatformsTable } from "./CombinedPlatformsTable";
import { bankData } from "./bankData";
import { appStoreBankData } from "./appStoreBankData";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function BankDashboard() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [platform, setPlatform] = useState<"googlePlay" | "appStore">("googlePlay");
  
  // Select data based on platform
  const currentData = platform === "googlePlay" ? bankData : appStoreBankData;
  
  // Filter data by category - ensure we always have an array
  const filteredData = Array.isArray(currentData)
    ? (categoryFilter === "all" 
      ? currentData 
      : currentData.filter(bank => bank.category === categoryFilter))
    : [];

  // Calculate total stats
  const totalRaters = filteredData.reduce((sum, bank) => sum + bank.totalRaters, 0);
  const totalDownloads = filteredData.reduce((sum, bank) => sum + bank.lastMonthDownloads, 0);
  const averageRating = filteredData.length > 0 ? filteredData.reduce((sum, bank) => sum + bank.averageRating, 0) / filteredData.length : 0;
  const averageFinalScore = filteredData.length > 0 ? filteredData.reduce((sum, bank) => sum + bank.finalScore, 0) / filteredData.length : 0;
  const totalBanks = filteredData.length;
  const topRating = filteredData.length > 0 ? Math.max(...filteredData.map(bank => bank.finalScore)) : 0;
  const topBankName = filteredData.length > 0 
    ? (filteredData.reduce((best: any | null, bank: any) => {
        if (!best || bank.finalScore > best.finalScore) return bank;
        return best;
      }, null)?.name ?? "")
    : "";

  const categories = Array.isArray(currentData) 
    ? ["all", ...Array.from(new Set(currentData.map(b => b.category).filter(Boolean)))]
    : ["all"];

  // @ts-ignore
    return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-4 md:p-8">
      {/* Keng ekranlarda grafiklar enini oshirish uchun konteyner kengaytirildi (2200px -> 2560px) */}
      <div className="max-w-[2560px] mx-auto space-y-6">
        {/* Header with 3D effect - Two clickable cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Google Play Card */}
          <button 
            onClick={() => setPlatform("googlePlay")}
            className={`relative backdrop-blur-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl border p-8 md:p-10 overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer group text-left ${
              platform === "googlePlay" ? "border-blue-400/60" : "border-white/20 hover:border-white/40"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-3xl"></div>
            <div className="relative z-10">
              <h1 className="text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all">
                Google Play: bank mobil ilovalari tahlili
              </h1>
              <p className="text-white">Bank mobil ilovalarining to‘liq statistikasi va professional tahlili</p>
            </div>
          </button>

          {/* App Store Card */}
          <button 
            onClick={() => setPlatform("appStore")}
            className={`relative backdrop-blur-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 rounded-3xl border p-8 md:p-10 overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer group text-left ${
              platform === "appStore" ? "border-cyan-400/60" : "border-white/20 hover:border-white/40"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-indigo-500/5 blur-3xl"></div>
            <div className="relative z-10">
              <h1 className="text-white mb-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-indigo-300 transition-all">
                App Store: bank mobil ilovalari tahlili
              </h1>
              <p className="text-white">Bank mobil ilovalarining to‘liq statistikasi va professional tahlili</p>
            </div>
          </button>
        </div>

        {/* Enhanced Stats Cards */}
        <StatsCards 
          totalBanks={totalBanks}
          totalRaters={totalRaters}
          totalDownloads={totalDownloads}
          averageRating={averageRating}
          topRating={topRating}
          averageFinalScore={averageFinalScore}
          platform={platform}
          topBankName={topBankName}
        />

        {/* Main Content with Enhanced Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="backdrop-blur-2xl bg-white/5 border border-white/20 p-1.5 rounded-2xl shadow-2xl flex flex-wrap md:flex-nowrap gap-2 overflow-x-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:backdrop-blur-xl rounded-xl text-white whitespace-nowrap">
              <BarChart3 className="w-4 h-4 mr-2" />
              Umumiy ko'rinish
            </TabsTrigger>
            <TabsTrigger value="ratings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:backdrop-blur-xl rounded-xl text-white whitespace-nowrap">
              <Star className="w-4 h-4 mr-2" />
              {platform === "googlePlay" ? "Google Play reytingi" : "App Store reytingi"}
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/20 data-[state=active]:to-emerald-500/20 data-[state=active]:backdrop-blur-xl rounded-xl text-white whitespace-nowrap">
              <Users className="w-4 h-4 mr-2" />
              Batafsil jadval
            </TabsTrigger>
            <TabsTrigger value="combined" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:backdrop-blur-xl rounded-xl text-white whitespace-nowrap">
              <Layers className="w-4 h-4 mr-2" />
                Yakuniy jadval
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <TopBanksChart data={filteredData} platform={platform} />
            <RatingDistribution data={filteredData} platform={platform} />
          </TabsContent>

          <TabsContent value="ratings" className="space-y-6">
            <RatingDistribution data={filteredData} detailed platform={platform} />
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <BanksTable data={filteredData} />
          </TabsContent>

          <TabsContent value="combined" className="space-y-6">
            <CombinedPlatformsTable googlePlayData={bankData} appStoreData={appStoreBankData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}