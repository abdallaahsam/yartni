import bcrypt from 'bcryptjs';
import { db, initDatabase } from './index.js';
import { slugify } from '../utils/slugify.js';

async function seed() {
  console.log('🌱 Starting Yareetni database seeding...');
  
  // Ensure tables exist
  initDatabase();

  // Clean existing data
  db.prepare('DELETE FROM comments').run();
  db.prepare('DELETE FROM advice_impacts').run();
  db.prepare('DELETE FROM bookmarks').run();
  db.prepare('DELETE FROM reports').run();
  db.prepare('DELETE FROM notifications').run();
  db.prepare('DELETE FROM advices').run();
  db.prepare('DELETE FROM users').run();
  db.prepare('DELETE FROM categories').run();

  // Reset sqlite sequences
  try {
    db.prepare('DELETE FROM sqlite_sequence').run();
  } catch (e) {}

  console.log('🧹 Cleaned existing tables.');

  // 1. Seed Categories
  const categories = [
    {
      name: 'دراسة وتعليم',
      slug: 'education',
      icon: '🎓',
      color: '#3B82F6',
      display_order: 1,
      description: 'نصائح الثانوية، اختيار التخصص الجامعي، المذاكرة الذكية والمنح الدراسية'
    },
    {
      name: 'عمل ومسار مهني',
      slug: 'career',
      icon: '💼',
      color: '#8B5CF6',
      display_order: 2,
      description: 'أول وظيفة، التفاوض على الراتب، تغيير المجال، وبيئة العمل'
    },
    {
      name: 'مال واستثمار',
      slug: 'money',
      icon: '💰',
      color: '#10B981',
      display_order: 3,
      description: 'الادخار، إدارة الديون، صناديق الطوارئ، والاستثمار المبكر'
    },
    {
      name: 'علاقات وصداقة',
      slug: 'relationships',
      icon: '🤝',
      color: '#F43F5E',
      display_order: 4,
      description: 'اختيار الأصدقاء، وضع الحدود الصحية، والعلاقات العاطفية الناضجة'
    },
    {
      name: 'صحة ونمط حياة',
      slug: 'health',
      icon: '🏃',
      color: '#06B6D4',
      display_order: 5,
      description: 'اللياقة البدنية، النوم الصحي، التغذية، والصحة النفسية'
    },
    {
      name: 'تطوير ذات ونفسية',
      slug: 'mindset',
      icon: '🧠',
      color: '#F59E0B',
      display_order: 6,
      description: 'إدارة التوتر، مواجهة متلازمة المحتال، والتعامل مع الندم والتسويف'
    },
    {
      name: 'عائلة وأسرة',
      slug: 'family',
      icon: '🏡',
      color: '#EC4899',
      display_order: 7,
      description: 'بر الوالدين، الزواج، الاستقلال الأسري، وتربية الأبناء'
    }
  ];

  const insertCatStmt = db.prepare(`
    INSERT INTO categories (name, slug, icon, color, display_order, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const categoryMap = {};
  for (const cat of categories) {
    const res = insertCatStmt.run(cat.name, cat.slug, cat.icon, cat.color, cat.display_order, cat.description);
    categoryMap[cat.slug] = res.lastInsertRowid;
  }
  console.log(`✅ Seeded ${categories.length} categories.`);

  // 2. Seed Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const usersData = [
    {
      username: 'tarek_finance',
      name: 'طارق عبد السلام',
      email: 'tarek@example.com',
      current_age: 38,
      bio: 'مستشار مالي ومستثمر، بحب أشارك أخطائي المالية قبل نجاحاتي.',
      avatar_color: '#10B981'
    },
    {
      username: 'dr_sarah',
      name: 'د. سارة المنشاوي',
      email: 'sarah@example.com',
      current_age: 34,
      bio: 'طبيبة ومحاضرة جامعية، مهتمة بنقل خبرات الموازنة بين الدراسة والحياة.',
      avatar_color: '#EC4899'
    },
    {
      username: 'omar_tech',
      name: 'عمر النجار',
      email: 'omar@example.com',
      current_age: 32,
      bio: 'مهندس برمجيات ومدير تقني سابق، تعلمت البرمجة بعد سن الـ 25.',
      avatar_color: '#3B82F6'
    },
    {
      username: 'hoda_coach',
      name: 'هدى مصطفى',
      email: 'hoda@example.com',
      current_age: 44,
      bio: 'لايف كوتش وأم لثلاثة شباب، شغفي توجيه الجيل الصاعد لتفادي صدمات الحياة.',
      avatar_color: '#F59E0B'
    },
    {
      username: 'karim_mentor',
      name: 'كريم زهران',
      email: 'karim@example.com',
      current_age: 29,
      bio: 'رائد أعمال في مجال التجارة الإلكترونية، مررت بتجربة إفلاس وتعلمت منها الكثير.',
      avatar_color: '#8B5CF6'
    },
    {
      username: 'gamal_veteran',
      name: 'م. جمال الباز',
      email: 'gamal@example.com',
      current_age: 52,
      bio: 'مهندس استشاري وأب وجد، بعد أكثر من ربع قرن من التجارب أنقل لكم ما تعلمته بعد الأربعين.',
      avatar_color: '#0D9488'
    }
  ];

  const insertUserStmt = db.prepare(`
    INSERT INTO users (username, name, email, password_hash, current_age, bio, avatar_color)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const userMap = {};
  for (const u of usersData) {
    const res = insertUserStmt.run(u.username, u.name, u.email, passwordHash, u.current_age, u.bio, u.avatar_color);
    userMap[u.username] = res.lastInsertRowid;
  }
  console.log(`✅ Seeded ${usersData.length} users.`);

  // 3. Seed Realistic Arabic Life Advice
  const advicesData = [
    {
      username: 'tarek_finance',
      category: 'money',
      target_age: 20,
      headline: 'ياريتني بدأت أحوّش 10% من أي قرش يدخل جيبي وأنا في الجامعة',
      story: 'كنت في سن العشرين فاكر إن الادخار ده للناس الكبار اللي عندهم مرتبات ضخمة، وكل ما كان بيجيلي مصروف أو فلوس من شغل حر بسيط كنت بصرفها كلها على الخروجات واللبس اللي ملوش لازمة. لما تخرجت وجت أول فرصة سفر، لقيت نفسي معنديش حتى مصاريف التذكرة والإجراءات، واضطررت أستلف وأبدأ حياتي مديون.',
      lesson: 'لو رجع بيا الزمن هفتح حساب بنكي منفصل ملوش فيزا سهلة السحب، وأحوّش 10% إلى 15% من أي دخل مهما كان 200 جنيه أو 2000 جنيه، لأن العادة أهم بكتير من المبلغ نفسه.',
      is_anonymous: 0,
      views: 240
    },
    {
      username: 'dr_sarah',
      category: 'education',
      target_age: 18,
      headline: 'ياريتني ما ضيعت أول سنة جامعة في القلق على التقديرات بدون بناء مهارات حقيقية',
      story: 'دخلت الجامعة محملة بعقدة الثانوية العامة، ليل ونهار أذاكر الملازم كلمة بكلمة عشان أجيب امتياز، ومكنتش بشترك في أي نشاط طلابي ولا بحضر مؤتمرات ولا اتعلمت لغة تانية. في المقابل زمايلي اللي كانوا بيجيبوا جيد جداً لكن عندهم مهارات تواصل وإنجليزي قوي أخدوا أفضل فرص تدريب صيفي.',
      lesson: 'لو رجع بيا الزمن هركز إني أحافظ على تقدير جيد جداً، لكن هخصص 40% من وقتي لتعلم الإنجليزية بطلاقة وتكوين شبكة علاقات والنزول للأنشطة والتدريب العملي من أول إجازة صيفية.',
      is_anonymous: 0,
      views: 310
    },
    {
      username: 'omar_tech',
      category: 'career',
      target_age: 22,
      headline: 'ياريتني ما استمريت في شركة سامة لمجرد خوفي من انقطاع الراتب',
      story: 'أول شغل اشتغلته بعد التخرج كان في شركة مديرها بيتعمد الإهانة وبيطلب شغل 14 ساعة يومياً حتى في الإجازات بدون مقابل. كنت مرعوب إني لو سبتها مش هلاقي شغل، وقعدت فيها سنتين ونص لحد ما جالي اكتئاب وأثرت على صحتي، وفي الآخر لما سبتها لقيت شغل أفضل في خلال شهرين بس.',
      lesson: 'لو رجع بيا الزمن هقدم على وظائف تانية من أول ما أحس ببيئة سامة ومستحيل أسمح لأي مدير يقلل من كرامتي، وهعرف إن مهاراتي هي رأس مالي مش مكان العمل.',
      is_anonymous: 0,
      views: 450
    },
    {
      username: 'hoda_coach',
      category: 'relationships',
      target_age: 24,
      headline: 'ياريتني فهمت إن الصديق اللي بيستنزف طاقتك مش لازم يفضل صاحب عمرك',
      story: 'كان عندي شلة أصحاب من المدرسة مكملين معايا للجامعة وبداية الشغل. كان فيهم اتنين كلامهم كله إحباط وتريقة على أي طموح أو خطوة أخدها لقدام. كنت بحس بذنب فظيع لو بعدت عنهم عشان كلمة "عشرة سنين". النتيجة إني اتأخرت كتير في قرارات مصيرية بسبب كلامهم المحبط.',
      lesson: 'لو رجع بيا الزمن هحط حدود صارمة ومستحيل أشارك أهدافي مع شخص سلبي، وهفهم إن جودة الأصدقاء اللي بتشجعك أهم بمليون مرة من عدد السنين اللي عشتوها سوا.',
      is_anonymous: 0,
      views: 185
    },
    {
      username: 'karim_mentor',
      category: 'career',
      target_age: 25,
      headline: 'ياريتني ما بدأت مشروعي الأول بدون دراسة دقيقة للكاش فلو والسيولة',
      story: 'كان عندي حماس الشباب وعملت وكالة تسويق، ركزت على المظاهر ومكتب فخم في التجمع الخامس ومعدات تصوير غالية قبل ما أتأكد من وجود عملاء منتظمين. بعد 7 شهور الفلوس خلصت ومكنتش قادر أدفع إيجار الشهر الجاي واضطررت أقفل وخسرت تحويشة عمري.',
      lesson: 'لو رجع بيا الزمن هبدأ من البيت بأقل إمكانيات ممكنة (Bootstrap)، وهختبر السوق الأول بأقل تكلفة، ومش هدفع قرش في مظاهر قبل ما أضمن تدفق نقدي أرباحه تغطي مصاريف 6 شهور مقدماً.',
      is_anonymous: 0,
      views: 390
    },
    {
      username: 'tarek_finance',
      category: 'mindset',
      target_age: 21,
      headline: 'ياريتني بطلت أقارن بداياتي بمواسم حصاد الآخرين على السوشيال ميديا',
      story: 'كنت بفتح إنستجرام وفيسبوك أشوف ناس في سني أو أكبر بسنتين راكبين عربيات جديدة أو بيسافروا أوروبا، وكنت بحس بفشل وإحباط تام وأقول أنا متأخر ومفيش أمل. لما كبرت عرفت إن 90% من اللي بيظهر ده قشور وديون أو دعم عائلي ملوش علاقة بكفاءتهم الحقيقية.',
      lesson: 'لو رجع بيا الزمن هقلل استخدام السوشيال ميديا لساعة واحدة يومياً، وهقارن نفسي بنسختي القديمة الشهر اللي فات فقط، لأن مسارك الحياتي ليه توقيته الخاص بيك تماماً.',
      is_anonymous: 1, // Anonymous example!
      views: 520
    },
    {
      username: 'dr_sarah',
      category: 'health',
      target_age: 23,
      headline: 'ياريتني ما أهملت ألم ضهري ومارست رياضة التقوية والنوم بدري',
      story: 'أيام سهر النبطشيات والمذاكرة كنت بقعد 10 ساعات متواصلة على كرسي مش مريح وباكل وجبات سريعة. في سن الـ 28 اكتشفت انزلاق غضروفي خلاني مش قادرة أقف نص ساعة متواصلة، والدكاترة قالولي ده تراكم إهمال سنين أوائل العشرينات.',
      lesson: 'لو رجع بيا الزمن هخصص 45 دقيقة مشي أو جيم 3 مرات أسبوعياً كأولوية قصوى زي الشغل بالظبط، وهشتري كرسي طبي مريح، لأن صحتك لما بتضيع مفيش فلوس هتعوضها.',
      is_anonymous: 0,
      views: 290
    },
    {
      username: 'omar_tech',
      category: 'education',
      target_age: 19,
      headline: 'ياريتني اتعلمت إنجليزي بالممارسة الحقيقية مش بحفظ قواعد الجرامر في الكشاكيل',
      story: 'فضلت سنين في كورسات إنجليزي بذاكر قواعد وامتحانات، بس لما قعدت في أول إنترفيو لشركة أجنبية لساني اتقل ومكنتش عارف أركب جملتين على بعض وضاعت الفرصة. التحول حصل لما بدأت أتكلم وأسمع بودكاست وأتفرج على فيديوهات بدون ترجمة.',
      lesson: 'لو رجع بيا الزمن هخلي موبايلي واليوتيوب وبودكاست اليوم كله إنجليزي، وهتكلم مع أجانب أو في برامج تبادل لغات يومياً نصف ساعة، الجرأة في الكلام أهم من الكمال اللغوي.',
      is_anonymous: 0,
      views: 610
    },
    {
      username: 'hoda_coach',
      category: 'family',
      target_age: 26,
      headline: 'ياريتني قعدت وقت أطول مع أهلي وسجلت حكاياتهم قبل ما تفوت الأيام',
      story: 'في سن الـ 26 كنت دايمًا مشغول؛ شغل الصبح، جيم العصر، وخروجات بالليل. ماما كانت تقولي اقعدي اشربي شاي معايا وأقولها ورايا مشوار. لما بابا توفى فجأة حسيت بندم عمري إني ضيعت فرص الجلوس والضحك وحضنه على حاجات تافهة كانت تستنى.',
      lesson: 'لو رجع بيا الزمن هخصص يوم أسبوعياً مخصص فقط للأهل، هسمع حكاياتهم وأسجلها بموبايلي وأحضنهم في كل فرصة، لأن وجود الأهل في حياتنا نعمة مؤقتة مش دائمة.',
      is_anonymous: 1, // Anonymous example
      views: 740
    },
    {
      username: 'karim_mentor',
      category: 'money',
      target_age: 28,
      headline: 'ياريتني ما دخلت في جمعيات وقروض عشان مظاهر فرح ومصاريف شكلية',
      story: 'عشان أرضي كلام الناس ونظرة الأقارب، عملت فرح ضخم في فندق وكتبت وصولات أمانة وأخدت قرض بنكي. بعد الفرح بأسبوعين لما بدأنا الحياة الواقعية، كنا بنعاني شهرياً عشان نسدد 70% من دخلنا للديون وفضلنا تحت ضغط نفسي 3 سنين كاملة.',
      lesson: 'لو رجع بيا الزمن هعمل فرح بسيط ومبهج للمقربين فقط، والفلوس اللي كانت هتروح في ليلة واحدة هستثمرها في شقة أو مشروع يجيب عائد مستمر.',
      is_anonymous: 0,
      views: 430
    },
    {
      username: 'tarek_finance',
      category: 'career',
      target_age: 30,
      headline: 'ياريتني فهمت إنك كل سنتين أو تلاتة لازم تراجع قيمتك السوقية وتتفاوض أو تنتقل',
      story: 'فضلت في شركة واحدة 6 سنين بدون زيادة حقيقية غير التضخم، بحجة الولاء للشركة. لما اتفتحت شركة منافسة وعملت معاهم مقابلة، عرضوا عليا ضعف المرتب اللي كنت باخده بالظبط! اكتشفت إني خسرت مئات الآلاف بسبب خوفي من المقابلات.',
      lesson: 'لو رجع بيا الزمن هعمل مقابلة كل سنة حتى لو مش ناوي أمشي، بس عشان أعرف قيمتي في السوق، ومش هستمر في مكان أكتر من 3 سنين لو مفيش ترقية أو زيادة ملموسة تواكب خبرتي.',
      is_anonymous: 0,
      views: 360
    },
    {
      username: 'dr_sarah',
      category: 'mindset',
      target_age: 27,
      headline: 'ياريتني اتعلمت كلمة "لأ" بدون ما أحس بذنب وتبريرات طويلة',
      story: 'كنت زمان بوافق على أي خدمة، أي مشوار ملوش لازمة، وأي شغل إضافي يرميه عليا زمايلي عشان بس ما يزعلوش مني وميقولوش عني مغرورة. النتيجة إني كنت برجع البيت منهكة ومفيش طاقة لنفسي ولا لحياتي الشخصية.',
      lesson: 'لو رجع بيا الزمن هقول "بعتذر، مش هقدر أساعدك المرة دي" بكل هدوء وابتسامة بدون ما أبرر ولا اعتذر ميت مرة، لأن وقتك وطاقتك ملكك وحدك.',
      is_anonymous: 0,
      views: 480
    },
    {
      username: 'tarek_finance',
      category: 'money',
      target_age: 32,
      headline: 'ياريتني استثمرت في صناديق استثمارية وأصول إنتاجية بدل ترك الكاش في البنك يتآكل',
      story: 'جمعت مبلغ محترم في بداية الثلاثينات وكنت فخور بيه، لكن سبته في حساب جاري عادي من غير استثمار خوفاً من أي مخاطرة. بعد موجات التضخم وانخفاض العملة اكتشفت إن القوة الشرائية لتحويشة سنين خسرت أكتر من 40%، بينما اللي اشترى أصول أو دخل صناديق حافظ على فلوسه وزادت.',
      lesson: 'لو رجع بيا الزمن هحتفظ فقط بمصاريف طوارئ لـ 6 شهور في البنك، والباقي هوزعه شهرياً في صناديق استثمارية وذهب وأصول تدر دخلاً وتسبق التضخم.',
      is_anonymous: 0,
      views: 390
    },
    {
      username: 'hoda_coach',
      category: 'career',
      target_age: 35,
      headline: 'ياريتني عرفت إن الاحتراق الوظيفي (Burnout) مش وسام شرف وإن صحتك النفسية أهم',
      story: 'في سن الـ 35 كنت بشتغل 16 ساعة متواصلة وفاكر إني خارق، حتى إجازاتي كنت بقضيها في الرد على الإيميلات. فجأة وقعت في أزمة قلبية خفيفة وانهيار عصبي أبعدني عن العمل 6 أشهر كاملة، والمفاجأة إن الشركة استمرت واشتغلت بدون أي عطلة، بينما أنا اللي دفعت تمن صحتي.',
      lesson: 'لو رجع بيا الزمن هقفل لابتوب الشغل بمجرد انتهاء ساعات العمل الرسمية، وهفهم إن ما فيش وظيفة في العالم تستاهل تخسر نومك وصحتك وراحة بالك عشانها.',
      is_anonymous: 0,
      views: 570
    },
    {
      username: 'gamal_veteran',
      category: 'health',
      target_age: 40,
      headline: 'ياريتني عملت فحصاً طبياً شاملاً سنوياً وبدأت رياضة المشي اليومية قبل الأربعين',
      story: 'قبل سن الأربعين مكنتش بشتكي من أي حاجة وفاكر جسمي هيفضل شباب للأبد. أهملت شرب المياه وكنت بطلب أكل جاهز كل يوم. في سن الـ 43 اكتشفت سكر وضغط بشكل مفاجئ، وكان ممكن تدارك الموضوع تماماً لو كنت محافظ على 40 دقيقة مشي يومي وفحص سنوي.',
      lesson: 'لو رجع بيا الزمن هعمل فحص دم وسكر ووظائف كلى وكبد كل عيد ميلاد، وهعتبر المشي نصف ساعة يومياً فرض صحي مش رفاهية.',
      is_anonymous: 0,
      views: 680
    },
    {
      username: 'gamal_veteran',
      category: 'family',
      target_age: 45,
      headline: 'ياريتني شاركت أولادي هواياتهم واهتماماتهم وهم مراهقين بدل لغة الأوامر والتوجيه الجاف',
      story: 'لما كانوا أولادي في سن 14 و 16 سنة كنت دايمًا بتعامل بمنطق الأب الآمر الناهي: ذاكروا، اقفلوا الموبايل، ناموا بدري. مكنتش بقعد أسمعهم ولا ألعب معاهم بلايستيشن ولا أفهم جيلهم بيفكر إزاي. النتيجة إنهم كبروا وبقى بينا حاجز صمت وجفاء أخد مني سنين طويلة عشان أصلحه.',
      lesson: 'لو رجع بيا الزمن هنزل لمستوى اهتمامات أولادي، هسمع أكتر ما أتكلم، وهصاحبهم قبل ما أحاسبهم، لأن الأبوة حب ومشاركة مش إدارة شركة.',
      is_anonymous: 0,
      views: 820
    }
  ];

  const insertAdviceStmt = db.prepare(`
    INSERT INTO advices (
      user_id, category_id, target_age, author_age_at_post,
      slug, headline, story, lesson, is_anonymous, view_count, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?))
  `);

  const adviceIds = [];
  let dayOffset = -15;

  for (const item of advicesData) {
    const userId = userMap[item.username];
    const categoryId = categoryMap[item.category];
    const authorAge = usersData.find(u => u.username === item.username).current_age;
    const baseSlug = slugify(item.headline);
    const dateModifier = `${dayOffset} days`;
    dayOffset += 1;

    const res = insertAdviceStmt.run(
      userId,
      categoryId,
      item.target_age,
      authorAge,
      baseSlug,
      item.headline,
      item.story,
      item.lesson,
      item.is_anonymous,
      item.views,
      dateModifier
    );
    adviceIds.push(res.lastInsertRowid);
  }
  console.log(`✅ Seeded ${advicesData.length} rich life advices.`);

  // 4. Seed Interactions (Impacts and Comments)
  const insertImpactStmt = db.prepare(`
    INSERT INTO advice_impacts (advice_id, user_id, created_at)
    VALUES (?, ?, datetime('now', '-2 days'))
  `);

  const insertCommentStmt = db.prepare(`
    INSERT INTO comments (advice_id, user_id, content, created_at)
    VALUES (?, ?, ?, datetime('now', '-1 days'))
  `);

  // Distribute realistic impacts
  const allUserIds = Object.values(userMap);
  for (let i = 0; i < adviceIds.length; i++) {
    const adviceId = adviceIds[i];
    // Give each advice 2-4 impacts from different users
    const numImpacts = 2 + (i % 3);
    for (let j = 0; j < numImpacts && j < allUserIds.length; j++) {
      try {
        insertImpactStmt.run(adviceId, allUserIds[j]);
      } catch (e) {}
    }
  }

  // Seed sample discussion comments
  const sampleComments = [
    { adviceIdx: 0, user: 'omar_tech', content: 'نصيحة ذهبية فعلاً، أنا بدأت متأخر في سن الـ 26 وحسيت بفارق شاسع، يا ريت كل شاب في الجامعة يقرأ ده.' },
    { adviceIdx: 0, user: 'dr_sarah', content: 'أتفق بشدة، الأهم هو غرس عادة الادخار حتى لو بمبلغ رمزي.' },
    { adviceIdx: 1, user: 'karim_mentor', content: 'كلام يوزن دهب.. المهارات واللغة هما اللي بيفتحوا الأبواب المغلقة.' },
    { adviceIdx: 2, user: 'tarek_finance', content: 'أهم درس اتعلمته في حياتي: صحتك النفسية وكرامتك أغلى من أي راتب شهري.' },
    { adviceIdx: 5, user: 'hoda_coach', content: 'مقارنة النفس بالآخرين على السوشيال ميديا هي أكبر سارق للسعادة والإنجاز في عصرنا.' },
    { adviceIdx: 8, user: 'omar_tech', content: 'رحم الله والدك، كلامك لمس قلبي جداً وخلاني أقوم حالا أقعد مع والدتي وأسلم عليها.' }
  ];

  for (const c of sampleComments) {
    if (adviceIds[c.adviceIdx] && userMap[c.user]) {
      insertCommentStmt.run(adviceIds[c.adviceIdx], userMap[c.user], c.content);
    }
  }

  console.log('✅ Seeded sample impacts and thoughtful comments.');
  console.log('🎉 Database seeding completed successfully!');
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
