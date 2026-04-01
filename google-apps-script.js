// ================================================================
//  2026 영어 토론 수행평가 - Google Apps Script
//  사용법:
//    1. 구글 스프레드시트 열기
//    2. 상단 메뉴 > 확장 프로그램 > Apps Script
//    3. 이 코드 전체를 붙여넣기 (기존 코드 지우고)
//    4. 저장(Ctrl+S) 후 → 배포 > 새 배포
//    5. 유형: 웹 앱 / 실행 계정: 나 / 액세스 권한: 모든 사용자
//    6. 배포 후 나오는 웹 앱 URL을 복사해서 debate-worksheet.html에 붙여넣기
// ================================================================

const SHEET_NAME = '토론학습지_제출';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    const row = [
      new Date().toLocaleString('ko-KR'),           // 제출시간
      data.studentId    || '',                       // 학번
      data.studentName  || '',                       // 이름
      data.topic        || data.customTopic || '',   // 토론 주제
      data.opinion === 'agree' ? '찬성' : data.opinion === 'disagree' ? '반대' : '',
      data.agreePros    || '',  // Brainstorm 찬성-장점
      data.agreeCons    || '',  // Brainstorm 찬성-단점
      data.disagreePros || '',  // Brainstorm 반대-장점
      data.disagreeCons || '',  // Brainstorm 반대-단점
      data.reason1      || '',  // Reason 1
      data.evidence1    || '',  // Evidence 1
      data.reason2      || '',  // Reason 2
      data.evidence2    || '',  // Evidence 2
      data.reason3      || '',  // Reason 3 (선택)
      data.evidence3    || '',  // Evidence 3 (선택)
      data.member1      || '',  // 그룹 멤버 1
      data.member2      || '',  // 그룹 멤버 2
      data.member3      || '',  // 그룹 멤버 3
      data.member4      || '',  // 그룹 멤버 4
      data.scriptOpinion  || '',  // 스크립트 - 입장
      data.scriptReason1  || '',  // 스크립트 - Reason 1
      data.scriptReason2  || '',  // 스크립트 - Reason 2
      data.scriptReason3  || '',  // 스크립트 - Reason 3
      data.counter1       || '',  // 예상 반박 1
      data.counter2       || '',  // 예상 반박 2
      data.counter3       || '',  // 예상 반박 3
      (data.peerFeedbacks || []).filter(v => v).join(' || '),  // 동료 평가
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);

    const headers = [
      '제출시간', '학번', '이름', '토론주제', '입장',
      'Brainstorm-찬성장점', 'Brainstorm-찬성단점',
      'Brainstorm-반대장점', 'Brainstorm-반대단점',
      'Reason1', 'Evidence1',
      'Reason2', 'Evidence2',
      'Reason3(선택)', 'Evidence3(선택)',
      '그룹멤버1', '그룹멤버2', '그룹멤버3', '그룹멤버4',
      '스크립트-입장', '스크립트-Reason1', '스크립트-Reason2', '스크립트-Reason3',
      '예상반박1', '예상반박2', '예상반박3',
      '동료평가'
    ];

    sheet.appendRow(headers);
    sheet.setFrozenRows(1);

    // 헤더 스타일
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange
      .setBackground('#1a365d')
      .setFontColor('white')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    // 열 너비 자동 조정
    sheet.autoResizeColumns(1, headers.length);
  }

  return sheet;
}

// 테스트용 (Apps Script 편집기에서 직접 실행해서 시트가 제대로 만들어지는지 확인)
function test() {
  const sheet = getOrCreateSheet();
  Logger.log('시트 이름: ' + sheet.getName());
  Logger.log('시트 URL: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
}
