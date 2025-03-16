"use client";

import type { DeedWithRelations } from "@/types/deed";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";


interface DeedPdfPreviewProps {
  deed: DeedWithRelations;
}

export default function DeedPdfPreview({ deed }: DeedPdfPreviewProps) {
  console.log("Deed:", deed);
  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-4 mb-4">
        <Button variant="outline">Generate PDF</Button>

        <Button>Download PDF</Button>
      </div>

      <Card className="flex flex-col items-center justify-center h-[600px] p-6 text-center">
        <p className="text-lg mb-4">
          Click &quot;Generate PDF&quot; to preview the deed document
        </p>
        <Button size="lg">Generate PDF</Button>
      </Card>
    </div>
  );
}
