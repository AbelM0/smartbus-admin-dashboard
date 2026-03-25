"use client";

import { useTranslations } from "next-intl";
import { UsersHeader } from "./_components/UsersHeader";
import { UsersStats } from "./_components/UsersStats";
import { UserDirectoryTable } from "./_components/UserDirectoryTable";
import { InstantRefillTool } from "./_components/InstantRefillTool";
import { TopUpActivity } from "./_components/TopUpActivity";
import { PromotionalBanner } from "./_components/PromotionalBanner";

const commuters = [
  {
    name: "Eskinder Bekele",
    email: "eskinder.b@example.et",
    id: "SB-8821",
    type: "Regular",
    balance: "245.50",
    status: "Active",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0IxE_oEkHHxcOrX5wzNbJ_NO6yo5e5KQgciD2NpPKZLbJjhfD3mwaIDQ6McNh5bhpSU5NfU_tiyw56qbK48lLez-4C4fu2BwSYwBpIdErRwuVX5813XBwDRAiIkZhbdNYw5p1EI5R6l2nPnTRGIbMV66PYYDoO3s3CDAsEfqSMMKdgZFrVue6jn5TkpoIYtWjsT3Z1kVCbsx363bGzNnAC0I_gKTFNCj9_-pKpOF3hcrpGloDM-O1aQFu76zA0uXRq8n1plgjheha",
  },
  {
    name: "Selamawit Tadesse",
    email: "selam.t@univ-addis.et",
    id: "SB-4409",
    type: "Student",
    balance: "12.00",
    status: "Low Balance",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf4cpZafqtEbWMwYUGmvydrsF-X8CF6EaP-ZhFHQZtr4ujo8Fp8KZgPRRyKCRkkeBeCtx4MJ9ZxJVZYpDeyOJ6ex3ngdz52co8Ke72N1bDB_4gSMBRAjbm8d4AihkI_2hXoBUDBnkhS4w1sY5fuP2RDJd4Xmu2w9qrISLv-675KpO720FdBRrXOlqyx8EcftwiezApXJD8-zkZY24kIdiGNouqTAIy-tPJnTBlYCt59lDvmcUDl9-Z76mhjc2zirt14_w0TPTVIHUw",
  },
  {
    name: "Haile Gebre",
    email: "haile.g@community.et",
    id: "SB-1192",
    type: "Elder",
    balance: "890.00",
    status: "Active",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuABtIYblUYdEWd8DDQXYLrhKtPUYErARjfu4cTI4N3qp299gsUqBGSvKulEvtb5-3ehCuKnnFUx5zswYMkiec0vi5lD_o5ccn4Lt-RPFvfCn5_mRVJUSydU12c6HBrMmOz5iGqchacbWsFtulxoFIeZF_BU3F6xXwoZFraD4xy2vMvvrEPHHJEmiRVGfN6aB7siDvMoUjPeNIM-GGYpRYIr_fzyOzxSycpYOoqCJBP_ewMqcr-p94vPVzFyJmQtfJrlM0AAq7j-bQ1",
  },
  {
    name: "Dawit Mersha",
    email: "dawit.m@corphub.et",
    id: "SB-9011",
    type: "Regular",
    balance: "1,420.75",
    status: "Blocked",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJzTMbdfXiaOwHTZ5jb7UAuYGWX5u4T1rCgjX45tFJP_u8jVvs05WkXTBNU3jYkAj54v5guY5IOPaLllV4G_Lm8T7lfySA_IDPiAHywoc26UZHXDA5ZIbloZHSA_Eu5AWZfYtVm64T1GoevS_JAMZdqML_PpPzPHJN978xvCzEdLQzEInZWNFBHJLyUc5TfGlzto1_hETZZM2uZwNr5fb4w8jDjj_sGOErc6ABrRhzD_u97kxclEZ4LAK2Yh1KMe8vuTI9KzPPPmsf",
  },
];

export default function UserManagement() {
  const t = useTranslations("users");

  return (
    <div className="p-5 space-y-6">
      <UsersHeader t={t} />
      <UsersStats t={t} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UserDirectoryTable t={t} commuters={commuters} />
        <div className="lg:col-span-1 space-y-4">
          <InstantRefillTool t={t} />
          <TopUpActivity t={t} />
        </div>
      </div>
      
      <PromotionalBanner />
    </div>
  );
}
