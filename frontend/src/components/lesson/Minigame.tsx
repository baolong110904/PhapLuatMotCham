"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { Header } from "@/components/lesson/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/lesson/Card";
import { useSoundEffect } from "@/components/lesson/SoundEffects";
import Badge from "./Badge";
import Firework from "@/components/lesson/Fireworks";
import CicIntro from "./CicIntro";

type GameIntro = {
  mascot: string;
  chooseScenario: string;
  options: { label: string; id: string; video?: string }[];
};

type GameQuestion = {
  id: number;
  img?: string[];
  question: string;
  options: { label: string; correct: boolean }[];
  feedback: { correct: string; wrong?: string };
};

type GameData = {
  type: string;
  intro: GameIntro;
  situations?: Record<string, { description: string; mascot: string }>; // only in CIC
  questions: GameQuestion[] | Record<string, GameQuestion[]>; // CIC: array, PENSION: object
  ending: string;
};

type Props = { data: GameData; hideHeader?: boolean; triggerUiIntro?: boolean };

export default function Minigame({ data, hideHeader = false, triggerUiIntro }: Props) {

  const [stage, setStage] = useState<
    "intro" | "introJson" | "situation" | "questions" | "ending"
  >("intro");
  const [cicIntroPlayed, setCicIntroPlayed] = useState(false);
  const [uiIntroPlayed, setUiIntroPlayed] = useState(false); // cic or pension UI intro (video + bubble)
  const searchParams = useSearchParams();
  const skipIntro = searchParams?.get('skipIntro') === '1';
  const [situation, setSituation] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [percentage, setPercentage] = useState(0);

  const { playCorrect, playWrong, playEnding } = useSoundEffect();
  const router = useRouter();

  // When parent signals that the UI intro finished, move to JSON intro stage
  useEffect(() => {
    if (triggerUiIntro) {
      setUiIntroPlayed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerUiIntro]);

  useEffect(() => {
    if (uiIntroPlayed) {
      setStage('introJson');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiIntroPlayed]);

  function getQuestions(): GameQuestion[] {
    if (data.type === "cic") {
      // cic
      return data.questions as GameQuestion[];
    }
    if (data.type === "pension" && situation) {
      return (
        (data.questions as Record<string, GameQuestion[]>)[situation] || []
      );
    }
    return [];
  }

  const questions = getQuestions();
  const totalQuestions = questions.length;

  const handleChooseSituation = (id: string) => {
    setSituation(id);
    // after user selects an option from the JSON intro, go to situation page if available
    if (data.situations) {
      setStage("situation");
    } else {
      setStage("questions");
    }
  };

  const handleAnswer = (correct: boolean, feedbackStr: string, idx: number) => {
    setSelectedOption(idx);
    setFeedback(feedbackStr);
    if (correct) {
      setScore((s) => s + 1);
      playCorrect();
    } else {
      playWrong();
    }
  };

  const handleNext = () => {
    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion((cur) => cur + 1);
      setFeedback(null);
      setStage("questions");
    } else {
      setStage("ending");
      playEnding();
    }
    setPercentage(Math.round(((currentQuestion + 1) / totalQuestions) * 100));
  };

  const variants = {
    hidden: { opacity: 0, x: 50 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div>
  {/* Hide Header/Badge while CIC intro is active, or when hideHeader is set by parent */}
  {!hideHeader && !(stage === "intro" && data.type === "cic") && <Header percentage={percentage} />}
  {!hideHeader && !(stage === "intro" && data.type === "cic") && <Badge score={score} />}
      <div className={`flex-1 ${stage === "intro" && data.type === "cic" ? 'mt-12' : 'mt-20'} flex items-center justify-center`}>
        <div className="lg:min-h-[350px] lg:w-[750px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
          <AnimatePresence mode="wait">
            {stage === "intro" && data.type === "cic" && !cicIntroPlayed && !skipIntro ? (
              <motion.div
                key="intro-cic"
                variants={variants}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-y-6"
              >
                <CicIntro
                  onStart={() => {
                    setCicIntroPlayed(true);
                    if (data.type === "cic") setStage("questions");
                    // pension handled by parent page — do not show pension intro here
                  }}
                />
              </motion.div>
            ) : null}
            {/* For pension: if coming into Minigame directly ensure we select the first scenario and show questions immediately */}
            {stage === "situation" && situation && data.situations && (
              <motion.div
                key="situation"
                variants={variants}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-y-6"
              >
                <p className="text-lg sm:text-2xl">
                  {data.situations[situation].description}
                </p>
                <p className="italic font-bold text-lg sm:text-2xl">
                  {data.situations[situation].mascot}
                </p>
                <div className="flex justify-between">
                  <Button
                    onClick={() => {
                      setSituation(null);
                      setStage("intro");
                    }}
                  >
                    Quay lại
                  </Button>
                  <Button onClick={() => setStage("questions")}>
                    Bắt đầu trả lời
                  </Button>
                </div>
              </motion.div>
            )}

            {stage === "introJson" && (data.intro) && (
              <motion.div
                key="intro-json"
                variants={variants}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-y-6"
              >
                <p className="text-lg sm:text-2xl">{data.intro.mascot}</p>
                <h1 className="text-2xl font-bold">{data.intro.chooseScenario}</h1>
                <div className="flex flex-col gap-3">
                  {data.intro.options.map((opt) => (
                    <Button
                      key={opt.id}
                      onClick={() => handleChooseSituation(opt.id)}
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            {stage === "questions" && questions[currentQuestion] && (
              <motion.div
                key={`q-${currentQuestion}`}
                variants={variants}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-y-6"
              >
                <h1 className="text-2xl font-bold">
                  {questions[currentQuestion].question}
                </h1>
                <div className="flex flex-col gap-3">
                  {feedback === null
                    ? questions[currentQuestion].options.map((opt, idx) => (
                        <Card
                          key={idx}
                          id={idx}
                          imageSrc={null}
                          text={opt.label}
                          onClick={() =>
                            handleAnswer(
                              opt.correct,
                              opt.correct
                                ? questions[currentQuestion].feedback.correct
                                : questions[currentQuestion].feedback.wrong ??
                                    "",
                              idx
                            )
                          }
                          disabled={false}
                          status="none"
                        />
                      ))
                    : questions[currentQuestion].options.map((opt, idx) => {
                        let status: "correct" | "wrong" | "none" = "none";
                        if (opt.correct) status = "correct";
                        else if (selectedOption === idx) {
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
                      })}
                </div>

                {feedback && (
                  <div className="mt-2">
                    <motion.div
                      key={`q-${currentQuestion}`}
                      variants={variants}
                      initial="hidden"
                      animate="enter"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="flex gap-5 items-center justify-between w-full"
                    >
                      <p className="italic font-bold">{feedback}</p>
                    </motion.div>
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
              </motion.div>
            )}

            {stage === "ending" && (
              <motion.div
                key="ending"
                variants={variants}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="text-center mt-20"
              >
                <Firework active={stage === "ending"} duration={30000} />
                <h1 className="text-3xl font-bold">🎉 Hoàn thành!</h1>
                <p className="mt-10 text-2xl">{data.ending}</p>
                <Button className="mt-10" onClick={() => router.push("/")}>
                  Quay về trang chủ
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
