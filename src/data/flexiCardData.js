// src/data/flexiCardData.js
// FlexiCardデータの一元管理

/**
 * カテゴリ定義
 * - school     : 学校の支援（Section01）
 * - prefecture  : 行政の支援／福井県（Section02）
 * - municipal   : 行政の支援／各市町（Section02）
 * - medical     : 医療機関／子どもの発達障害・心療内科
 */

const flexiCardData = [
  // ── 学校の支援 ──────────────────────────────
  {
    id: 1,
    category: 'school',
    title: 'スクールカウンセラー',
    description: '心のよりそいをしてくれます。相談したい場合は学校に依頼をしてください。',
    buttonText: null,
    url: '',
  },
  {
    id: 2,
    category: 'school',
    title: '校内サポートルーム',
    description: '学校内の別の居場所。県内の小中学校73校（7年度）設置。ご自身の学校に設置されているか、学校までお問い合わせください。',
    buttonText: null,
    url: '',
  },
  {
    id: 3,
    category: 'school',
    title: 'ライフパートナー',
    description: '大学生が、話し相手や遊び相手になってくれます。家庭派遣やオンライン支援も可能。学校までお問い合わせください。',
    buttonText: '公式サイトをみる',
    url: 'https://www.f-edu.u-fukui.ac.jp/~life2020/',
  },
  {
    id: 12,
    category: 'school',
    title: '高校内居場所カフェ',
    description: '学校内にある、家庭や学校関係者以外の、信頼できる大人や友達と安心して過ごすことができる第三の居場所。',
    buttonText: '公式サイトをみる',
    url: 'https://www.pref.fukui.lg.jp/doc/016407/kateifukusi/kounaikafe.html',
  },

  // ── 行政の支援／福井県 ────────────────────────
  {
    id: 4,
    category: 'prefecture',
    title: '福井県教育総合研究所\n教育相談センター',
    description: null,
    phones: [
      { number: '0776-51-0511', note: '（24時間対応）' },
      { number: '0120-0-78310', note: '（24時間フリーダイヤル）' },
    ],
    buttonText: '公式サイトをみる',
    url: 'https://www.fukui-c.ed.jp/~fec/kyoikusodan/',
  },
  {
    id: 5,
    category: 'prefecture',
    title: 'スクールソーシャル\nワーカー',
    description: '教育と社会福祉の知識をもつスクールソーシャルワーカーが、定期的に家庭訪問をして、児童生徒や保護者を支援します。',
    buttonText: null,
    url: '',
  },

  // ── 行政の支援／各市町 ────────────────────────
  {
    id: 6,
    category: 'municipal',
    title: '福井市\nチャレンジ教室',
    description: '学校復帰を目的とした、公的なフリースクール。',
    buttonText: '公式サイトをみる',
    url: 'http://www.fukui-city.ed.jp/challenge/',
  },
  {
    id: 7,
    category: 'municipal',
    title: '坂井市\nステップスクールさかい',
    description: '学校復帰を目的とした、公的なフリースクール。',
    buttonText: '公式サイトをみる',
    url: 'https://www.city.fukui-sakai.lg.jp/gakko/kosodate/kyoiku/tetsuzuki/step-school.html',
  },
  {
    id: 8,
    category: 'municipal',
    title: '鯖江市\n鯖江チャイルド',
    description: '学校復帰を目的とした、公的なフリースクール。',
    buttonText: '公式サイトをみる',
    url: 'https://www.city.sabae.fukui.jp/kosodate_kyoiku/gakko_kyoiku/kyoikuiinkai/childcenter.html',
  },

  // ── 医療機関／子どもの発達障害・心療内科 ──────────
  // ※ データが揃い次第追加してください
  {
    id: 9,
    category: 'medical',
    title: '福井大学医学部附属病院',
    description: '子どもの発達障害に関する支援を提供します。',
    buttonText: '公式サイトをみる',
    url: '',
  },
  {
    id: 10,
    category: 'medical',
    title: '福井県立病院',
    description: '子どもの発達障害に関する支援を提供します。',
    buttonText: '公式サイトをみる',
    url: '',
  },
  {
    id: 11,
    category: 'medical',
    title: '厚生病院',
    description: '子どもの発達障害に関する支援を提供します。',
    buttonText: '公式サイトをみる',
    url: '',
  },
];

export default flexiCardData;

/** カテゴリでフィルタリングするヘルパー */
export const getCardsByCategory = (category) =>
  flexiCardData.filter((card) => card.category === category);
