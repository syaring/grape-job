"use client"
import { useState } from "react";

import styles from "./page.module.css";

const NONE = 'NONE';
const DONE = 'DONE';
const HALF = 'HALF';

type TypeGrape = {
  id: number;
  day: number;
  status: typeof NONE | typeof DONE | typeof HALF;
};

// 대상 시트
// https://docs.google.com/spreadsheets/d/1azYhHUyle5Y1hqGkR5xhHtt1nUm6PlYuyw4_2U7J7K4/edit#gid=0
// 스프레드시트: 1azYhHUyle5Y1hqGkR5xhHtt1nUm6PlYuyw4_2U7J7K4
// 시트: 0
// 이름: [알파벳]1
// 개인 수행 날짜: [알파벳]2 ~ 32
// 총 합계: [알파벳]33

// https://developers.google.com/sheets/api/guides/concepts?hl=ko
// https://console.cloud.google.com/apis/api/sheets.googleapis.com/metrics?project=grape-job

export default function Home() {
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
    <main>
      <h1>포도알 출석부</h1>
      <h2>김세림</h2>
      <div>
        <div>김세림의 🍇</div>
        <div className={styles.grape}>
          {status.map(({ day, status }, idx) => {
            return (
              <>
                <span
                  key={idx}
                  className={`${styles.circles} ${styles[status]}`}
                  onMouseDown={() => handleClickCircle(idx)}
                >
                  {day}
                </span>
                {newLine.includes(idx) && <br />}
              </>
            );
          })}
        </div>
      </div>
    </main>
  );
}
