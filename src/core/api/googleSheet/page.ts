// src > core > api > googleSheet > pages.ts


export async function loadGoogleSheet() {
  try {
    const doc = new GoogleSpreadsheet(documentID, jwt);
    await doc.loadInfo();
    return doc;
  } catch (error) {
    console.error("Sheet Load Rows Error:", error);
    throw new Error("Failed to Load Rows data.");
  }
}


export async function findRow() {
  try {
    const doc = await loadGoogleSheet(); // 문서 불러오기

    return doc;
  } catch (error) {
    console.error("Sheet find row Error:", error);
    throw new Error("Failed to find Row data.");
  }
}
