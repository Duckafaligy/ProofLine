import { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import type { CitationChecklistItem } from '../data/claims';

interface CitationChecklistProps {
  claimId: string;
  items: CitationChecklistItem[];
  checkedIds: Record<string, boolean>;
  onToggleItem: (itemId: string) => void;
}

export function CitationChecklist({
  claimId,
  items,
  checkedIds,
  onToggleItem,
}: CitationChecklistProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    items[0]?.id ?? null
  );

  const completedCount = items.filter((item) =>
    Boolean(checkedIds[item.id])
  ).length;
  const allComplete = completedCount === items.length && items.length > 0;

  return (
    <section
      aria-labelledby={`checklist-heading-${claimId}`}
      className="hairline-card rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-6">
        <div className="min-w-0">
          <h2
            id={`checklist-heading-${claimId}`}
            className="text-balance text-lg font-bold tracking-[-0.02em] text-zinc-950"
          >
            3 Questions Before You Cite This
          </h2>
          <p className="mt-1 text-pretty text-sm text-zinc-600">
            Student verification audit before quoting this study in a paper
          </p>
        </div>

        <span
          role="status"
          aria-live="polite"
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 font-mono-tabular text-xs font-semibold ${
            allComplete
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-zinc-200 bg-zinc-50 text-zinc-700'
          }`}
        >
          {allComplete && (
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          )}
          {completedCount}/{items.length} Audited
        </span>
      </div>

      {items.length === 0 ? (
        <p className="mt-5 text-sm text-zinc-600">
          No citation checklist items available for this claim.
        </p>
      ) : (
        <div className="mt-6 divide-y divide-zinc-200">
          {items.map((item, idx) => {
            const isChecked = Boolean(checkedIds[item.id]);
            const isExpanded = expandedId === item.id;
            const inputId = `check-${claimId}-${item.id}`;
            const panelId = `evidence-${claimId}-${item.id}`;

            return (
              <div key={item.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <label
                    htmlFor={inputId}
                    className="-m-1.5 flex min-w-0 flex-1 cursor-pointer items-start gap-3.5 rounded-lg p-1.5 transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-zinc-50"
                  >
                    <input
                      id={inputId}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleItem(item.id)}
                      className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-zinc-300 accent-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-semibold leading-snug ${
                          isChecked
                            ? 'text-zinc-500 line-through'
                            : 'text-zinc-950'
                        }`}
                      >
                        <span className="mr-2 font-mono-tabular text-xs text-zinc-500">
                          0{idx + 1}.
                        </span>
                        {item.question}
                      </span>
                      <span className="mt-1.5 block text-xs leading-relaxed text-zinc-600">
                        {item.hint}
                      </span>
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : item.id)
                    }
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    aria-label={`${isExpanded ? 'Hide' : 'Show'} evidence for question ${idx + 1}`}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-zinc-400 hover:text-zinc-950 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
                  >
                    Evidence
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div
                    id={panelId}
                    className="mt-4 ml-7 rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-4 text-[13px] leading-relaxed text-zinc-700"
                  >
                    <span className="mr-1.5 font-semibold text-zinc-950">
                      Audit Finding:
                    </span>
                    {item.evidenceAnswer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
