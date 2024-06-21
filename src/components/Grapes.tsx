"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import { ThreeDots } from "react-loader-spinner";
import DropDown, { Option } from "react-dropdown";

import { Grape } from "@/app/lib/gsApi";

import halfGrape from '../assets/images/grape-done.png';
import doneGrape from '../assets/images/grape-done.png';

import styles from "./Grape.module.css";
import "react-dropdown/style.css";

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
  const [showLoader, setShowLoader] = useState(true);

  const [grape, setGrape] = useState<any>(null);
  const [names, setNames] = useState<string[]>([]);
  const [personalIndex, setPersonalIndex] = useState<number | null>(null); // 행 인덱스와 일치
  const [personalGrape, setPersonalGrape] = useState<{ [key: string]: string } | null>(null);

  const [lastIndex, setLastIndex] = useState<number | undefined>();
  const [totalSum, setTotalSum] = useState<number>(0);
  const [filledCount, setFilledCount] = useState(0);
  const [isLastGrape, setIsLastGrape] = useState(false);

  const [imageStatus, setImageStatus] = useState<'HALF' | 'DONE' | 'NONE'>('NONE');

  useEffect (() => {
    fetchGrapes();
  }, []);

  const handleClickCircle = async (header: number, status: number) => {
    setShowLoader(true);

    const curStatus = status;
    let nextStatus: number;

    if (curStatus === RES_TYPE.NONE) {
      nextStatus = RES_TYPE.DONE;
    } else if (curStatus === RES_TYPE.DONE) {
      nextStatus = RES_TYPE.HALF;
    } else {
      nextStatus = RES_TYPE.NONE;
    }

    await grape.upadateSheet(personalIndex, header.toString(), nextStatus);

    setPersonalGrape({
      ...personalGrape,
      [header]: nextStatus.toString(),
    });

    if (isLastGrape && filledCount === 30) {
      if (nextStatus === RES_TYPE.DONE) {
        setImageStatus('DONE');
        await grape.upadateSheet(personalIndex, 'lastIndex', header.toString);
      } else if (nextStatus === RES_TYPE.HALF) {
        setImageStatus('HALF');
        await grape.upadateSheet(personalIndex, 'lastIndex', header.toString);
      } else {
        setImageStatus('NONE');
        await grape.upadateSheet(personalIndex, 'lastIndex', 0);
      }
    } if (isLastGrape && filledCount !== 30) {
      if (nextStatus === RES_TYPE.NONE) {
        setImageStatus('NONE');
        await grape.upadateSheet(personalIndex, 'lastIndex', 0);
      } else {
        setImageStatus('HALF');
        await grape.upadateSheet(personalIndex, 'lastIndex', header.toString);
      }
    } else {
      setImageStatus('NONE');
    }


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

  const fetchPersonalGrape = async (name: Option) => {
    setShowLoader(true);

    const idx = names.findIndex((n) => n === name.value);

    const personalGrape = await grape.getPersonalData(idx);

    console.log(personalGrape);

    setPersonalGrape(personalGrape);
    setPersonalIndex(idx);
    setLastIndex(personalGrape.lastIndex);

    checkGrapeInfo(personalGrape);

    setShowLoader(false);
  };

  const checkGrapeInfo = (grape: any) => {
    let count = 0;
    let total = 0;
    let hasZero = false;

    for (let i = 0 ; i < GRAPE_INDEX.length ; i ++) {
      const index = GRAPE_INDEX[i];

      if (+grape[index] === 0 || !grape[index]) {
        hasZero = true;
      } else {
        count++;
      }

      total += grape[index] ? +grape[index] : 0;
    }

    setTotalSum(total);
    setFilledCount(count);

    if (!hasZero && total === 30) {
      setIsLastGrape(true);
    }
  }

  console.log(lastIndex, filledCount, isLastGrape)
  return (
    <div className={styles.grape}>
      {names && (
        <DropDown
          options={names}
          onChange={(name) => fetchPersonalGrape(name)}
          placeholder="알갱이 이름을 선택하세요"
        />
      )}
      {personalGrape && (
        <div className={styles.cluster}>
          {GRAPE_INDEX.map((idx) => {
            const status: number = +personalGrape?.[idx] || 0;

            return (
              <div key={idx} style={{ display: 'inline' }}>
                <span
                  className={`${styles.circles} ${styles[GRAPE_PALLETTE[status]]} ${styles[imageStatus]}`}
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
