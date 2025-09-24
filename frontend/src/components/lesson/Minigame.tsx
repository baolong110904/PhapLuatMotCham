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
  video?: string;
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

  const { playCorrect, playWrong, playEnding, stopAll } = useSoundEffect();
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

  // Ensure any playing sound from the sound hook stops when component unmounts or navigation occurs
  useEffect(() => {
    const onVisibility = () => {
      try {
        stopAll();
      } catch (e) {
        // ignore
      }
    };

    const onPop = () => {
      try {
        stopAll();
      } catch (e) {
        // ignore
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('popstate', onPop);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('popstate', onPop);
      try {
        stopAll();
      } catch (e) {
        // ignore
      }
    };
    // stopAll is stable from the hook (useCallback)
  }, [stopAll]);

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
  const currentQ = questions[currentQuestion];
  const mediaSrc = currentQ?.video ?? (currentQ?.img && currentQ.img[0]);
  const isImage = typeof mediaSrc === 'string' && /\.(png|jpe?g|gif|webp|svg)$/i.test(mediaSrc || '');

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
  <div className="lg:min-h-[350px] max-w-7xl w-full px-8 lg:px-20 mx-auto flex flex-col gap-y-12">
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
                {/* <p className="text-lg sm:text-2xl">{data.intro.mascot}</p> */}
                <h1 className="-mt-10 text-3xl font-bold">{data.intro.chooseScenario}</h1>

                {/* Mobile: keep original stacked buttons (no videos) */}
                <div className="flex flex-col gap-3 md:hidden">
                  {data.intro.options.map((opt) => (
                    <Button key={opt.id} onClick={() => handleChooseSituation(opt.id)}>
                      {opt.label}
                    </Button>
                  ))}
                </div>

                {/* Desktop/tablet: larger video cards full-width within their columns; videos are scaled slightly for visual padding */}
                <div className="hidden md:grid md:grid-cols-2 gap-6">
                  {data.intro.options.map((opt) => (
                    <div
                      key={opt.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleChooseSituation(opt.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleChooseSituation(opt.id)
                      }}
                      className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition"
                      aria-label={opt.label}
                    >
                      <div className="w-full h-72 md:h-72 lg:h-[520px] relative">
                        {opt.video ? (
                          <video
                            key={opt.video}
                            src={opt.video}
                            aria-label={opt.label}
                            className="absolute inset-0 w-full h-full object-cover transform scale-80"
                            playsInline
                            muted={true}
                            loop
                            autoPlay
                            preload="metadata"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100" />
                        )}
                      </div>
                      <div className="p-1 md:p-2 -mt-3 flex items-center justify-between gap-2">
                        <div className="text-left">
                          <div className="text-sm md:text-2xl lg:text-3xl font-semibold text-gray-800">{opt.label}</div>
                        </div>
                      </div>
                    </div>
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
                {/* If the question has a video, show two-column layout on md+ */}
                {(mediaSrc) ? (
                  <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    <div className="md:col-span-5">
                      <div className="w-full h-full md:h-[460px] rounded-lg overflow-hidden bg-black flex items-center justify-center">
                        {isImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={String(mediaSrc)} alt={`Image for question ${currentQ?.id ?? ''}`} className="w-full h-full object-cover" />
                        ) : (
                          <video
                            key={String(mediaSrc)}
                            src={String(mediaSrc)}
                            aria-label={`Video for question ${currentQ?.id ?? ''}`}
                            className="w-full h-full object-cover"
                            playsInline
                            muted={true}
                            loop
                            autoPlay
                          />
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-7 flex flex-col gap-4">
                      <h1 className="text-2xl font-bold">{questions[currentQuestion].question}</h1>
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
                    </div>
                  </div>
                ) : (
                  // Fallback: original single-column layout for mobile and questions without video
                  <>
                    <h1 className="text-2xl font-bold">{questions[currentQuestion].question}</h1>
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
                  </>
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
                <Button
                  className="mt-10"
                  onClick={() => {
                    try {
                      stopAll();
                    } catch (e) {
                      // ignore
                    }
                    router.push("/");
                  }}
                >
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
