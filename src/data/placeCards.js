// src/data/placeCards.js
// プレイスカードのデータを一元管理

const placeCards = [
  {
    id: 1,
    title: "子どもデザインアカデミーふくい勝山教室",
    description: "",
    body: "当教室では小中学生のお子様に向けてイラストや漫画の描き方をレッスンしています。マンガやアニメボーカロイド等描くことが好きなお子様のもっと上手くなりたい気持ちに寄り添い、お話を聞きながら楽しく絵を描いています。完全オンライン対応でご自宅からご受講いただけます。平日日中のレッスンも承ります。",
    address: "オンライン教室",
    hours: "月水金土開講",
    contact: "08037406668",
    detailInfo: {
      location: "オンライン教室",
      phone: "080-3740-6668",
      email: "office@305design.net",
      website: "https://kodomo-design.jp/school-list/fukui-katsuyama/",
      target: "小学生, 中学生, 高校生",
      recommended: "専門的なことを学びたい, オンラインで授業を受けたい, 家以外の場所での居場所を見つけたい, お友達を見つけたい",
      suggestion: "習い事",
      schedule: "月水金土開講",
      fee: "月2回6,380円（税込）〜",
      other: "我が家にも不登校気味の子がいます。お子様が好きなことで集中する時間がお母さんの救いになることもあるかと思い応募させていただきました。"
    },
    // 検索用タグ（フィルタリング用）
    searchTags: {
      grade: ["小学生から", "中学生から", "高校生から"],
      situation: ["専門的なことを学びたい", "家以外の場所での居場所を見つけたい", "友達をさがしたい"],
      facility: ["習い事"]
    },
    images: [
      require('../assets/images/AdobeStock_Preview.png'),
    ],
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["小学生", "中学生", "高校生", "習い事"]
  },
  {
    id: 2,
    title: "とまり木",
    description: "",
    body: "福井市で不登校のお子さんを持つお母さん向けに座談会をしています。私自身中学校不登校だった息子の経験から同じような立場で気軽に話せる場が欲しかったことから始めました。少しでも心が軽くなってもらえたら嬉しいです",
    address: "福井市",
    hours: "主に第三か第四日曜日 場所はインスタグラムにて",
    contact: "09097685530",
    detailInfo: {
      location: "福井市",
      phone: "09097685530",
      email: "ringopandaisuki123@gmail.com",
      website: "tomarigi_fukui",
      target: "不登校生の保護者",
      recommended: "不登校や子育てについて相談したい, 不登校や子育てについて共有したい, 同じ悩みを持つ人と話したい",
      suggestion: "不登校児の親のおしゃべり会",
      schedule: "主に第三か第四日曜日 場所はインスタグラムにて",
      fee: "無料",
      other: "最初の方のメールアドレスというところは非公開ですか？（できれば個人のメールなので非公開でお願いしたいです）"
    },
    // 検索用タグ（フィルタリング用）
    searchTags: {
      grade: ["卒業している場合"],
      situation: ["不登校や子育てについて相談したい", "不登校や子育ての未来について見失わない"],
      facility: ["サークル"]
    },
    images: [
      require('../assets/images/AdobeStock_Preview.png'),
    ],
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["不登校生の保護者", "不登校児の親のおしゃべり会"]
  },
  {
    id: 3,
    title: "オルタナティブスクールちいさな学校ヒトツナガリ",
    description: "",
    body: "ちいさな学校ヒトツナガリは、\n子どもたちが主体性を持って日々の暮らしの中で\n遊び、学ぶ、オルタナティブスクールです。\n\n自然や日々の暮らしの中には、\n生きていく上で大切な多くの学びがあります。\n子どもたちには、遊びの中からでも興味・関心を膨らませ、\n学びを見つける力があります。\n\nちいさな学校ヒトツナガリは、\n暮らしと遊びと学び、すべてがひとつながりとなり、\n子どもたちが伸びやかに自分を表現し\n育っていくことのできる学び場です。",
    address: "福井市",
    hours: "月火木金",
    contact: "0776655623",
    detailInfo: {
      location: "福井市",
      phone: "0776655623",
      email: "hitotsunagari.school@gmail.com",
      website: "https://www.instagram.com/hitotsunagari_school?igsh=d2E4eXF5NXo3YWdp&utm_source=qr",
      target: "小学生",
      recommended: "専門的なことを学びたい, 家以外の場所での居場所を見つけたい, 外部とコミュニケーションを取れる場所に行きたい, 不登校や子育てについて相談したい, 不登校や子育てについて共有したい, 不登校や子育てのイベントに参加したい, お友達を見つけたい",
      suggestion: "オルタナティブスクール",
      schedule: "月火木金",
      fee: "3000円〜",
      other: "オルタナティブスクールちいさな学校ヒトツナガリでは新入スクール生を随時募集しています◎\n\nヒトツナガリには小学校に行ったことがなく、スクールが私の学校だ！と思って通っている子、\n小学校に週1.2回通いながら、ヒトツナガリに通っている子、\n不登校になって家で過ごしていたけれど、\nヒトツナガリに来るようになった子など\n色んな子がいますよ◎\n\n入学を検討されている方の体験入学も随時受付中！"
    },
    // 検索用タグ（フィルタリング用）
    searchTags: {
      grade: ["小学生から"],
      situation: ["専門的なことを学びたい", "家以外の場所での居場所を見つけたい", "外部とコミュニケーションを取れる場所に行きたい", "不登校や子育てについて相談したい", "不登校や子育てのイベントに参加したい", "友達をさがしたい"],
      facility: ["オルタナティブスクール"]
    },
    images: [
      require('../assets/images/AdobeStock_Preview.png'),
    ],
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["小学生", "オルタナティブスクール"]
  },
  {
    id: 4,
    title: "ミモザの会",
    description: "",
    body: "不登校でお困りの方　お話ししましょ",
    address: "大野市",
    hours: "毎月第一土曜日",
    contact: "09028378050",
    detailInfo: {
      location: "大野市",
      phone: "09028378050",
      email: "z27a227dc278c@i.softbank.jp",
      website: "",
      target: "不登校生の保護者",
      recommended: "不登校や子育てについて相談したい, 不登校や子育てについて共有したい, 同じ悩みを持つ人と話したい",
      suggestion: "親の会",
      schedule: "毎月第一土曜日",
      fee: "無料",
      other: ""
    },
    // 検索用タグ（フィルタリング用）
    searchTags: {
      grade: ["卒業している場合"],
      situation: ["不登校や子育てについて相談したい", "不登校や子育ての未来について見失わない"],
      facility: ["サークル"]
    },
    images: [
      require('../assets/images/AdobeStock_Preview.png'),
    ],
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["不登校生の保護者", "親の会"]
  },
  {
    id: 5,
    title: "中学受験専門個別指導塾　P!CONT F 福井東教室",
    description: "",
    body: "P!CONT F は県外中学受験まで対応できる個別指導塾です。\n\n県内外の中学受験に向けた勉強はもちろん、普段の勉強のサポートや進路相談も承ります。\n\n不登校を経験していても、受け入れてくれる県外の中学校もあります。幅広い進路選択のサポートをさせていただきます。\n\n通塾以外にも不定期の学習スペース利用も行っております。個別ブースでご自身のペースで過ごすことができます。",
    address: "福井県福井市西方2-11-8",
    hours: "随時",
    contact: "08015263984",
    detailInfo: {
      location: "福井県福井市西方2-11-8",
      phone: "08015263984",
      email: "creperie.in.visby@gmail.com",
      website: "https://picont-f.com/",
      target: "小学生, 不登校生の保護者",
      recommended: "専門的なことを学びたい, 一人で学習したい, 家以外の場所での居場所を見つけたい, 外部とコミュニケーションを取れる場所に行きたい",
      suggestion: "塾",
      schedule: "随時",
      fee: "学習スペースは半日1000円、1日1800円です。通塾は別途ご相談ください。",
      other: "こんにちは。Instagramで拝見し、ご連絡させていただきました。学習塾としての事業がメインですが、空き時間を、さまざまなニーズをお持ちの方にご利用いただきたいと思っております。\n\nよろしくお願いいたします。"
    },
    // 検索用タグ（フィルタリング用）
    searchTags: {
      grade: ["小学生から"],
      situation: ["専門的なことを学びたい", "一人で学習したい", "家以外の場所での居場所を見つけたい", "外部とコミュニケーションを取れる場所に行きたい"],
      facility: ["塾"]
    },
    images: [
      require('../assets/images/AdobeStock_Preview.png'),
    ],
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["小学生", "不登校生の保護者", "塾"]
  },
  {
    id: 6,
    title: "福井県　起立性調節障害　親の会",
    description: "",
    body: "現在、高校から20代前半のお子さんを持つお母さん達が年に何回か集まって色んな悩みや子供達の様子などを話したり情報交換しています。\n　少人数で、みんな困っているお母さん達と繋がりたいなぁと思っています。お気楽に連絡下さい\n　",
    address: "福井県　坂井市",
    hours: "不定期",
    contact: "09017428891",
    detailInfo: {
      location: "福井県　坂井市",
      phone: "09017428891",
      email: "orenji.panda.2015.9@gmail.com",
      website: "",
      target: "小学生, 中学生, 高校生, 不登校生の保護者",
      recommended: "家以外の場所での居場所を見つけたい, 不登校や子育てについて相談したい, 不登校や子育てについて共有したい, お友達を見つけたい, 同じ悩みを持つ人と話したい",
      suggestion: "サークル",
      schedule: "不定期",
      fee: "なし",
      other: ""
    },
    // 検索用タグ（フィルタリング用）
    searchTags: {
      grade: ["小学生から", "中学生から", "高校生から"],
      situation: ["家以外の場所での居場所を見つけたい", "不登校や子育てについて相談したい", "不登校や子育ての未来について見失わない", "友達をさがしたい"],
      facility: ["サークル"]
    },
    images: [
      require('../assets/images/AdobeStock_Preview.png'),
    ],
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["小学生", "中学生", "高校生", "不登校生の保護者", "サークル"]
  },
  {
    id: 7,
    title: "一般社団法人DAISUKI　ごきげん学園",
    description: "",
    body: "ごきげん学園は、1人ひとりの「得意」を伸ばし、自由な発想で学べる新しいスタイルの学び場です。１日２回の授業（自由参加）では、３Dプリンターや農業・AIなど、学校では学べない多彩な学びを取り入れ、自分のペースで成長できる環境を提供します。好きなことに熱中しながら、小さな「できた！」を積み重ね、自信と可能性を広げましょう。",
    address: "福井県福井市米松１丁目15-41　GOKIGENビル１F",
    hours: "平日９時～17時",
    contact: "070-9045-7371",
    detailInfo: {
      location: "福井県福井市米松１丁目15-41　GOKIGENビル１F",
      phone: "070-9045-7371",
      email: "info@daisuki-gokigen.jp",
      website: "https://daisuki-gokigen.jp/",
      target: "小学生, 中学生, 不登校生の保護者",
      recommended: "進学したい, 専門的なことを学びたい, 一人で学習したい, 家以外の場所での居場所を見つけたい, 学校行事に参加したい, 外部とコミュニケーションを取れる場所に行きたい, 不登校や子育てについて共有したい, お友達を見つけたい, 同じ悩みを持つ人と話したい, 保護者サポートもしてほしい",
      suggestion: "フリースクール",
      schedule: "平日９時～17時",
      fee: "月額39,800円（税別)／1回利用5000円（税別)",
      other: ""
    },
    // 検索用タグ（フィルタリング用）
    searchTags: {
      grade: ["小学生から", "中学生から"],
      situation: ["進学したい", "専門的なことを学びたい", "一人で学習したい", "家以外の場所での居場所を見つけたい", "学校行事に参加したい", "外部とコミュニケーションを取れる場所に行きたい", "不登校や子育ての未来について見失わない", "友達をさがしたい"],
      facility: ["フリースクール"]
    },
    images: [
      require('../assets/images/AdobeStock_Preview.png'),
    ],
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["小学生", "中学生", "不登校生の保護者", "フリースクール"]
  },
  {
    id: 8,
    title: "ハローインターナショナル",
    description: "",
    body: "自分にあった環境で勉強を続けたい方\n環境を代えて自分の能力を発揮したい方\n様々な選択肢があることをご存知ですか？\nこれまでも海外留学を経て進学し、活躍されているハローの先輩方が何人もおります",
    address: "",
    hours: "",
    contact: "09034057249",
    detailInfo: {
      location: "",
      phone: "09034057249",
      email: "rie@hello-fukui.jp",
      website: "Hello-fukui.jp",
      target: "小学生, 中学生, 高校生",
      recommended: "進学したい, 専門的なことを学びたい, 一人で学習したい, オンラインで授業を受けたい, 家以外の場所での居場所を見つけたい, 外部とコミュニケーションを取れる場所に行きたい, 環境を変えたい（海外留学・進学）",
      suggestion: "塾, オンラインサポート, 習い事, イベント, ",
      schedule: "",
      fee: "https://share.google/NJrBZIuQHb4kKDyVQ  留学料金別途お問い合わせ下さい",
      other: ""
    },
    // 検索用タグ（フィルタリング用）
    searchTags: {
      grade: ["小学生から", "中学生から", "高校生から"],
      situation: ["進学したい", "専門的なことを学びたい", "一人で学習したい", "オンラインで授業を受けたい", "家以外の場所での居場所を見つけたい", "外部とコミュニケーションを取れる場所に行きたい"],
      facility: ["塾", "オンラインサポート", "習い事", "イベント"]
    },
    images: [
      require('../assets/images/AdobeStock_Preview.png'),
    ],
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["小学生", "中学生", "高校生", "塾", "オンラインサポート", "習い事"]
  },
  {
    id: 9,
    title: "ふくいICT中央高等学院",
    description: "",
    body: "当校はみんなの「こうしたい」を尊重しながら、無理なく、楽しく、 高校卒業資格を取得できるようにスタッフが全力でサポートします。どこからでも、やろうと思った時から始められるのが通信制高校です。\n\nふくいICT 中央高等学院は、3年間の間にやりたいことを見つけて、笑顔で巣立っていけるように、 学習面だけでなくパソコンやデジタルスキルを身につけ、「生きる力」を育みます。安心して私たちに任せてください。",
    address: "福井市大宮3丁目6−9",
    hours: "月曜、火曜、水曜、金曜の10時～17時",
    contact: "0776-97-5509",
    detailInfo: {
      location: "福井市大宮3丁目6−9",
      phone: "0776-97-5509",
      email: "irodori@ell-ict.com",
      website: "https://www.fukui-chuos.com/",
      target: "高校生",
      recommended: "進学したい, 専門的なことを学びたい, 一人で学習したい, 家以外の場所での居場所を見つけたい, 学校行事に参加したい, 外部とコミュニケーションを取れる場所に行きたい, お友達を見つけたい, 同じ悩みを持つ人と話したい",
      suggestion: "通信制サポート校",
      schedule: "月曜、火曜、水曜、金曜の10時～17時",
      fee: "約2万6000円から",
      other: ""
    },
    // 検索用タグ（フィルタリング用）
    searchTags: {
      grade: ["高校生から"],
      situation: ["進学したい", "専門的なことを学びたい", "一人で学習したい", "家以外の場所での居場所を見つけたい", "学校行事に参加したい", "外部とコミュニケーションを取れる場所に行きたい", "友達をさがしたい"],
      facility: ["フリースクール"]
    },
    images: [
      require('../assets/images/AdobeStock_Preview.png'),
    ],
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["高校生", "通信制サポート校"]
  },
  {
    id: 10,
    title: "フリースクール　イロドリ",
    description: "",
    body: "不安や悩みがあっても大丈夫！自分のペースに合わせて週1日～3日を選んで、自分のやりたいことを好きな時間にやります。自分が学び直しをしたい学年や教科を選んでの学習、料理やゲームなどの特別活動、デジタルイラストやパソコンなどのICT学習。「高校に行くために勉強のおさらいをしたい」「生活リズムを整えたい」「人と上手に話せるようになりたい」そんな方にぴったりです。まずは入会相談と見学にお越しください。",
    address: "福井市大宮3丁目6-9",
    hours: "月曜、水曜、金曜の10時～16時45分",
    contact: "0776-97-5509",
    detailInfo: {
      location: "福井市大宮3丁目6-9",
      phone: "0776-97-5509",
      email: "irodori@ell-ict.com",
      website: "https://www.fukui-chuos.com/chu3-free-school/",
      target: "中学生, 中学3年生が対象です",
      recommended: "進学したい, 家以外の場所での居場所を見つけたい, 学校行事に参加したい, 外部とコミュニケーションを取れる場所に行きたい, お友達を見つけたい, 同じ悩みを持つ人と話したい",
      suggestion: "フリースクール",
      schedule: "月曜、水曜、金曜の10時～16時45分",
      fee: "15,400円～",
      other: ""
    },
    // 検索用タグ（フィルタリング用）
    searchTags: {
      grade: ["中学生から"],
      situation: ["進学したい", "家以外の場所での居場所を見つけたい", "学校行事に参加したい", "外部とコミュニケーションを取れる場所に行きたい", "友達をさがしたい"],
      facility: ["フリースクール"]
    },
    images: [
      require('../assets/images/AdobeStock_Preview.png'),
    ],
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["中学生", "フリースクール"]
  },
  {
    id: 11,
    title: "トーキョーコーヒー福井市",
    description: "",
    body: "私自身、娘が小学生の時に不登校で辛い時期もありました。でも、その中での気づきがとても大きく、今では娘が自分の気持ちを大切にしてくれたこと（不登校）に、感謝するほどです。トーキョーコーヒーは、まずは大人がたのしむことを大切にしています。子どもの側にいる大人がまず自分の在りたい姿で生きていること。そのことが子どもたちにとっても、良き育ちに繋がっていくと信じています。気軽に遊びに来てくださいね。",
    address: "福井市自宅",
    hours: "月2、3回",
    contact: "080-6948-7080",
    detailInfo: {
      location: "福井市自宅",
      phone: "080-6948-7080",
      email: "tokiutukusii55@icloud.com",
      website: "https://www.instagram.com/tkcf_fukui_363?igsh=MWxxNmFwZnBrNmE3bQ%3D%3D&utm_source=qr",
      target: "不登校生の保護者, 大人も子どももだれでもどうぞ",
      recommended: "外部とコミュニケーションを取れる場所に行きたい, 不登校や子育てについて相談したい, 不登校や子育てについて共有したい, 不登校や子育てのイベントに参加したい, お友達を見つけたい, 同じ悩みを持つ人と話したい",
      suggestion: "大人も子どもも自分らしく在れる場所",
      schedule: "月2、3回",
      fee: "600円＋イベントによって",
      other: ""
    },
    // 検索用タグ（フィルタリング用）
    searchTags: {
      grade: [],
      situation: [], 
      facility: []
    },
    images: [
      require('../assets/images/AdobeStock_Preview.png'),
    ],
    image: require('../assets/images/AdobeStock_Preview.png'),
    tags: ["タグ1", "タグ2"] // 検索用の簡易タグ
  }
];

export default placeCards;