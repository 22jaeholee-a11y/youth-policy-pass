"use client";

import { useState } from "react";
import { Policy } from "@/types/policy";
import { HousingNotice, ResultItem } from "@/types/housing";
import PolicyCard from "./PolicyCard";
import PolicyModal from "./PolicyModal";
import HousingCard from "./HousingCard";
import HousingModal from "./HousingModal";

interface PolicyListProps {
  items: ResultItem[];
}

export default function PolicyList({ items }: PolicyListProps) {
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<HousingNotice | null>(null);

  return (
    <>
      <div className="space-y-3">
        {items.map((item) => {
          if (item.type === "policy") {
            return (
              <PolicyCard
                key={`policy-${item.data.id}`}
                policy={item.data}
                onClick={() => setSelectedPolicy(item.data)}
              />
            );
          }
          return (
            <HousingCard
              key={`housing-${item.data.provider}-${item.data.notice_id}`}
              notice={item.data}
              onClick={() => setSelectedNotice(item.data)}
            />
          );
        })}
      </div>

      {selectedPolicy && (
        <PolicyModal
          policy={selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
        />
      )}

      {selectedNotice && (
        <HousingModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}
    </>
  );
}
