"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import Image from "next/image";
import { useSoundEffect } from "./SoundEffects";

// badges
const badges = [
  { id: 1, threshold: 2, image: "/assets/badge_1.png" },
  { id: 2, threshold: 4, image: "/assets/badge_2.png" },
  { id: 3, threshold: 6, image: "/assets/badge_3.png" },
];

type Props = {
  score: number;
};

export default function Badge({ score }: Props) {
  const [earnedBadges, setEarnedBadges] = useState<number[]>([]);
  const [newBadge, setNewBadge] = useState<number | null>(null);
  const [targetPosition, setTargetPosition] = useState<{ x: number; y: number } | null>(null);
  const [flyStart, setFlyStart] = useState(false);
  const {playReward} = useSoundEffect();

  const badgeBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unlocked = badges.find(
      (b) => score >= b.threshold && !earnedBadges.includes(b.id)
    );
    if (unlocked) {
      setNewBadge(unlocked.id);
      setFlyStart(false);
      playReward();
    }
  }, [score, earnedBadges]);

  // Calculate target position for flying badge
  useEffect(() => {
    if (newBadge && badgeBarRef.current) {
      const slot = badgeBarRef.current.querySelector(`[data-badge-slot="${newBadge}"]`) as HTMLElement;
      if (slot) {
        const rect = slot.getBoundingClientRect();
        setTargetPosition({
          x: rect.left + rect.width / 2 + window.scrollX - window.innerWidth / 2,
          y: rect.top + rect.height / 2 + window.scrollY - window.innerHeight / 2,
        });
      }
    }
  }, [newBadge]);

  return (
    <div className="w-full">
      {/* Badge display bar */}
      <div ref={badgeBarRef} className="flex gap-4 justify-center mt-4">
        {badges.map((b) => (
          <div
            key={b.id}
            data-badge-slot={b.id}
            className="w-20 h-20 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center"
          >
            {earnedBadges.includes(b.id) && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={b.image}
                  alt={`Badge ${b.id}`}
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Celebration Overlay */}
      <AnimatePresence>
        {newBadge && targetPosition && (
          <motion.div
            className="fixed inset-0  bg-opacity-70 z-50 pointer-events-none flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Pop-in badge */}
            {!flyStart && (
              <motion.div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  translateX: "-50%",
                  translateY: "-50%",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.6, opacity: 1 }}
                transition={{ duration: 1.2 }}
                onAnimationComplete={() => {
                  // After pop-in duration, start flying
                  setFlyStart(true);
                }}
              >
                <Image
                  src={badges.find((b) => b.id === newBadge)!.image}
                  alt={`Badge ${newBadge}`}
                  width={240}
                  height={240}
                  className="rounded-full shadow-xl"
                />
              </motion.div>
            )}

            {/* Flying badge */}
            {flyStart && (
              <motion.div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  translateX: "-50%",
                  translateY: "-50%",
                }}
                initial={{ x: 0, y: 0, scale: 1.5, opacity: 1 }}
                animate={{
                  x: targetPosition.x,
                  y: targetPosition.y,
                  scale: 0.6,
                  opacity: 0,
                }}
                transition={{ duration: 0.6, ease: easeInOut }}
                onAnimationComplete={() => {
                  // Add to earned badges
                  setEarnedBadges((prev) => [...prev, newBadge]);
                  setNewBadge(null);
                  setTargetPosition(null);
                  setFlyStart(false);
                }}
              >
                <Image
                  src={badges.find((b) => b.id === newBadge)!.image}
                  alt={`Badge ${newBadge}`}
                  width={160}
                  height={160}
                  className="rounded-full shadow-xl"
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
