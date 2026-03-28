import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function SurveyQuestions({
  questions,
  answers,
  onChange
}: SurveyQuestionsProps) {

  const handleCheckboxChange = (qid: string, value: string) => {
    const current = answers[qid] || []

    if (current.includes(value)) {
      onChange(qid, current.filter((v: string) => v !== value))
    } else {
      onChange(qid, [...current, value])
    }
  }

  return (
    <div className="space-y-6">

      {questions.map((q, i) => (
        <div key={q.id} className="space-y-3 border rounded-lg p-4">

          <p className="font-medium">
            {i + 1}. {q.text}
          </p>

          {/* SHORT TEXT */}
          {/*{q.type === "text" && (
            <Input
              value={answers[q.id] || ""}
              onChange={(e) => onChange(q.id, e.target.value)}
              placeholder="Your answer"
            />
          )}*/}

          {/* LONG TEXT */}
          {q.type === "text" && (
            <Textarea
              value={answers[q.id] || ""}
              onChange={(e) => onChange(q.id, e.target.value)}
              placeholder="Write your answer..."
            />
          )}

          {/* SINGLE CHOICE */}
          {q.type === "single_choice" && (
            <>
              {console.log(q.options)}
              <div className="space-y-2">
                {q.options?.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === opt.value}
                      onChange={() => onChange(q.id, opt.value)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {/* MULTIPLE CHOICE (CHECKBOX) */}
          {q.type === "multiple_choice" && (
            <div className="space-y-2">

              {q.options?.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(answers[q.id] || []).includes(opt.value)}
                    onChange={() => handleCheckboxChange(q.id, opt.value)}
                  />

                  <span>{opt.label}</span>
                </label>
              ))}

            </div>
          )}

          {/* RATING */}
          {q.type === "rating" && (
            <div className="flex gap-2">

              {[1,2,3,4,5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className={`px-3 py-1 rounded border ${
                    answers[q.id] === rating
                      ? "bg-primary text-white"
                      : "bg-secondary"
                  }`}
                  onClick={() => onChange(q.id, rating)}
                >
                  {rating}
                </button>
              ))}

            </div>
          )}

        </div>
      ))}

    </div>
  )
}