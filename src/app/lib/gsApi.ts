import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// https://disquiet.io/@eungwang1203/makerlog/google-sheets%EB%A5%BC-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EB%B2%A0%EC%9D%B4%EC%8A%A4%EB%A1%9C-%ED%99%9C%EC%9A%A9%ED%95%98%EA%B8%B0-feat-nextjs-1694136357334
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
    console.log(error);
  }
};

export default async function googleSheet(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const doc = await loadGoogleDoc();
      if (!doc)
        return res
          .status(200)
          .json({ ok: false, error: "사전등록에 실패했습니다." });
// "유저등록정보" 라는 이름의 sheet가 존재하는지 확인하고, 없다면 만들어줍니다.
      let sheet = doc.sheetsByTitle["유저등록정보"];
      if (!sheet) {
        sheet = await doc.addSheet({
          headerValues: ["email", "createdAt"],
          title: "유저등록정보",
        });
      }
// sheet에서 모든row 정보를 가져옵니다.
      const rows = await sheet.getRows();
// 이미 등록된 이메일인지 검증합니다.
      const isRegistered = rows.some(
        (row) => row.get("email") === req.body.email
      );
      if (isRegistered) {
        return res
          .status(200)
          .json({ ok: false, error: "이미 등록된 이메일입니다." });
      }
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
      const koreaTimeDiff = 9 * 60 * 60 * 1000;
// sheet에 새로운 정보를 등록해줍니다.
      await sheet.addRow({
        email: req.body.email,
        createdAt: new Date(utc + koreaTimeDiff).toLocaleString(),
      });
      return res.status(200).json({ ok: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
