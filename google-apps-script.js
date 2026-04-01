// ================================================================
//  2026 영어 토론 수행평가 — Google Apps Script
//
//  설정 방법:
//  1. Google 스프레드시트 열기 (sheets.google.com → 새 문서)
//  2. 상단 메뉴 → 확장 프로그램 → Apps Script
//  3. 기존 코드 전체 지우고 이 코드 붙여넣기
//  4. 저장 (Ctrl+S)
//  5. 오른쪽 위 "배포" → "새 배포"
//     - 유형: 웹 앱
//     - 실행 계정: 나
//     - 액세스 권한: 모든 사용자
//  6. "배포" 클릭 → 권한 허용 → 웹 앱 URL 복사
//  7. index.html 파일 안의 SCRIPT_URL에 붙여넣기
// ================================================================

const SHEET_NAME = '토론_제출';

function doPost(e) {
  try {
    const data  = JSON.parse(e.postData.contents);
    const sheet = getSheet();

    const row = [
      new Date().toLocaleString('ko-KR'),
      data.sid       || '',
      data.sname     || '',
      data.topic     || '',
      data.opinion   || '',
      // Brainstorming
      data.agreePros    || '',
      data.agreeCons    || '',
      data.disagreePros || '',
      data.disagreeCons || '',
      // Reasons & Evidence
      data.r1 || '', data.e1 || '',
      data.r2 || '', data.e2 || '',
      data.r3 || '', data.e3 || '',
      // 그룹 멤버
      data.m1 || '', data.m2 || '', data.m3 || '', data.m4 || '',
      // 스크립트
      data.sc0 || '',
      data.sc1 || '', data.sc2 || '', data.sc3 || '',
      data.ct1 || '', data.ct2 || '', data.ct3 || '',
      // 동료 평가
      (data.peers || []).filter(v => v).join('\n---\n'),
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', msg: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);

    const headers = [
      '제출시간', '학번', '이름', '토론주제', '입장',
      'BS-찬성장점', 'BS-찬성단점', 'BS-반대장점', 'BS-반대단점',
      'Reason1', 'Evidence1',
      'Reason2', 'Evidence2',
      'Reason3', 'Evidence3',
      '멤버1', '멤버2', '멤버3', '멤버4',
      '스크립트-입장',
      '스크립트-R1', '스크립트-R2', '스크립트-R3',
      '예상반박1', '예상반박2', '예상반박3',
      '동료평가'
    ];

    sheet.appendRow(headers);
    sheet.setFrozenRows(1);

    const hRange = sheet.getRange(1, 1, 1, headers.length);
    hRange.setBackground('#1e3a8a')
          .setFontColor('#ffffff')
          .setFontWeight('bold')
          .setHorizontalAlignment('center');

    sheet.autoResizeColumns(1, headers.length);
  }

  return sheet;
}

// 배포 전 테스트용 — Apps Script 편집기에서 직접 실행하세요
function testSetup() {
  const sheet = getSheet();
  Logger.log('✅ 시트 준비 완료: ' + sheet.getName());
  Logger.log('📋 URL: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
}
