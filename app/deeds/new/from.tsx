"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import type {
  Check,
  DeedData,
  FirstSideRepresentative,
  InterestBankDetails,
  Nominee,
} from "@/types/deed";
import { Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
type Props = {
    branchData: {
      branch_code: string;
      branch_name: string;
      region: {
        region_code: string;
        region_name: string;
        zone: {
          zone_code: string;
          zone_name: string;
        };
      };
    };
  };
  const generateDeedId = (): string => {
    const now = new Date();
    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0')
    ].join('');
  };
export default function NewDeedPage({ branchData }: Props) {
  
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const [deedData, setDeedData] = useState<Partial<DeedData>>({
    deed_custom_id: "",
    agreementdate: new Date().toISOString().split("T")[0],
    fullname: "",
    fathersname: "",
    mothersname: "",
    nid: "",
    mobile: "",
    currentvillage: "",
    currentpostoffice: "",
    currentupazila: "",
    currentdistrict: "",
    permanentvillage: "",
    permanentpostoffice: "",
    permanentupazila: "",
    permanentdistrict: "",
    loan_amount: 0,
    loan_amount_in_words: "",
    tenure_of_loan: 0,
  });

  const [checks, setChecks] = useState<Partial<Check>[]>([
    { check_number: "", bank_name: "", branch: "", amount: 0 },
  ]);
  const [bankDetails, setBankDetails] = useState<Partial<InterestBankDetails>>({
    name: "",
    account_number: "",
    branch: "",
    bank_name: "",
    branch_routing_number: "",
    amount: 0,
  });
  const [adi, setAdi] = useState<Partial<FirstSideRepresentative>>({
    name: "",
    branch_name: branchData.branch_name,
    region_name: branchData.region.region_name,
    zone_name: branchData.region.zone.zone_name,
  });

  const [nominees, setNominees] = useState<Partial<Nominee>[]>([
    {
      name: "",
      fathersname: "",
      age: 0,
      nid: "",
      mobile: "",
      relationship: "",
      distributed_portion: 0,
    },
  ]);
  useEffect(() => {
    setDeedData(prev => ({
      ...prev,
      deed_custom_id: generateDeedId()
    }));
  }, [])

  const handleDeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeedData((prev) => ({ ...prev, [name]: value }));
  };
  const handlebankDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };
  const handleAdiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdi((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newChecks = [...checks];
    newChecks[index] = {
      ...newChecks[index],
      [name]: name === "amount" ? Number.parseFloat(value) || 0 : value,
    };
    setChecks(newChecks);
  };

  const handleNomineeChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newNominees = [...nominees];
    newNominees[index] = {
      ...newNominees[index],
      [name]:
        name === "age" || name === "distributed_portion"
          ? Number.parseFloat(value) || 0
          : value,
    };
    setNominees(newNominees);
  };

  const addCheck = () => {
    setChecks([
      ...checks,
      { check_number: "", bank_name: "", branch: "", amount: 0 },
    ]);
  };

  const removeCheck = (index: number) => {
    if (checks.length > 1) {
      setChecks(checks.filter((_, i) => i !== index));
    }
  };

  const addNominee = () => {
    setNominees([
      ...nominees,
      {
        name: "",
        fathersname: "",
        age: 0,
        nid: "",
        mobile: "",
        relationship: "",
        distributed_portion: 0,
      },
    ]);
  };

  const removeNominee = (index: number) => {
    if (nominees.length > 1) {
      setNominees(nominees.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Insert deed
      const { data: deedResult, error: deedError } = await supabase
        .from("deeds")
        .insert([deedData])
        .select()
        .single();

      if (deedError) throw deedError;

      const deedId = deedResult.id;

      // Insert bank details
      const { error: bankDetailsError } = await supabase
        .from("interest_bank_details")
        .insert({ ...bankDetails, deed_id: deedId });
      if (bankDetailsError) throw bankDetailsError;

      // Insert ADI
      const { error: adiError } = await supabase
      .from("first_side_representative")
      .insert({ ...adi, deed_id: deedId });
      if (adiError) throw adiError;

      // Insert checks
      if (checks.length > 0) {
        const checksWithDeedId = checks.map((check) => ({
          ...check,
          deed_id: deedId,
        }));

        const { error: checksError } = await supabase
          .from("checks")
          .insert(checksWithDeedId);

        if (checksError) throw checksError;
      }

      // Insert nominees
      if (nominees.length > 0) {
        const nomineesWithDeedId = nominees.map((nominee) => ({
          ...nominee,
          deed_id: deedId,
        }));

        const { error: nomineesError } = await supabase
          .from("nominees")
          .insert(nomineesWithDeedId);

        if (nomineesError) throw nomineesError;
      }

      // Redirect to the deed page
      router.push(`/deeds/${deedId}`);
    } catch (error) {
      console.error("Error creating deed:", error);
      alert("Failed to create deed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToNextTab = () => {
    if (activeTab === "personal") setActiveTab("address");
    else if (activeTab === "address") setActiveTab("adi");
    else if (activeTab === "adi") setActiveTab("loan");
    else if (activeTab === "loan") setActiveTab("checks");
    else if (activeTab === "checks") setActiveTab("interest_bank_details");
    else if (activeTab === "interest_bank_details") setActiveTab("nominees");
  };

  const goToPrevTab = () => {
    if (activeTab === "nominees") setActiveTab("interest_bank_details");
    else if (activeTab === "interest_bank_details") setActiveTab("checks");
    else if (activeTab === "checks") setActiveTab("adi");
    else if (activeTab === "adi") setActiveTab("loan");
    else if (activeTab === "loan") setActiveTab("address");
    else if (activeTab === "address") setActiveTab("personal");
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Deed</h1>
        <Link href="/">
          <Button variant="outline">Back to List</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="adi">ADI Representative</TabsTrigger>
            <TabsTrigger value="loan">Loan Information</TabsTrigger>
            <TabsTrigger value="checks">Checks</TabsTrigger>
            <TabsTrigger value="interest_bank_details">
              Interest Bank Information
            </TabsTrigger>

            <TabsTrigger value="nominees">Nominees</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agreementdate">Agreement Date</Label>
                    <Input
                      id="agreementdate"
                      name="agreementdate"
                      type="date"
                      value={deedData.agreementdate}
                      onChange={handleDeedChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      name="fullname"
                      value={deedData.fullname}
                      onChange={handleDeedChange}
                      className="bangla"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fathersname">Father&apos;s Name</Label>
                    <Input
                      id="fathersname"
                      name="fathersname"
                      value={deedData.fathersname}
                      onChange={handleDeedChange}
                      className="bangla"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mothersname">Mother&apos;s Name</Label>
                    <Input
                      id="mothersname"
                      name="mothersname"
                      value={deedData.mothersname}
                      onChange={handleDeedChange}
                      className="bangla"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nid">NID</Label>
                    <Input
                      id="nid"
                      name="nid"
                      value={deedData.nid}
                      onChange={handleDeedChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      value={deedData.mobile}
                      onChange={handleDeedChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={goToNextTab}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address">
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Current Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentvillage">Village</Label>
                      <Input
                        id="currentvillage"
                        name="currentvillage"
                        value={deedData.currentvillage}
                        onChange={handleDeedChange}
                        className="bangla"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentpostoffice">Post Office</Label>
                      <Input
                        id="currentpostoffice"
                        name="currentpostoffice"
                        value={deedData.currentpostoffice}
                        onChange={handleDeedChange}
                        className="bangla"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentupazila">Upazila</Label>
                      <Input
                        id="currentupazila"
                        name="currentupazila"
                        value={deedData.currentupazila}
                        onChange={handleDeedChange}
                        className="bangla"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentdistrict">District</Label>
                      <Input
                        id="currentdistrict"
                        name="currentdistrict"
                        value={deedData.currentdistrict}
                        onChange={handleDeedChange}
                        className="bangla"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Permanent Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="permanentvillage">Village</Label>
                      <Input
                        id="permanentvillage"
                        name="permanentvillage"
                        value={deedData.permanentvillage}
                        onChange={handleDeedChange}
                        className="bangla"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="permanentpostoffice">Post Office</Label>
                      <Input
                        id="permanentpostoffice"
                        name="permanentpostoffice"
                        value={deedData.permanentpostoffice}
                        onChange={handleDeedChange}
                        className="bangla"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="permanentupazila">Upazila</Label>
                      <Input
                        id="permanentupazila"
                        name="permanentupazila"
                        value={deedData.permanentupazila}
                        onChange={handleDeedChange}
                        className="bangla"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="permanentdistrict">District</Label>
                      <Input
                        id="permanentdistrict"
                        name="permanentdistrict"
                        value={deedData.permanentdistrict}
                        onChange={handleDeedChange}
                        className="bangla"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={goToNextTab}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adi">
            <Card>
              <CardHeader>
                <CardTitle>ADI Representative</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Representative Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={adi.name}
                        onChange={handleAdiChange}
                        className="bangla"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branch_name">Branch Name</Label>
                      <Input
                        id="branch_name"
                        name="branch_name"
                        value={adi.branch_name}
                        onChange={handleAdiChange}
                        className="bangla"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region_name">Region Name</Label>
                      <Input
                        id="region_name"
                        name="region_name"
                        value={adi.region_name}
                        onChange={handleAdiChange}
                        className="bangla"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zone_name">Zone Name</Label>
                      <Input
                        id="zone_name"
                        name="zone_name"
                        value={adi.zone_name}
                        onChange={handleAdiChange}
                        className="bangla"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={goToNextTab}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loan">
            <Card>
              <CardHeader>
                <CardTitle>Loan Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="loan_amount">Loan Amount</Label>
                      <Input
                        id="loan_amount"
                        name="loan_amount"
                        value={deedData.loan_amount}
                        onChange={handleDeedChange}
                        type="number"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="loan_amount_in_words">
                        Amount In Words
                      </Label>
                      <Input
                        id="loan_amount_in_words"
                        name="loan_amount_in_words"
                        value={deedData.loan_amount_in_words}
                        onChange={handleDeedChange}
                        className="bangla"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tenure_of_loan">Tenure of the loan</Label>
                      <Input
                        id="tenure_of_loan"
                        name="tenure_of_loan"
                        value={deedData.tenure_of_loan}
                        onChange={handleDeedChange}
                        type="number"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={goToNextTab}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checks">
            <Card>
              <CardHeader>
                <CardTitle>Check Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {checks.map((check, index) => (
                  <div key={index} className="p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        Check #{index + 1}
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCheck(index)}
                        disabled={checks.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`check_number_${index}`}>
                          Check Number
                        </Label>
                        <Input
                          id={`check_number_${index}`}
                          name="check_number"
                          value={check.check_number}
                          onChange={(e) => handleCheckChange(index, e)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`bank_name_${index}`}>Bank Name</Label>
                        <Input
                          id={`bank_name_${index}`}
                          name="bank_name"
                          value={check.bank_name}
                          onChange={(e) => handleCheckChange(index, e)}
                          className="bangla"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`branch_${index}`}>Branch</Label>
                        <Input
                          id={`branch_${index}`}
                          name="branch"
                          value={check.branch}
                          onChange={(e) => handleCheckChange(index, e)}
                          className="bangla"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`amount_${index}`}>Amount</Label>
                        <Input
                          id={`amount_${index}`}
                          name="amount"
                          type="number"
                          value={check.amount}
                          onChange={(e) => handleCheckChange(index, e)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addCheck}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Check
                </Button>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={goToNextTab}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interest_bank_details">
            <Card>
              <CardHeader>
                <CardTitle>Interest Bank Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`interest_acount_name`}>
                        Interest Account Name
                      </Label>
                      <Input
                        id={`account_name`}
                        name="name"
                        value={bankDetails.name}
                        onChange={handlebankDetailsChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`interest_acount_number`}>
                        Interest Account Number
                      </Label>
                      <Input
                        id={`account_number`}
                        name="account_number"
                        value={bankDetails.account_number}
                        onChange={handlebankDetailsChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`bank_name`}>Bank Name</Label>
                      <Input
                        id={`bank_name`}
                        name="bank_name"
                        value={bankDetails.bank_name}
                        onChange={handlebankDetailsChange}
                        className="bangla"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`branch`}>Branch</Label>
                      <Input
                        id={`branch`}
                        name="branch"
                        value={bankDetails.branch}
                        onChange={handlebankDetailsChange}
                        className="bangla"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`branch_routing_number`}>
                        Branch Routing Number
                      </Label>
                      <Input
                        id={`branch_routing_number`}
                        name="branch_routing_number"
                        value={bankDetails.branch_routing_number}
                        onChange={handlebankDetailsChange}
                        className="bangla"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`amount`}>Amount</Label>
                      <Input
                        id={`amount`}
                        name="amount"
                        type="number"
                        value={bankDetails.amount}
                        onChange={handlebankDetailsChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Previous
                  </Button>
                  <Button type="button" onClick={goToNextTab}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nominees">
            <Card>
              <CardHeader>
                <CardTitle>Nominee Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {nominees.map((nominee, index) => (
                  <div key={index} className="p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        Nominee #{index + 1}
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeNominee(index)}
                        disabled={nominees.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`name_${index}`}>Name</Label>
                        <Input
                          id={`name_${index}`}
                          name="name"
                          value={nominee.name}
                          onChange={(e) => handleNomineeChange(index, e)}
                          className="bangla"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`fathersname_${index}`}>
                          Father&apos;s Name
                        </Label>
                        <Input
                          id={`fathersname_${index}`}
                          name="fathersname"
                          value={nominee.fathersname}
                          onChange={(e) => handleNomineeChange(index, e)}
                          className="bangla"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`age_${index}`}>Age</Label>
                        <Input
                          id={`age_${index}`}
                          name="age"
                          type="number"
                          value={nominee.age}
                          onChange={(e) => handleNomineeChange(index, e)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`nid_${index}`}>NID</Label>
                        <Input
                          id={`nid_${index}`}
                          name="nid"
                          value={nominee.nid}
                          onChange={(e) => handleNomineeChange(index, e)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`mobile_${index}`}>Mobile</Label>
                        <Input
                          id={`mobile_${index}`}
                          name="mobile"
                          value={nominee.mobile}
                          onChange={(e) => handleNomineeChange(index, e)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`relationship_${index}`}>
                          Relationship
                        </Label>
                        <Input
                          id={`relationship_${index}`}
                          name="relationship"
                          value={nominee.relationship}
                          onChange={(e) => handleNomineeChange(index, e)}
                          className="bangla"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`distributed_portion_${index}`}>
                          Distributed Portion (%)
                        </Label>
                        <Input
                          id={`distributed_portion_${index}`}
                          name="distributed_portion"
                          type="number"
                          value={nominee.distributed_portion}
                          onChange={(e) => handleNomineeChange(index, e)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addNominee}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Nominee
                </Button>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPrevTab}>
                    Previous
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Deed"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </main>
  );
}
