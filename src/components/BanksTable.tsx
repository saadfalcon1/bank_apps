import { useState } from "react";
import { Search } from "lucide-react";

import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

interface BankRow {
  name?: string;
  category?: string;
  appId?: string;
  appName?: string;

  totalRaters?: number;
  lastMonthDownloads?: number;
  lastMonthComments?: number;
  lastMonthReviews?: number;
  lastMonthRaters?: number;

  horizontalScore?: number;
  verticalScorePercent?: number;
  activityScore?: number;
  finalScore?: number;

  [key: string]: any;
}

interface BanksTableProps {
  data: BankRow[];
}

type SortOrder = "asc" | "desc";

export function BanksTable({ data }: BanksTableProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "appLabel">("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (field: "name" | "appLabel") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const filteredData = data
    .filter((bank) => {
      const q = search.toLowerCase();
      return (
        bank?.name?.toLowerCase?.().includes(q) ||
        bank?.category?.toLowerCase?.().includes(q) ||
        bank?.appId?.toLowerCase?.().includes(q) ||
        bank?.appName?.toLowerCase?.().includes(q)
      );
    })
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (sortBy === "name") {
        aValue = a?.name ?? "";
        bValue = b?.name ?? "";
      } else {
        // appLabel
        aValue = a?.appId ?? a?.appName ?? "";
        bValue = b?.appId ?? b?.appName ?? "";
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const cmp = aValue.localeCompare(bValue);
        return sortOrder === "asc" ? cmp : -cmp;
      }
      return 0;
    });

  const SortHeader = ({
    field,
    label,
    leftSticky,
    width,
  }: {
    field: "name" | "appLabel";
    label: string;
    leftSticky?: number;
    width: string;
  }) => (
    <TableHead
      className={[
        "text-white bg-black/60 border-r border-white/10 p-0",
        `w-[${width}]`,
        leftSticky !== undefined ? "sticky z-20" : "",
        leftSticky !== undefined ? `left-[${leftSticky}px]` : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        onClick={() => handleSort(field)}
        className="flex flex-col items-start justify-center gap-1 text-white hover:text-gray-200 transition-colors w-full h-full py-2 px-3 leading-tight"
      >
        <span className="block whitespace-normal leading-tight text-xs md:text-sm text-left">
          {label}
        </span>
        {sortBy === field && (
          <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>
        )}
      </button>
    </TableHead>
  );

  const formatNumber = (value?: number) =>
    typeof value === "number" ? value.toLocaleString() : "0";

  const formatScore = (value?: number) =>
    typeof value === "number" ? value.toFixed(1) : "0.0";

  return (
    <Card className="backdrop-blur-2xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-white mb-2">
            Barcha bank mobil ilovalarining batafsil jadvali
          </h3>
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
            <TableHeader className="sticky top-0 backdrop-blur-xl bg-black/60 z-10">
              <TableRow className="border-white/10 hover:bg-transparent">
                {/* № – chapga yopishgan, sort yo‘q */}
                <TableHead className="text-white text-left w-[60px] sticky left-0 z-20 bg-black/60 border-r border-white/10 px-3">
                  №
                </TableHead>

                {/* Faqat Bank nomi sortable + sticky */}
                <SortHeader
                  field="name"
                  label="Bank nomi"
                  leftSticky={60}
                  width="260px"
                />

                {/* Faqat Ilova nomi sortable (sticky emas) */}
                <SortHeader
                  field="appLabel"
                  label="Ilova nomi"
                  width="240px"
                />

                {/* Qolgan ustunlar – faqat matn, sort yo‘q */}
                <TableHead className="text-white text-center w-[180px] hidden md:table-cell bg-black/60 border-r border-white/10 px-3">
                  Jami baho bergan <br /> foydalanuvchilar soni
                </TableHead>

                <TableHead className="text-white text-center w-[180px] hidden md:table-cell bg-black/60 border-r border-white/10 px-3">
                  So‘nggi oyda <br /> yuklab olishlar soni
                </TableHead>

                <TableHead className="text-white text-center w-[180px] hidden md:table-cell bg-black/60 border-r border-white/10 px-3">
                  So‘nggi oyda <br />
                  izoh qoldirganlar soni
                </TableHead>

                <TableHead className="text-white text-center w-[180px] hidden md:table-cell bg-black/60 border-r border-white/10 px-3">
                  So‘nggi oyda <br /> baho berganlar soni
                </TableHead>

                <TableHead className="text-white text-center w-[130px] bg-black/60 border-r border-white/10 px-3">
                  Gorizontal <br /> ball
                </TableHead>

                <TableHead className="text-white text-center w-[130px] hidden md:table-cell bg-black/60 border-r border-white/10 px-3">
                  Vertikal <br /> ball
                </TableHead>

                <TableHead className="text-white text-center w-[130px] bg-black/60 border-r border-white/10 px-3">
                  Faollik <br /> ball
                </TableHead>

                <TableHead className="text-white text-center w-[150px] bg-black/60 px-3">
                  Yakuniy <br /> ball
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.map((bank, index) => (
                <TableRow
                  key={index}
                  className="border-white/5 hover:bg-white/5 transition-colors duration-200"
                >
                  {/* № */}
                  <TableCell className="text-white text-center sticky left-0 z-20 bg-gradient-to-r from-black/70 to-black/60 border-r border-white/10">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 mx-auto text-sm font-medium">
                      {index + 1}
                    </div>
                  </TableCell>

                  {/* Bank nomi – sticky */}
                  <TableCell className="text-white sticky left-[60px] z-10 bg-gradient-to-r from-black/70 to-black/60 border-r border-white/5">
                    <div className="py-1 leading-tight font-medium tracking-wide">
                      {bank?.name ?? "-"}
                    </div>
                  </TableCell>

                  {/* Ilova nomi */}
                  <TableCell className="text-white">
                    <div className="text-sm text-gray-200 leading-tight py-1">
                      {bank.appId || bank.appName || "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-white text-center hidden md:table-cell">
                    {formatNumber(bank.totalRaters)}
                  </TableCell>

                  <TableCell className="text-white text-center hidden md:table-cell">
                    {formatNumber(bank.lastMonthDownloads)}
                  </TableCell>

                  <TableCell className="text-white text-center hidden md:table-cell">
                    {formatNumber(
                      bank.lastMonthComments ?? bank.lastMonthReviews
                    )}
                  </TableCell>

                  <TableCell className="text-white text-center hidden md:table-cell">
                    {formatNumber(bank.lastMonthRaters)}
                  </TableCell>

                  <TableCell className="text-center text-white">
                    {formatScore(bank.horizontalScore)}
                  </TableCell>

                  <TableCell className="text-center text-white hidden md:table-cell">
                    {formatScore(bank.verticalScorePercent)}
                  </TableCell>

                  <TableCell className="text-center text-white">
                    {formatScore(bank.activityScore)}
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
                      {formatScore(bank.finalScore)}
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