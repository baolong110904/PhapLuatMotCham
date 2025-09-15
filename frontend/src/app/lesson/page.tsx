"use client";

import { useState } from "react";
import { Header } from "@/components/lesson/header";
import { Button } from "@/components/ui/button";
import gameData from "@/mock/minigame1.json";
import { Card } from "@/components/lesson/card";

export default function LessonPage() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [situation, setSituation] = useState<
    keyof typeof gameData.situations | null
  >();
  const [stage, setStage] = useState<
    "intro" | "situation" | "questions" | "ending"
  >("intro");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [percentage, setPercentage] = useState(0);

  const totalQuestions = gameData.questions.length;

  const handleChooseSituation = (id: keyof typeof gameData.situations) => {
    setSituation(id);
    setStage("situation");
  };

  const handleAnswer = (correct: boolean, feedbackStr: string, idx: number) => {
    setSelectedOption(idx);
    setFeedback(feedbackStr);
    if (correct) {
      setScore(score + 1);
      console.log(percentage);
    }
  };
  const handleNext = () => {
    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion((cur) => cur + 1);
      setFeedback(null);
      setStage("questions");
    } else {
      setStage("ending");
    }
    setPercentage(Math.round(((currentQuestion + 1) / totalQuestions) * 100));
  };

  return (
    <div>
      <Header percentage={percentage} />

      <div className="flex-1 mt-20">
        <div className="items-center justify-center h-full flex">
          <div className="lg:min-h-[350px] lg:w-[650px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            {stage === "intro" && (
              <>
                <p className="text-lg">{gameData.intro.mascot}</p>
                <h1 className="text-xl font-bold">
                  {gameData.intro.chooseScenario}
                </h1>
                <div className="flex flex-col gap-3">
                  {gameData.intro.options.map((opt) => (
                    <Button
                      key={opt.id}
                      onClick={() =>
                        handleChooseSituation(opt.id as "expired" | "lost")
                      }
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </>
            )}
            {stage === "situation" && situation && (
              <>
                <p className="text-lg">
                  {gameData.situations[situation].description}
                </p>
                <p className="italic">
                  {gameData.situations[situation].mascot}
                </p>
                <Button onClick={() => setStage("questions")}>
                  Bắt đầu trả lời
                </Button>
              </>
            )}

            {stage === "questions" && (
              <>
                <h1 className="text-xl font-bold">
                  {gameData.questions[currentQuestion].question}
                </h1>

                <div className="flex flex-col gap-3">
                  {feedback === null
                    ? gameData.questions[currentQuestion].options.map(
                        (opt, idx) => (
                          <Card
                            key={idx}
                            id={idx}
                            imageSrc={null}
                            text={opt.label}
                            onClick={() =>
                              handleAnswer(
                                opt.correct,
                                opt.correct
                                  ? gameData.questions[currentQuestion].feedback
                                      .correct
                                  : gameData.questions[currentQuestion].feedback
                                      .wrong,
                                idx
                              )
                            }
                            disabled={false}
                            status="none"
                          />
                        )
                      )
                    : gameData.questions[currentQuestion].options.map(
                        (opt, idx) => {
                          let status: "correct" | "wrong" | "none" = "none";
                          if (opt.correct) {
                            status = "correct";
                          } else if (selectedOption === idx) {
                            status = "wrong";
                          }
                          return (
                            <Card
                              key={idx}
                              id={idx}
                              imageSrc={null}
                              text={opt.label}
                              onClick={() => {}}
                              disabled
                              status={status}
                            />
                          );
                        }
                      )}
                </div>

                {feedback && (
                  <div className="mt-2">
                    <p className="mb-10">{feedback}</p>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => {
                          setSelectedOption(null);
                          handleNext();
                        }}
                      >
                        Tiếp tục
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {stage === "ending" && (
              <div className="text-center">
                <h1 className=" text-2xl font-bold">🎉 Hoàn thành!</h1>
                <p>Ông bà đã hoàn thành hành trình công dân.</p>
              </div>
            )}
            {/* <h1 className="text-2xl lg:text-3xl text-center font-bold text-neutral-700">
              test
            </h1> */}
          </div>
        </div>
      </div>
    </div>
  );
}
