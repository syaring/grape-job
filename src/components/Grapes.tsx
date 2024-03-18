"use client"
import { useEffect, useState } from "react";

import styles from "./Grape.module.css";
import { loadGoogleDoc } from "@/app/lib/gsApi";

const NONE = 'NONE';
const DONE = 'DONE';
const HALF = 'HALF';

type TypeGrape = {
  id: number;
  day: number;
  status: typeof NONE | typeof DONE | typeof HALF;
};

export default function Grapes() {
  useEffect(() => {
    const doc = loadGoogleDoc();

    console.log(doc);
  }, []);
  const grapes: TypeGrape[] = new Array(31).fill(0).map((_, idx) => ({ id: idx, day: idx + 1, status: NONE }));

  const newLine = [2, 7, 12, 17, 21, 24, 27, 29];

  const [status, setStatus] = useState<TypeGrape[]>([...grapes]);

  const handleClickCircle = (idx: number) => {
    const curStatus = status[idx];
    let nextStatus: typeof NONE | typeof DONE | typeof HALF = NONE;

    if (curStatus.status === NONE) {
      nextStatus = DONE;
    } else if (curStatus.status === DONE) {
      nextStatus = HALF;
    } else {
      nextStatus = NONE;
    }

    const newStatus = [...status];
    newStatus[idx].status = nextStatus;

    setStatus([...newStatus])
  };

  return (
    <div className={styles.grape}>
      {status.map(({ day, status }, idx) => {
        return (
          <div key={idx} style={{ display: 'inline' }}>
            <span
              className={`${styles.circles} ${styles[status]}`}
              onMouseDown={() => handleClickCircle(idx)}
            >
              {day}
            </span>
            {newLine.includes(idx) && <br />}
          </div>
        );
      })}
    </div>
  );
}
