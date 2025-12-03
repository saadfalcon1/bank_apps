import { Card } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "./ui/badge";
import { useState } from "react";

interface CombinedPlatformsTableProps {
  googlePlayData: any[];
  appStoreData: any[];
}

interface CombinedBank {
  name: string;
  category: string;
  appLabel: string;
  googlePlayScore: number;
  appStoreScore: number;
  averageScore: number;
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

  // Combine data
  const combinedData: CombinedBank[] = [];

  googlePlayData.forEach(gpBank => {
    const asBank = appStoreData.find((asb: any) => asb.name === gpBank.name);

    if (asBank) {
      combinedData.push({
        name: gpBank.name,
        category: gpBank.category,
        appLabel: gpBank.appId ?? asBank.appName ?? "",
        googlePlayScore: gpBank.finalScore,
        appStoreScore: asBank.finalScore,
        averageScore: (gpBank.finalScore + asBank.finalScore) / 2,
        googlePlayRaters: gpBank.totalRaters,
        appStoreRaters: asBank.totalRaters
      });
    }
  });

  // Sort
  const sortedData = [...combinedData].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
    }
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "desc"
        ? bValue.localeCompare(aValue)
        : aValue.localeCompare(bValue);
    }
    return 0;
  });

  const SortButton = ({ field, label }: { field: keyof CombinedBank; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-white hover:text-gray-200 transition-colors text-base font-semibold"
    >
      {label}
      {sortBy === field && <ArrowUpDown className="w-3 h-3" />}
    </button>
  );

  return (
    <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-6">

      <div className="mb-6">
        <h3 className="text-white mb-2">Google Play va App Store yakuniy jadval tahlili</h3>
      </div>

      <div className="overflow-x-auto rounded-xl">
        <Table className="min-w-[880px] sm:min-w-full text-xs sm:text-sm">

          <TableHeader className="backdrop-blur-xl bg-black/50">

            {/* HEADER 1 — TITLE ROW */}
            <TableRow className="border-white/20 hover:bg-transparent">

              <TableHead className="text-white text-center w-16 text-base font-semibold">№</TableHead>

              <TableHead className="text-white min-w-[200px] text-base font-semibold">
                <SortButton field="name" label="Bank nomi" />
              </TableHead>

              <TableHead className="text-white min-w-[200px] hidden sm:table-cell text-base font-semibold">
                <SortButton field="appLabel" label="Ilova nomi" />
              </TableHead>

              <TableHead className="text-white min-w-[140px] hidden sm:table-cell text-base font-semibold">
                <SortButton field="category" label="Kategoriya" />
              </TableHead>

              {/* Google Play */}
              <TableHead className="text-center" colSpan={1}>
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-2 border border-blue-400/30">
                  <span className="text-blue-300 font-semibold text-base">Google Play</span>
                </div>
              </TableHead>

              {/* App Store */}
              <TableHead className="text-center" colSpan={1}>
                <div className="bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-lg p-2 border border-cyan-400/30">
                  <span className="text-cyan-300 font-semibold text-base">App Store</span>
                </div>
              </TableHead>

              {/* AVERAGE SCORE — CENTERED */}
              <TableHead className="text-white text-center text-lg font-semibold" colSpan={1}>
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-2 border border-green-400/30 flex justify-center">
                  <SortButton field="averageScore" label="O'rtacha Ball" />
                </div>
              </TableHead>

            </TableRow>

            {/* HEADER 2 — SUBTITLE ROW */}
            <TableRow className="border-white/20 hover:bg-transparent">
              <TableHead className="text-white"></TableHead>
              <TableHead className="text-white"></TableHead>
              <TableHead className="text-white hidden sm:table-cell"></TableHead>
              <TableHead className="text-white hidden sm:table-cell"></TableHead>

              <TableHead className="text-white text-right min-w-[100px]">
                <SortButton field="googlePlayScore" label="" />
              </TableHead>

              <TableHead className="text-white text-right min-w-[100px]">
                <SortButton field="appStoreScore" label="" />
              </TableHead>

              <TableHead className="text-white text-center">
                <span className="text-green-300 text-base font-semibold">(GP + AS) / 2</span>
              </TableHead>
            </TableRow>

          </TableHeader>

          {/* BODY */}
          <TableBody>
            {sortedData.map((bank, index) => (
              <TableRow
                key={index}
                className="border-white/10 hover:bg-gradient-to-r hover:from-white/5 hover:to-white/10 transition-all duration-300"
              >
                <TableCell className="text-white text-left p-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 font-semibold">
                    {index + 1}
                  </div>
                </TableCell>

                <TableCell className="text-white font-medium truncate max-w-[200px]" title={bank.name}>
                  {bank.name}
                </TableCell>

                <TableCell className="text-white hidden sm:table-cell truncate max-w-[220px]" title={bank.appLabel || "-"}>
                  {bank.appLabel || "-"}
                </TableCell>

                <TableCell className="hidden sm:table-cell">
                  <Badge
                    variant="outline"
                    className={`${
                      bank.category === "Davlat banki"
                        ? "bg-green-500/10 text-green-300 border-green-500/30"
                        : bank.category === "Xususiy bank"
                        ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                        : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                    }`}
                  >
                    {bank.category}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border border-blue-400/30 backdrop-blur-xl">
                    {bank.googlePlayScore.toFixed(1)}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <Badge className="bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-200 border border-cyan-400/30 backdrop-blur-xl">
                    {bank.appStoreScore.toFixed(1)}
                  </Badge>
                </TableCell>

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
                    {bank.averageScore.toFixed(1)}
                  </Badge>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>

    </Card>
  );
}
