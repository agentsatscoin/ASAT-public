'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AsatLogo } from '@/components/AsatLogo';
import {
  autoConnectPhantom,
  connectPhantom,
  disconnectPhantom,
  getPhantomBrowserSdk,
  getPhantomErrorMessage,
} from '@/lib/phantom-browser-sdk';

const ASAT_MINT =
  process.env.NEXT_PUBLIC_ASAT_MINT ||
  'HumYaGUBQva6HgP9BNqioicEGijVRK2xtSUMiT4gpump';

const STORAGE_KEYS = {
  wallets: [
    'asat.registry.walletAddress',
    'asat_wallet_address',
    'asat_registry_wallet',
    'asat_phantom_connected_wallet',
  ] as const,
  usernames: ['asat.registry.username', 'asat_x_handle'] as const,
  role: 'asat.registry.role',
  tier: 'asat.registry.tier',
} as const;

type LocaleKey = 'en' | 'fr' | 'es' | 'ar' | 'zh';
type TierKey = 'starter' | 'standard' | 'premium';
type TierLabel = 'Starter' | 'Standard' | 'Premium' | 'Unverified';
type RoleKey = 'operator' | 'validator' | 'router' | 'scout';
type ActivityStatus =
  | 'registered'
  | 'working'
  | 'in_review'
  | 'reward_pending'
  | 'rewarded';
type PerformanceSortMode = 'rewarded' | 'active' | 'recent';

interface Agent {
  id: string;
  wallet_address: string;
  asat_balance: number;
  tier: string;
  role: string;
  x_handle?: string | null;
  reward_status: string;
  created_at: string;
  status?: string | null;
  signature?: string | null;
}

interface Stats {
  total: number;
  byTier: {
    starter: number;
    standard: number;
    premium: number;
  };
  byRole: {
    operator: number;
    validator: number;
    router: number;
    scout: number;
  };
  byRewardStatus: {
    pending: number;
    rewarded: number;
  };
  pooledAssetsUsd?: number | null;
  stakedAsat?: number | null;
  lastRegistration?: string | null;
}

interface OperatorPerformance {
  walletAddress: string;
  tasksClaimedTotal: number;
  tasksInProgress: number;
  tasksSubmittedForReview: number;
  tasksRewarded: number;
  taskRewardedAsatTotal: number;
  rewardRecordsTotal: number;
  rewardPendingCount: number;
  rewardPaidCount: number;
  rewardPaidAsatTotal: number;
  lastTaskActivityAt: string | null;
  activityStatus: ActivityStatus;
}

interface PhantomPublicKey {
  toString(): string;
}

interface PhantomConnectResponse {
  publicKey?: PhantomPublicKey | null;
}

interface PhantomSignatureResponse {
  signature?: Uint8Array | number[];
}

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: PhantomPublicKey | null;
  isConnected?: boolean;
  connect: (
    options?: { onlyIfTrusted?: boolean }
  ) => Promise<PhantomConnectResponse>;
  signMessage?: (
    message: Uint8Array,
    display?: 'utf8' | 'hex'
  ) => Promise<PhantomSignatureResponse>;
  request?: (args: { method: string; params?: any }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  off?: (event: string, handler: (...args: any[]) => void) => void;
}

type UiStrings = {
  shell: {
    title: string;
    subtitle: string;
  };
  connect: {
    step: string;
    title: string;
    subtitle: string;
    button: string;
    connecting: string;
    refresh: string;
    disconnect: string;
    walletAddress: string;
    asatBalance: string;
    tier: string;
    registrationLock: string;
    missingTitle: string;
    missingBody: string;
    openInPhantom: string;
    installPhantom: string;
    continueWithoutWallet: string;
    browserHint: string;
  };
  register: {
    step: string;
    title: string;
    xHandle: string;
    verifyBefore: string;
    signAndRegister: string;
    awaitingApproval: string;
    savedFound: string;
    wallet: string;
    username: string;
    registered: string;
    tierConfirmed: string;
    roleConfirmed: string;
    enterTaskLayer: string;
    registerNewWallet: string;
  };
  sections: {
    rewardPool: string;
    rewardPoolSub: string;
    latestEntries: string;
    latestEntriesSub: string;
    statusRail: string;
    protocol: string;
  };
  columns: {
    wallet: string;
    status: string;
    rewardedAsat: string;
    liveWork: string;
    role: string;
    tier: string;
    operatorStatus: string;
  };
  states: {
    registered: string;
    working: string;
    inReview: string;
    rewardPending: string;
    rewarded: string;
  };
  roles: {
    operator: string;
    validator: string;
    router: string;
    scout: string;
    unknown: string;
  };
  sort: {
    rewarded: string;
    active: string;
    recent: string;
  };
  rail: {
    registeredAgents: string;
    activeOperators: string;
    inReview: string;
    rewardedOperators: string;
  };
  meta: {
    lastActivity: string;
    active: string;
    inReview: string;
    rewardedTaskOne: string;
    rewardedTaskMany: string;
    noTaskActivityYet: string;
    noRewardedPerformanceYet: string;
    rewardedSuffix: string;
    registeredOn: string;
    noRegistryEntriesYet: string;
    contract: string;
    contractVerified: string;
    registryBalances: string;
  };
  errors: {
    phantomMissing: string;
    rejected: string;
    popupOpen: string;
    connectFailed: string;
    invalidSelection: string;
    balanceUnverified: string;
    alreadyRegistered: string;
    registerFailed: string;
  };
};

