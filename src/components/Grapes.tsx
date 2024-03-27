"use client"
import { useEffect, useState } from "react";

import styles from "./Grape.module.css";

import { getGrapes } from "@/app/lib/gsApi";

const NONE = 'NONE';
const DONE = 'DONE';
const HALF = 'HALF';

type TypeGrape = {
  id: number;
  day: number;
  status: typeof NONE | typeof DONE | typeof HALF;
};

export default function Grapes() {
  const newLineIndex = [2, 7, 12, 17, 21, 24, 27, 29];

  const [status, setStatus] = useState<TypeGrape[]>([]);

  useEffect (() => {
    fetchGrapes();
  }, []);

  const fetchGrapes = async () => {
    const grapes = await getGrapes();

    const { rows, names } = grapes!;

    const newGrape = [];

    for (let i = 0 ; i < 31 ; i ++ ) {
      newGrape[i] = {
        id: i,
        day: i + 1,
        status: rows[i].get(names[0]) || NONE,
      }
    }

    setStatus(newGrape);
  };

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
            {newLineIndex.includes(idx) && <br />}
          </div>
        );
      })}
    </div>
  );
}
