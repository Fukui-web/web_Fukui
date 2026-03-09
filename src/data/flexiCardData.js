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

  // ── 行政の支援／福井県 ────────────────────────
  {
    id: 4,
    category: 'prefecture',
    title: '福井県教育総合研究所\n教育相談センター',
    description: '今すぐどこかに相談したい方はこちら。フリーダイヤル・24時間対応。',
    buttonText: null,
    phone: '0120-96-8104',
    url: '',
  },
  {
    id: 5,
    category: 'prefecture',
    title: 'スクールソーシャル\nワーカー',
    description: '保護者も含めた家庭への支援。学校までお問い合わせください。',
    buttonText: null,
    url: '',
  },

  // ── 行政の支援／各市町 ────────────────────────
  {
    id: 6,
    category: 'municipal',
    title: '福井市\nチャレンジ教室',
    description: '学校概要を再検討した。公費グラフ・スクール',
    buttonText: '公式サイトをみる',
    url: '',
  },
  {
    id: 7,
    category: 'municipal',
    title: '坂井市\nスタッフスクールきぼう',
    description: '学校概要を再検討した。公費グラフ・スクール',
    buttonText: '公式サイトをみる',
    url: '',
  },
  {
    id: 8,
    category: 'municipal',
    title: '鮫江市\n嶺北エールド',
    description: '学校概要を再検討した。公費グラフ・スクール',
    buttonText: '公式サイトをみる',
    url: '',
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