const UI_BY_LOCALE: Record<LocaleKey, UiStrings> = {
  en: {
    shell: {
      title: 'ASAT Agent Registry',
      subtitle:
        'Register your wallet, secure your tier, and establish your position in the ASAT operator registry.',
    },
    connect: {
      step: 'Step 1',
      title: 'Connect Wallet',
      subtitle:
        'Connect your Solana wallet to verify ASAT balance and continue with registration.',
      button: 'Connect Phantom Wallet',
      connecting: 'Connecting...',
      refresh: 'Retry Balance Lookup',
      disconnect: 'Disconnect',
      walletAddress: 'Wallet Address',
      asatBalance: 'ASAT Balance',
      tier: 'Tier',
      registrationLock:
        'Registration stays locked until ASAT balance is verified and the message is signed in Phantom.',
      missingTitle: 'Phantom not detected',
      missingBody:
        'Some users do not have the extension installed, or they are opening the page outside the Phantom browser. Choose one of the options below.',
      openInPhantom: 'Try Phantom Browser',
      installPhantom: 'Install Phantom',
      continueWithoutWallet: 'Continue without wallet',
      browserHint:
        'On mobile, opening this page inside Phantom usually works better than sending users directly to install.',
    },
    register: {
      step: 'Step 2',
      title: 'Choose Your Role',
      xHandle: 'Username / X Handle',
      verifyBefore: 'Verify ASAT Balance Before Registering',
      signAndRegister: 'Sign & Register',
      awaitingApproval: 'Awaiting Phantom Approval...',
      savedFound: 'Saved registration data found',
      wallet: 'Wallet',
      username: 'Username',
      registered: 'Wallet registered ✓',
      tierConfirmed: 'Tier confirmed',
      roleConfirmed: 'Role confirmed',
      enterTaskLayer: 'Enter Task Layer →',
      registerNewWallet: 'Register new wallet',
    },
    sections: {
      rewardPool: 'Early Operator Reward Pool',
      rewardPoolSub: 'Real operator performance based on completed work and rewards.',
      latestEntries: 'Latest Registry Entries',
      latestEntriesSub: 'Newest wallet registrations with real operator activity state.',
      statusRail: 'Status Rail',
      protocol: 'Protocol',
    },
    columns: {
      wallet: 'Wallet',
      status: 'Status',
      rewardedAsat: 'Rewarded ASAT',
      liveWork: 'Live Work',
      role: 'Role',
      tier: 'Tier',
      operatorStatus: 'Operator Status',
    },
    states: {
      registered: 'Registered',
      working: 'Working',
      inReview: 'In Review',
      rewardPending: 'Reward Pending',
      rewarded: 'Rewarded',
    },
    roles: {
      operator: 'Operator',
      validator: 'Validator',
      router: 'Router',
      scout: 'Scout',
      unknown: 'Unknown',
    },
    sort: {
      rewarded: 'Top Rewarded',
      active: 'Most Active',
      recent: 'Most Recent',
    },
    rail: {
      registeredAgents: 'Registered Agents',
      activeOperators: 'Active Operators',
      inReview: 'In Review',
      rewardedOperators: 'Rewarded Operators',
    },
    meta: {
      lastActivity: 'Last activity',
      active: 'active',
      inReview: 'in review',
      rewardedTaskOne: 'rewarded task',
      rewardedTaskMany: 'rewarded tasks',
      noTaskActivityYet: 'No task activity yet',
      noRewardedPerformanceYet: 'No operator performance yet.',
      rewardedSuffix: 'ASAT rewarded',
      registeredOn: 'Registered',
      noRegistryEntriesYet: 'No registry entries yet.',
      contract: 'Solana mainnet contract',
      contractVerified:
        'Contract verified on Solana mainnet. Registry tier is derived from live verified ASAT balance at registration.',
      registryBalances: 'Registry balances currently total',
    },
    errors: {
      phantomMissing: 'Phantom is not available in this browser.',
      rejected: 'Wallet connection was rejected in Phantom.',
      popupOpen: 'Phantom approval window is already open. Approve or close it first.',
      connectFailed: 'Failed to connect wallet.',
      invalidSelection: 'Please connect a wallet and select a role.',
      balanceUnverified: 'Wallet connected, but ASAT balance could not be verified yet.',
      alreadyRegistered: 'This wallet is already registered.',
      registerFailed: 'Registration failed. Please try again.',
    },
  },
  fr: {
    shell: {
      title: 'Registre agent ASAT',
      subtitle:
        'Enregistrez votre wallet, sécurisez votre tier et établissez votre position dans le registre opérateur ASAT.',
    },
    connect: {
      step: 'Étape 1',
      title: 'Connecter le wallet',
      subtitle:
        'Connectez votre wallet Solana pour vérifier le solde ASAT et continuer l’inscription.',
      button: 'Connecter Phantom',
      connecting: 'Connexion...',
      refresh: 'Relancer la vérification du solde',
      disconnect: 'Déconnecter',
      walletAddress: 'Adresse wallet',
      asatBalance: 'Solde ASAT',
      tier: 'Tier',
      registrationLock:
        'L’inscription reste verrouillée jusqu’à la vérification du solde ASAT et la signature du message dans Phantom.',
      missingTitle: 'Phantom non détecté',
      missingBody:
        'Certains utilisateurs n’ont pas l’extension installée, ou ouvrent la page hors du navigateur Phantom. Choisissez une option ci-dessous.',
      openInPhantom: 'Essayer dans Phantom',
      installPhantom: 'Installer Phantom',
      continueWithoutWallet: 'Continuer sans wallet',
      browserHint:
        'Sur mobile, ouvrir cette page dans Phantom marche souvent mieux qu’un renvoi direct vers l’installation.',
    },
    register: {
      step: 'Étape 2',
      title: 'Choisissez votre rôle',
      xHandle: 'Pseudo / Handle X',
      verifyBefore: 'Vérifiez le solde ASAT avant inscription',
      signAndRegister: 'Signer et enregistrer',
      awaitingApproval: 'En attente de validation Phantom...',
      savedFound: 'Données d’inscription sauvegardées trouvées',
      wallet: 'Wallet',
      username: 'Pseudo',
      registered: 'Wallet enregistré ✓',
      tierConfirmed: 'Tier confirmé',
      roleConfirmed: 'Rôle confirmé',
      enterTaskLayer: 'Entrer dans la Task Layer →',
      registerNewWallet: 'Enregistrer un nouveau wallet',
    },
    sections: {
      rewardPool: 'Pool de récompenses opérateurs',
      rewardPoolSub:
        'Performance réelle des opérateurs basée sur le travail complété et les récompenses.',
      latestEntries: 'Dernières entrées du registre',
      latestEntriesSub:
        'Les inscriptions les plus récentes avec statut opérateur réel.',
      statusRail: 'Rail de statut',
      protocol: 'Protocole',
    },
    columns: {
      wallet: 'Wallet',
      status: 'Statut',
      rewardedAsat: 'ASAT récompensés',
      liveWork: 'Travail en cours',
      role: 'Rôle',
      tier: 'Tier',
      operatorStatus: 'Statut opérateur',
    },
    states: {
      registered: 'Enregistré',
      working: 'Actif',
      inReview: 'En revue',
      rewardPending: 'Récompense en attente',
      rewarded: 'Récompensé',
    },
    roles: {
      operator: 'Opérateur',
      validator: 'Validateur',
      router: 'Routeur',
      scout: 'Éclaireur',
      unknown: 'Inconnu',
    },
    sort: {
      rewarded: 'Top récompensés',
      active: 'Plus actifs',
      recent: 'Plus récents',
    },
    rail: {
      registeredAgents: 'Agents enregistrés',
      activeOperators: 'Opérateurs actifs',
      inReview: 'En revue',
      rewardedOperators: 'Opérateurs récompensés',
    },
    meta: {
      lastActivity: 'Dernière activité',
      active: 'actif',
      inReview: 'en revue',
      rewardedTaskOne: 'tâche récompensée',
      rewardedTaskMany: 'tâches récompensées',
      noTaskActivityYet: 'Aucune activité de tâche pour le moment',
      noRewardedPerformanceYet: 'Aucune performance opérateur pour le moment.',
      rewardedSuffix: 'ASAT récompensés',
      registeredOn: 'Enregistré',
      noRegistryEntriesYet: 'Aucune entrée de registre pour le moment.',
      contract: 'Contrat Solana mainnet',
      contractVerified:
        'Contrat vérifié sur Solana mainnet. Le tier du registre est dérivé du solde ASAT vérifié en direct à l’inscription.',
      registryBalances: 'Les soldes du registre totalisent actuellement',
    },
    errors: {
      phantomMissing: 'Phantom n’est pas disponible dans ce navigateur.',
      rejected: 'La connexion wallet a été refusée dans Phantom.',
      popupOpen:
        'La fenêtre d’approbation Phantom est déjà ouverte. Validez-la ou fermez-la d’abord.',
      connectFailed: 'Échec de connexion du wallet.',
      invalidSelection: 'Veuillez connecter un wallet et sélectionner un rôle.',
      balanceUnverified:
        'Wallet connecté, mais le solde ASAT n’a pas encore pu être vérifié.',
      alreadyRegistered: 'Ce wallet est déjà enregistré.',
      registerFailed: 'Échec de l’inscription. Réessayez.',
    },
  },
  es: {
    shell: {
      title: 'Registro de agentes ASAT',
      subtitle:
        'Registra tu wallet, asegura tu tier y establece tu posición dentro del registro de operadores ASAT.',
    },
    connect: {
      step: 'Paso 1',
      title: 'Conectar wallet',
      subtitle:
        'Conecta tu wallet de Solana para verificar el saldo ASAT y continuar con el registro.',
      button: 'Conectar Phantom',
      connecting: 'Conectando...',
      refresh: 'Reintentar verificación de saldo',
      disconnect: 'Desconectar',
      walletAddress: 'Dirección wallet',
      asatBalance: 'Saldo ASAT',
      tier: 'Tier',
      registrationLock:
        'El registro permanece bloqueado hasta que el saldo ASAT sea verificado y el mensaje sea firmado en Phantom.',
      missingTitle: 'Phantom no detectado',
      missingBody:
        'Algunos usuarios no tienen la extensión instalada, o abren la página fuera del navegador Phantom. Elige una opción abajo.',
      openInPhantom: 'Probar en Phantom',
      installPhantom: 'Instalar Phantom',
      continueWithoutWallet: 'Continuar sin wallet',
      browserHint:
        'En móvil, abrir esta página dentro de Phantom suele funcionar mejor que enviar al usuario directo a instalar.',
    },
    register: {
      step: 'Paso 2',
      title: 'Elige tu rol',
      xHandle: 'Usuario / Handle de X',
      verifyBefore: 'Verifica saldo ASAT antes de registrarte',
      signAndRegister: 'Firmar y registrar',
      awaitingApproval: 'Esperando aprobación de Phantom...',
      savedFound: 'Se encontraron datos guardados de registro',
      wallet: 'Wallet',
      username: 'Usuario',
      registered: 'Wallet registrada ✓',
      tierConfirmed: 'Tier confirmado',
      roleConfirmed: 'Rol confirmado',
      enterTaskLayer: 'Entrar a Task Layer →',
      registerNewWallet: 'Registrar nueva wallet',
    },
    sections: {
      rewardPool: 'Pool de recompensa de operadores',
      rewardPoolSub:
        'Rendimiento real de operadores basado en trabajo completado y recompensas.',
      latestEntries: 'Últimas entradas del registro',
      latestEntriesSub:
        'Registros más recientes con estado real de actividad del operador.',
      statusRail: 'Panel de estado',
      protocol: 'Protocolo',
    },
    columns: {
      wallet: 'Wallet',
      status: 'Estado',
      rewardedAsat: 'ASAT recompensados',
      liveWork: 'Trabajo activo',
      role: 'Rol',
      tier: 'Tier',
      operatorStatus: 'Estado del operador',
    },
    states: {
      registered: 'Registrado',
      working: 'Trabajando',
      inReview: 'En revisión',
      rewardPending: 'Recompensa pendiente',
      rewarded: 'Recompensado',
    },
    roles: {
      operator: 'Operador',
      validator: 'Validador',
      router: 'Router',
      scout: 'Explorador',
      unknown: 'Desconocido',
    },
    sort: {
      rewarded: 'Más recompensados',
      active: 'Más activos',
      recent: 'Más recientes',
    },
    rail: {
      registeredAgents: 'Agentes registrados',
      activeOperators: 'Operadores activos',
      inReview: 'En revisión',
      rewardedOperators: 'Operadores recompensados',
    },
    meta: {
      lastActivity: 'Última actividad',
      active: 'activo',
      inReview: 'en revisión',
      rewardedTaskOne: 'tarea recompensada',
      rewardedTaskMany: 'tareas recompensadas',
      noTaskActivityYet: 'Aún no hay actividad de tareas',
      noRewardedPerformanceYet: 'Aún no hay rendimiento de operadores.',
      rewardedSuffix: 'ASAT recompensados',
      registeredOn: 'Registrado',
      noRegistryEntriesYet: 'Aún no hay entradas de registro.',
      contract: 'Contrato Solana mainnet',
      contractVerified:
        'Contrato verificado en Solana mainnet. El tier del registro se deriva del saldo ASAT verificado en vivo durante el registro.',
      registryBalances: 'Los saldos del registro suman actualmente',
    },
    errors: {
      phantomMissing: 'Phantom no está disponible en este navegador.',
      rejected: 'La conexión wallet fue rechazada en Phantom.',
      popupOpen:
        'La ventana de aprobación de Phantom ya está abierta. Apruébala o ciérrala primero.',
      connectFailed: 'No se pudo conectar la wallet.',
      invalidSelection: 'Conecta una wallet y selecciona un rol.',
      balanceUnverified:
        'Wallet conectada, pero el saldo ASAT aún no pudo verificarse.',
      alreadyRegistered: 'Esta wallet ya está registrada.',
      registerFailed: 'El registro falló. Inténtalo de nuevo.',
    },
  },
  ar: {
    shell: {
      title: 'سجل وكلاء ASAT',
      subtitle:
        'سجّل محفظتك، ثبّت tier الخاص بك، وحدد موقعك داخل سجل مشغّلي ASAT.',
    },
    connect: {
      step: 'الخطوة 1',
      title: 'ربط المحفظة',
      subtitle:
        'اربط محفظة Solana الخاصة بك للتحقق من رصيد ASAT ومتابعة التسجيل.',
      button: 'ربط Phantom',
      connecting: 'جارٍ الربط...',
      refresh: 'إعادة محاولة التحقق من الرصيد',
      disconnect: 'فصل',
      walletAddress: 'عنوان المحفظة',
      asatBalance: 'رصيد ASAT',
      tier: 'الفئة',
      registrationLock:
        'يبقى التسجيل مقفلاً حتى يتم التحقق من رصيد ASAT وتوقيع الرسالة داخل Phantom.',
      missingTitle: 'لم يتم اكتشاف Phantom',
      missingBody:
        'بعض المستخدمين لا يملكون الإضافة مثبتة، أو يفتحون الصفحة خارج متصفح Phantom. اختر أحد الخيارات أدناه.',
      openInPhantom: 'جرّب داخل Phantom',
      installPhantom: 'تثبيت Phantom',
      continueWithoutWallet: 'المتابعة بدون محفظة',
      browserHint:
        'على الهاتف، فتح هذه الصفحة داخل Phantom يكون غالبًا أفضل من إرسال المستخدم مباشرة إلى التثبيت.',
    },
    register: {
      step: 'الخطوة 2',
      title: 'اختر دورك',
      xHandle: 'اسم المستخدم / X Handle',
      verifyBefore: 'تحقق من رصيد ASAT قبل التسجيل',
      signAndRegister: 'وقّع وسجّل',
      awaitingApproval: 'بانتظار موافقة Phantom...',
      savedFound: 'تم العثور على بيانات تسجيل محفوظة',
      wallet: 'المحفظة',
      username: 'اسم المستخدم',
      registered: 'تم تسجيل المحفظة ✓',
      tierConfirmed: 'تم تأكيد tier',
      roleConfirmed: 'تم تأكيد الدور',
      enterTaskLayer: 'ادخل إلى Task Layer →',
      registerNewWallet: 'تسجيل محفظة جديدة',
    },
    sections: {
      rewardPool: 'مجمع مكافآت المشغّلين',
      rewardPoolSub: 'أداء حقيقي للمشغّلين بناءً على العمل المكتمل والمكافآت.',
      latestEntries: 'أحدث إدخالات السجل',
      latestEntriesSub:
        'أحدث عمليات التسجيل مع حالة نشاط حقيقية للمشغّل.',
      statusRail: 'شريط الحالة',
      protocol: 'البروتوكول',
    },
    columns: {
      wallet: 'المحفظة',
      status: 'الحالة',
      rewardedAsat: 'ASAT المُكافأة',
      liveWork: 'العمل النشط',
      role: 'الدور',
      tier: 'الفئة',
      operatorStatus: 'حالة المشغّل',
    },
    states: {
      registered: 'مسجل',
      working: 'يعمل',
      inReview: 'قيد المراجعة',
      rewardPending: 'مكافأة معلّقة',
      rewarded: 'تمت مكافأته',
    },
    roles: {
      operator: 'مشغّل',
      validator: 'مدقّق',
      router: 'موجّه',
      scout: 'كشّاف',
      unknown: 'غير معروف',
    },
    sort: {
      rewarded: 'الأعلى مكافأة',
      active: 'الأكثر نشاطًا',
      recent: 'الأحدث',
    },
    rail: {
      registeredAgents: 'الوكلاء المسجلون',
      activeOperators: 'المشغّلون النشطون',
      inReview: 'قيد المراجعة',
      rewardedOperators: 'المشغّلون المُكافأون',
    },
    meta: {
      lastActivity: 'آخر نشاط',
      active: 'نشط',
      inReview: 'قيد المراجعة',
      rewardedTaskOne: 'مهمة تمت مكافأتها',
      rewardedTaskMany: 'مهام تمت مكافأتها',
      noTaskActivityYet: 'لا يوجد نشاط مهام بعد',
      noRewardedPerformanceYet: 'لا يوجد أداء للمشغّلين بعد.',
      rewardedSuffix: 'ASAT تمت مكافأتها',
      registeredOn: 'تم التسجيل',
      noRegistryEntriesYet: 'لا توجد إدخالات سجل بعد.',
      contract: 'عقد Solana mainnet',
      contractVerified:
        'تم التحقق من العقد على Solana mainnet. يتم اشتقاق tier السجل من رصيد ASAT المتحقق منه مباشرة عند التسجيل.',
      registryBalances: 'إجمالي أرصدة السجل حاليًا',
    },
    errors: {
      phantomMissing: 'Phantom غير متاح في هذا المتصفح.',
      rejected: 'تم رفض ربط المحفظة داخل Phantom.',
      popupOpen:
        'نافذة موافقة Phantom مفتوحة بالفعل. وافق عليها أو أغلقها أولاً.',
      connectFailed: 'فشل ربط المحفظة.',
      invalidSelection: 'يرجى ربط محفظة واختيار دور.',
      balanceUnverified:
        'تم ربط المحفظة، لكن لم يتم التحقق من رصيد ASAT بعد.',
      alreadyRegistered: 'هذه المحفظة مسجلة بالفعل.',
      registerFailed: 'فشل التسجيل. حاول مرة أخرى.',
    },
  },
  zh: {
    shell: {
      title: 'ASAT 代理注册表',
      subtitle:
        '注册你的钱包，确认你的 tier，并在 ASAT 操作员注册表中建立位置。',
    },
    connect: {
      step: '步骤 1',
      title: '连接钱包',
      subtitle:
        '连接你的 Solana 钱包以验证 ASAT 余额并继续注册流程。',
      button: '连接 Phantom',
      connecting: '连接中...',
      refresh: '重新尝试余额查询',
      disconnect: '断开连接',
      walletAddress: '钱包地址',
      asatBalance: 'ASAT 余额',
      tier: '层级',
      registrationLock:
        '只有在验证 ASAT 余额并在 Phantom 中签署消息后，注册才会解锁。',
      missingTitle: '未检测到 Phantom',
      missingBody:
        '有些用户没有安装扩展，或者是在 Phantom 浏览器之外打开此页面。请选择下面的一个选项。',
      openInPhantom: '在 Phantom 中打开',
      installPhantom: '安装 Phantom',
      continueWithoutWallet: '无钱包继续',
      browserHint:
        '在移动端中，直接在 Phantom 内打开此页面通常比直接跳转安装更好。',
    },
    register: {
      step: '步骤 2',
      title: '选择你的角色',
      xHandle: '用户名 / X Handle',
      verifyBefore: '注册前先验证 ASAT 余额',
      signAndRegister: '签名并注册',
      awaitingApproval: '等待 Phantom 批准中...',
      savedFound: '发现已保存的注册数据',
      wallet: '钱包',
      username: '用户名',
      registered: '钱包已注册 ✓',
      tierConfirmed: '层级已确认',
      roleConfirmed: '角色已确认',
      enterTaskLayer: '进入 Task Layer →',
      registerNewWallet: '注册新钱包',
    },
    sections: {
      rewardPool: '早期操作员奖励池',
      rewardPoolSub: '基于已完成工作与奖励的真实操作员表现。',
      latestEntries: '最新注册表条目',
      latestEntriesSub: '显示真实操作员活动状态的最新注册记录。',
      statusRail: '状态栏',
      protocol: '协议',
    },
    columns: {
      wallet: '钱包',
      status: '状态',
      rewardedAsat: '已奖励 ASAT',
      liveWork: '进行中的工作',
      role: '角色',
      tier: '层级',
      operatorStatus: '操作员状态',
    },
    states: {
      registered: '已注册',
      working: '进行中',
      inReview: '审核中',
      rewardPending: '奖励待发',
      rewarded: '已奖励',
    },
    roles: {
      operator: '操作员',
      validator: '验证员',
      router: '路由员',
      scout: '侦察员',
      unknown: '未知',
    },
    sort: {
      rewarded: '奖励最高',
      active: '最活跃',
      recent: '最近活动',
    },
    rail: {
      registeredAgents: '已注册代理',
      activeOperators: '活跃操作员',
      inReview: '审核中',
      rewardedOperators: '已奖励操作员',
    },
    meta: {
      lastActivity: '最近活动',
      active: '活跃',
      inReview: '审核中',
      rewardedTaskOne: '已奖励任务',
      rewardedTaskMany: '已奖励任务',
      noTaskActivityYet: '尚无任务活动',
      noRewardedPerformanceYet: '尚无操作员表现数据。',
      rewardedSuffix: 'ASAT 已奖励',
      registeredOn: '已注册',
      noRegistryEntriesYet: '尚无注册记录。',
      contract: 'Solana 主网合约',
      contractVerified:
        '合约已在 Solana 主网上验证。注册层级基于注册时实时验证的 ASAT 余额。',
      registryBalances: '当前注册表余额总计',
    },
    errors: {
      phantomMissing: '此浏览器中未检测到 Phantom。',
      rejected: 'Phantom 中的钱包连接被拒绝。',
      popupOpen: 'Phantom 批准窗口已打开，请先批准或关闭它。',
      connectFailed: '钱包连接失败。',
      invalidSelection: '请先连接钱包并选择角色。',
      balanceUnverified: '钱包已连接，但尚无法验证 ASAT 余额。',
      alreadyRegistered: '该钱包已注册。',
      registerFailed: '注册失败，请重试。',
    },
  },
};

