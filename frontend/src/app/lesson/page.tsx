"use client";

import { useState } from "react";
import { Header } from "@/components/lesson/header";
import { Button } from "@/components/ui/button";
import gameData from "@/mock/minigame1.json";
import { Card } from "@/components/lesson/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
  const router = useRouter();

  const handleChooseSituation = (id: keyof typeof gameData.situations) => {
    setSituation(id);
    setStage("situation");
  };

  const handleAnswer = (correct: boolean, feedbackStr: string, idx: number) => {
    setSelectedOption(idx);
    setFeedback(feedbackStr);
    if (correct) {
      setScore(score + 1);
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

  // Animation variants
  const variants = {
    hidden: { opacity: 0, x: 50 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div>
      <Header percentage={percentage} />

      <div className="flex-1 mt-20">
        <div className="items-center justify-center h-full flex">
          <div className="lg:min-h-[350px] lg:w-[750px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <AnimatePresence mode="wait">
              {stage === "intro" && (
                <motion.div
                  key="intro"
                  variants={variants}
                  initial="hidden"
                  animate="enter"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-y-6"
                >
                  <motion.div
                    key="intro"
                    variants={variants}
                    initial="hidden"
                    animate="enter"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between w-full"
                  >
                    <p className="text-lg sm:text-2xl">
                      {gameData.intro.mascot}
                    </p>
                    <Image
                      src="/assets/greeting.svg"
                      alt="greeting"
                      width={120}
                      height={120}
                      draggable={false}
                      className="sm:w-[120px] sm:h-[120px] w-[100px] h-[100px]"
                    />
                  </motion.div>
                  <h1 className="text-2xl font-bold">
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
                </motion.div>
              )}

              {stage === "situation" && situation && (
                <motion.div
                  key="situation"
                  variants={variants}
                  initial="hidden"
                  animate="enter"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-y-6"
                >
                  <motion.div
                    key="situation"
                    variants={variants}
                    initial="hidden"
                    animate="enter"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="flex gap-5 items-center justify-between w-full"
                  >
                    <Image
                      src="/assets/old_man.svg"
                      alt="greeting"
                      width={120}
                      height={120}
                      draggable={false}
                      className="sm:w-[120px] sm:h-[120px] w-[100px] h-[100px]"
                    />
                    <p className="text-lg sm:text-2xl">
                      {gameData.situations[situation].description}
                    </p>
                  </motion.div>

                  <div className="flex gap-1 items-center justify-between w-full">
                    <p className="italic font-bold text-lg sm:text-2xl">
                      {gameData.situations[situation].mascot}
                    </p>
                    <Image
                      src="/assets/help.svg"
                      alt="greeting"
                      width={120}
                      height={120}
                      draggable={false}
                      className="sm:w-[120px] sm:h-[120px] w-[100px] h-[100px]"
                    />
                  </div>

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

              {stage === "questions" && (
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
                                    ? gameData.questions[currentQuestion]
                                        .feedback.correct
                                    : gameData.questions[currentQuestion]
                                        .feedback.wrong,
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
                      <motion.div
                        key={`q-${currentQuestion}`}
                        variants={variants}
                        initial="hidden"
                        animate="enter"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        className="flex gap-5 items-center justify-between w-full"
                      >
                        <Image
                          src={
                            selectedOption !== null &&
                            gameData.questions[currentQuestion].options[
                              selectedOption
                            ].correct === true
                              ? "/assets/celebrating.svg"
                              : "/assets/sad.svg"
                          }
                          alt="greeting"
                          width={120}
                          height={120}
                          draggable={false}
                          className="sm:w-[120px] sm:h-[120px] w-[100px] h-[100px]"
                        />
                        <p className="mb-10 text-lg italic font-bold">
                          {feedback}
                        </p>
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
                  className="text-center mt-30"
                >
                  <h1 className=" text-2xl font-bold">🎉 Hoàn thành!</h1>
                  <p>Ông bà đã hoàn thành hành trình công dân.</p>
                  <div className="mt-30">
                    <Button
                      onClick={() => {
                        router.push("/home");
                      }}
                    >
                      Quay về trang chủ
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}