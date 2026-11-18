import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Star } from 'lucide-react';
import ProfileCard from './ProfileCard';

export default function SwipeCard({
  profile,
  isFront,
  onSwipe,
  onOpenDetail,
  disabled = false
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Rotation proportional to horizontal drag
  const rotate = useTransform(x, [-260, 0, 260], [-16, 0, 16]);

  // Stamp opacities
  const likeOpacity = useTransform(x, [25, 120], [0, 1]);
  const passOpacity = useTransform(x, [-25, -120], [0, 1]);
  const superLikeOpacity = useTransform(y, [-30, -120], [0, 1]);

  // Subtle card scale during drag
  const scale = useTransform(x, [-220, 0, 220], [0.97, 1, 0.97]);

  const handleDragEnd = (event, info) => {
    if (disabled) return;
    const threshold = 110;
    const velocityX = info.velocity.x;
    const velocityY = info.velocity.y;

    // Check Super Like swipe up
    if (info.offset.y < -130 || velocityY < -500) {
      onSwipe('superlike', profile);
      return;
    }

    // Check Right Swipe (Like)
    if (info.offset.x > threshold || velocityX > 400) {
      onSwipe('like', profile);
    }
    // Check Left Swipe (Pass)
    else if (info.offset.x < -threshold || velocityX < -400) {
      onSwipe('pass', profile);
    }
  };

  return (
    <motion.div
      style={{
        x: isFront ? x : 0,
        y: isFront ? y : 0,
        rotate: isFront ? rotate : 0,
        scale: isFront ? scale : 0.95,
        zIndex: isFront ? 30 : 20,
      }}
      drag={isFront && !disabled ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.85}
      onDragEnd={handleDragEnd}
      animate={!isFront ? { scale: 0.94, y: 12, opacity: 0.85 } : { opacity: 1 }}
      transition={{ type: 'spring', damping: 22, stiffness: 240 }}
      className={`absolute inset-0 w-full h-full ${
        isFront ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
    >
      <ProfileCard profile={profile} onOpenDetail={onOpenDetail} />

      {/* Real-time Visual Stamps during Drag */}
      {isFront && (
        <>
          {/* LIKE STAMP (Emerald) */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-16 left-6 z-30 pointer-events-none transform -rotate-12 px-4 py-1.5 rounded-2xl stamp-like shadow-lg"
          >
            <div className="flex items-center gap-1.5">
              <Heart className="w-6 h-6 fill-emerald-600 stroke-emerald-600" />
              <span className="text-2xl font-black tracking-wider uppercase">
                LIKE
              </span>
            </div>
          </motion.div>

          {/* PASS STAMP (Crimson) */}
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-16 right-6 z-30 pointer-events-none transform rotate-12 px-4 py-1.5 rounded-2xl stamp-pass shadow-lg"
          >
            <div className="flex items-center gap-1.5">
              <X className="w-6 h-6 stroke-[3]" />
              <span className="text-2xl font-black tracking-wider uppercase">
                PASS
              </span>
            </div>
          </motion.div>

          {/* SUPER LIKE STAMP (Gold) */}
          <motion.div
            style={{ opacity: superLikeOpacity }}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-4 py-1.5 rounded-2xl stamp-superlike shadow-lg"
          >
            <div className="flex items-center gap-1.5">
              <Star className="w-6 h-6 fill-amber-500 stroke-amber-500" />
              <span className="text-xl font-black tracking-wider uppercase">
                SUPER LIKE
              </span>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
