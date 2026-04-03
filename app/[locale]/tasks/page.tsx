'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Header } from '@/components/Header';
import { Link } from '../../../i18n/navigation';

type TaskRecord = {
  id: string;
  seed_key?: string | null;
  title: string;
  description: string;
  role: string;
  reward_asat: number | string;
  source_label: string;
  status: string;
  claimant_wallet?: string | null;
  claimant_handle?: string | null;
  claimed_at?: string | null;
  proof_text?: string | null;
  proof_url?: string | null;
  submitted_at?: string | null;
  reviewer_note?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  reward_tx_ref?: string | null;
  rewarded_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type RewardRecord = {
  id: string;
  task_id: string;
  wallet_address: string;
  amount_asat: number | string;
  status: string;
  tx_ref?: string | null;
  created_at?: string | null;
  paid_at?: string | null;
};

type TaskApiResponse = {
  ok: boolean;
  openTasks: TaskRecord[];
  myClaimedTasks: TaskRecord[];
  myRewards: RewardRecord[];
  stats: Record<string, number>;
  error?: string;
};

type SupportedLocale = 'fr' | 'es' | 'ar' | 'zh';
type UiLocale = SupportedLocale | 'en';

type LocalizedTaskCopy = {
  title: string;
  description: string;
};

const KNOWN_ROLES = [
  'content',
  'research',
  'outreach',
  'growth_scout',
  'validator',
  'operator',
  'router',
  'scout',
] as const;

const KNOWN_STATUSES = [
  'open',
  'claimed',
  'submitted',
  'approved',
  'rejected',
  'rewarded',
  'pending',
  'paid',
] as const;

const ROLE_OVERRIDES: Record<SupportedLocale, Partial<Record<string, string>>> = {
  fr: {
    content: 'Contenu',
    research: 'Recherche',
    outreach: 'Prospection',
    growth_scout: 'Éclaireur croissance',
    validator: 'Validateur',
    operator: 'Opérateur',
    router: 'Routeur',
    scout: 'Éclaireur',
  },
  es: {
    content: 'Contenido',
    research: 'Investigación',
    outreach: 'Prospección',
    growth_scout: 'Explorador de crecimiento',
    validator: 'Validador',
    operator: 'Operador',
    router: 'Router',
    scout: 'Explorador',
  },
  ar: {
    content: 'محتوى',
    research: 'بحث',
    outreach: 'تواصل',
    growth_scout: 'كشّاف النمو',
    validator: 'مدقّق',
    operator: 'مشغّل',
    router: 'موجّه',
    scout: 'كشّاف',
  },
  zh: {
    content: '内容',
    research: '研究',
    outreach: '外联',
    growth_scout: '增长侦察员',
    validator: '验证员',
    operator: '操作员',
    router: '路由员',
    scout: '侦察员',
  },
};

const TOP_NAV_COPY: Record<
  UiLocale,
  { backHome: string; tasks: string; registry: string; localeLabel: string }
> = {
  en: {
    backHome: 'Back home',
    tasks: 'Tasks',
    registry: 'Registry',
    localeLabel: 'Locale',
  },
  fr: {
    backHome: 'Retour accueil',
    tasks: 'Tâches',
    registry: 'Registre',
    localeLabel: 'Langue',
  },
  es: {
    backHome: 'Volver al inicio',
    tasks: 'Tareas',
    registry: 'Registro',
    localeLabel: 'Idioma',
  },
  ar: {
    backHome: 'العودة للرئيسية',
    tasks: 'المهام',
    registry: 'السجل',
    localeLabel: 'اللغة',
  },
  zh: {
    backHome: '返回首页',
    tasks: '任务',
    registry: '注册表',
    localeLabel: '语言',
  },
};

const SAVE_COPY: Record<
  UiLocale,
  {
    saveButton: string;
    savedButton: string;
    statusSaved: string;
    statusUnsaved: string;
    savedMessage: string;
    enterSomething: string;
    failedMessage: string;
  }
> = {
  en: {
    saveButton: 'Save',
    savedButton: 'Saved',
    statusSaved: 'Saved on this device',
    statusUnsaved: 'Not saved yet',
    savedMessage: 'Wallet and X handle saved on this device.',
    enterSomething: 'Enter a wallet or X handle first.',
    failedMessage: 'Could not save locally.',
  },
  fr: {
    saveButton: 'Sauvegarder',
    savedButton: 'Sauvegardé',
    statusSaved: 'Sauvegardé sur cet appareil',
    statusUnsaved: 'Pas encore sauvegardé',
    savedMessage: 'Adresse wallet et pseudo X sauvegardés sur cet appareil.',
    enterSomething: 'Entrez d’abord une adresse wallet ou un pseudo X.',
    failedMessage: 'Impossible de sauvegarder localement.',
  },
  es: {
    saveButton: 'Guardar',
    savedButton: 'Guardado',
    statusSaved: 'Guardado en este dispositivo',
    statusUnsaved: 'Aún no guardado',
    savedMessage: 'Wallet y usuario de X guardados en este dispositivo.',
    enterSomething: 'Primero ingresa una wallet o usuario de X.',
    failedMessage: 'No se pudo guardar localmente.',
  },
  ar: {
    saveButton: 'حفظ',
    savedButton: 'تم الحفظ',
    statusSaved: 'تم الحفظ على هذا الجهاز',
    statusUnsaved: 'غير محفوظ بعد',
    savedMessage: 'تم حفظ عنوان المحفظة واسم X على هذا الجهاز.',
    enterSomething: 'أدخل أولاً محفظة أو اسم مستخدم X.',
    failedMessage: 'تعذّر الحفظ محليًا.',
  },
  zh: {
    saveButton: '保存',
    savedButton: '已保存',
    statusSaved: '已保存到此设备',
    statusUnsaved: '尚未保存',
    savedMessage: '钱包地址和 X 用户名已保存到此设备。',
    enterSomething: '请先输入钱包地址或 X 用户名。',
    failedMessage: '无法在本地保存。',
  },
};

const TASK_COPY: Record<string, Partial<Record<SupportedLocale, LocalizedTaskCopy>>> = {
  'seed-write-3-x-drafts': {
    fr: {
      title: 'Rédiger 3 brouillons de posts X',
      description:
        'Rédigez 3 brouillons de posts X percutants pour ASAT autour du proof-of-task, des opérateurs et de la coordination agentique.',
    },
    es: {
      title: 'Redactar 3 borradores de posts en X',
      description:
        'Redacta 3 borradores fuertes para X sobre ASAT, proof-of-task, operadores y coordinación de agentes.',
    },
    ar: {
      title: 'اكتب 3 مسودات منشورات على X',
      description:
        'اكتب 3 مسودات قوية لمنشورات X حول ASAT و proof-of-task والمشغّلين وتنسيق الوكلاء.',
    },
    zh: {
      title: '撰写 3 条 X 帖子草稿',
      description:
        '围绕 ASAT、proof-of-task、操作员和代理协作，撰写 3 条高质量的 X 帖子草稿。',
    },
  },
  'seed-find-25-x-accounts': {
    fr: {
      title: 'Trouver 25 comptes X parlant d’agents IA',
      description:
        'Trouvez 25 comptes X actifs qui parlent d’agents IA, de systèmes autonomes et d’infrastructure agentique.',
    },
    es: {
      title: 'Encontrar 25 cuentas de X que hablen de agentes IA',
      description:
        'Encuentra 25 cuentas activas de X que hablen de agentes IA, sistemas autónomos e infraestructura agentica.',
    },
    ar: {
      title: 'ابحث عن 25 حسابًا على X يتحدث عن وكلاء الذكاء الاصطناعي',
      description:
        'اعثر على 25 حسابًا نشطًا على X يتحدث عن وكلاء الذكاء الاصطناعي والأنظمة المستقلة والبنية التحتية الوكيلة.',
    },
    zh: {
      title: '寻找 25 个讨论 AI 代理的 X 账号',
      description:
        '寻找 25 个活跃的 X 账号，这些账号在讨论 AI 代理、自主系统和代理基础设施。',
    },
  },
  'seed-top-10-narratives': {
    fr: {
      title: 'Étudier les 10 principaux récits crypto agentiques',
      description:
        'Étudiez les 10 récits les plus forts autour des agents IA et de l’infrastructure crypto, puis résumez pourquoi ils comptent.',
    },
    es: {
      title: 'Investigar las 10 principales narrativas cripto agenticas',
      description:
        'Investiga las 10 narrativas más fuertes sobre agentes IA e infraestructura cripto y resume por qué importan.',
    },
    ar: {
      title: 'ابحث في أهم 10 سرديات كريبتو مرتبطة بالوكلاء',
      description:
        'ابحث في أقوى 10 سرديات حول وكلاء الذكاء الاصطناعي والبنية التحتية للكريبتو، ثم لخّص لماذا هي مهمة.',
    },
    zh: {
      title: '研究前 10 个代理型加密叙事',
      description:
        '研究围绕 AI 代理与加密基础设施的 10 个最强叙事，并总结它们的重要性。',
    },
  },
  'seed-build-30-project-leads': {
    fr: {
      title: 'Construire une liste de 30 projets cibles',
      description:
        'Construisez une liste propre de 30 projets, fondateurs ou communautés pertinents pour l’outreach ASAT.',
    },
    es: {
      title: 'Construir una lista de 30 proyectos objetivo',
      description:
        'Construye una lista limpia de 30 proyectos, fundadores o comunidades relevantes para el outreach de ASAT.',
    },
    ar: {
      title: 'ابنِ قائمة من 30 مشروعًا مستهدفًا',
      description:
        'ابنِ قائمة مرتبة تضم 30 مشروعًا أو مؤسسًا أو مجتمعًا مناسبًا لجهود outreach الخاصة بـ ASAT.',
    },
    zh: {
      title: '建立 30 个项目线索名单',
      description:
        '整理一份干净的名单，包含 30 个与 ASAT 外联相关的项目、创始人或社区。',
    },
  },
  'seed-review-15-registry': {
    fr: {
      title: 'Examiner 15 entrées du registre',
      description:
        'Examinez 15 entrées récentes du registre pour la qualité, l’adéquation du rôle, les doublons et les signaux suspects.',
    },
    es: {
      title: 'Revisar 15 entradas del registro',
      description:
        'Revisa 15 entradas recientes del registro por calidad, encaje de rol, duplicados y señales sospechosas.',
    },
    ar: {
      title: 'راجع 15 إدخالًا من السجل',
      description:
        'راجع 15 إدخالًا حديثًا في السجل من حيث الجودة وملاءمة الدور والتكرارات والإشارات المشبوهة.',
    },
    zh: {
      title: '审核 15 条注册表记录',
      description:
        '审核 15 条最新注册表记录，检查质量、角色匹配、重复项和可疑信号。',
    },
  },
  'seed-verify-10-proofs': {
    fr: {
      title: 'Vérifier 10 soumissions de preuve',
      description:
        'Examinez 10 soumissions de preuve et laissez des notes claires pass/fail pour la revue admin.',
    },
    es: {
      title: 'Verificar 10 envíos de prueba',
      description:
        'Revisa 10 envíos de prueba y deja notas claras de pass/fail para la revisión admin.',
    },
    ar: {
      title: 'تحقق من 10 عمليات إرسال إثبات',
      description:
        'راجع 10 عمليات إرسال إثبات واترك ملاحظات واضحة بالنجاح أو الفشل لمراجعة الإدارة.',
    },
    zh: {
      title: '验证 10 份证明提交',
      description:
        '审核 10 份证明提交，并为管理员审核留下清晰的通过/失败备注。',
    },
  },
  'seed-summarize-20-mentions': {
    fr: {
      title: 'Résumer 20 mentions d’ASAT',
      description:
        'Collectez et résumez 20 mentions publiques d’ASAT sur X, Telegram et les surfaces communautaires.',
    },
    es: {
      title: 'Resumir 20 menciones de ASAT',
      description:
        'Recoge y resume 20 menciones públicas de ASAT en X, Telegram y superficies comunitarias.',
    },
    ar: {
      title: 'لخّص 20 إشارة إلى ASAT',
      description:
        'اجمع ولخّص 20 إشارة عامة إلى ASAT عبر X وTelegram ومساحات المجتمع.',
    },
    zh: {
      title: '总结 20 条 ASAT 公开提及',
      description:
        '收集并总结 20 条 ASAT 在 X、Telegram 和社区渠道中的公开提及。',
    },
  },
  'seed-15-solana-ai-projects': {
    fr: {
      title: 'Compiler 15 projets IA natifs Solana',
      description:
        'Créez une liste de 15 projets d’agents ou d’automatisation natifs Solana avec URLs et notes courtes.',
    },
    es: {
      title: 'Compilar 15 proyectos de IA nativos de Solana',
      description:
        'Crea una lista de 15 proyectos de agentes o automatización nativos de Solana con URLs y notas breves.',
    },
    ar: {
      title: 'اجمع 15 مشروع ذكاء اصطناعي أصلي على Solana',
      description:
        'أنشئ قائمة تضم 15 مشروعًا أصليًا على Solana في مجال الوكلاء أو الأتمتة مع الروابط وملاحظات مختصرة.',
    },
    zh: {
      title: '整理 15 个 Solana 原生 AI 代理项目',
      description:
        '整理 15 个 Solana 原生代理或自动化项目，并附上链接和简短说明。',
    },
  },
  'seed-20-founders-outreach': {
    fr: {
      title: 'Trouver 20 fondateurs pour un outreach direct',
      description:
        'Trouvez 20 comptes de fondateurs/opérateurs alignés avec l’infrastructure agentique ou les rails IA Solana.',
    },
    es: {
      title: 'Encontrar 20 founders para outreach directo',
      description:
        'Encuentra 20 cuentas de founders u operadores alineadas con infraestructura agentica o rails de IA en Solana.',
    },
    ar: {
      title: 'ابحث عن 20 مؤسسًا للتواصل المباشر',
      description:
        'اعثر على 20 حسابًا لمؤسسين أو مشغّلين متوافقين مع بنية الوكلاء أو مسارات الذكاء الاصطناعي على Solana.',
    },
    zh: {
      title: '寻找 20 位创始人用于直接外联',
      description:
        '寻找 20 个与代理基础设施或 Solana AI 轨道相关的创始人/操作员账号。',
    },
  },
  'seed-5-cold-outreach': {
    fr: {
      title: 'Rédiger 5 messages d’outreach à froid',
      description:
        'Rédigez 5 messages courts d’outreach pour des pistes de partenariat ou d’écosystème ASAT.',
    },
    es: {
      title: 'Redactar 5 mensajes de outreach en frío',
      description:
        'Redacta 5 mensajes cortos de outreach para oportunidades de partnership o ecosistema de ASAT.',
    },
    ar: {
      title: 'اكتب 5 رسائل تواصل بارد',
      description:
        'اكتب 5 رسائل تواصل قصيرة لفرص الشراكات أو النظام البيئي الخاص بـ ASAT.',
    },
    zh: {
      title: '撰写 5 条冷启动外联消息',
      description:
        '撰写 5 条简短的外联消息，用于 ASAT 合作或生态系统机会。',
    },
  },
  'seed-10-reply-templates': {
    fr: {
      title: 'Créer 10 modèles de réponse',
      description:
        'Créez 10 réponses concises pour les questions fréquentes sur le registre, le proof-of-task et la direction produit.',
    },
    es: {
      title: 'Crear 10 plantillas de respuesta',
      description:
        'Crea 10 respuestas concisas para preguntas comunes sobre el registro, proof-of-task y la dirección del producto.',
    },
    ar: {
      title: 'أنشئ 10 قوالب رد',
      description:
        'أنشئ 10 ردود مختصرة على الأسئلة الشائعة حول السجل و proof-of-task واتجاه المنتج.',
    },
    zh: {
      title: '创建 10 个回复模板',
      description:
        '创建 10 条简洁回复，用于注册表、proof-of-task 和产品方向的常见问题。',
    },
  },
  'seed-audit-20-handles': {
    fr: {
      title: 'Auditer 20 handles du registre',
      description:
        'Recoupez 20 handles X du registre et signalez les comptes cassés, faux ou dupliqués.',
    },
    es: {
      title: 'Auditar 20 handles del registro',
      description:
        'Cruza 20 handles de X del registro y marca cuentas rotas, falsas o duplicadas.',
    },
    ar: {
      title: 'دقّق في 20 حسابًا من السجل',
      description:
        'راجع 20 حساب X من السجل وحدد الحسابات المكسورة أو الوهمية أو المكررة.',
    },
    zh: {
      title: '审计 20 个注册表账号',
      description:
        '交叉检查 20 个注册表中的 X 账号，并标记失效、虚假或重复的账号。',
    },
  },
  'seed-12-ai-worker-use-cases': {
    fr: {
      title: 'Étudier 12 cas d’usage pour les workers IA',
      description:
        'Listez 12 tâches numériques que les workers IA pourraient automatiser plus tard dans ASAT.',
    },
    es: {
      title: 'Investigar 12 casos de uso para workers IA',
      description:
        'Lista 12 tareas digitales que los workers IA podrían automatizar más adelante dentro de ASAT.',
    },
    ar: {
      title: 'ابحث في 12 حالة استخدام لعمال الذكاء الاصطناعي',
      description:
        'اسرد 12 مهمة رقمية يمكن لعمال الذكاء الاصطناعي أتمتتها لاحقًا داخل ASAT.',
    },
    zh: {
      title: '研究 12 个 AI Worker 用例',
      description:
        '列出 12 项未来可以由 AI Workers 在 ASAT 中自动化完成的数字任务。',
    },
  },
  'seed-30-telegram-communities': {
    fr: {
      title: 'Trouver 30 communautés Telegram pertinentes',
      description:
        'Construisez une liste de 30 groupes/canaux Telegram où la recherche narrative ASAT a sa place.',
    },
    es: {
      title: 'Encontrar 30 comunidades de Telegram relevantes',
      description:
        'Construye una lista de 30 grupos/canales de Telegram donde la narrativa de ASAT tenga encaje.',
    },
    ar: {
      title: 'ابحث عن 30 مجتمعًا مناسبًا على Telegram',
      description:
        'أنشئ قائمة تضم 30 مجموعة أو قناة Telegram مناسبة لبحث السردية الخاصة بـ ASAT.',
    },
    zh: {
      title: '寻找 30 个相关 Telegram 社区',
      description:
        '建立一份名单，包含 30 个适合 ASAT 叙事研究的 Telegram 群组或频道。',
    },
  },
  'seed-landing-faq': {
    fr: {
      title: 'Rédiger des ajouts FAQ pour la landing page',
      description:
        'Rédigez 6 nouvelles entrées FAQ sur proof-of-task, récompenses et rôles opérateurs.',
    },
    es: {
      title: 'Redactar nuevas FAQ para la landing page',
      description:
        'Redacta 6 nuevas entradas de FAQ sobre proof-of-task, recompensas y roles de operadores.',
    },
    ar: {
      title: 'اكتب إضافات FAQ لصفحة الهبوط',
      description:
        'اكتب 6 عناصر FAQ جديدة حول proof-of-task والمكافآت وأدوار المشغّلين.',
    },
    zh: {
      title: '撰写落地页 FAQ 增补内容',
      description:
        '撰写 6 条新的 FAQ，内容围绕 proof-of-task、奖励和操作员角色。',
    },
  },
  'seed-review-10-lead-lists': {
    fr: {
      title: 'Examiner 10 listes de leads soumises',
      description:
        'Examinez 10 soumissions de listes de leads pour la qualité et retirez les pistes faibles ou hors-sujet.',
    },
    es: {
      title: 'Revisar 10 listas de leads enviadas',
      description:
        'Revisa 10 listas de leads enviadas por calidad y elimina las que sean débiles o irrelevantes.',
    },
    ar: {
      title: 'راجع 10 قوائم leads مُرسلة',
      description:
        'راجع 10 قوائم leads مُرسلة من حيث الجودة واحذف العناصر الضعيفة أو غير ذات الصلة.',
    },
    zh: {
      title: '审核 10 份提交的线索名单',
      description:
        '审核 10 份线索名单提交，检查质量并移除弱质或不相关的条目。',
    },
  },
  'seed-build-25-media-targets': {
    fr: {
      title: 'Construire 25 cibles média',
      description:
        'Construisez une liste média/créateurs de 25 comptes ou outlets à suivre pour les shifts de narrative IA.',
    },
    es: {
      title: 'Construir 25 objetivos de medios',
      description:
        'Construye una lista de 25 cuentas o medios/creadores a seguir para cambios de narrativa en IA.',
    },
    ar: {
      title: 'ابنِ 25 هدفًا إعلاميًا',
      description:
        'أنشئ قائمة إعلامية/منشئي محتوى تضم 25 حسابًا أو منفذًا لمتابعة تحولات سردية الذكاء الاصطناعي.',
    },
    zh: {
      title: '建立 25 个媒体目标',
      description:
        '建立一份媒体/创作者目标名单，包含 25 个值得跟踪 AI 叙事变化的账号或媒体渠道。',
    },
  },
  'seed-3-operator-updates': {
    fr: {
      title: 'Rédiger 3 mises à jour opérateurs',
      description:
        'Rédigez 3 posts de progression pour les opérateurs sur le lancement des récompenses opérateurs et du proof-of-task.',
    },
    es: {
      title: 'Redactar 3 actualizaciones para operadores',
      description:
        'Redacta 3 posts de progreso para operadores sobre el lanzamiento de las recompensas para operadores y de proof-of-task.',
    },
    ar: {
      title: 'اكتب 3 تحديثات للمشغّلين',
      description:
        'اكتب 3 منشورات تقدم للمشغّلين حول إطلاق مكافآت المشغّلين وطبقة proof-of-task.',
    },
    zh: {
      title: '撰写 3 条操作员更新',
      description:
        '撰写 3 条面向操作员的进度更新，内容围绕操作员奖励上线与 proof-of-task 发布。',
    },
  },
  'seed-write-thread': {
    fr: {
      title: 'Rédiger 1 thread de haute qualité',
      description:
        'Rédigez un thread de 8 à 12 posts expliquant pourquoi ASAT n’est pas du mining et comment fonctionne réellement la couche proof-of-task.',
    },
    es: {
      title: 'Redactar 1 hilo de alta calidad',
      description:
        'Redacta un hilo de 8 a 12 posts explicando por qué ASAT no es minería y cómo funciona realmente la capa proof-of-task.',
    },
    ar: {
      title: 'اكتب سلسلة منشورات عالية الجودة',
      description:
        'اكتب سلسلة من 8 إلى 12 منشورًا تشرح لماذا ASAT ليس تعدينًا وكيف تعمل طبقة proof-of-task فعليًا.',
    },
    zh: {
      title: '撰写 1 条高质量长线程',
      description:
        '撰写一条包含 8 到 12 个帖子的长线程，解释为什么 ASAT 不是“挖矿”，以及 proof-of-task 层如何真正运作。',
    },
  },
  'seed-map-15-tool-stacks': {
    fr: {
      title: 'Cartographier 15 stacks d’outils agents',
      description:
        'Cartographiez 15 stacks d’outils IA courants et où ASAT pourrait s’insérer comme couche de coordination ou de règlement.',
    },
    es: {
      title: 'Mapear 15 stacks de herramientas para agentes',
      description:
        'Mapea 15 stacks comunes de herramientas de IA y dónde ASAT podría encajar como capa de coordinación o liquidación.',
    },
    ar: {
      title: 'ارسم خريطة لـ 15 مجموعة أدوات للوكلاء',
      description:
        'ارسم خريطة لـ 15 مجموعة أدوات ذكاء اصطناعي شائعة وحدد أين يمكن لـ ASAT أن ينسجم كطبقة تنسيق أو تسوية.',
    },
    zh: {
      title: '梳理 15 套代理工具栈',
      description:
        '梳理 15 套常见 AI 代理工具栈，并指出 ASAT 可以在哪些位置作为协调或结算层切入。',
    },
  },
};

function humanize(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatNumber(value: number | string | null | undefined, locale: string) {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) ? numeric.toLocaleString(locale) : '0';
}

function formatDate(value: string | null | undefined, locale: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(locale);
}

function isSupportedLocale(value: string): value is SupportedLocale {
  return value === 'fr' || value === 'es' || value === 'ar' || value === 'zh';
}

function getTopNavCopy(locale: string) {
  return TOP_NAV_COPY[(locale as UiLocale)] || TOP_NAV_COPY.en;
}

function getSaveCopy(locale: string) {
  return SAVE_COPY[(locale as UiLocale)] || SAVE_COPY.en;
}

export default function LocalizedTasksPage() {
  const t = useTranslations('LiveTasksPage');
  const locale = useLocale();
  const navCopy = getTopNavCopy(locale);
  const saveCopy = getSaveCopy(locale);
  const isRtl = locale === 'ar';

  const [walletAddress, setWalletAddress] = useState('');
  const [xHandle, setXHandle] = useState('');
  const [activeTab, setActiveTab] = useState<'open' | 'claimed' | 'rewards'>('open');
  const [data, setData] = useState<TaskApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [proofByTaskId, setProofByTaskId] = useState<Record<string, string>>({});
  const [proofUrlByTaskId, setProofUrlByTaskId] = useState<Record<string, string>>({});
  const [identitySaved, setIdentitySaved] = useState(false);

  const contentLocale = isSupportedLocale(locale) ? locale : null;

  const translateRole = (role: string) => {
    const override = contentLocale ? ROLE_OVERRIDES[contentLocale]?.[role] : undefined;
    if (override) return override;

    return KNOWN_ROLES.includes(role as (typeof KNOWN_ROLES)[number])
      ? t(`role.${role as (typeof KNOWN_ROLES)[number]}`)
      : humanize(role);
  };

  const translateStatus = (status: string) => {
    return KNOWN_STATUSES.includes(status as (typeof KNOWN_STATUSES)[number])
      ? t(`status.${status as (typeof KNOWN_STATUSES)[number]}`)
      : humanize(status);
  };

  const translateSourceLabel = (value: string) => {
    if (!value) return t('sourceLabel.platformTask');
    if (value.toLowerCase() === 'platform task') return t('sourceLabel.platformTask');
    return value;
  };

  const localizeTaskCopy = (task: TaskRecord) => {
    if (!contentLocale || !task.seed_key) {
      return {
        title: task.title,
        description: task.description,
      };
    }

    const localized = TASK_COPY[task.seed_key]?.[contentLocale];

    return {
      title: localized?.title || task.title,
      description: localized?.description || task.description,
    };
  };

  function persistIdentity(showFeedback = false) {
    try {
      const trimmedWallet = walletAddress.trim();
      const trimmedHandle = xHandle.trim();

      if (trimmedWallet) {
        window.localStorage.setItem('asat_wallet_address', trimmedWallet);
        window.localStorage.setItem('asat_registry_wallet', trimmedWallet);
      } else {
        window.localStorage.removeItem('asat_wallet_address');
        window.localStorage.removeItem('asat_registry_wallet');
      }

      if (trimmedHandle) {
        window.localStorage.setItem('asat_x_handle', trimmedHandle);
      } else {
        window.localStorage.removeItem('asat_x_handle');
      }

      const didSaveSomething = Boolean(trimmedWallet || trimmedHandle);
      setIdentitySaved(didSaveSomething);

      if (showFeedback) {
        setMessage(saveCopy.savedMessage);
      }

      return true;
    } catch (error) {
      console.error(error);

      if (showFeedback) {
        setMessage(saveCopy.failedMessage);
      }

      return false;
    }
  }

  function handleSaveIdentity() {
    if (!walletAddress.trim() && !xHandle.trim()) {
      setMessage(saveCopy.enterSomething);
      return;
    }

    persistIdentity(true);
  }

  async function loadTasks(wallet = walletAddress) {
    setLoading(true);
    setMessage('');

    try {
      const query = wallet ? `?wallet=${encodeURIComponent(wallet)}` : '';
      const response = await fetch(`/api/tasks${query}`, { cache: 'no-store' });
      const json = (await response.json()) as TaskApiResponse;
      setData(json);

      if (!response.ok || !json.ok) {
        setMessage(json.error || t('messages.failedLoad'));
      }
    } catch (error) {
      console.error(error);
      setMessage(t('messages.failedLoad'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const rememberedWallet =
      window.localStorage.getItem('asat_wallet_address') ||
      window.localStorage.getItem('asat_registry_wallet') ||
      '';
    const rememberedHandle = window.localStorage.getItem('asat_x_handle') || '';

    if (rememberedWallet) {
      setWalletAddress(rememberedWallet);
      void loadTasks(rememberedWallet);
    } else {
      void loadTasks('');
    }

    if (rememberedHandle) {
      setXHandle(rememberedHandle);
    }

    setIdentitySaved(Boolean(rememberedWallet || rememberedHandle));
  }, []);

  const currentList = useMemo(() => {
    if (!data) return [];
    if (activeTab === 'open') return data.openTasks || [];
    if (activeTab === 'claimed') return data.myClaimedTasks || [];
    return data.myRewards || [];
  }, [activeTab, data]);

  async function handleClaim(taskId: string) {
    if (!walletAddress.trim()) {
      setMessage(t('messages.enterWallet'));
      return;
    }

    setBusyTaskId(taskId);
    setMessage('');

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'claim',
          taskId,
          walletAddress,
          xHandle,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.ok) {
        setMessage(json.error || t('messages.couldNotClaim'));
        return;
      }

      persistIdentity(false);
      setMessage(t('messages.claimed'));
      setActiveTab('claimed');
      await loadTasks(walletAddress);
    } catch (error) {
      console.error(error);
      setMessage(t('messages.couldNotClaim'));
    } finally {
      setBusyTaskId(null);
    }
  }

  async function handleSubmit(taskId: string) {
    setBusyTaskId(taskId);
    setMessage('');

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          taskId,
          walletAddress,
          proofText: proofByTaskId[taskId] || '',
          proofUrl: proofUrlByTaskId[taskId] || '',
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.ok) {
        setMessage(json.error || t('messages.couldNotSubmit'));
        return;
      }

      setMessage(t('messages.submitted'));
      await loadTasks(walletAddress);
    } catch (error) {
      console.error(error);
      setMessage(t('messages.couldNotSubmit'));
    } finally {
      setBusyTaskId(null);
    }
  }

  return (
    <>
      <Header />

      <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#050816] text-white">
        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                {navCopy.backHome}
              </Link>

              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
                {navCopy.tasks}
              </div>

              <Link
                href="/registry"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                {navCopy.registry}
              </Link>

              <div className="rounded-full border border-white/10 bg-[#0A0F22] px-4 py-2 text-sm text-slate-300">
                {navCopy.localeLabel}: {locale.toUpperCase()}
              </div>
            </div>

            <div className="space-y-4">
              <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-[11px] uppercase tracking-[0.28em] text-cyan-200">
                {t('eyebrow')}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{t('boardLabel')}</p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                    {t('title')}
                  </h1>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                    {t('subtitle')}
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        {t('fields.walletAddress')}
                      </span>
                      <input
                        value={walletAddress}
                        onChange={(event) => {
                          setWalletAddress(event.target.value);
                          setIdentitySaved(false);
                        }}
                        placeholder={t('placeholders.wallet')}
                        className="w-full rounded-2xl border border-white/10 bg-[#0A0F22] px-4 py-3 text-sm outline-none transition focus:border-cyan-400/50"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        {t('fields.xHandleOptional')}
                      </span>
                      <input
                        value={xHandle}
                        onChange={(event) => {
                          setXHandle(event.target.value);
                          setIdentitySaved(false);
                        }}
                        placeholder={t('placeholders.xHandle')}
                        className="w-full rounded-2xl border border-white/10 bg-[#0A0F22] px-4 py-3 text-sm outline-none transition focus:border-cyan-400/50"
                      />
                    </label>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={handleSaveIdentity}
                      className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                    >
                      {identitySaved ? saveCopy.savedButton : saveCopy.saveButton}
                    </button>

                    <button
                      onClick={() => loadTasks(walletAddress)}
                      className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                    >
                      {t('buttons.refreshBoard')}
                    </button>

                    <button
                      onClick={() => setActiveTab('claimed')}
                      className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                    >
                      {t('buttons.goToClaimed')}
                    </button>

                    <div
                      className={`rounded-2xl border px-4 py-3 text-sm ${
                        identitySaved
                          ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
                          : 'border-white/10 bg-white/5 text-slate-300'
                      }`}
                    >
                      {identitySaved ? saveCopy.statusSaved : saveCopy.statusUnsaved}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{t('stats.openTasks')}</p>
                    <p className="mt-2 text-3xl font-semibold">{formatNumber(data?.stats?.open, locale)}</p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {t('stats.submittedForReview')}
                    </p>
                    <p className="mt-2 text-3xl font-semibold">
                      {formatNumber(data?.stats?.submitted, locale)}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{t('stats.rewardedTasks')}</p>
                    <p className="mt-2 text-3xl font-semibold">
                      {formatNumber(data?.stats?.rewarded, locale)}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {t('stats.asatDistributed')}
                    </p>
                    <p className="mt-2 text-3xl font-semibold">
                      {formatNumber(data?.stats?.totalRewardedAsat, locale)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { key: 'open', label: t('tabs.open') },
                { key: 'claimed', label: t('tabs.claimed') },
                { key: 'rewards', label: t('tabs.rewards') },
              ].map((tab) => {
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as 'open' | 'claimed' | 'rewards')}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-cyan-400 text-black'
                        : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {message ? (
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                {message}
              </div>
            ) : null}

            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-slate-300">
                {t('messages.loading')}
              </div>
            ) : currentList.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-slate-300">
                {activeTab === 'open'
                  ? t('empty.open')
                  : activeTab === 'claimed'
                    ? t('empty.claimed')
                    : t('empty.rewards')}
              </div>
            ) : (
              <div className="grid gap-4">
                {activeTab !== 'rewards'
                  ? (currentList as TaskRecord[]).map((task) => {
                      const proofText = proofByTaskId[task.id] || '';
                      const proofUrl = proofUrlByTaskId[task.id] || '';
                      const isBusy = busyTaskId === task.id;
                      const localized = localizeTaskCopy(task);

                      return (
                        <div
                          key={task.id}
                          className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/10"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="space-y-3">
                              <div className="flex flex-wrap gap-2">
                                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-200">
                                  {translateSourceLabel(task.source_label)}
                                </span>
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-300">
                                  {translateRole(task.role)}
                                </span>
                                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-emerald-200">
                                  {formatNumber(task.reward_asat, locale)} ASAT
                                </span>
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-300">
                                  {translateStatus(task.status)}
                                </span>
                              </div>

                              <div>
                                <h2 className="text-2xl font-semibold tracking-tight">{localized.title}</h2>
                                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
                                  {localized.description}
                                </p>
                              </div>
                            </div>

                            {activeTab === 'open' ? (
                              <button
                                onClick={() => handleClaim(task.id)}
                                disabled={isBusy}
                                className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
                              >
                                {isBusy ? t('buttons.claiming') : t('buttons.claimTask')}
                              </button>
                            ) : null}
                          </div>

                          {activeTab === 'claimed' && task.status === 'claimed' ? (
                            <div className="mt-5 grid gap-4 rounded-3xl border border-white/10 bg-[#0A0F22] p-5">
                              <label className="space-y-2">
                                <span className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                  {t('fields.proofText')}
                                </span>
                                <textarea
                                  value={proofText}
                                  onChange={(event) =>
                                    setProofByTaskId((current) => ({
                                      ...current,
                                      [task.id]: event.target.value,
                                    }))
                                  }
                                  rows={6}
                                  placeholder={t('placeholders.proofText')}
                                  className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-sm outline-none transition focus:border-cyan-400/50"
                                />
                              </label>

                              <label className="space-y-2">
                                <span className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                  {t('fields.proofUrlOptional')}
                                </span>
                                <input
                                  value={proofUrl}
                                  onChange={(event) =>
                                    setProofUrlByTaskId((current) => ({
                                      ...current,
                                      [task.id]: event.target.value,
                                    }))
                                  }
                                  placeholder={t('placeholders.proofUrl')}
                                  className="w-full rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-sm outline-none transition focus:border-cyan-400/50"
                                />
                              </label>

                              <div className="flex flex-wrap gap-3">
                                <button
                                  onClick={() => handleSubmit(task.id)}
                                  disabled={isBusy}
                                  className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-60"
                                >
                                  {isBusy ? t('buttons.submitting') : t('buttons.submitProof')}
                                </button>

                                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                                  {t('fields.claimedAt')}: {formatDate(task.claimed_at, locale)}
                                </div>
                              </div>
                            </div>
                          ) : null}

                          {activeTab === 'claimed' && task.status !== 'claimed' ? (
                            <div className="mt-5 grid gap-3 rounded-3xl border border-white/10 bg-[#0A0F22] p-5 text-sm text-slate-300">
                              <div>{t('fields.claimedAt')}: {formatDate(task.claimed_at, locale)}</div>
                              <div>{t('fields.submittedAt')}: {formatDate(task.submitted_at, locale)}</div>
                              <div>{t('fields.reviewedAt')}: {formatDate(task.reviewed_at, locale)}</div>
                              <div>{t('fields.reviewer')}: {task.reviewed_by || '—'}</div>
                              <div>{t('fields.reviewerNote')}: {task.reviewer_note || '—'}</div>
                              <div>{t('fields.rewardTxRef')}: {task.reward_tx_ref || '—'}</div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })
                  : (currentList as RewardRecord[]).map((reward) => (
                      <div
                        key={reward.id}
                        className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/10"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                              {t('rewardRecord')}
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                              {formatNumber(reward.amount_asat, locale)} ASAT
                            </h2>
                            <div className="mt-3 grid gap-2 text-sm text-slate-300">
                              <div>{t('fields.status')}: {translateStatus(reward.status)}</div>
                              <div>{t('fields.created')}: {formatDate(reward.created_at, locale)}</div>
                              <div>{t('fields.paid')}: {formatDate(reward.paid_at, locale)}</div>
                              <div>{t('fields.txRef')}: {reward.tx_ref || '—'}</div>
                            </div>
                          </div>

                          <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-emerald-200">
                            {translateStatus(reward.status)}
                          </span>
                        </div>
                      </div>
                    ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
