import { Card } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Search } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

interface BanksTableProps {
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
      let aValue: any;
      let bValue: any;

      if (sortBy === 'appLabel') {
        aValue = (a as any)?.appId ?? (a as any)?.appName ?? '';
        bValue = (b as any)?.appId ?? (b as any)?.appName ?? '';
      } else if (sortBy === 'commentsUnified') {
        aValue = (a as any)?.lastMonthComments ?? (a as any)?.lastMonthReviews ?? 0;
        bValue = (b as any)?.lastMonthComments ?? (b as any)?.lastMonthReviews ?? 0;
      } else if (sortBy === 'verticalScorePercent') {
        aValue = (a as any)?.verticalScorePercent;
        bValue = (b as any)?.verticalScorePercent;
      } else if (sortBy === 'horizontalScore') {
        aValue = (a as any)?.horizontalScore;
        bValue = (b as any)?.horizontalScore;
      } else {
        aValue = (a as any)?.[sortBy];
        bValue = (b as any)?.[sortBy];
      }

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

  const SortButton = ({ field, label }: { field: string; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center justify-center gap-1.5 text-white hover:text-gray-200 transition-colors w-full h-full py-2 px-1"
    >
      <span className="text-center leading-tight">{label}</span>
      {sortBy === field && (
        <span className="text-xs flex-shrink-0">{sortOrder === "desc" ? "↓" : "↑"}</span>
      )}
    </button>
  );

  return (
    <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-white mb-2">Barcha mobil bank ilovalarining batafsil jadvali</h3>
          <p className="text-white text-sm">{filteredData.length} ta ilova</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300" />
          <Input
            placeholder="Bank, ilova yoki kategoriya bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-300 w-full md:min-w-[350px]"
          />
        </div>
      </div>

      <ScrollArea className="h-[60vh] md:h-[700px] rounded-xl">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 backdrop-blur-xl bg-black/50 z-10">
              <TableRow className="border-white/20 hover:bg-transparent">
                <TableHead className="text-white text-center w-[60px] sticky left-0 z-20 bg-black/50 backdrop-blur-xl border-r border-white/10">
                  <div className="py-2">№</div>
                </TableHead>
                <TableHead className="text-white w-[200px] sticky left-[60px] z-20 bg-black/50 backdrop-blur-xl border-r border-white/10 p-0">
                  <SortButton field="name" label="Bank nomi" />
                </TableHead>
                <TableHead className="text-white w-[180px] p-0">
                  <SortButton field="appLabel" label="Ilova nomi" />
                </TableHead>
                <TableHead className="text-white text-center w-[140px] hidden md:table-cell p-0">
                  <SortButton field="totalRaters" label="Jami baho bergan foydalanuvchilar" />
                </TableHead>
                <TableHead className="text-white text-center w-[140px] hidden md:table-cell p-0">
                  <SortButton field="lastMonthDownloads" label="So'nggi oyda yuklab olishlar" />
                </TableHead>
                <TableHead className="text-white text-center w-[140px] hidden md:table-cell p-0">
                  <SortButton field="commentsUnified" label="So'nggi oyda izohlar" />
                </TableHead>
                <TableHead className="text-white text-center w-[140px] hidden md:table-cell p-0">
                  <SortButton field="lastMonthRaters" label="So'nggi oyda baho berganlar" />
                </TableHead>
                <TableHead className="text-white text-center w-[110px] p-0">
                  <SortButton field="horizontalScore" label="Gorizontal ball" />
                </TableHead>
                <TableHead className="text-white text-center w-[110px] hidden md:table-cell p-0">
                  <SortButton field="verticalScorePercent" label="Vertikal ball" />
                </TableHead>
                <TableHead className="text-white text-center w-[110px] p-0">
                  <SortButton field="activityScore" label="Faollik" />
                </TableHead>
                <TableHead className="text-white text-center w-[130px] p-0">
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
                  <TableCell className="text-white text-center sticky left-0 z-20 bg-black/30 backdrop-blur-xl border-r border-white/10">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 mx-auto">
                      {index + 1}
                    </div>
                  </TableCell>
                  <TableCell className="text-white sticky left-[60px] z-20 bg-black/30 backdrop-blur-xl border-r border-white/10">
                    <div className="py-1 leading-tight">{bank?.name ?? '-'}</div>
                  </TableCell>
                  <TableCell className="text-white">
                    <div className="text-sm text-gray-200 leading-tight py-1">{bank.appId || bank.appName || '-'}</div>
                  </TableCell>
                  <TableCell className="text-white text-center hidden md:table-cell">
                    <div className="py-1">{bank?.totalRaters?.toLocaleString?.() || '0'}</div>
                  </TableCell>
                  <TableCell className="text-white text-center hidden md:table-cell">
                    <div className="py-1">{bank?.lastMonthDownloads?.toLocaleString?.() || '0'}</div>
                  </TableCell>
                  <TableCell className="text-white text-center hidden md:table-cell">
                    <div className="py-1">
                      {(bank?.lastMonthComments ?? bank?.lastMonthReviews ?? 0).toLocaleString?.() || '0'}
                    </div>
                  </TableCell>
                  <TableCell className="text-white text-center hidden md:table-cell">
                    <div className="py-1">{bank?.lastMonthRaters?.toLocaleString?.() || '0'}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2 py-1">
                      <span className="text-white">
                        {typeof bank?.horizontalScore === 'number' ? bank.horizontalScore.toFixed(1) : '0.0'}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-white text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-2 py-1">
                      <span className="text-white">
                        {typeof bank?.verticalScorePercent === 'number' ? bank.verticalScorePercent.toFixed(1) : '0.0'}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="py-1">
                      <span className={`${
                        (bank?.activityScore ?? 0) >= 80 ? "text-white" :
                        (bank?.activityScore ?? 0) >= 60 ? "text-white" :
                        (bank?.activityScore ?? 0) >= 40 ? "text-white" :
                        "text-white"
                      }`}>
                        {typeof bank?.activityScore === 'number' ? bank.activityScore.toFixed(1) : '0.0'}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center py-1">
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
                        {typeof bank?.finalScore === 'number' ? bank.finalScore.toFixed(1) : '0.0'}
                      </Badge>
                    </div>
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
