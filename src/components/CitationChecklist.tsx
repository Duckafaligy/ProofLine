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
      className="hairline-card rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-5">
        <div>
          <h2 className="text-lg font-bold tracking-[-0.02em] text-zinc-950">
            3 Questions Before You Cite This
          </h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            Student verification audit before quoting this study in a paper
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono-tabular text-xs font-semibold ${
            allComplete
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-zinc-200 bg-zinc-50 text-zinc-600'
          }`}
        >
          {allComplete && <CheckCircle2 className="h-3.5 w-3.5" />}
          {completedCount}/{items.length} Audited
        </span>
      </div>

      <div className="mt-5 divide-y divide-zinc-200">
        {items.map((item, idx) => {
          const isChecked = Boolean(checkedIds[item.id]);
          const isExpanded = expandedId === item.id;

          return (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3.5">
                <input
                  id={`check-${item.id}`}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggleItem(item.id)}
                  className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-zinc-300 accent-zinc-950"
                />
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor={`check-${item.id}`}
                    className={`block cursor-pointer text-sm font-semibold ${
                      isChecked ? 'text-zinc-400 line-through' : 'text-zinc-950'
                    }`}
                  >
                    <span className="mr-2 font-mono-tabular text-xs text-zinc-400">
                      0{idx + 1}.
                    </span>
                    {item.question}
                  </label>
                  <p className="mt-1 text-xs text-zinc-500">{item.hint}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  aria-expanded={isExpanded}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 hover:border-zinc-400 hover:text-zinc-950"
                >
                  Evidence
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-3 ml-7 rounded-lg bg-zinc-50 p-3.5 text-xs leading-relaxed text-zinc-700">
                  <span className="mr-1.5 font-semibold text-zinc-950">Audit Finding:</span>
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
