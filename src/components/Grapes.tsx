"use client"
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";

import { Grape } from "@/app/lib/gsApi";

import styles from "./Grape.module.css";

const RES_TYPE = {
  NONE: 0,
  DONE: 1,
  HALF: 0.5,
};

type TypeKey = keyof typeof RES_TYPE;

const GRAPE_PALLETTE: { [key: number]: TypeKey } = {
  0: 'NONE',
  1: 'DONE',
  0.5: 'HALF',
}

const GRAPE_INDEX = new Array(31).fill(1).map((_, i) => i + 1);
const NEW_LINE_INDEX = [3, 8, 13, 18, 22, 25, 28, 30];

export default function Grapes() {
  const [showLoader, setShowLoader] = useState(false);

  const [grape, setGrape] = useState<any>(null);
  const [names, setNames] = useState<string[]>([]);
  const [personalIndex, setPersonalIndex] = useState<number | null>(null); // 행 인덱스와 일치
  const [personalGrape, setPersonalGrape] = useState<{ [key: string]: string } | null>(null);

  useEffect (() => {
    fetchGrapes();
  }, []);

  const handleClickCircle = async (header: number, status: number) => {
    const curStatus = status;
    let nextStatus: number;

    if (curStatus === RES_TYPE.NONE) {
      nextStatus = RES_TYPE.DONE;
    } else if (curStatus === RES_TYPE.DONE) {
      nextStatus = RES_TYPE.HALF;
    } else {
      nextStatus = RES_TYPE.NONE;
    }

    setShowLoader(true);

    await grape.upadateSheet(personalIndex, header.toString(), nextStatus);

    setPersonalGrape({
      ...personalGrape,
      [header]: nextStatus.toString(),
    });

    setShowLoader(false);
  };

  const fetchGrapes = async () => {
    setShowLoader(true);

    const g = new Grape();
    await g.initialize();

    setGrape(g);
    setNames(g.getNames());

    setShowLoader(false);
  };

  const fetchPersonalGrape = async (idx: number) => {
    setShowLoader(true);

    const personalGrape = await grape.getPersonalData(idx);

    setPersonalGrape(personalGrape);
    setPersonalIndex(idx);

    setShowLoader(false);
  };

  return (
    <div className={styles.grape}>
      {names.map((name, i) => (
        <button
          key={name}
          onMouseDown={() => fetchPersonalGrape(i)}
          className={styles.name}
        >
          {name}
        </button>
      ))}
      {personalGrape && (
        <div className={styles.cluster}>
          {GRAPE_INDEX.map((idx) => {
            const status: number = +personalGrape?.[idx];

            return (
              <div key={idx} style={{ display: 'inline' }}>
                <span
                  className={`${styles.circles} ${styles[GRAPE_PALLETTE[status] || 'WRONG']}`}
                  onMouseDown={() => handleClickCircle(idx, status)}
                >
                  {idx}
                </span>
                {NEW_LINE_INDEX.includes(idx) && <br />}
              </div>
            );
          })}
        </div>
      )}
      {showLoader && (
        <div className={styles.spinerWrapper}>
          <ThreeDots
            visible={showLoader}
            height="80"
            width="80"
            color="#b928e6"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperClass={styles.spinner}
          />
        </div>
      )}
    </div>
  );
}
