"use client";

import { useState } from "react";
import { Policy } from "@/types/policy";
import PolicyCard from "./PolicyCard";
import PolicyModal from "./PolicyModal";

interface PolicyListProps {
  policies: Policy[];
}

export default function PolicyList({ policies }: PolicyListProps) {
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  return (
    <>
      <div className="space-y-3">
        {policies.map((policy) => (
          <PolicyCard
            key={policy.id}
            policy={policy}
            onClick={() => setSelectedPolicy(policy)}
          />
        ))}
      </div>

      {selectedPolicy && (
        <PolicyModal
          policy={selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
        />
      )}
    </>
  );
}
