"use client";

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
  Witness,
} from "@/types/deed";
import { Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

export default function EditDeedPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [isLoading, setIsLoading] = useState(true);

  const [deedData, setDeedData] = useState<Partial<DeedData>>({});
  const [checks, setChecks] = useState<Partial<Check>[]>([]);
  const [bankDetails, setBankDetails] = useState<Partial<InterestBankDetails>>(
    {}
  );
  const [adi, setAdi] = useState<Partial<FirstSideRepresentative>>({});
  const [nominees, setNominees] = useState<Partial<Nominee>[]>([]);
  const [witnesses, setWitnesses] = useState<Partial<Witness>[]>([
    {
      party: "adi",
      name: "",
      fathersname: "",
      age: 0,
      addresss: "",
      nid: "",
      mobile: "",
    },
    {
      party: "adi",
      name: "",
      fathersname: "",
      age: 0,
      addresss: "",
      nid: "",
      mobile: "",
    },
    {
      party: "lander",
      name: "",
      fathersname: "",
      age: 0,
      addresss: "",
      nid: "",
      mobile: "",
    },
    {
      party: "lander",
      name: "",
      fathersname: "",
      age: 0,
      addresss: "",
      nid: "",
      mobile: "",
    },
  ]);

  useEffect(() => {
    const fetchDeedData = async () => {
      try {
        // Fetch Deed
        const { data: deed, error: deedError } = await supabase
          .from("deeds")
          .select("*")
          .eq("id", params.id)
          .single();

        if (deedError) throw deedError;
        setDeedData(deed);

        // Fetch Checks
        const { data: checksData, error: checksError } = await supabase
          .from("checks")
          .select("*")
          .eq("deed_id", params.id);
        if (!checksError) setChecks(checksData || []);

        // Fetch Nominees
        const { data: nomineesData, error: nomineesError } = await supabase
          .from("nominees")
          .select("*")
          .eq("deed_id", params.id);
        if (!nomineesError) setNominees(nomineesData || []);

        // Fetch Bank Details
        const { data: bankDetailsData, error: bankDetailsError } =
          await supabase
            .from("interest_bank_details")
            .select("*")
            .eq("deed_id", params.id)
            .single();
        if (!bankDetailsError) setBankDetails(bankDetailsData || {});

        // Fetch ADI
        const { data: adiData, error: adiError } = await supabase
          .from("first_side_representative")
          .select("*")
          .eq("deed_id", params.id)
          .single();
        if (!adiError) setAdi(adiData || {});
      } catch (error) {
        console.error("Error fetching deed:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeedData();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update Deed
      const { error: deedError } = await supabase
        .from("deeds")
        .update(deedData)
        .eq("id", params.id);
      if (deedError) throw deedError;

      // For Bank Details
      const { error: bankDetailsError } = await supabase
        .from("interest_bank_details")
        .upsert({ ...bankDetails, deed_id: params.id })
        .eq("deed_id", params.id);
      if (bankDetailsError) throw bankDetailsError;
      // For ADI Representative
      const { error: adiError } = await supabase
        .from("first_side_representative")
        .upsert({ ...adi, deed_id: params.id })
        .eq("deed_id", params.id);
      if (adiError) throw adiError;

      // Delete existing checks and insert new ones
      await supabase.from("checks").delete().eq("deed_id", params.id);
      if (checks.length > 0) {
        const { error: checksError } = await supabase
          .from("checks")
          .insert(checks.map((check) => ({ ...check, deed_id: params.id })));
        if (checksError) throw checksError;
      }

      // Delete existing nominees and insert new ones
      await supabase.from("nominees").delete().eq("deed_id", params.id);
      if (nominees.length > 0) {
        const { error: nomineesError } = await supabase
          .from("nominees")
          .insert(
            nominees.map((nominee) => ({ ...nominee, deed_id: params.id }))
          );
        if (nomineesError) throw nomineesError;
      }
      // Delete existing witnesses and insert new ones
      await supabase.from("witnesses").delete().eq("deed_id", params.id);
      if (witnesses.length > 0) {
        const { error: witnessesError } = await supabase
          .from("witnesses")
          .insert(
            witnesses.map((witness) => ({ ...witness, deed_id: params.id }))
          );
        if (witnessesError) throw witnessesError;
      }
      router.push(`/deeds/${params.id}`);
    } catch (error) {
      console.error("Error updating deed:", error);
      alert("Failed to update deed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
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
  const handleWitnessChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updated = [...witnesses];
    updated[index] = {
      ...updated[index],
      [name]: name === "age" ? Number.parseFloat(value) || 0 : value,
    };
    setWitnesses(updated);
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

  const tabs = [
    { value: "personal", label: "Personal Information" },
    { value: "address", label: "Address" },
    { value: "adi", label: "ADI Representative" },
    { value: "loan", label: "Loan Information" },
    { value: "checks", label: "Checks" },
    { value: "interest_bank_details", label: "Interest Bank Information" },
    { value: "nominees", label: "Nominees" },
    { value: "witnesses", label: "Witnesses" },
  ];

  const goToNextTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.value === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].value);
    }
  };

  const goToPrevTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.value === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].value);
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Deed</h1>
        <Link href="/">
          <Button variant="outline">Back to List</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-8">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
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
                  <Button type="button" onClick={goToNextTab}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="witnesses">
            <Card>
              <CardHeader>
                <CardTitle>Witnesses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {witnesses.map((witness, index) => (
                  <div key={index} className="p-4 border rounded-md">
                    <h3 className="text-lg font-medium mb-4">
                      Witness #{index + 1}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`w_name_${index}`}>Name</Label>
                        <Input
                          id={`w_name_${index}`}
                          name="name"
                          value={witness.name}
                          onChange={(e) => handleWitnessChange(index, e)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`w_fathersname_${index}`}>
                          Father&apos;s Name
                        </Label>
                        <Input
                          id={`w_fathersname_${index}`}
                          name="fathersname"
                          value={witness.fathersname}
                          onChange={(e) => handleWitnessChange(index, e)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`w_age_${index}`}>Age</Label>
                        <Input
                          id={`w_age_${index}`}
                          name="age"
                          type="number"
                          value={witness.age}
                          onChange={(e) => handleWitnessChange(index, e)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`w_nid_${index}`}>NID</Label>
                        <Input
                          id={`w_nid_${index}`}
                          name="nid"
                          value={witness.nid}
                          onChange={(e) => handleWitnessChange(index, e)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`w_mobile_${index}`}>Mobile</Label>
                        <Input
                          id={`w_mobile_${index}`}
                          name="mobile"
                          value={witness.mobile}
                          onChange={(e) => handleWitnessChange(index, e)}
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`w_address_${index}`}>Address</Label>
                        <Input
                          id={`w_address_${index}`}
                          name="addresss"
                          value={witness.addresss}
                          onChange={(e) => handleWitnessChange(index, e)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}

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
