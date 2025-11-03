import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

function getTimeParts(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

function pad(n) {
  return n.toString().padStart(2, "0");
}

export default function BirthdayCountdown() {
  const offsetHours = 3; // UTC+3 for Saudi Arabia
  const defaultTarget = useMemo(() => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const saudiNow = new Date(utc + 3600000 * offsetHours);
    const target = new Date(saudiNow);
    target.setHours(24, 0, 0, 0); // midnight target
    return target;
  }, []);

  const [target, setTarget] = useState(defaultTarget);
  const [now, setNow] = useState(() => new Date());
  const hasCelebratedRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    confetti({ particleCount: 100, spread: 60, startVelocity: 40, scalar: 0.9, origin: { y: 0.6 } });
  }, []);

  useEffect(() => {
    const remaining = target.getTime() - now.getTime();
    if (remaining <= 0 && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      (function frame() {
        confetti({
          particleCount: 7,
          startVelocity: 40,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 }
        });
        if (Date.now() < animationEnd) requestAnimationFrame(frame);
      })();
    }
  }, [now, target]);

  const remainingMs = target.getTime() - now.getTime();
  const hasEnded = remainingMs <= 0;
  const parts = getTimeParts(Math.abs(remainingMs));

  function burstConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 7,
        startVelocity: 40,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
      if (Date.now() < animationEnd) requestAnimationFrame(frame);
    })();
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-rose-50 to-fuchsia-100 text-slate-800 flex flex-col items-center justify-center p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="rounded-3xl bg-white/70 backdrop-blur-md shadow-xl border border-pink-200 p-6 sm:p-10 text-center max-w-3xl w-full">
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
          <div className="relative">
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-tr from-fuchsia-300 to-pink-300 grid place-items-center shadow-md">
              <span className="text-4xl">🎉</span>
            </div>
            <span className="absolute -bottom-2 -right-2 text-2xl">🎂</span>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Happy Birthday, <span className="bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">Gigi</span>!
            </h1>
            <p className="mt-2 text-slate-600">
              {hasEnded ? "It’s officially Gigi’s birthday! 🎉" : "Counting down to midnight for Gigi’s birthday!"}
            </p>
          </div>
        </div>

        <div className="mt-8">
          {hasEnded ? (
            <BirthdayWishCard />
          ) : (
            <Countdown parts={parts} />
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <button onClick={burstConfetti} className="rounded-xl px-6 py-3 bg-pink-600 text-white font-bold shadow-md hover:bg-pink-700 transition">
            🎊 Make It Rain Confetti!
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function TimeBox({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="rounded-2xl bg-white shadow-md border border-rose-200 px-6 py-5 min-w-[96px] text-center">
        <div className="text-4xl font-black tabular-nums tracking-tight">{value}</div>
      </div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
    </div>
  );
}

function Countdown({ parts }) {
  return (
    <div className="grid grid-cols-3 gap-4 justify-items-center">
      <TimeBox label="Hours" value={pad(parts.hours)} />
      <TimeBox label="Minutes" value={pad(parts.minutes)} />
      <TimeBox label="Seconds" value={pad(parts.seconds)} />
    </div>
  );
}

function BirthdayWishCard() {
  return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="mt-10 bg-gradient-to-br from-pink-200 via-rose-100 to-fuchsia-200 border border-pink-300 rounded-3xl shadow-xl p-8 text-center">
      <h2 className="text-2xl font-bold text-pink-700 mb-4">💌 A Birthday Wish for Gigi 💌</h2>
      <p className="text-lg text-slate-700 leading-relaxed max-w-xl mx-auto">
        Dear Gigi,<br />
        Wishing you a day filled with laughter, love, and all the sparkle you bring to everyone’s life.
        You are one of a kind may your year ahead be full of joy, success, and unforgettable moments. 💖
        From Yara 
      </p>
      <p className="mt-4 text-xl font-semibold text-pink-600">Happy Birthday! 🎂🎉</p>
    </motion.div>
  );
}
