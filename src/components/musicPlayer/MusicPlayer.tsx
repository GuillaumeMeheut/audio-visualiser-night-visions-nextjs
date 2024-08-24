"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Main from "../../visualizer/main";
import styles from "./style.module.scss";
import { MusicData } from "@/app/page";
import Hexagons from "../hexagons/Hexagons";
import Image from "next/image";

const MusicPlayer = ({ musics }: { musics: MusicData[] }) => {
  const [currentMusicID, setCurrentMusicID] = useState(13);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const musicTitleHexaRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const srcRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (!contextRef.current) {
      contextRef.current = new window.AudioContext();
      srcRef.current = contextRef.current.createMediaElementSource(
        audioRef.current
      );
    }
  }, []);

  const createVisualizer = useCallback(() => {
    if (!canvasRef.current || !audioRef.current || !contextRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const analyser = contextRef.current.createAnalyser();
    srcRef.current?.connect(analyser);
    analyser.connect(contextRef.current.destination);
    analyser.fftSize = 1024;

    const bufferLength = analyser.frequencyBinCount;
    const analyserDataArray = new Uint8Array(bufferLength);
    const main = new Main(
      canvas.width,
      canvas.height,
      analyserDataArray,
      bufferLength
    );

    const renderFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      analyser.getByteFrequencyData(analyserDataArray);
      main.update();
      main.draw(ctx);
      requestAnimationFrame(renderFrame);
    };

    requestAnimationFrame(renderFrame);
  }, []);

  useEffect(() => {
    createVisualizer();
  }, [createVisualizer]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = musics[currentMusicID].link;
      audioRef.current.volume = 0.5;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      contextRef.current?.resume();
      audioRef.current.play();
    }
    setIsPlaying((prevState) => !prevState);
  }, [isPlaying]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.volume = parseFloat(e.target.value);
    }
  };

  const handleSetMusic = (id: number) => {
    if (id < musics.length) {
      setCurrentMusicID(id);
      if (audioRef.current) {
        audioRef.current.src = musics[id].link;
        audioRef.current.volume = 0.5;
        setIsPlaying(true);
        contextRef.current?.resume();
        audioRef.current.play();
      }
    }
  };

  const handleSetTitle = (id: number) => {
    if (musicTitleHexaRef.current)
      musicTitleHexaRef.current.textContent =
        id < musics.length ? musics[id].title : "";
  };

  useEffect(() => {
    if (!audioRef.current) return;

    let animationFrameId: number;

    const updateProgressBar = () => {
      if (audioRef.current) {
        const currentTime = audioRef.current.currentTime;
        const duration = audioRef.current.duration;
        const percentageDuration = (currentTime / duration) * 100;

        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${percentageDuration}%`;
        }

        animationFrameId = requestAnimationFrame(updateProgressBar);
      }
    };

    updateProgressBar();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.wrapper}>
        {isPlaying ? (
          <Image
            className={styles.img}
            src="img/pause.svg"
            width={30}
            height={40}
            onClick={togglePlay}
            alt="pause"
          />
        ) : (
          <Image
            className={styles.img}
            src="img/play.svg"
            width={40}
            height={40}
            onClick={togglePlay}
            alt="play"
          />
        )}
        <input
          className={styles.barVolume}
          type="range"
          min="0"
          max="1"
          step="0.01"
          onChange={handleVolumeChange}
        />
      </div>

      <div ref={progressBarRef} className={styles.progressBar} />
      <h3 className={styles.musicTitle}>{musics[currentMusicID].title}</h3>
      <p className={styles.musicTitleHexa} ref={musicTitleHexaRef} />
      <Hexagons
        handleSetMusic={handleSetMusic}
        handleSetTitle={handleSetTitle}
        currentMusicID={currentMusicID}
      />
    </>
  );
};

export default MusicPlayer;
