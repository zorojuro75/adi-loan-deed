"use client";

import { Button } from "@/components/ui/button";
import { convertToBengaliNumber, toBanglaDate } from "@/lib/utils";
import type { DeedWithRelations } from "@/types/deed";
import { Resolution, usePDF } from "react-to-pdf";

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
const nomineeHeaders = [
  "নমিনির নাম",
  "পিতার নাম",
  "বয়স",
  "জাতীয় পরিচয়পত্র নং",
  "বন্টনকৃত অংশ",
  "ঋনদাতার সাথে নমিনির সম্পর্ক",
  "নমিনির স্বাক্ষর",
];

export default function DeedPdfPreview({ deed }: DeedPdfPreviewProps) {
  const { toPDF, targetRef } = usePDF({
    filename: "document.pdf",
    resolution: Resolution.MEDIUM,
    page: {
      format: "legal",
    },
  });
  const bangladate = toBanglaDate(deed.agreementdate);

  return (
    <div className="space-y-4 min-w-[942px]">
      <div className="flex justify-start gap-4 mb-4">
        <Button variant="outline" onClick={() => toPDF()}>
          Download PDF
        </Button>
      </div>

      <div className="m-0 p-0 b-0" ref={targetRef}>
        <div className={`flex xl:h-[1551px] h-[1549.76px] w-[942px]`}>
          <div className="mt-[4.5in] mb-[1.5in] mx-[1in] flex-1 flex flex-col items-center gap-4">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold">
                অলটারনেটিভ ডেভেলপমেন্ট ইনিসিয়েটিভ (এডিআই)
              </h1>
              <p>
                বাড়ি নং-৫৮/বি, রোড নং-০৩, ব্লক-বি,নিকেতন হাউজিং সোসাইটি,
                গুলশান-১, ঢাকা-১২১২
              </p>
              <p>এম আর এ সনদ নং- ০০৭১১-০০০২৭-০০০০৩০৩, মোবাইল: ০১৩১৩৭৬৬৩২৫</p>
              <p>ই-মেইল: adi.bd.org@gmail.com ওয়েভ সাইট: www.adi-bd.org</p>
              <br />
              <p>APLF ঋণ চুক্তিপত্র/ ব্যক্তিগত ঋনের চুক্তিপত্র</p>
              <br />
              <p>চুক্তিপত্র নং-{deed.id}</p>
            </div>
            <p>
              অদ্য {convertToBengaliNumber(deed.agreementdate)} খ্রীষ্টাব্দ
              তারিখ মোতাবেক {bangladate} বঙ্গাব্দ শীর্ষোক্ত চুক্তিপত্র নিম্নে
              বর্নিত শর্তাবলী মোতাবেক পক্ষগনের মধ্যে ঋণচুক্তি সম্পাদিত হলো।{" "}
            </p>
            <div className="flex gap-4">
              {/* First Column */}
              <div className="flex-1 border rounded p-2">
                <p>১ম পক্ষঃ(ঋণগ্রহীতা)</p>
                <p>অলটারনেটিভ ডেভেলপমেন্ট ইনিসিয়েটিভ (এডিআই) পক্ষে।</p>
                <br />
                <br />
                <p>সীল মোহর ও স্বাক্ষর</p>
              </div>

              {/* Second Column */}
              <div className="flex-1 border rounded p-2">
                <p>২য় পক্ষঃ (ঋণদাতা)</p>
                <p>নামঃ {deed.fullname}</p>
                <p>পিতাঃ {deed.fathersname}</p>
                <p>মাতাঃ {deed.mothersname}</p>
                <p>জাতীয় পরিচয়পত্র নংঃ {deed.nid}</p>
                <p>মোবাইল নংঃ {deed.mobile}</p>
                <br />
                <p>বর্তমান ঠিকানাঃ</p>
                <p>গ্রামঃ {deed.currentvillage}</p>
                <p>ডাকঘরঃ {deed.currentpostoffice}</p>
                <p>
                  উপজেলাঃ {deed.currentupazila}, জেলাঃ {deed.currentdistrict}
                </p>
                <br />
                <p>স্থায়ী ঠিকানাঃ</p>
                <p>গ্রামঃ {deed.permanentvillage}</p>
                <p>ডাকঘরঃ {deed.permanentpostoffice}</p>
                <p>
                  উপজেলাঃ {deed.permanentupazila}, জেলাঃ{" "}
                  {deed.permanentdistrict}
                </p>

                <br />
                <br />
                <p>ঋণদাতার স্বাক্ষর</p>
              </div>
            </div>
          </div>
        </div>
        <div className={`flex xl:h-[1551px] h-[1549.76px] w-[942px]`}>
          <div className="mt-[4.5in] mb-[1.5in] mx-[1in] flex-1 flex flex-col items-center gap-4">
            <p className="text-justify">
              অলটারনেটিভ ডেভেলপমেন্ট ইনিসিয়েটিভ (এডিআই) এর ক্ষুদ্রঋণ কার্যক্রম
              পরিচালন ও এর গতি বৃদ্ধির লক্ষ্যে প্রথম পক্ষ ব্যক্তিগত ঋণ নেওয়ার
              ইচ্ছা পোষন করলে দ্বিতীয় পক্ষ (ঋন দাতা) নাম {deed.fullname} পিতাঃ{" "}
              {deed.fathersname}, প্রথম পক্ষের (ঋণগ্রহীতা) স্থানীয় কার্যালয়;
              অলটারনেটিভ ডেভেলপমেন্ট ইনিসিয়েটিভ (এডিআই){" "}
              {deed.first_side_representative.branch_name} শাখা,{" "}
              {deed.first_side_representative.region_name} অঞ্চল,{" "}
              {deed.first_side_representative.zone_name} জোন এ উপস্থিত হয়ে অদ্য-
              {convertToBengaliNumber(deed.agreementdate)} ইং তারিখে যাবতীয়
              শর্তাবলী মেনে ঋণ প্রদানে সম্মত হলেন এবং উপস্থিত সকল পক্ষ
              স্বাক্ষীগণের সামনে ঋন পরিশোধের সকল দায়-দায়িত্ব ও আইনগত বাধ্যবাধকতা
              স্বীকার করে নিম্নলিখিত শর্তাবলীর আলোকে অলটারনেটিভ ডেভেলপমেন্ট
              ইনিসিয়েটিভ ক্ষুদ্রঋন প্রতিষ্ঠান- এর পক্ষে
              {deed.first_side_representative.name} এর সাথে এ ঋণ চুক্তিনামা
              সম্পাদন করে নিম্নে উল্লেখিত চেকের মাধ্যমে={" "}
              {convertToBengaliNumber(deed.loan_amount)}/= কথায়ঃ{" "}
              {deed.loan_amount_in_words} টাকা মাত্র ঋণ প্রদান করিল ।
            </p>
            <table className="w-full border border-collapse border-black text-center">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="border border-black p-2 font-bold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deed.checks.map((check, index) => (
                  <tr key={index}>
                    <td className="border border-black p-2">
                      {convertToBengaliNumber(index + 1)}
                    </td>
                    <td className="border border-black p-2">
                      {check.bank_name}
                    </td>
                    <td className="border border-black p-2">{check.branch}</td>
                    <td className="border border-black p-2">
                      {convertToBengaliNumber(check.check_number)}
                    </td>
                    <td className="border border-black p-2">
                      {convertToBengaliNumber(check.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2 className="text-xl font-semibold">ঋণ চুক্তির শর্তাবলীঃ</h2>
            <ul className="text-justify">
              <li>
                ১. প্রথম পক্ষ অলটারনেটিভ ডেভেলপমেন্ট ইনিসিয়েটিভ গৃহীত ঋণের
                সম্পুর্ন টাকা অলটারনেটিভ ডেভেলপমেন্ট ইনিসিয়েটিভ এর ক্ষুদ্রঋণ
                কর্মসূচি কার্যক্রম সম্প্রসারনের লক্ষ্যে ব্যবহার করবে।
              </li>
              <li>২. গৃহীত ঋনের বাৎসরিক মুনাফা ১২% হারে প্রযোজ্য হবে।</li>
              <li>
                ৩. ঋণের মেয়াদ হবে {convertToBengaliNumber(deed.tenure_of_loan)}{" "}
                বছর।
              </li>
              <li>
                ৪. ঋণের মেয়াদ উত্তীর্ণ হওয়ার পর উভয় পক্ষ চাইলে উক্ত ঋন নবায়ন করা
                যাবে।
              </li>
              <li>
                ৫. ঋণের কিস্তির সংখ্যাঃ ১ (এক) টি, মেয়াদ শেষে এককালিন
                পরিশোধযোগ্য।
              </li>
              <li>
                ৬. প্রথম পক্ষ (ঋণগ্রহীতা) প্রতি মাসে ঋণের মেয়াদ ০১ (এক) মাস
                উর্ত্তীণ হওয়ার পরবর্তী সপ্তাহের প্রথম কর্মদিবসে দ্বিতীয় পক্ষের
                (ঋণদাতা) সংশ্লিষ্ট {deed.interest_bank_details.bank_name},{" "}
                {deed.interest_bank_details.branch} শাখার, হিসাব নং{" "}
                {convertToBengaliNumber(
                  deed.interest_bank_details.account_number
                )}{" "}
                মাধ্যমে মুনাফার টাকা প্রদান করবে।
              </li>
              <li>
                ৭. ঋণচুক্তির মেয়াদ ০৩ মাস উত্তীর্ণ হওয়ার আগে ঋণচুক্তি বাতিল করে
                অর্থ উত্তোলন করলে ২য় পক্ষ কোন প্রকার মুনাফা পাবে না। ২য় পক্ষ যদি
                উক্ত সময়ে মাসিক মুনাফা গ্রহন করে, সে ক্ষেত্রে গ্রহনকৃত মুনাফার
                সমপরিমাণ অর্থ ঋণদাতার (২য় পক্ষ) মূল অর্থের সাথে সমন্বয় করে
                অবশিষ্ট অর্থ ১ম পক্ষ, ২য় পক্ষকে ফেরত দিবে।{" "}
                <div className="text-center">অথবা</div>
                ঋণচুক্তির মেয়াদ উর্ত্তীন হওয়ার আগে ঋণচুক্তি বাতিল করে অর্থ
                উত্তোলন করলে সে ক্ষেত্রে ঋণের মেয়াদ ১ (এক) বছর পুর্ন করলে ১২%
                এবং ঋণের মেয়াদ ১ (এক) বছরের কম হলে ৬% হারে মুনাফা প্রদান করতে
                হবে। (৬ বছরে দিগুন ঋণের ক্ষেত্রে )
              </li>
              <li>
                ৮. ঋণদাতা (২য় পক্ষ) তার প্রদানকৃত অর্থ ফেরত নেয়ার জন্য কমপক্ষে
                ১০ (দশ) কর্ম দিবস পূর্বে সংস্থার সংশ্লিষ্ট অফিসের মাধ্যমে
                নির্বাহী পরিচালক বরাবর লিখিত আবেদন করতে হবে।
              </li>
              <li>
                ৯. ২য় পক্ষ (ঋণদাতা) কে ঋণের মূল অর্থ গ্রহনের জন্য সংশ্লিষ্ট
                অফিসে নিজে অথবা ক্ষমতা প্রাপ্ত ব্যক্তিকে উপস্থিত হয়ে চেক গ্রহণ
                করতে হবে।
              </li>
            </ul>
          </div>
        </div>
        <div className={`flex xl:h-[1551px] h-[1549.76px] w-[942px]`}>
          <div className="mt-[4.5in] mb-[1.5in] mx-[1in] flex-1 flex flex-col items-center gap-4">
            <ul className="text-justify">
              <li>
                ১০. ঋণের মূল অর্থ ফেরতের সময় অব্যশই ঋণদাতা (২য় পক্ষ) ঋণের
                সংক্রান্ত মূল রশিদ ও চুক্তিনামার মূল কপি জমা নিতে হবে।
              </li>
              <li>
                ১১. ২য় পক্ষ চুক্তি বাতিল করে মূল টাকা ফেরত নিতে চাইলে, ১ম পক্ষের
                নিকট থেকে ২য় পক্ষের জিম্মায় যদি কোন ঋণ থাকে এবং সেই ঋণের যদি কোন
                স্থিতি থাকে অথবা ২য় পক্ষকে ১ম পক্ষ ঝুঁকি মনে করলে ২য় পক্ষের
                চুক্তিকৃত টাকা থেকে ১ম পক্ষের সমস্ত পাওনা টাকা কর্তন পূর্বক
                সমন্বয় করে নিতে পারবে।
              </li>
              <li>
                ১২. ঋণদাতা (২য় পক্ষ) ১ম পক্ষ-কে ঋণ দেয়ার পর যদি মৃত্যুবরণ করে,
                সে ক্ষেত্রে আইনগত কোন জটিলতা না থাকলে নিম্ন ছক অনুযায়ী নমিনি
                প্রদানকৃত অর্থ ফেরত পাবে। যদি নমিনি তার চুক্তি চলমান রাখতে চান,
                তবে সংস্থার সাথে নতুন চুক্তি সম্পাদন করতে হবে।
              </li>
            </ul>
            <table>
              <thead>
                <tr>
                  {nomineeHeaders.map((header, index) => (
                    <th
                      key={index}
                      className="border border-black p-2 font-bold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deed.nominees.map((nominee, index) => (
                  <tr key={index}>
                    <td className="border border-black p-2">{nominee.name}</td>
                    <td className="border border-black p-2">
                      {nominee.fathersname}
                    </td>
                    <td className="border border-black p-2">
                      {convertToBengaliNumber(nominee.age)}
                    </td>
                    <td className="border border-black p-2">
                      {convertToBengaliNumber(nominee.nid)}
                    </td>
                    <td className="border border-black p-2">
                      {convertToBengaliNumber(nominee.distributed_portion)}
                    </td>
                    <td className="border border-black p-2">
                      {nominee.relationship}
                    </td>
                    <td className="border border-black p-2"> </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="text-justify">
              <li>
                ১৩. ২য় পক্ষ (ঋণদাতা) ও তার নমিনি উভয় মৃত্যবরন করলে মৃত
                ব্যক্তিগনের মৃত্যুসনদ ও ওয়ারিশ সনদ উপস্থাপন স্বাপক্ষে বৈধ
                ওয়ারিশদের ঋণের সমুদয় অর্থ দেয়া যাবে। তবে আইনগত সমস্যা থাকলে
                সমাধান না হওয়া পর্যন্ত উক্ত ঋণের অর্থ ফেরত দেয়া স্থগিত থাকবে।
              </li>
              <li>
                ১৪. ২য় পক্ষ (ঋণদাতা) যদি আইনগত ভাবে অপরাধী প্রামণিত হয় অথবা
                আদালত কর্তৃক দেউলিয়া ঘোষিত হয় অথবা সামাজিকভাবে ক্ষতিকর কাজে
                লিপ্ত হয় তবে ১ম পক্ষ তৎক্ষনাৎ তার সাথে চুক্তি বাতিল করতে পারবে।
                এক্ষেত্রে চুক্তির তারিখ থেকে চুক্তি বাতিল এর তারিখ পর্যন্ত
                মেয়াদকাল ৬ (ছয়) মাসের কম হলে কোন প্রকার মুনাফা প্রদান করা হবে
                না। যদি ৬-১২ মাস বা ৬ মাসের উর্দ্ধে কিন্তু ১ (এক) বছরের কম সময়
                হয় তবে প্রতি পূর্ণ মাস হিসাব করে ৬% হারে মুনাফা প্রদান করা হবে
                এবং চুক্তি বাতিল পূর্বক দেনা-পাওনা মূল অর্থের সাথে সমন্বয় পূর্বক
                অবশিষ্ট অর্থ ফেরত প্রদান করা হবে।
              </li>
            </ul>
          </div>
        </div>
        <div className={`flex xl:h-[1551px] h-[1549.76px] w-[942px]`}>
          <div className="mt-[4.5in] mb-[1.5in] mx-[1in] flex-1 flex flex-col items-center gap-4">
            <p className="text-justify">
              নিম্ন লিখিত স্বাক্ষীগণের উপস্থিতিতে স্বেচ্ছায় স্বজ্ঞানে সুস্থ্য
              মস্তিষ্কে কারো দ্বারা প্ররোচিত না হয়ে এই চুক্তির মর্মার্থ অনুধাবন
              পূর্বক চুক্তিপত্রে সহি স্বাক্ষর সম্পাদন করলাম।
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex-1 border rounded p-2">
                <p>১ম পক্ষ (ঋণগ্রহীতা)</p>
                <p>অলটারনেটিভ ডেভেলপমেন্ট ইনিসিয়েটিভ (এডিআই) পক্ষে</p>
                <br />
                <br />
                <p>স্বাক্ষর</p>
                <p>সীল</p>
                <br />
                <br />
                <br />
              </div>
              <div className="flex-1 border rounded p-2">
                <p>২য় পক্ষ (ঋণদাতা)</p>
                <br />
                <br />
                <p>স্বাক্ষর</p>
              </div>
              <div className="flex-1 border rounded p-2">
                <p> ১ম পক্ষের (ঋনগ্রহিতা) স্বাক্ষী</p>
                <p>অলটারনেটিভ ডেভেলপমেন্ট ইনিসিয়েটিভ (এডিআই) পক্ষে</p>
                <br />
                <br />
                <p>স্বাক্ষর</p>

                <p>সীল</p>
                <br />
                <br />
                <br />
                <br />
              </div>
              <div className="flex-1 border rounded p-2">
                <p> ২য় পক্ষের (ঋনদাতা) স্বাক্ষী</p>
                <p>নাম:</p>
                <br />
                <br />
                <p>স্বাক্ষর</p>
                <p>ঠিকানা:</p>
              </div>
              <div className="flex-1 border rounded p-2">
                <p> ১ম পক্ষের (ঋনগ্রহিতা) স্বাক্ষী</p>
                <p>অলটারনেটিভ ডেভেলপমেন্ট ইনিসিয়েটিভ (এডিআই) পক্ষে</p>
                <br />
                <br />
                <p>স্বাক্ষর</p>
                <p>সীল</p>
                <br />
                <br />
                <br />
                <br />
              </div>
              <div className="flex-1 border rounded p-2">
                <p> ২য় পক্ষের (ঋনদাতা) স্বাক্ষী</p>
                <p>নাম:</p>
                <br />
                <br />
                <p>স্বাক্ষর</p>
                <p>ঠিকানা:</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
