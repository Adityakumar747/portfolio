import { useCallback, useEffect, useRef } from "react";

export const useSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const pressBufferRef = useRef<AudioBuffer | null>(null);
  const releaseBufferRef = useRef<AudioBuffer | null>(null);
  const confettiBufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        audioContextRef.current = ctx;

        const response = await fetch("/assets/keycap-sounds/press.mp3");
        pressBufferRef.current = await ctx.decodeAudioData(await response.arrayBuffer());

        const releaseResponse = await fetch("/assets/keycap-sounds/release.mp3");
        releaseBufferRef.current = await ctx.decodeAudioData(await releaseResponse.arrayBuffer());

        const confettiResponse = await fetch("/assets/sounds/vine-boom.mp3");
        confettiBufferRef.current = await ctx.decodeAudioData(await confettiResponse.arrayBuffer());
      } catch (error) {
        console.error("Failed to load sound", error);
      }
    };

    loadSound();

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const getContext = useCallback(() => {
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume().catch(() => {});
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback(
    (startFreq: number, endFreq: number, duration: number, vol: number) => {
      try {
        const ctx = getContext();
        if (!ctx) return;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const startTime = ctx.currentTime;

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(startFreq, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(vol, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      } catch (error) {
        console.error("Failed to play sound", error);
      }
    },
    [getContext]
  );

  const playSoundBuffer = useCallback(
    (buffer: AudioBuffer | null, baseDetune = 0) => {
      try {
        const ctx = getContext();
        if (!ctx || !buffer) return;

        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();

        source.buffer = buffer;
        source.detune.value = baseDetune + Math.random() * 200 - 100;
        gainNode.gain.value = 0.4;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
      } catch (error) {
        console.error("Failed to play sound", error);
      }
    },
    [getContext]
  );

  const playPressSound = useCallback(() => {
    playSoundBuffer(pressBufferRef.current);
  }, [playSoundBuffer]);

  const playReleaseSound = useCallback(() => {
    playSoundBuffer(releaseBufferRef.current);
  }, [playSoundBuffer]);

  const playConfettiSound = useCallback(
    (intensity: number = 0.5) => {
      try {
        const ctx = getContext();
        const buffer = confettiBufferRef.current;
        if (!ctx || !buffer) return;

        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();

        source.buffer = buffer;
        source.playbackRate.value = 1.2 - intensity * 0.4;
        source.detune.value = Math.random() * 100 - 50;
        gainNode.gain.value = 0.15 + intensity * 0.5;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
      } catch (error) {
        console.error("Failed to play confetti sound", error);
      }
    },
    [getContext]
  );

  const chargeOscRef = useRef<OscillatorNode | null>(null);
  const chargeGainRef = useRef<GainNode | null>(null);

  const startChargeTone = useCallback(() => {
    try {
      const ctx = getContext();
      if (!ctx || chargeOscRef.current) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = 200;
      gain.gain.value = 0;

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      chargeOscRef.current = osc;
      chargeGainRef.current = gain;
    } catch (error) {
      console.error("Failed to start charge sound", error);
    }
  }, [getContext]);

  const updateChargeTone = useCallback((intensity: number) => {
    const osc = chargeOscRef.current;
    const gain = chargeGainRef.current;
    if (!osc || !gain) return;

    osc.frequency.value = 200 + intensity * 600;
    gain.gain.value = intensity * 0.06;
  }, []);

  const stopChargeTone = useCallback(() => {
    try {
      chargeOscRef.current?.stop();
    } catch {}
    chargeOscRef.current = null;
    chargeGainRef.current = null;
  }, []);

  return {
    playPressSound,
    playReleaseSound,
    playConfettiSound,
    startChargeTone,
    updateChargeTone,
    stopChargeTone,
  };
};
