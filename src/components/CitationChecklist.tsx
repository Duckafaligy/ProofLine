import { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, ClipboardCheck } from 'lucide-react';
import type { CitationChecklistItem } from '../data/claims';

interface CitationChecklistProps {
  claimId: string;
  items: CitationChecklistItem[];
  checkedIds: Record<string, boolean>;
  onToggleItem: (itemId: string) => void;
}

export function CitationChecklist({
  items,
  checkedIds,
  onToggleItem,
}: CitationChecklistProps) {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id ?? null);

  const completedCount = items.filter((item) => Boolean(checkedIds[item.id])).length;
  const allComplete = completedCount === items.length && items.length > 0;

  return (
    <section
      aria-label="3 Questions Before You Cite This"
      className="hairline-card rounded-xl border border-white/[0.08] bg-[#13151A] p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] pb-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#10B981]/15 text-[#10B981]">
            <ClipboardCheck className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#F8FAFC]">
              3 Questions Before You Cite This
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Student verification audit before quoting this study in a paper
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono-tabular text-xs font-semibold ${
            allComplete
              ? 'border-[#10B981]/30 bg-[#10B981]/15 text-[#10B981]'
              : 'border-white/[0.1] bg-[#1C1F26] text-[#94A3B8]'
          }`}
        >
          {allComplete && <CheckCircle2 className="h-3.5 w-3.5" />}
          {completedCount}/{items.length} Audited
        </span>
      </div>

      <div className="mt-3.5 space-y-2.5">
        {items.map((item, idx) => {
          const isChecked = Boolean(checkedIds[item.id]);
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-lg border transition-colors ${
                isChecked
                  ? 'border-[#10B981]/35 bg-[#10B981]/[0.05]'
                  : 'border-white/[0.07] bg-[#1C1F26]'
              }`}
            >
              <div className="flex items-start gap-3 p-3">
                <input
                  id={`check-${item.id}`}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleItem(item.id)}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-white/20 bg-[#0B0C0E] accent-[#10B981]"
                />
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor={`check-${item.id}`}
                    className="block cursor-pointer text-sm font-medium text-[#F8FAFC]"
                  >
                    <span className="mr-1.5 font-mono-tabular text-xs text-[#94A3B8]">
                      0{idx + 1}.
                    </span>
                    {item.question}
                  </label>
                  <p className="mt-0.5 text-xs text-[#94A3B8]">{item.hint}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : item.id)
                  }
                  aria-expanded={isExpanded}
                  className="inline-flex shrink-0 items-center gap-1 rounded-md border border-white/[0.08] bg-[#13151A] px-2 py-1 text-[11px] font-medium text-[#94A3B8] hover:text-[#F8FAFC]"
                >
                  Evidence
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>
              </div>

              {isExpanded && (
                <div className="border-t border-white/[0.06] bg-[#0B0C0E]/60 px-3 py-2.5 text-xs leading-relaxed text-[#CBD5E1]">
                  <span className="mr-1.5 font-semibold text-[#10B981]">
                    Audit Finding:
                  </span>
                  {item.evidenceAnswer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
