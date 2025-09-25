"use client"

import QuizBox from "@/components/Lesson/QuizBox";

const quizList = [
  { quizName: "Thủ tục cấp lại CCCD", img: "/assets/cic.png", route: "/quiz/cic" },
  { quizName: "Thủ tục nhận lương hưu", img: "/assets/pension.png", route: "/quiz/pension" },
];

export default function QuizPage() {
  return (
    <div className="min-h-[600px]">
    <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
      {quizList.map((quiz, index) => (
        <QuizBox
          key={index}
          quizName={quiz.quizName}
          img={quiz.img}
          route={quiz.route}
        />
      ))}
    </div>
    </div>
  );
}