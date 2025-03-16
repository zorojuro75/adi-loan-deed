"use client";

import React from "react";
import type { DeedWithRelations } from "@/types/deed";
import { Button } from "@/components/ui/button";
import { usePDF } from "react-to-pdf";

interface DeedPdfPreviewProps {
  deed: DeedWithRelations;
}
const headers = [
  "ক্রমিক নং",
  "ব্যাংকের নাম",
  "ব্যাংক শাখার নাম",
  "চেক নং",
  "টাকা",
];
const rows = [
  ["১", "ব্র্যাক ব্যাংক", "গুলশান শাখা", "১২৩৪৫৬", "৫,০০০"],
  ["২", "ডাচ বাংলা ব্যাংক", "মিরপুর শাখা", "৬৭৮৯১০", "১০,০০০"],
  ["৩", "প্রাইম ব্যাংক", "ধানমন্ডি শাখা", "১১১২১৩", "১৫,০০০"],
  ["৪", "", "", "", ""],
  ["৫", "", "", "", ""],
];
export default function DeedPdfPreview({ deed }: DeedPdfPreviewProps) {
  const { toPDF, targetRef } = usePDF({ filename: "document.pdf" });

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-4 mb-4">
        <Button variant="outline" onClick={() => toPDF()}>
          Generate PDF
        </Button>
      </div>
    
      <div className="m-0 p-0" ref={targetRef} >
        <div
          className={`flex flex-col gap-4 items-center justify-center h-[1210px] px-4`}
        >
          <h1 className="text-2xl font-bold mb-4">
            অলটারনেটিভ ডেভেলপমেন্ট ইনিসিয়েটিভ (এডিআই)
          </h1>
          <p className="">
            বাড়ি নং-৫৮/বি, রোড নং-০৩, ব্লক-বি,নিকেতন হাউজিং সোসাইটি, গুলশান-১,
            ঢাকা-১২১২
          </p>
          <p>এম আর এ সনদ নং- ০০৭১১-০০০২৭-০০০০৩০৩</p>
          <p>মোবাইল:০১৭১১-৮১৩৪৭০</p>
          <p>ই-মেইল: adi.bd.org@gmail.com ওয়েভ সাইট: www.adi-bd.org</p>
          <p>APLF ঋণ চুক্তিপত্র/ ব্যক্তিগত ঋনের চুক্তিপত্র</p>
          <p>চুক্তিপত্র নং-{deed.id}</p>
        </div>
        <div
          className={`flex flex-col gap-4 items-center justify-center h-[1210px] p-20`}
        >
          <p className="mt-10">
            অদ্য {deed.agreementdate} খ্রীষ্টাব্দ তারিখ মোতাবেক 08 ফাল্গুন তারিখ
            0000 বঙ্গাব্দ শীর্ষোক্ত চুক্তিপত্র নিম্নে বর্নিত শর্তাবলী মোতাবেক
            পক্ষগনের মধ্যে ঋণচুক্তি সম্পাদিত হলো।{" "}
          </p>
          <div className="flex gap-4">
            {/* First Column */}
            <div className="flex-1 border rounded p-2">
              <p>১ম পক্ষঃ(ঋণ গ্রহীতা)</p>
              <p>অলটারনেটিভ ডেভেলপমেন্ট ইনিসিয়েটিভ (এডিআই) পক্ষে।</p>
              <br />
              <br />
              <p>সীল মোহর ও স্বাক্ষরর</p>
            </div>

            {/* Second Column */}
            <div className="flex-1 border rounded p-2">
              <p>২য় পক্ষঃ (ঋণ দাতা)</p>
              <p>নামঃ {deed.fullname}</p>
              <p>পিতাঃ {deed.fathersname}</p>
              <p>মাতাঃ {deed.mothersname}</p>
              <p>জাতীয় পরিচয়পত্র নংঃ {deed.nid}</p>
              <p>মোবাইল নংঃ {deed.mobile}</p>

              <p>বর্তমান ঠিকানাঃ</p>
              <p>গ্রামঃ {deed.currentvillage}</p>
              <p>ডাকঘরঃ {deed.currentpostoffice}</p>
              <p>
                উপজেলাঃ {deed.currentupazila}, জেলাঃ {deed.currentdistrict}
              </p>

              <p>স্থায়ী ঠিকানাঃ</p>
              <p>গ্রামঃ {deed.permanentvillage}</p>
              <p>ডাকঘরঃ {deed.permanentpostoffice}</p>
              <p>
                উপজেলাঃ {deed.permanentupazila}, জেলাঃ {deed.permanentdistrict}
              </p>

              <br />
              <br />
              <p>ঋণ দাতার স্বাক্ষর</p>
            </div>
          </div>
          <p>
            অলটারনেটিভ ডেভেলপমেন্ট ইনিসিয়েটিভ (এডিআই) এর ক্ষুদ্রঋণ কার্যক্রম
            পরিচালন ও এর গতি বৃদ্ধির লক্ষ্যে নিমিত্তে প্রথম পক্ষ ব্যক্তিগত ঋণ
            নেওয়ার ইচ্ছা পোষন করলে দ্বিতীয় পক্ষ (ঋন দাতা) নাম {deed.fullname}{" "}
            পিতাঃ {deed.fathersname}, প্রথম পক্ষের (ঋণ গ্রহীতা) স্থানীয়
            কার্যালয়; অলটারনেটিভ ডেভেলপমেন্ট ইনিসিয়েটিভ (এডিআই)
            ---------------------------- শাখা, ------------------- অঞ্চল,
            --------------------- জোন এ উপস্থিত হয়ে অদ্য-{deed.agreementdate} ইং
            তারিখে যাবতীয় শর্তাবলী মেনে ঋণ প্রদানে সম্মত হলেন এবং উপস্থিত সকল
            পক্ষ স্বাক্ষী গনের সামনে ঋন পরিশোধের সকল দায় দায়িত্ব ও আইনগত
            বাধ্যবাধকতা স্বীকার করে নিম্নলিখিত শর্তাবলীর আলোকে অলটারনেটিভ
            ডেভেলপমেন্ট ইনিসিয়েটিভ ক্ষুদ্রঋন প্রতিষ্ঠান- এর পক্ষে
            ---------------------------------এর সাথে এ ঋণ চুক্তিনামা সম্পাদন করে
            নিম্নে উল্লেখিত চেকের মাধ্যমে= ----------------------/=টাকা <br />
            কথায়ঃ
            ------------------------------------------------------------------
            টাকা মাত্র ঋণ প্রদান করিল ।
          </p>
          <table className="w-full border border-collapse border-black text-center">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className="border border-black p-2 font-bold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-black p-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className={`flex flex-col gap-4 items-center justify-center h-[1210px] p-20`}
        >
          <h2 className="text-xl font-semibold mt-10">ঋণ চুক্তির শর্তাবলীঃ</h2>
          <ol className="list-decimal list-inside text-justify">
            <li>
              প্রথম পক্ষ অলটারনেটিভ ডেভেলপমেন্ট ইনিসিয়েটিভ গৃহীত ঋণের সম্পুর্ন
              টাকা অলটারনেটিভ ডেভেলপমেন্ট ইনিসিয়েটিভ এর ক্ষুদ্রঋণ কর্মসূচি
              কার্যক্রম সম্প্রসারনের লক্ষ্যে ব্যবহার করবে।
            </li>
            <li>গৃহীত ঋনের বাৎসরিক মুনাফা ১২% হারে প্রযোজ্য হবে।</li>
            <li>ঋণের মেয়াদ হবে --------- বছর ।</li>
            <li>
              ঋণের মেয়াদ উত্তীর্ণ হওয়ার পর উভয় পক্ষ চাইলে উক্ত ঋন নবায়ন করা
              যাবে।
            </li>
            <li>
              ঋণের কিস্তির সংখ্যাঃ ১ (এক) টি, মেয়াদ শেষে এককালিন পরিশোধ যোগ্য ।
            </li>
            <li>
              প্রতি মাসে ঋণের মেয়াদ ০১ মাস উর্ত্তীণ হওয়ার পরবর্তী সপ্তাহের প্রথম
              কর্মদিবসে মুনাফার টাকা প্রদান করবে।
            </li>
            <li>৩ মাস উত্তীর্ণ হওয়ার আগে চুক্তি বাতিল করলে মুনাফা পাবেন না।</li>
            <li>
              ঋণদাতা ফেরতের জন্য ১০ কর্ম দিবস পূর্বে লিখিত আবেদন করতে হবে।
            </li>
            <li>মূল টাকা গ্রহনের জন্য নিজে উপস্থিত হয়ে চেক গ্রহণ করতে হবে।</li>
            <li>ফেরতের সময় মূল রশিদ ও চুক্তিনামার কপি জমা নিতে হবে।</li>
            <li>
              চুক্তি বাতিল হলে দেনা-পাওনা সমন্বয় পূর্বক অবশিষ্ট অর্থ ফেরত প্রদান
              করা হবে।
            </li>
            <li>ঋণ দাতা মৃত্যুবরণ করলে নমিনি প্রদানকৃত অর্থ ফেরত পাবে।</li>
            <li>
              নমিনি ও ঋণদাতা উভয় মৃত্যুবরণ করলে ওয়ারিশদের অর্থ ফেরত দেয়া যাবে।
            </li>
            <li>
              আইনগত অপরাধী প্রামণিত হলে চুক্তি বাতিল করা হবে এবং সমন্বয় পূর্বক
              অর্থ ফেরত দেয়া হবে।
            </li>
          </ol>

          <div className="flex gap-4 mt-4">
            <div className="flex-1 border rounded p-2">
              <p>১ম পক্ষঃ (ঋণ গ্রহীতা)</p>
              <p>অলটারনেটিভ ডেভেলপমেন্ট ইনিসিয়েটিভ (এডিআই) পক্ষে।</p>
              <br />
              <br />
              <p>সীল মোহর ও স্বাক্ষর</p>
            </div>

            <div className="flex-1 border rounded p-2">
              <p>২য় পক্ষঃ (ঋণ দাতা)</p>
              <br />
              <br />
              <p>স্বাক্ষর</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
