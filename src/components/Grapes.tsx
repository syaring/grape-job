"use client"
import { useEffect, useState } from "react";
import { GoogleSpreadsheetRow } from "google-spreadsheet";

import { getGrapes, postGrapeStatus } from "@/app/lib/gsApi";

import styles from "./Grape.module.css";

const NONE = 'NONE';
const DONE = 'DONE';
const HALF = 'HALF';
const NEW_LINE_INDEX = [2, 7, 12, 17, 21, 24, 27, 29];

type TypeGrape = {
  id: number;
  day: number;
  status: typeof NONE | typeof DONE | typeof HALF;
};

export default function Grapes() {
  const [status, setStatus] = useState<TypeGrape[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [rows, setRows] = useState<GoogleSpreadsheetRow<Record<string, any>>[]>([]);
  const [nameIndex, setNameIndex] = useState<number | null>(null);

  useEffect (() => {
    fetchGrapes();
  }, []);

  const fetchGrapes = async () => {
    const grapes = await getGrapes();

    const { rows, names: headers } = grapes!;

    setNames(headers);
    setRows(rows);
    setNameIndex(0);
  };

  useEffect(() => {
    if (nameIndex !== null) {
      const newGrape = [];

      for (let i = 0 ; i < 31 ; i ++ ) {
        newGrape[i] = {
          id: i,
          day: i + 1,
          status: rows[i]?.get(names[nameIndex]) || NONE,
        }
      }

      setStatus(newGrape);
    }
  }, [nameIndex]);

  const handleClickCircle = async (idx: number) => {
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

    setStatus([...newStatus]);

    await postGrapeStatus({
      value: nextStatus,
      col: nameIndex!,
      row: idx + 1,
    });
  };

  return (
    <div className={styles.grape}>
    <div className={styles.names}>
      {names.map((n, i) => (
        <span
          key={n}
          onMouseDown={() => setNameIndex(i)}
        >
          {n}
        </span>
      ))}
    </div>
      <h2>
        {nameIndex !== null && (
          <>
            {names[nameIndex]}의 🍇
          </>
        )}
      </h2>
      {status.map(({ day, status }, idx) => {
        return (
          <div key={idx} style={{ display: 'inline' }}>
            <span
              className={`${styles.circles} ${styles[status]}`}
              onMouseDown={() => handleClickCircle(idx)}
            >
              {day}
            </span>
            {NEW_LINE_INDEX.includes(idx) && <br />}
          </div>
        );
      })}
    </div>
  );
}
