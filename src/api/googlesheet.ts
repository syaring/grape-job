import { useEffect, useState } from 'react';
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// const credential = require('../assets/grape-job-9a8c0a2e1785.json');

// 구글 시트 조회하는 로직
export const getGoogleSheet: () => Promise<GoogleSpreadsheet> = async () => {
  const doc = new GoogleSpreadsheet('1azYhHUyle5Y1hqGkR5xhHtt1nUm6PlYuyw4_2U7J7K4', serviceAccountAuth);

  console.log(doc);
  return doc;
}

// 구글 시트 조회하는 custom useHook
const useGoogleSheet = (sheetId: number) => {
    const [googleSheetRows, setGoogleSheetRows] = useState<GoogleSpreadsheetRow[]>([]);

    const fetchGoogleSheetRows = async () => {
        const googleSheet = await getGoogleSheet();
        const sheetsByIdElement = googleSheet.sheetsById[sheetId];
        const rows = await sheetsByIdElement.getRows();
        setGoogleSheetRows(rows)
    }

    useEffect(() => {
        fetchGoogleSheetRows();
    },[]);

    return [googleSheetRows];
}

export default useGoogleSheet;
