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
    description: 'ついつい頼りたくなりつらさを軽く理解できる話の専門家です。',
    buttonText: '公式サイトをみる',
    url: '',
  },
  {
    id: 2,
    category: 'school',
    title: '校内サポートルーム',
    description: '県内の小学校、１時間がありません。校内の先生とは別の相談窓口です。',
    buttonText: '公式サイトをみる',
    url: '',
  },
  {
    id: 3,
    category: 'school',
    title: 'ライフパートナー制度',
    description: '専攻大学の学生さん。おしゃべりや遊び、自分との関わり、宿題など付き合ってくれます。',
    buttonText: '公式サイトをみる',
    url: '',
  },

  // ── 行政の支援／福井県 ────────────────────────
  {
    id: 4,
    category: 'prefecture',
    title: '福井県教育庁\n教育相談課',
    description: '0776-56-1310',
    buttonText: '公式サイトをみる',
    url: '',
  },
  {
    id: 5,
    category: 'prefecture',
    title: 'スクールソーシャル\nワーカー',
    description: '家庭と学校現場の間の繋ぐスクールソーシャルワーカー不登校支援に関するのもお願いしま',
    buttonText: '公式サイトをみる',
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
