import { Card } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Star, ArrowUpDown } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface CombinedPlatformsTableProps {
  googlePlayData: any[];
  appStoreData: any[];
}

interface CombinedBank {
  name: string;
  category: string;
  googlePlayScore: number;
  appStoreScore: number;
  averageScore: number;
  googlePlayRating: number;
  appStoreRating: number;
  googlePlayRaters: number;
  appStoreRaters: number;
}

export function CombinedPlatformsTable({ googlePlayData, appStoreData }: CombinedPlatformsTableProps) {
  const [sortBy, setSortBy] = useState<keyof CombinedBank>("averageScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (field: keyof CombinedBank) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // Combine data from both platforms
  const combinedData: CombinedBank[] = [];
  
  googlePlayData.forEach(gpBank => {
    const asBank = appStoreData.find(asb => asb.name === gpBank.name);
    
    if (asBank) {
      combinedData.push({
        name: gpBank.name,
        category: gpBank.category,
        googlePlayScore: gpBank.finalScore,
        appStoreScore: asBank.finalScore,
        averageScore: (gpBank.finalScore + asBank.finalScore) / 2,
        googlePlayRating: gpBank.averageRating,
        appStoreRating: asBank.averageRating,
        googlePlayRaters: gpBank.totalRaters,
        appStoreRaters: asBank.totalRaters
      });
    }
  });

  // Sort data
  const sortedData = [...combinedData].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === "desc" 
        ? bValue.localeCompare(aValue) 
        : aValue.localeCompare(bValue);
    }
    return 0;
  });

  const SortButton = ({ field, label }: { field: keyof CombinedBank; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-white hover:text-gray-200 transition-colors"
    >
      {label}
      {sortBy === field && (
        <ArrowUpDown className="w-3 h-3" />
      )}
    </button>
  );

  return (
    <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-6">
      <div className="mb-6">
        <h3 className="text-white mb-2">Google Play va App Store Birgalikda Tahlil</h3>
        <p className="text-white text-sm">
          Ikkala platformadagi yakuniy ballning o'rtachasi - {sortedData.length} ta bank
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl">
        <Table>
          <TableHeader className="backdrop-blur-xl bg-black/50">
            <TableRow className="border-white/20 hover:bg-transparent">
              <TableHead className="text-white text-center w-16">#</TableHead>
              <TableHead className="text-white min-w-[200px]">
                <SortButton field="name" label="Bank nomi" />
              </TableHead>
              <TableHead className="text-white min-w-[140px]">
                <SortButton field="category" label="Kategoriya" />
              </TableHead>
              
              {/* Google Play */}
              <TableHead className="text-center" colSpan={2}>
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-2 border border-blue-400/30">
                  <span className="text-blue-300 font-semibold">Google Play</span>
                </div>
              </TableHead>
              
              {/* App Store */}
              <TableHead className="text-center" colSpan={2}>
                <div className="bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-lg p-2 border border-cyan-400/30">
                  <span className="text-cyan-300 font-semibold">App Store</span>
                </div>
              </TableHead>
              
              {/* Average */}
              <TableHead className="text-white text-center min-w-[140px]">
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-2 border border-green-400/30">
                  <SortButton field="averageScore" label="O'rtacha Ball" />
                </div>
              </TableHead>
            </TableRow>
            
            {/* Sub headers */}
            <TableRow className="border-white/20 hover:bg-transparent">
              <TableHead className="text-white"></TableHead>
              <TableHead className="text-white"></TableHead>
              <TableHead className="text-white"></TableHead>
              
              <TableHead className="text-white text-center min-w-[100px]">
                <SortButton field="googlePlayScore" label="Ball" />
              </TableHead>
              <TableHead className="text-white text-center min-w-[100px]">
                <SortButton field="googlePlayRating" label="Reyting" />
              </TableHead>
              
              <TableHead className="text-white text-center min-w-[100px]">
                <SortButton field="appStoreScore" label="Ball" />
              </TableHead>
              <TableHead className="text-white text-center min-w-[100px]">
                <SortButton field="appStoreRating" label="Reyting" />
              </TableHead>
              
              <TableHead className="text-white text-center">
                <span className="text-green-300">(GP + AS) / 2</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {sortedData.map((bank, index) => (
              <TableRow 
                key={index}
                className="border-white/10 hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 transition-all duration-300"
              >
                <TableCell className="text-white text-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 font-semibold">
                    {index + 1}
                  </div>
                </TableCell>
                
                <TableCell className="text-white font-medium">{bank.name}</TableCell>
                
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`${
                      bank.category === "Davlat banklari" 
                        ? "bg-green-500/10 text-green-300 border-green-500/30"
                        : bank.category === "Xorijiy banklar"
                        ? "bg-orange-500/10 text-orange-300 border-orange-500/30"
                        : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                    }`}
                  >
                    {bank.category}
                  </Badge>
                </TableCell>
                
                {/* Google Play Score */}
                <TableCell className="text-center">
                  <Badge 
                    className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border border-blue-400/30 backdrop-blur-xl"
                  >
                    {bank.googlePlayScore.toFixed(2)}
                  </Badge>
                </TableCell>
                
                {/* Google Play Rating */}
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-blue-400 text-blue-400" />
                    <span className="text-blue-200 text-sm">{bank.googlePlayRating.toFixed(2)}</span>
                  </div>
                </TableCell>
                
                {/* App Store Score */}
                <TableCell className="text-center">
                  <Badge 
                    className="bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-200 border border-cyan-400/30 backdrop-blur-xl"
                  >
                    {bank.appStoreScore.toFixed(2)}
                  </Badge>
                </TableCell>
                
                {/* App Store Rating */}
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                    <span className="text-cyan-200 text-sm">{bank.appStoreRating.toFixed(2)}</span>
                  </div>
                </TableCell>
                
                {/* Average Score */}
                <TableCell className="text-center">
                  <Badge 
                    className={`${
                      bank.averageScore >= 90 
                        ? "bg-gradient-to-r from-green-500/30 to-emerald-500/30 text-green-200 border-green-400/40" 
                        : bank.averageScore >= 75
                        ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-blue-200 border-blue-400/40"
                        : bank.averageScore >= 60
                        ? "bg-gradient-to-r from-yellow-500/30 to-orange-500/30 text-yellow-200 border-yellow-400/40"
                        : "bg-gradient-to-r from-orange-500/30 to-red-500/30 text-orange-200 border-orange-400/40"
                    } backdrop-blur-xl border text-lg font-bold`}
                  >
                    {bank.averageScore.toFixed(2)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl p-4">
          <p className="text-blue-300 text-sm mb-1">Google Play O'rtacha</p>
          <p className="text-white text-2xl font-bold">
            {(sortedData.reduce((sum, b) => sum + b.googlePlayScore, 0) / sortedData.length).toFixed(2)}
          </p>
        </div>
        
        <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border border-cyan-400/30 rounded-xl p-4">
          <p className="text-cyan-300 text-sm mb-1">App Store O'rtacha</p>
          <p className="text-white text-2xl font-bold">
            {(sortedData.reduce((sum, b) => sum + b.appStoreScore, 0) / sortedData.length).toFixed(2)}
          </p>
        </div>
        
        <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-xl p-4">
          <p className="text-green-300 text-sm mb-1">Umumiy O'rtacha</p>
          <p className="text-white text-2xl font-bold">
            {(sortedData.reduce((sum, b) => sum + b.averageScore, 0) / sortedData.length).toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
}