const EMPTY_STATS: Stats = {
  total: 0,
  byTier: {
    starter: 0,
    standard: 0,
    premium: 0,
  },
  byRole: {
    operator: 0,
    validator: 0,
    router: 0,
    scout: 0,
  },
  byRewardStatus: {
    pending: 0,
    rewarded: 0,
  },
  pooledAssetsUsd: 0,
  stakedAsat: 0,
  lastRegistration: null,
};

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function shortWallet(walletAddress: string): string {
  if (!walletAddress) return '—';
  if (walletAddress.length <= 16) return walletAddress;
  return `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}`;
}

function getPhantomProvider(): PhantomProvider | null {
  if (typeof window === 'undefined') return null;

  const browserWindow = window as Window & {
    phantom?: {
      solana?: PhantomProvider;
    };
    solana?: PhantomProvider;
  };

  const provider = browserWindow.phantom?.solana ?? browserWindow.solana;
  return provider?.isPhantom ? provider : null;
}

function bytesToBase64(value: Uint8Array | number[]): string {
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
  let binary = '';

  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

function getTierKey(balance: number): TierKey {
  if (balance > 5000) return 'premium';
  if (balance > 1000) return 'standard';
  return 'starter';
}

function getTierLabel(balance: number): Exclude<TierLabel, 'Unverified'> {
  if (balance > 5000) return 'Premium';
  if (balance > 1000) return 'Standard';
  return 'Starter';
}

function normalizeTierLabel(value: string | null | undefined): TierLabel {
  const key = String(value ?? '')
    .trim()
    .toLowerCase();

  if (key === 'premium' || key === 'gold' || key === 'elite') return 'Premium';
  if (key === 'standard' || key === 'silver') return 'Standard';
  if (key === 'starter' || key === 'bronze') return 'Starter';
  return 'Unverified';
}

function getLocalizedRoleLabel(
  role: string | null | undefined,
  ui: UiStrings
): string {
  switch (String(role ?? '').toLowerCase()) {
    case 'operator':
      return ui.roles.operator;
    case 'validator':
      return ui.roles.validator;
    case 'router':
      return ui.roles.router;
    case 'scout':
      return ui.roles.scout;
    default:
      return ui.roles.unknown;
  }
}

function normalizeRoleKey(role: string | null | undefined): RoleKey | '' {
  switch (String(role ?? '').toLowerCase()) {
    case 'operator':
      return 'operator';
    case 'validator':
      return 'validator';
    case 'router':
      return 'router';
    case 'scout':
      return 'scout';
    default:
      return '';
  }
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function getTime(value: string | null | undefined) {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function normalizeStats(data: any): Stats {
  const byTier = data?.byTier ?? data?.tiers ?? {};
  const byRole = data?.byRole ?? data?.roles ?? {};
  const byRewardStatus = data?.byRewardStatus ?? data?.rewards ?? {};

  return {
    total: toNumber(data?.total),
    byTier: {
      starter: toNumber(byTier?.starter),
      standard: toNumber(byTier?.standard),
      premium: toNumber(byTier?.premium),
    },
    byRole: {
      operator: toNumber(byRole?.operator),
      validator: toNumber(byRole?.validator),
      router: toNumber(byRole?.router),
      scout: toNumber(byRole?.scout),
    },
    byRewardStatus: {
      pending: toNumber(byRewardStatus?.pending),
      rewarded: toNumber(byRewardStatus?.rewarded),
    },
    pooledAssetsUsd: toNumber(data?.pooledAssetsUsd),
    stakedAsat: toNumber(data?.stakedAsat),
    lastRegistration: data?.lastRegistration
      ? String(data.lastRegistration)
      : null,
  };
}

function normalizeAgent(agent: any): Agent {
  return {
    id: String(
      agent?.id ??
        `${agent?.wallet_address ?? 'wallet'}-${agent?.created_at ?? Date.now()}`
    ),
    wallet_address: String(agent?.wallet_address ?? ''),
    asat_balance: toNumber(agent?.asat_balance),
    tier: String(agent?.tier ?? 'starter'),
    role: String(agent?.role ?? 'operator'),
    x_handle: agent?.x_handle ? String(agent.x_handle) : null,
    reward_status: String(agent?.reward_status ?? 'pending'),
    created_at: String(agent?.created_at ?? new Date().toISOString()),
    status: agent?.status ? String(agent.status) : null,
    signature: agent?.signature ? String(agent.signature) : null,
  };
}

function normalizeAgents(input: unknown): Agent[] {
  if (!Array.isArray(input)) return [];
  return input.map(normalizeAgent);
}

function normalizeOperatorPerformance(input: any): OperatorPerformance {
  return {
    walletAddress: String(input?.walletAddress ?? ''),
    tasksClaimedTotal: toNumber(input?.tasksClaimedTotal),
    tasksInProgress: toNumber(input?.tasksInProgress),
    tasksSubmittedForReview: toNumber(input?.tasksSubmittedForReview),
    tasksRewarded: toNumber(input?.tasksRewarded),
    taskRewardedAsatTotal: toNumber(input?.taskRewardedAsatTotal),
    rewardRecordsTotal: toNumber(input?.rewardRecordsTotal),
    rewardPendingCount: toNumber(input?.rewardPendingCount),
    rewardPaidCount: toNumber(input?.rewardPaidCount),
    rewardPaidAsatTotal: toNumber(input?.rewardPaidAsatTotal),
    lastTaskActivityAt: input?.lastTaskActivityAt
      ? String(input.lastTaskActivityAt)
      : null,
    activityStatus: (input?.activityStatus || 'registered') as ActivityStatus,
  };
}

async function safeJson(response: Response): Promise<any | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function fetchAsatBalance(walletAddress: string): Promise<number> {
  const response = await fetch(
    `/api/asat-balance?wallet=${encodeURIComponent(walletAddress)}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  );

  const payload = await safeJson(response);

  if (!response.ok) {
    throw new Error(payload?.error || 'Failed to fetch ASAT balance.');
  }

  return toNumber(payload?.asatBalance);
}

function buildRegistrationMessage(args: {
  walletAddress: string;
  role: string;
  balance: number;
}) {
  return [
    'ASAT Agent Registry v1',
    'Action: Register this wallet as an ASAT agent.',
    `Wallet: ${args.walletAddress}`,
    `Role: ${args.role}`,
    `ASAT Balance: ${args.balance}`,
    `ASAT Mint: ${ASAT_MINT}`,
    `Origin: ${window.location.origin}`,
    `Timestamp: ${new Date().toISOString()}`,
    'This signature does not authorize token transfers.',
  ].join('\n');
}

async function signRegistrationMessage(message: string): Promise<string> {
  const sdk = getPhantomBrowserSdk() as any;

  if (sdk?.solana && typeof sdk.solana.signMessage === 'function') {
    try {
      const signed = await sdk.solana.signMessage(message);

      if (signed?.signature) {
        return bytesToBase64(signed.signature);
      }

      if (signed instanceof Uint8Array || Array.isArray(signed)) {
        return bytesToBase64(signed as Uint8Array | number[]);
      }
    } catch (error) {
      console.warn('Browser SDK signMessage failed, falling back to injected provider.', error);
    }
  }

  const provider = getPhantomProvider();

  if (!provider) {
    throw new Error('Phantom is not available for signing.');
  }

  const encodedMessage = new TextEncoder().encode(message);

  if (typeof provider.signMessage === 'function') {
    const signed = await provider.signMessage(encodedMessage, 'utf8');

    if (!signed?.signature) {
      throw new Error('Phantom returned no signature.');
    }

    return bytesToBase64(signed.signature);
  }

  if (typeof provider.request === 'function') {
    const signed = await provider.request({
      method: 'signMessage',
      params: {
        message: encodedMessage,
        display: 'utf8',
      },
    });

    if (signed?.signature) {
      return bytesToBase64(signed.signature);
    }
  }

  throw new Error('Message signing is unavailable in this Phantom session.');
}

function readStoredValue(keys: readonly string[]) {
  if (typeof window === 'undefined') return '';

  for (const key of keys) {
    const value = window.localStorage.getItem(key);
    if (value && value.trim()) {
      return value.trim();
    }
  }

  return '';
}

function writeStoredValue(keys: readonly string[], value: string) {
  if (typeof window === 'undefined') return;

  for (const key of keys) {
    if (value) {
      window.localStorage.setItem(key, value);
    } else {
      window.localStorage.removeItem(key);
    }
  }
}

function getActivityBadgeStyle(status: ActivityStatus) {
  switch (status) {
    case 'rewarded':
      return 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200';
    case 'reward_pending':
      return 'border-amber-400/25 bg-amber-400/10 text-amber-200';
    case 'in_review':
      return 'border-cyan-400/25 bg-cyan-400/10 text-cyan-200';
    case 'working':
      return 'border-blue-400/25 bg-blue-400/10 text-blue-200';
    default:
      return 'border-white/15 bg-white/5 text-slate-300';
  }
}

function getActivityLabel(status: ActivityStatus, ui: UiStrings) {
  switch (status) {
    case 'rewarded':
      return ui.states.rewarded;
    case 'reward_pending':
      return ui.states.rewardPending;
    case 'in_review':
      return ui.states.inReview;
    case 'working':
      return ui.states.working;
    default:
      return ui.states.registered;
  }
}

function EmptyRows({ text }: { text: string }) {
  return <div className="px-4 py-6 text-sm text-[#AEBBCC]">{text}</div>;
}

function PerformanceRow({
  agent,
  performance,
  ui,
}: {
  agent: Agent;
  performance: OperatorPerformance;
  ui: UiStrings;
}) {
  return (
    <div className="grid gap-4 px-4 py-4 md:grid-cols-2 2xl:grid-cols-4">
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.14em] text-[#8FA3BC]">
          {ui.columns.wallet}
        </div>
        <div className="mt-1 break-words font-mono text-sm text-[#DDE5EE]">
          {shortWallet(agent.wallet_address)}
        </div>
        <div className="mt-1 text-xs text-[#7F92A6]">
          {ui.meta.lastActivity} {formatDate(performance.lastTaskActivityAt)}
        </div>
      </div>

      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.14em] text-[#8FA3BC]">
          {ui.columns.status}
        </div>
        <div
          className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${getActivityBadgeStyle(
            performance.activityStatus
          )}`}
        >
          {getActivityLabel(performance.activityStatus, ui)}
        </div>
      </div>

      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.14em] text-[#8FA3BC]">
          {ui.columns.rewardedAsat}
        </div>
        <div className="mt-1 text-sm font-semibold text-[#F4F6F8]">
          {performance.rewardPaidAsatTotal.toLocaleString()} ASAT
        </div>
        <div className="mt-1 text-xs text-[#7F92A6]">
          {performance.tasksRewarded}{' '}
          {performance.tasksRewarded === 1
            ? ui.meta.rewardedTaskOne
            : ui.meta.rewardedTaskMany}
        </div>
      </div>

      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.14em] text-[#8FA3BC]">
          {ui.columns.liveWork}
        </div>
        <div className="mt-1 text-sm text-[#F4F6F8]">
          {performance.tasksInProgress} {ui.meta.active}
        </div>
        <div className="mt-1 text-xs text-[#7F92A6]">
          {performance.tasksSubmittedForReview} {ui.meta.inReview}
        </div>
      </div>
    </div>
  );
}

function RegistryRow({
  agent,
  performance,
  ui,
}: {
  agent: Agent;
  performance?: OperatorPerformance | null;
  ui: UiStrings;
}) {
  const status = performance?.activityStatus || 'registered';

  return (
    <div className="grid gap-4 px-4 py-4 md:grid-cols-2 2xl:grid-cols-4">
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.14em] text-[#8FA3BC]">
          {ui.columns.wallet}
        </div>
        <div className="mt-1 break-words font-mono text-sm text-[#DDE5EE]">
          {shortWallet(agent.wallet_address)}
        </div>
        <div className="mt-1 text-xs text-[#7F92A6]">
          {ui.meta.registeredOn} {formatDate(agent.created_at)}
        </div>
      </div>

      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.14em] text-[#8FA3BC]">
          {ui.columns.role}
        </div>
        <div className="mt-1 text-sm text-[#F4F6F8]">
          {getLocalizedRoleLabel(agent.role, ui)}
        </div>
      </div>

      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.14em] text-[#8FA3BC]">
          {ui.columns.tier}
        </div>
        <div className="mt-1 text-sm text-[#F4F6F8]">
          {normalizeTierLabel(agent.tier)}
        </div>
      </div>

      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-[0.14em] text-[#8FA3BC]">
          {ui.columns.operatorStatus}
        </div>
        <div
          className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${getActivityBadgeStyle(
            status
          )}`}
        >
          {getActivityLabel(status, ui)}
        </div>
        {performance ? (
          <div className="mt-1 text-xs text-[#7F92A6]">
            {performance.rewardPaidAsatTotal.toLocaleString()} {ui.meta.rewardedSuffix}
          </div>
        ) : (
          <div className="mt-1 text-xs text-[#7F92A6]">{ui.meta.noTaskActivityYet}</div>
        )}
      </div>
    </div>
  );
}

function isMobileDevice() {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function getPhantomBrowseUrl() {
  if (typeof window === 'undefined') return 'https://phantom.app/';
  const currentUrl = window.location.href;
  return `https://phantom.app/ul/browse/${encodeURIComponent(currentUrl)}`;
}

export function AsatAgentRegistry() {
  const pathname = usePathname();

  const currentLocale = useMemo(() => {
    const parts = (pathname || '/').split('/').filter(Boolean);
    const locale = (parts[0] || 'en') as LocaleKey;
    return UI_BY_LOCALE[locale] ? locale : 'en';
  }, [pathname]);

  const ui = UI_BY_LOCALE[currentLocale];
  const taskHref = `/${currentLocale}/tasks`;

  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [asatBalance, setAsatBalance] = useState(0);
  const [balanceLoaded, setBalanceLoaded] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleKey | ''>('');
  const [xHandle, setXHandle] = useState('');
  const [registered, setRegistered] = useState(false);
  const [confirmedTier, setConfirmedTier] = useState<TierLabel>('Unverified');
  const [confirmedRole, setConfirmedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rpcNotice, setRpcNotice] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [operatorPerformanceByWallet, setOperatorPerformanceByWallet] = useState<
    Record<string, OperatorPerformance>
  >({});
  const [toastMessage, setToastMessage] = useState('');
  const [performanceSort, setPerformanceSort] =
    useState<PerformanceSortMode>('rewarded');
  const [phantomMissing, setPhantomMissing] = useState(false);

  const roles: Array<{
    id: RoleKey;
    label: string;
    description: string;
  }> = [
    {
      id: 'operator',
      label: ui.roles.operator,
      description: 'Run tasks and coordinate work',
    },
    {
      id: 'validator',
      label: ui.roles.validator,
      description: 'Verify task proofs',
    },
    {
      id: 'router',
      label: ui.roles.router,
      description: 'Route and coordinate agents',
    },
    {
      id: 'scout',
      label: ui.roles.scout,
      description: 'Discover and signal opportunities',
    },
  ];

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const persistRegistrationState = (args: {
    wallet: string;
    username?: string | null;
    role?: string | null;
    tier?: string | null;
  }) => {
    if (typeof window === 'undefined') return;

    writeStoredValue(STORAGE_KEYS.wallets, args.wallet);
    writeStoredValue(STORAGE_KEYS.usernames, args.username || '');

    if (args.role) {
      window.localStorage.setItem(STORAGE_KEYS.role, args.role);
    }

    if (args.tier) {
      window.localStorage.setItem(STORAGE_KEYS.tier, args.tier);
    }
  };

  const resetWalletState = () => {
    setConnected(false);
    setWalletAddress('');
    setAsatBalance(0);
    setBalanceLoaded(false);
    setBalanceLoading(false);
    setRegistered(false);
  };

  const restoreSavedRegisteredState = () => {
    const savedWallet = readStoredValue(STORAGE_KEYS.wallets);
    const savedUsername = readStoredValue(STORAGE_KEYS.usernames);
    const savedRole = window.localStorage.getItem(STORAGE_KEYS.role)?.trim() || '';
    const savedTier = window.localStorage.getItem(STORAGE_KEYS.tier)?.trim() || '';

    if (!savedWallet || (!savedRole && !savedTier)) {
      return false;
    }

    setWalletAddress(savedWallet);
    setXHandle(savedUsername);
    setConnected(true);
    setRegistered(true);
    setSelectedRole(normalizeRoleKey(savedRole));
    setConfirmedRole(savedRole ? getLocalizedRoleLabel(savedRole, ui) : '');
    setConfirmedTier(savedTier ? normalizeTierLabel(savedTier) : 'Unverified');
    setError('');
    setRpcNotice('');
    setPhantomMissing(false);
    return true;
  };

  const applyRegisteredAgent = (
    agent: Agent,
    options?: {
      toast?: string;
      walletOverride?: string;
      balanceOverride?: number | null;
    }
  ) => {
    const normalizedRole = normalizeRoleKey(agent.role);
    const resolvedWallet = options?.walletOverride || agent.wallet_address;
    const resolvedBalance =
      typeof options?.balanceOverride === 'number'
        ? options.balanceOverride
        : toNumber(agent.asat_balance);

    setConnected(true);
    setWalletAddress(resolvedWallet);
    setRegistered(true);
    setError('');
    setRpcNotice('');
    setPhantomMissing(false);
    setConfirmedTier(normalizeTierLabel(agent.tier));
    setConfirmedRole(getLocalizedRoleLabel(agent.role, ui));
    setSelectedRole(normalizedRole);
    setAsatBalance(resolvedBalance);
    setBalanceLoaded(true);

    if (agent.x_handle) {
      setXHandle(agent.x_handle);
    }

    persistRegistrationState({
      wallet: resolvedWallet,
      username: agent.x_handle || xHandle || '',
      role: normalizedRole || agent.role,
      tier: normalizeTierLabel(agent.tier),
    });

    if (options?.toast) {
      showToast(options.toast);
    }
  };

  const clearSavedRegistration = () => {
    if (typeof window !== 'undefined') {
      writeStoredValue(STORAGE_KEYS.wallets, '');
      writeStoredValue(STORAGE_KEYS.usernames, '');
      window.localStorage.removeItem(STORAGE_KEYS.role);
      window.localStorage.removeItem(STORAGE_KEYS.tier);
    }

    setToastMessage('');
    setError('');
    setRpcNotice('');
    setSelectedRole('');
    setXHandle('');
    setConfirmedTier('Unverified');
    setConfirmedRole('');
    setPhantomMissing(false);
    resetWalletState();
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats', { cache: 'no-store' });

      if (!res.ok) {
        setStats(EMPTY_STATS);
        return;
      }

      const data = await safeJson(res);
      setStats(normalizeStats(data));
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setStats(EMPTY_STATS);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/registry', { cache: 'no-store' });

      if (!res.ok) {
        setAgents([]);
        return [];
      }

      const data = await safeJson(res);
      const nextAgents = normalizeAgents(data?.agents);
      setAgents(nextAgents);
      return nextAgents;
    } catch (err) {
      console.error('Failed to fetch agents:', err);
      setAgents([]);
      return [];
    }
  };

  const fetchOperatorPerformance = async () => {
    try {
      const res = await fetch('/api/operator-performance', { cache: 'no-store' });

      if (!res.ok) {
        setOperatorPerformanceByWallet({});
        return;
      }

      const data = await safeJson(res);
      const byWalletRaw = data?.byWallet || {};
      const nextByWallet: Record<string, OperatorPerformance> = {};

      for (const [wallet, performance] of Object.entries(byWalletRaw)) {
        nextByWallet[String(wallet).trim().toLowerCase()] =
          normalizeOperatorPerformance(performance);
      }

      setOperatorPerformanceByWallet(nextByWallet);
    } catch (err) {
      console.error('Failed to fetch operator performance:', err);
      setOperatorPerformanceByWallet({});
    }
  };

  const findRegisteredAgent = async (
    address: string,
    preload?: Agent[]
  ): Promise<Agent | null> => {
    const normalizedAddress = address.trim().toLowerCase();
    const source = preload && preload.length > 0 ? preload : await fetchAgents();

    const match = source.find(
      (agent) =>
        String(agent.wallet_address).trim().toLowerCase() === normalizedAddress
    );

    return match || null;
  };

  const refreshBalance = async (address: string): Promise<number | null> => {
    if (!address) return null;

    setBalanceLoading(true);
    setError('');

    try {
      const liveBalance = await fetchAsatBalance(address);
      setAsatBalance(liveBalance);
      setBalanceLoaded(true);
      setRpcNotice('');
      return liveBalance;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : ui.errors.balanceUnverified;

      setAsatBalance(0);
      setBalanceLoaded(false);
      setRpcNotice(message);
      return null;
    } finally {
      setBalanceLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const provider = getPhantomProvider();

    const init = async () => {
      await Promise.all([fetchStats(), fetchOperatorPerformance()]);
      const loadedAgents = await fetchAgents();
      if (!mounted) return;

      const savedWallet = readStoredValue(STORAGE_KEYS.wallets);
      const savedUsername = readStoredValue(STORAGE_KEYS.usernames);
      const savedRole = window.localStorage.getItem(STORAGE_KEYS.role)?.trim() || '';
      const savedTier = window.localStorage.getItem(STORAGE_KEYS.tier)?.trim() || '';

      if (savedWallet) {
        setWalletAddress(savedWallet);
        setConnected(true);
      }

      if (savedUsername) {
        setXHandle(savedUsername);
      }

      if (savedRole) {
        setSelectedRole(normalizeRoleKey(savedRole));
        setConfirmedRole(getLocalizedRoleLabel(savedRole, ui));
      }

      if (savedTier) {
        setConfirmedTier(normalizeTierLabel(savedTier));
      }

      if (savedWallet && (savedRole || savedTier)) {
        setRegistered(true);
      }

      if (savedWallet) {
        const existing = await findRegisteredAgent(savedWallet, loadedAgents);
        if (mounted && existing) {
          applyRegisteredAgent(existing, {
            walletOverride: savedWallet,
            balanceOverride: existing.asat_balance,
          });
        }
      }

      try {
        const restoredAddress = await autoConnectPhantom();
        let address = restoredAddress || '';

        if (!address && provider) {
          const response = await provider.connect({ onlyIfTrusted: true });
          address =
            response?.publicKey?.toString?.() || provider.publicKey?.toString?.() || '';
        }

        if (!address || !mounted) return;

        if (typeof window !== 'undefined') {
          window.localStorage.setItem('asat_phantom_connected_wallet', address);
        }

        setConnected(true);
        setWalletAddress(address);
        setPhantomMissing(false);

        const liveBalance = await refreshBalance(address);
        const existing = await findRegisteredAgent(address, loadedAgents);

        if (mounted && existing) {
          applyRegisteredAgent(existing, {
            walletOverride: address,
            balanceOverride:
              typeof liveBalance === 'number'
                ? liveBalance
                : existing.asat_balance,
          });
        }
      } catch {
        // silent
      }
    };

    const handleDisconnect = () => {
      const restored = restoreSavedRegisteredState();

      if (!restored) {
        resetWalletState();
      }
    };

    const handleAccountChanged = async (publicKey?: PhantomPublicKey | null) => {
      if (!publicKey) {
        const restored = restoreSavedRegisteredState();

        if (!restored) {
          resetWalletState();
        }

        setError('');
        setRpcNotice('');
        return;
      }

      const address = publicKey.toString();
      setConnected(true);
      setWalletAddress(address);
      setRegistered(false);
      setPhantomMissing(false);

      const liveBalance = await refreshBalance(address);
      const existing = await findRegisteredAgent(address);

      if (existing) {
        applyRegisteredAgent(existing, {
          walletOverride: address,
          balanceOverride:
            typeof liveBalance === 'number' ? liveBalance : existing.asat_balance,
        });
      }
    };

    void init();

    const interval = setInterval(() => {
      void fetchStats();
      void fetchAgents();
      void fetchOperatorPerformance();
    }, 5000);

    provider?.on?.('disconnect', handleDisconnect);
    provider?.on?.('accountChanged', handleAccountChanged);

    return () => {
      mounted = false;
      clearInterval(interval);
      provider?.off?.('disconnect', handleDisconnect);
      provider?.off?.('accountChanged', handleAccountChanged);
    };
  }, [ui]);

  const handleOpenPhantomBrowser = () => {
    const url = getPhantomBrowseUrl();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleInstallPhantom = () => {
    window.open('https://phantom.app/', '_blank', 'noopener,noreferrer');
  };

  const connectWallet = async () => {
    setLoading(true);
    setError('');
    setRpcNotice('');
    setPhantomMissing(false);

    let address = '';

    try {
      const nextAddress = await connectPhantom('injected');
      address = nextAddress || '';

      if (!address) {
        setPhantomMissing(true);
        setError('');
        return;
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('asat_phantom_connected_wallet', address);
        window.sessionStorage.setItem('asat_phantom_return_to', window.location.pathname);
      }

      setConnected(true);
      setWalletAddress(address);
      setRegistered(false);
      setPhantomMissing(false);

      const liveBalance = await refreshBalance(address);
      const existing = await findRegisteredAgent(address);

      if (existing) {
        applyRegisteredAgent(existing, {
          toast: 'Wallet already registered ✓',
          walletOverride: address,
          balanceOverride:
            typeof liveBalance === 'number' ? liveBalance : existing.asat_balance,
        });
      }
    } catch (err: any) {
      if (!address) {
        const restored = restoreSavedRegisteredState();

        if (!restored) {
          resetWalletState();
        }
      }

      if (err?.code === 4001) {
        setError(ui.errors.rejected);
      } else if (err?.code === -32002) {
        setError(ui.errors.popupOpen);
      } else {
        setPhantomMissing(true);
        setError(getPhantomErrorMessage(err) || ui.errors.connectFailed);
      }
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    void disconnectPhantom().catch(() => {
      // ignore disconnect cleanup issues
    });

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('asat_phantom_connected_wallet');
      window.sessionStorage.removeItem('asat_phantom_connected_wallet');
      window.sessionStorage.removeItem('asat_phantom_last_status');
    }

    resetWalletState();
    setError('');
    setRpcNotice('');
    setPhantomMissing(false);
  };

  const handleRegister = async () => {
    if (!selectedRole || !walletAddress) {
      setError(ui.errors.invalidSelection);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const liveBalance =
        balanceLoaded && !balanceLoading
          ? asatBalance
          : await refreshBalance(walletAddress);

      if (liveBalance === null) {
        setError(ui.errors.balanceUnverified);
        return;
      }

      const existing = await findRegisteredAgent(walletAddress);

      if (existing) {
        applyRegisteredAgent(existing, {
          toast: 'Wallet already registered ✓',
          walletOverride: walletAddress,
          balanceOverride: liveBalance,
        });
        return;
      }

      const balanceTierKey = getTierKey(liveBalance);
      const balanceTierLabel = getTierLabel(liveBalance);
      const normalizedXHandle = xHandle.trim()
        ? xHandle.trim().startsWith('@')
          ? xHandle.trim()
          : `@${xHandle.trim()}`
        : '';

      const message = buildRegistrationMessage({
        walletAddress,
        role: selectedRole,
        balance: liveBalance,
      });

      const signature = await signRegistrationMessage(message);

      const res = await fetch('/api/registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          asatBalance: liveBalance,
          tier: balanceTierKey,
          role: selectedRole,
          xHandle: normalizedXHandle || null,
          signature,
        }),
      });

      const data = await safeJson(res);

      if (res.ok) {
        const normalizedAgent = data?.agent ? normalizeAgent(data.agent) : null;

        setRegistered(true);
        setConfirmedTier(balanceTierLabel);
        setConfirmedRole(getLocalizedRoleLabel(selectedRole, ui));
        setError('');
        setRpcNotice('');
        showToast('Wallet registered ✓');

        if (normalizedXHandle) {
          setXHandle(normalizedXHandle);
        }

        persistRegistrationState({
          wallet: walletAddress,
          username: normalizedXHandle || xHandle.trim(),
          role: selectedRole,
          tier: balanceTierLabel,
        });

        if (normalizedAgent) {
          setAgents((current) => [
            normalizedAgent,
            ...current.filter((agent) => agent.id !== normalizedAgent.id),
          ]);
        }

        await Promise.all([
          fetchStats(),
          fetchAgents(),
          fetchOperatorPerformance(),
        ]);
      } else if (res.status === 409) {
        const conflictAgent = data?.agent
          ? normalizeAgent(data.agent)
          : await findRegisteredAgent(walletAddress);

        if (conflictAgent) {
          applyRegisteredAgent(conflictAgent, {
            toast: 'Wallet already registered ✓',
            walletOverride: walletAddress,
            balanceOverride: liveBalance,
          });
        } else {
          setError(ui.errors.alreadyRegistered);
        }
      } else {
        setError(data?.error || ui.errors.registerFailed);
      }
    } catch (err: any) {
      if (err?.code === 4001) {
        setError(ui.errors.rejected);
      } else if (err?.code === -32002) {
        setError(ui.errors.popupOpen);
      } else {
        setError(
          err instanceof Error ? err.message : ui.errors.registerFailed
        );
      }

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const balanceTierLabel: TierLabel = balanceLoaded
    ? getTierLabel(asatBalance)
    : 'Unverified';

  const totalTrackedAsat = useMemo(() => {
    return agents.reduce((sum, agent) => sum + toNumber(agent.asat_balance), 0);
  }, [agents]);

  const operatorPerformanceValues = useMemo(() => {
    return Object.values(operatorPerformanceByWallet);
  }, [operatorPerformanceByWallet]);

  const operatorRows = useMemo(() => {
    return agents
      .map((agent) => {
        const performance =
          operatorPerformanceByWallet[
            String(agent.wallet_address).trim().toLowerCase()
          ] || null;

        return { agent, performance };
      })
      .filter((row) => {
        if (!row.performance) return false;

        return (
          row.performance.tasksClaimedTotal > 0 ||
          row.performance.tasksInProgress > 0 ||
          row.performance.tasksSubmittedForReview > 0 ||
          row.performance.rewardPendingCount > 0 ||
          row.performance.tasksRewarded > 0 ||
          row.performance.rewardPaidAsatTotal > 0
        );
      });
  }, [agents, operatorPerformanceByWallet]);

  const rewardPoolRows = useMemo(() => {
    const rows = [...operatorRows];

    rows.sort((a, b) => {
      const aPerf = a.performance!;
      const bPerf = b.performance!;

      if (performanceSort === 'active') {
        if (bPerf.tasksInProgress !== aPerf.tasksInProgress) {
          return bPerf.tasksInProgress - aPerf.tasksInProgress;
        }
        if (bPerf.tasksSubmittedForReview !== aPerf.tasksSubmittedForReview) {
          return bPerf.tasksSubmittedForReview - aPerf.tasksSubmittedForReview;
        }
        if (bPerf.tasksClaimedTotal !== aPerf.tasksClaimedTotal) {
          return bPerf.tasksClaimedTotal - aPerf.tasksClaimedTotal;
        }
        return getTime(bPerf.lastTaskActivityAt) - getTime(aPerf.lastTaskActivityAt);
      }

      if (performanceSort === 'recent') {
        const recentDiff =
          getTime(bPerf.lastTaskActivityAt) - getTime(aPerf.lastTaskActivityAt);
        if (recentDiff !== 0) return recentDiff;

        if (bPerf.rewardPaidAsatTotal !== aPerf.rewardPaidAsatTotal) {
          return bPerf.rewardPaidAsatTotal - aPerf.rewardPaidAsatTotal;
        }

        return bPerf.tasksRewarded - aPerf.tasksRewarded;
      }

      if (bPerf.rewardPaidAsatTotal !== aPerf.rewardPaidAsatTotal) {
        return bPerf.rewardPaidAsatTotal - aPerf.rewardPaidAsatTotal;
      }
      if (bPerf.tasksRewarded !== aPerf.tasksRewarded) {
        return bPerf.tasksRewarded - aPerf.tasksRewarded;
      }
      return getTime(bPerf.lastTaskActivityAt) - getTime(aPerf.lastTaskActivityAt);
    });

    return rows.slice(0, 5) as Array<{
      agent: Agent;
      performance: OperatorPerformance | null;
    }>;
  }, [operatorRows, performanceSort]);

  const latestEntryRows = useMemo(() => {
    return [...agents]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);
  }, [agents]);

  const registeredAgentsCount = stats.total || agents.length;
  const activeOperatorsCount = operatorPerformanceValues.filter(
    (item) =>
      item.tasksClaimedTotal > 0 ||
      item.tasksInProgress > 0 ||
      item.tasksSubmittedForReview > 0 ||
      item.rewardPendingCount > 0 ||
      item.tasksRewarded > 0 ||
      item.rewardPaidAsatTotal > 0
  ).length;
  const inReviewCount = operatorPerformanceValues.filter(
    (item) => item.tasksSubmittedForReview > 0 || item.activityStatus === 'in_review'
  ).length;
  const rewardedOperatorsCount = operatorPerformanceValues.filter(
    (item) =>
      item.rewardPaidAsatTotal > 0 ||
      item.tasksRewarded > 0 ||
      item.rewardPaidCount > 0
  ).length;

  const stakedAsatValue =
    totalTrackedAsat > 0 ? `${formatCompactNumber(totalTrackedAsat)} ASAT` : '—';

  const statusItems = [
    { label: ui.rail.registeredAgents, value: String(registeredAgentsCount) },
    { label: ui.rail.activeOperators, value: String(activeOperatorsCount) },
    { label: ui.rail.inReview, value: String(inReviewCount) },
    { label: ui.rail.rewardedOperators, value: String(rewardedOperatorsCount) },
  ];

  return (
    <section
      id="registry"
      className="relative border-b border-white/10 py-16 sm:py-20"
      style={{
        backgroundColor: '#060B14',
        backgroundImage:
          'linear-gradient(rgba(140,235,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(140,235,255,0.03) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(17,214,255,0.04),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl overflow-x-clip px-4 sm:px-6 lg:px-8">
        {toastMessage ? (
          <div className="fixed left-1/2 top-24 z-50 -translate-x-1/2">
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-emerald-200 shadow-2xl">
              {toastMessage}
            </div>
          </div>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)]">
          <div className="min-w-0 space-y-8">
            <div className="rounded-[28px] border border-white/10 bg-[#081326]/88 p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <AsatLogo size="sm" />
              </div>

              <h2 className="text-3xl font-semibold text-[#F4F6F8] sm:text-4xl">
                {ui.shell.title}
              </h2>

              <p className="mt-4 max-w-3xl text-base leading-8 text-[#C9D3DF] sm:text-lg">
                {ui.shell.subtitle}
              </p>

              <div className="mt-8 rounded-[24px] border border-white/10 bg-[#060B14]/60 p-5 sm:p-6">
                {!connected && !registered ? (
                  <div className="space-y-5">
                    {error ? (
                      <div className="rounded-2xl border border-red-500/40 bg-red-950/20 px-4 py-3 text-sm text-red-200">
                        {error}
                      </div>
                    ) : null}

                    {(walletAddress || xHandle) && (
                      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 px-4 py-4 text-sm text-emerald-100">
                        <div className="font-semibold text-emerald-200">
                          {ui.register.savedFound}
                        </div>
                        {walletAddress ? (
                          <div className="mt-2">
                            {ui.register.wallet}:{' '}
                            <span className="font-mono">
                              {shortWallet(walletAddress)}
                            </span>
                          </div>
                        ) : null}
                        {xHandle ? (
                          <div className="mt-1">
                            {ui.register.username}: {xHandle}
                          </div>
                        ) : null}
                      </div>
                    )}

                    <div>
                      <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8FA3BC]">
                        {ui.connect.step}
                      </div>
                      <h3 className="mt-2 text-2xl font-semibold text-[#F4F6F8]">
                        {ui.connect.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#AEBBCC]">
                        {ui.connect.subtitle}
                      </p>
                    </div>

                    {phantomMissing ? (
                      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                        <div className="text-sm font-semibold text-cyan-200">
                          {ui.connect.missingTitle}
                        </div>
                        <p className="mt-2 text-sm leading-7 text-slate-300">
                          {ui.connect.missingBody}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={handleOpenPhantomBrowser}
                            className="rounded-2xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
                          >
                            {ui.connect.openInPhantom}
                          </button>

                          <button
                            type="button"
                            onClick={handleInstallPhantom}
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                          >
                            {ui.connect.installPhantom}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setPhantomMissing(false);
                              setError('');
                            }}
                            className="rounded-2xl border border-white/10 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                          >
                            {ui.connect.continueWithoutWallet}
                          </button>
                        </div>

                        <p className="mt-3 text-xs leading-6 text-[#8FA3BC]">
                          {ui.connect.browserHint}
                          {isMobileDevice() ? ' Mobile device detected.' : ''}
                        </p>
                      </div>
                    ) : null}

                    <button
                      id="connect-phantom-btn"
                      onClick={connectWallet}
                      disabled={loading}
                      className="rounded-2xl bg-[#A8E8F8] px-6 py-3 text-sm font-semibold text-[#081326] transition hover:bg-[#B9F0FF] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? ui.connect.connecting : ui.connect.button}
                    </button>
                  </div>
                ) : registered ? (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5 text-emerald-100">
                      <div className="text-lg font-semibold text-emerald-200">
                        {ui.register.registered}
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-emerald-400/20 bg-black/10 px-4 py-3">
                          <div className="text-[11px] uppercase tracking-[0.14em] text-emerald-200/80">
                            {ui.register.tierConfirmed}
                          </div>
                          <div className="mt-1 text-base font-semibold">
                            {confirmedTier}
                          </div>
                        </div>

                        <div className="rounded-xl border border-emerald-400/20 bg-black/10 px-4 py-3">
                          <div className="text-[11px] uppercase tracking-[0.14em] text-emerald-200/80">
                            {ui.register.roleConfirmed}
                          </div>
                          <div className="mt-1 text-base font-semibold">
                            {confirmedRole || getLocalizedRoleLabel(selectedRole, ui)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <Link
                          href={taskHref}
                          className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-300 px-6 py-4 text-base font-semibold text-[#081326] transition hover:bg-emerald-200 sm:w-auto"
                        >
                          {ui.register.enterTaskLayer}
                        </Link>
                      </div>

                      <button
                        type="button"
                        onClick={clearSavedRegistration}
                        className="mt-4 text-sm font-medium text-emerald-100 underline underline-offset-4 transition hover:text-white"
                      >
                        {ui.register.registerNewWallet}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {error ? (
                      <div className="rounded-2xl border border-red-500/40 bg-red-950/20 px-4 py-3 text-sm text-red-200">
                        {error}
                      </div>
                    ) : null}

                    {rpcNotice ? (
                      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-sm text-amber-100">
                        {rpcNotice}
                      </div>
                    ) : null}

                    <div className="rounded-2xl border border-white/10 bg-[#081326] p-5">
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <div className="text-xs uppercase tracking-[0.14em] text-[#8FA3BC]">
                            {ui.connect.walletAddress}
                          </div>
                          <div className="mt-2 break-all font-mono text-sm text-[#DDE5EE]">
                            {walletAddress}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs uppercase tracking-[0.14em] text-[#8FA3BC]">
                              {ui.connect.asatBalance}
                            </div>
                            <div className="mt-2 text-lg font-semibold text-[#8CEBFF]">
                              {balanceLoading
                                ? 'Loading...'
                                : balanceLoaded
                                ? `${asatBalance.toLocaleString(undefined, {
                                    maximumFractionDigits: 6,
                                  })} ASAT`
                                : 'Unverified'}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs uppercase tracking-[0.14em] text-[#8FA3BC]">
                              {ui.connect.tier}
                            </div>
                            <div
                              className={`mt-2 text-lg font-semibold ${
                                balanceTierLabel === 'Premium'
                                  ? 'text-[#C8B08A]'
                                  : balanceTierLabel === 'Standard'
                                  ? 'text-[#8CEBFF]'
                                  : 'text-[#D7E0EA]'
                              }`}
                            >
                              {balanceTierLabel}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => refreshBalance(walletAddress)}
                          disabled={balanceLoading || loading}
                          className="rounded-2xl border border-white/20 px-4 py-2.5 text-sm font-medium text-[#F4F6F8] transition hover:border-[#11D6FF]/60 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {ui.connect.refresh}
                        </button>

                        <button
                          type="button"
                          onClick={disconnectWallet}
                          className="rounded-2xl border border-white/20 px-4 py-2.5 text-sm font-medium text-[#F4F6F8] transition hover:border-[#11D6FF]/60 hover:bg-white/5"
                        >
                          {ui.connect.disconnect}
                        </button>
                      </div>

                      <p className="mt-4 text-xs leading-6 text-[#8FA3BC]">
                        {ui.connect.registrationLock}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8FA3BC]">
                          {ui.register.step}
                        </div>
                        <h3 className="mt-2 text-2xl font-semibold text-[#F4F6F8]">
                          {ui.register.title}
                        </h3>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {roles.map((role) => (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => setSelectedRole(role.id)}
                            className={`rounded-2xl border p-4 text-left transition ${
                              selectedRole === role.id
                                ? 'border-[#11D6FF]/60 bg-[#11D6FF]/10'
                                : 'border-white/10 bg-[#081326] hover:border-[#11D6FF]/35'
                            }`}
                          >
                            <div className="text-lg font-semibold text-[#F4F6F8]">
                              {role.label}
                            </div>
                            <div className="mt-1 text-sm leading-6 text-[#AEBBCC]">
                              {role.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#F4F6F8]">
                        {ui.register.xHandle}
                      </label>
                      <input
                        type="text"
                        placeholder="@yourhandle"
                        value={xHandle}
                        onChange={(e) => setXHandle(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[#081326] px-4 py-3 text-white placeholder:text-[#6F8399] focus:border-[#11D6FF]/50 focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleRegister}
                      disabled={
                        !selectedRole || loading || balanceLoading || !balanceLoaded
                      }
                      className="w-full rounded-2xl bg-[#A8E8F8] px-6 py-4 text-base font-semibold text-[#081326] transition hover:bg-[#B9F0FF] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading
                        ? ui.register.awaitingApproval
                        : !balanceLoaded
                        ? ui.register.verifyBefore
                        : ui.register.signAndRegister}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0 grid gap-6">
              <div className="rounded-[28px] border border-white/10 bg-[#081326]/88 p-6 sm:p-8">
                <div className="mb-6 flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-2xl font-semibold text-[#F4F6F8]">
                      {ui.sections.rewardPool}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#AEBBCC]">
                      {ui.sections.rewardPoolSub}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {([
                      ['rewarded', ui.sort.rewarded],
                      ['active', ui.sort.active],
                      ['recent', ui.sort.recent],
                    ] as Array<[PerformanceSortMode, string]>).map(([mode, label]) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPerformanceSort(mode)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          performanceSort === mode
                            ? 'border-[#11D6FF]/35 bg-[#11D6FF]/10 text-[#8CEBFF]'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-[#06101D]">
                  {rewardPoolRows.length === 0 ? (
                    <EmptyRows text={ui.meta.noRewardedPerformanceYet} />
                  ) : (
                    rewardPoolRows.map(
                      ({ agent, performance }) =>
                        performance && (
                          <PerformanceRow
                            key={agent.id}
                            agent={agent}
                            performance={performance}
                            ui={ui}
                          />
                        )
                    )
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-[#081326]/88 p-6 sm:p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-[#F4F6F8]">
                    {ui.sections.latestEntries}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#AEBBCC]">
                    {ui.sections.latestEntriesSub}
                  </p>
                </div>

                <div className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-[#06101D]">
                  {latestEntryRows.length === 0 ? (
                    <EmptyRows text={ui.meta.noRegistryEntriesYet} />
                  ) : (
                    latestEntryRows.map((agent) => (
                      <RegistryRow
                        key={agent.id}
                        agent={agent}
                        performance={
                          operatorPerformanceByWallet[
                            String(agent.wallet_address).trim().toLowerCase()
                          ] || null
                        }
                        ui={ui}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="min-w-0 space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-[#081326]/88 p-6">
              <div className="text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">
                {ui.sections.statusRail}
              </div>

              <div className="mt-5 grid gap-4">
                {[
                  { label: ui.rail.registeredAgents, value: String(registeredAgentsCount) },
                  { label: ui.rail.activeOperators, value: String(activeOperatorsCount) },
                  { label: ui.rail.inReview, value: String(inReviewCount) },
                  { label: ui.rail.rewardedOperators, value: String(rewardedOperatorsCount) },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-[#06101D] px-4 py-4"
                  >
                    <div className="text-[11px] uppercase tracking-[0.14em] text-[#8FA3BC]">
                      {item.label}
                    </div>
                    <div className="mt-2 text-xl font-semibold text-white">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#081326]/88 p-6">
              <div className="text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">
                {ui.sections.protocol}
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-[#06101D] px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-[#8FA3BC]">
                    {ui.meta.contract}
                  </div>
                  <div className="mt-2 break-all font-mono text-sm text-[#DDE5EE]">
                    {ASAT_MINT}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#06101D] px-4 py-4 text-sm leading-7 text-[#AEBBCC]">
                  {ui.meta.contractVerified}
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#06101D] px-4 py-4 text-sm leading-7 text-[#AEBBCC]">
                  {ui.meta.registryBalances} {stakedAsatValue}.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default AsatAgentRegistry;
