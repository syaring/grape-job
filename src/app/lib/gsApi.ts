import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import Error from 'next/error';

export async function loadGoogleDoc() {
  try {
    const formattedKey = process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    const serviceAccountAuth = new JWT({
      key: formattedKey,
      email: process.env.NEXT_PUBLIC_GOOGLE_SERVICE_MAIL,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(
      process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID!,
      serviceAccountAuth,
    );

    await doc.loadInfo();

    return doc;
  } catch (error) {
    alert(error);
  }
};

export async function getGrapes () {
  try {
    const doc = await loadGoogleDoc();

    const sheet = doc?.sheetsByTitle["grapes"];

    if (!sheet) {
      alert("시트가 없습니다!");

      return;
    }

    const rows = await sheet.getRows();
    const names = await sheet.headerValues;

    return {
      rows,
      names,
    };
  } catch (error) {
    alert(error);
  }
}

const NONE = 'NONE';
const DONE = 'DONE';
const HALF = 'HALF';

export async function postGrapeStatus ({
  value,
  col,
  row,
}: {
  value: typeof NONE | typeof DONE | typeof HALF,
  col: number,
  row: number,
}) {
  try {
    const doc = await loadGoogleDoc();

    const sheet = doc?.sheetsByTitle["grapes"];
    await sheet?.loadCells('A1:D35')

    if (!sheet) {
      alert("시트가 없습니다!");

      return;
    }

    const cell = await sheet.getCell(row, col);

    cell.value = value;

    await sheet.saveUpdatedCells();
  } catch (error) {
    alert(error);
  }
}
