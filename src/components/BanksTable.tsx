import { Card } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Star, TrendingUp, TrendingDown, Search } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

interface BanksTableProps {
  // Ikki platforma (Google Play va App Store) ma'lumotlarini qo'llab-quvvatlash
  data: any[];
}

export function BanksTable({ data }: BanksTableProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("finalScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const filteredData = data
    .filter(bank =>
      bank?.name?.toLowerCase?.().includes(search.toLowerCase()) ||
      bank?.category?.toLowerCase?.().includes(search.toLowerCase()) ||
      bank?.appId?.toLowerCase?.().includes(search.toLowerCase()) ||
      bank?.appName?.toLowerCase?.().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = (a as any)?.[sortBy];
      const bValue = (b as any)?.[sortBy];

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

  const SortButton = ({ field, label }: { field: string; label: any }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-white hover:text-gray-200 transition-colors"
    >
      {label}
      {sortBy === field && (
        <span className="text-xs">{sortOrder === "desc" ? "↓" : "↑"}</span>
      )}
    </button>
  );

  return (
    <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-white mb-2">Barcha bank ilovalarining batafsil jadvali</h3>
          <p className="text-white text-sm">{filteredData.length} ta ilova</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300" />
          <Input
            placeholder="Bank, ilova yoki kategoriya bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-300 min-w-[350px]"
          />
        </div>
      </div>

      <ScrollArea className="h-[700px] rounded-xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 backdrop-blur-xl bg-black/50 z-10">
              <TableRow className="border-white/20 hover:bg-transparent">
                <TableHead className="text-white text-center">#</TableHead>
                <TableHead className="text-white min-w-[180px]">
                  <SortButton field="name" label="Bank nomi" />
                </TableHead>
                <TableHead className="text-white min-w-[140px]">
                  <SortButton field="category" label="Kategoriya" />
                </TableHead>
                <TableHead className="text-white text-center min-w-[120px]">
                 <SortButton field="totalRaters" label={<span>Baho berganlar<br/>soni</span>} />
                </TableHead>
                <TableHead className="text-white text-center min-w-[140px]">
                  <SortButton
                    field="volumeValue"
                    label={<span>Oxirgi oyda<br/>yuklab olishlar soni</span>}
                  />
                </TableHead>
                <TableHead className="text-white text-center min-w-[140px]">
                  <SortButton
                    field="lastMonthDownloads"
                    label={<span>Oxirgi oyda<br/>izoh berganlar soni</span>}
                  />
                </TableHead>
                <TableHead className="text-white text-center min-w-[140px]">
                  <SortButton
                    field="lastMonthRaters"
                    label={<span>Oylik<br/>baholovchilar soni</span>}
                  />
                </TableHead>
                  <TableHead className="text-white text-center min-w-[100px]">
                  <SortButton field="averageRating" label={<span>Gorizontal<br/>ball</span>}/>
                </TableHead>
                <TableHead className="text-white text-center min-w-[100px]">
                  <SortButton field="verticalScore" label={<span>Vertikal<br/>ball</span>} />
                </TableHead>
                <TableHead className="text-white text-center min-w-[100px]">
                  <SortButton field="activityScore" label="Faollik" />
                </TableHead>
                <TableHead className="text-white text-center min-w-[120px]">
                  <SortButton field="finalScore" label="Yakuniy ball" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((bank, index) => (
                <TableRow
                  key={index}
                  className="border-white/10 hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 transition-all duration-300"
                >
                  <TableCell className="text-white text-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5">
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell className="text-white">{bank?.name ?? '-'}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${
                        (bank?.category ?? "") === "Davlat banklari" 
                          ? "bg-green-500/10 text-green-300 border-green-500/30"
                          : (bank?.category ?? "") === "Xorijiy banklar"
                          ? "bg-orange-500/10 text-orange-300 border-orange-500/30"
                          : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                      }`}
                    >
                      {bank?.category ?? '-'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white text-center">
                    {bank?.totalRaters?.toLocaleString?.() || '0'}
                  </TableCell>
                  <TableCell className="text-white text-center">
                    {typeof bank?.volumeValue === 'number' ? (bank.volumeValue * 1000000).toLocaleString() : '0'}
                  </TableCell>
                  <TableCell className="text-white text-center">
                    {bank?.lastMonthDownloads?.toLocaleString?.() || '0'}
                  </TableCell>
                  <TableCell className="text-white text-center">
                    {bank?.lastMonthRaters?.toLocaleString?.() || '0'}
                  </TableCell>
                    <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-white">{typeof bank?.horizontalScore === 'number' ? bank.horizontalScore.toFixed(2) : '0.00'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-white text-center">
                     <div className="flex items-center justify-center gap-2">
                      <span className="text-white">{typeof bank?.verticalScorePercent === 'number' ? bank.verticalScorePercent.toFixed(2) : '0.00'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`${
                      (bank?.activityScore ?? 0) >= 80 ? "text-green-300" :
                      (bank?.activityScore ?? 0) >= 60 ? "text-blue-300" :
                      (bank?.activityScore ?? 0) >= 40 ? "text-yellow-300" :
                      "text-orange-300"
                    }`}>
                      {typeof bank?.activityScore === 'number' ? bank.activityScore.toFixed(2) : '0.00'}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`${
                        (bank?.finalScore ?? 0) >= 90 
                          ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30" 
                          : (bank?.finalScore ?? 0) >= 75
                          ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30"
                          : (bank?.finalScore ?? 0) >= 60
                          ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30"
                          : (bank?.finalScore ?? 0) >= 40
                          ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30"
                          : "bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30"
                      } backdrop-blur-xl border`}
                    >
                      {typeof bank?.finalScore === 'number' ? bank.finalScore.toFixed(2) : '0.00'}
                    </Badge>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </Card>
  );
}