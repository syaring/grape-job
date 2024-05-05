import { GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export class Grape {
  private doc: GoogleSpreadsheet | null;
  private sheet: GoogleSpreadsheetWorksheet | null;
  private rows: GoogleSpreadsheetRow<Record<string, any>>[] | null;

  constructor() {
    this.doc = null;
    this.sheet = null;
    this.rows = null;
  }

  async initialize() {
    const formattedKey = process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    const serviceAccountAuth = new JWT({
      key: formattedKey,
      email: process.env.NEXT_PUBLIC_GOOGLE_SERVICE_MAIL,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });


    this.doc = new GoogleSpreadsheet(
      process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID!,
      serviceAccountAuth,
    );

    await this.doc.loadInfo();

    if (this.doc) {
      this.sheet = this.doc.sheetsByTitle["grapes"];
    }

    if (this.sheet) {
      this.rows = await this.sheet.getRows();
    }
  }

  getRows() {
    return this.rows;
  }

  getNames(): string[] {
    if (!this.sheet) {
      alert('포도알 시트를 불러올 수 없습니다. 다시 시도해주세요.');

      return [];
    }

    if (!this.rows) {
      alert('포도알 행 정보를 불러올 수 없습니다. 다시 시도해주세요.');

      return [];
    }

    return this.rows.map((row) => row.get('name'));
  }

  async getPersonalData(headerIndex: number) {
    if (!this.sheet) {
      alert('시트를 불러올 수 없습니다. 다시 시도해주세요.');

      return;
    }

    if (!this.rows) {
      alert('포도알 행 정보를 불러올 수 없습니다. 다시 시도해주세요.');

      return [];
    }

    return this.rows[headerIndex].toObject();
  }

  async upadateSheet(rowIndex: number, header: string, value: number) {
    if (!this.sheet) {
      alert('시트를 불러올 수 없습니다. 다시 시도해주세요.');

      return;
    }

    if (!this.rows) {
      alert('포도알 행 정보를 불러올 수 없습니다. 다시 시도해주세요.');

      return [];
    }

    this.rows[rowIndex].set(header, value);

    try {
      await this.rows[rowIndex].save();
    } catch (error) {
      alert('포도알 업데이트 중 오류가 발생했습니다! 새로고침 후 다시 시도해주세요!');
    }
  }
}
