import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import type { Mission, Application } from './missions'

export interface Bakery {
  id: string
  name: string
  email: string
  password: string // pour la démo
  address: string
  city: string
  postalCode: string
  avatar?: string
  description?: string
  createdAt: string
  // Données admin
  siret?: string
  siren?: string
  tvaNumber?: string
  phone?: string
  managerName?: string
  managerEmail?: string
  verificationStatus?: 'pending' | 'verified' | 'rejected' | 'suspended'
  verificationDocuments?: Array<{
    type: 'siret' | 'kbis' | 'identity' | 'diploma' | 'other'
    url: string
    uploadedAt: string
    verified: boolean
  }>
  notes?: string // Notes internes admin
  suspendedUntil?: string // Date de fin de suspension
}

export const useBakeriesStore = defineStore('bakeries', () => {
  const bakeries = ref<Bakery[]>([])
  const currentBakery = ref<Bakery | null>(null)
  const bakeryMissions = ref<Mission[]>([])
  const bakeryApplications = ref<Application[]>([])

  // Stats computed
  const totalMissions = computed(() => bakeryMissions.value.length)
  const openMissions = computed(() => bakeryMissions.value.filter(m => m.status === 'open').length)
  const filledMissions = computed(() => bakeryMissions.value.filter(m => m.status === 'filled').length)
  const totalApplications = computed(() => bakeryApplications.value.length)
  const pendingApplications = computed(() => bakeryApplications.value.filter(a => a.status === 'pending').length)

  // Stats historiques 6 derniers mois (données fixes pour la démo)
  const monthlyStatsData = ref<Array<{
    month: string
    monthKey: string
    missionsPosted: number
    missionsFilled: number
    applicationsReceived: number
    avgRating: number
  }>>([])

  // Initialiser les stats une seule fois
  function initializeMonthlyStats() {
    if (monthlyStatsData.value.length > 0) return // Déjà initialisé
    
    const months = []
    const now = new Date()
    // Données fixes pour la démo (cohérentes)
    const data = [
      { missionsPosted: 5, missionsFilled: 3, applicationsReceived: 12, avgRating: 4.3 },
      { missionsPosted: 7, missionsFilled: 5, applicationsReceived: 18, avgRating: 4.5 },
      { missionsPosted: 6, missionsFilled: 4, applicationsReceived: 15, avgRating: 4.4 },
      { missionsPosted: 8, missionsFilled: 6, applicationsReceived: 20, avgRating: 4.6 },
      { missionsPosted: 9, missionsFilled: 7, applicationsReceived: 22, avgRating: 4.7 },
      { missionsPosted: 10, missionsFilled: 8, applicationsReceived: 25, avgRating: 4.8 }
    ]
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const dataIndex = 5 - i
      months.push({
        month: date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
        monthKey,
        missionsPosted: data[dataIndex].missionsPosted,
        missionsFilled: data[dataIndex].missionsFilled,
        applicationsReceived: data[dataIndex].applicationsReceived,
        avgRating: data[dataIndex].avgRating
      })
    }
    monthlyStatsData.value = months
  }

  const monthlyStats = computed(() => {
    if (monthlyStatsData.value.length === 0) {
      initializeMonthlyStats()
    }
    return monthlyStatsData.value
  })

  // Fonction pour sélectionner un avatar aléatoire
  function getRandomBakeryAvatar(): string {
    const avatars = Array.from({ length: 22 }, (_, i) => `boulangerie${i + 1}.jpeg`)
    return avatars[Math.floor(Math.random() * avatars.length)]
  }

  function generateMockBakeries() {
    const bks: Bakery[] = [
      {
        id: 'bakery1',
        name: 'Boulangerie du Moulin',
        email: 'boulangerie@moulin.fr',
        password: 'demo123',
        address: '23 Rue de Rivoli',
        city: 'Paris',
        postalCode: '75001',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie artisanale familiale depuis 1950',
        createdAt: '2020-01-15',
        siret: '12345678901234',
        siren: '123456789',
        tvaNumber: 'FR12123456789',
        phone: '+33 1 42 33 44 55',
        managerName: 'Pierre Martin',
        managerEmail: 'pierre.martin@moulin.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery1.pdf', uploadedAt: '2020-01-10', verified: true },
          { type: 'kbis', url: '/documents/kbis_bakery1.pdf', uploadedAt: '2020-01-10', verified: true },
          { type: 'identity', url: '/documents/id_martin.pdf', uploadedAt: '2020-01-10', verified: true }
        ],
        notes: 'Boulangerie très professionnelle, excellente relation avec les artisans.'
      },
      {
        id: 'bakery2',
        name: 'Pâtisserie Délices',
        email: 'contact@delices.fr',
        password: 'demo123',
        address: '45 Avenue des Champs-Élysées',
        city: 'Paris',
        postalCode: '75008',
        avatar: getRandomBakeryAvatar(),
        description: 'Pâtisserie fine haut de gamme',
        createdAt: '2018-03-20',
        siret: '98765432109876',
        siren: '987654321',
        tvaNumber: 'FR98987654321',
        phone: '+33 1 42 55 66 77',
        managerName: 'Sophie Dubois',
        managerEmail: 'sophie.dubois@delices.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery2.pdf', uploadedAt: '2018-03-15', verified: true },
          { type: 'kbis', url: '/documents/kbis_bakery2.pdf', uploadedAt: '2018-03-15', verified: true }
        ],
        notes: 'Pâtisserie premium, très exigeante sur la qualité.'
      },
      {
        id: 'bakery3',
        name: 'La Mie Dorée',
        email: 'contact@miedoree.fr',
        password: 'demo123',
        address: '12 Place Saint-Germain',
        city: 'Paris',
        postalCode: '75006',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie de quartier',
        createdAt: '2021-05-10',
        siret: '11122233344455',
        siren: '111222333',
        tvaNumber: 'FR11111122233',
        phone: '+33 1 43 22 33 44',
        managerName: 'Marc Leroy',
        managerEmail: 'marc.leroy@miedoree.fr',
        verificationStatus: 'pending',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery3.pdf', uploadedAt: '2021-05-08', verified: false }
        ],
        notes: 'En attente de vérification des documents.'
      },
      // Boulangeries supplémentaires (20+)
      {
        id: 'bakery4',
        name: 'Le Pain de la Terre',
        email: 'contact@painterre.fr',
        password: 'demo123',
        address: '78 Rue de la Paix',
        city: 'Paris',
        postalCode: '75002',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie bio et responsable',
        createdAt: '2019-08-12',
        siret: '22233344455566',
        siren: '222333444',
        tvaNumber: 'FR22222233344',
        phone: '+33 1 44 55 66 77',
        managerName: 'Julie Bernard',
        managerEmail: 'julie.bernard@painterre.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery4.pdf', uploadedAt: '2019-08-10', verified: true },
          { type: 'kbis', url: '/documents/kbis_bakery4.pdf', uploadedAt: '2019-08-10', verified: true }
        ],
        notes: 'Boulangerie engagée, très appréciée.'
      },
      {
        id: 'bakery5',
        name: 'La Croûte Dorée',
        email: 'contact@croute-doree.fr',
        password: 'demo123',
        address: '15 Boulevard Haussmann',
        city: 'Paris',
        postalCode: '75009',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie traditionnelle',
        createdAt: '2020-02-20',
        siret: '33344455566677',
        siren: '333444555',
        tvaNumber: 'FR33333344455',
        phone: '+33 1 45 66 77 88',
        managerName: 'Thomas Moreau',
        managerEmail: 'thomas.moreau@croute-doree.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery5.pdf', uploadedAt: '2020-02-18', verified: true }
        ],
        notes: 'Très active, nombreuses missions.'
      },
      {
        id: 'bakery6',
        name: 'Pâtisserie Royale',
        email: 'contact@royale.fr',
        password: 'demo123',
        address: '32 Avenue des Ternes',
        city: 'Paris',
        postalCode: '75017',
        avatar: getRandomBakeryAvatar(),
        description: 'Pâtisserie de luxe',
        createdAt: '2017-11-05',
        siret: '44455566677788',
        siren: '444555666',
        tvaNumber: 'FR44444455566',
        phone: '+33 1 46 77 88 99',
        managerName: 'Marie Lefebvre',
        managerEmail: 'marie.lefebvre@royale.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery6.pdf', uploadedAt: '2017-11-03', verified: true },
          { type: 'kbis', url: '/documents/kbis_bakery6.pdf', uploadedAt: '2017-11-03', verified: true }
        ],
        notes: 'Pâtisserie haut de gamme, très sélective.'
      },
      {
        id: 'bakery7',
        name: 'Le Fournil Artisanal',
        email: 'contact@fournil-art.fr',
        password: 'demo123',
        address: '56 Rue de Vaugirard',
        city: 'Paris',
        postalCode: '75006',
        avatar: getRandomBakeryAvatar(),
        description: 'Fournil artisanal',
        createdAt: '2021-03-15',
        siret: '55566677788899',
        siren: '555666777',
        tvaNumber: 'FR55555566677',
        phone: '+33 1 47 88 99 00',
        managerName: 'David Rousseau',
        managerEmail: 'david.rousseau@fournil-art.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery7.pdf', uploadedAt: '2021-03-13', verified: true }
        ],
        notes: 'Nouvelle boulangerie prometteuse.'
      },
      {
        id: 'bakery8',
        name: 'Boulangerie du Quartier',
        email: 'contact@bq.fr',
        password: 'demo123',
        address: '89 Rue de Belleville',
        city: 'Paris',
        postalCode: '75020',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie de quartier',
        createdAt: '2018-06-22',
        siret: '66677788899900',
        siren: '666777888',
        tvaNumber: 'FR66666677788',
        phone: '+33 1 48 99 00 11',
        managerName: 'Sophie Martin',
        managerEmail: 'sophie.martin@bq.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery8.pdf', uploadedAt: '2018-06-20', verified: true }
        ],
        notes: 'Boulangerie populaire et appréciée.'
      },
      {
        id: 'bakery9',
        name: 'La Maison du Pain',
        email: 'contact@maison-pain.fr',
        password: 'demo123',
        address: '12 Rue de la République',
        city: 'Boulogne-Billancourt',
        postalCode: '92100',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie familiale',
        createdAt: '2019-04-10',
        siret: '77788899900011',
        siren: '777888999',
        tvaNumber: 'FR77777788899',
        phone: '+33 1 49 00 11 22',
        managerName: 'Pierre Durand',
        managerEmail: 'pierre.durand@maison-pain.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery9.pdf', uploadedAt: '2019-04-08', verified: true }
        ],
        notes: 'Boulangerie familiale bien établie.'
      },
      {
        id: 'bakery10',
        name: 'Pâtisserie des Rêves',
        email: 'contact@reves.fr',
        password: 'demo123',
        address: '45 Avenue Montaigne',
        city: 'Paris',
        postalCode: '75008',
        avatar: getRandomBakeryAvatar(),
        description: 'Pâtisserie créative',
        createdAt: '2020-09-18',
        siret: '88899900011122',
        siren: '888999000',
        tvaNumber: 'FR88888899900',
        phone: '+33 1 50 11 22 33',
        managerName: 'Claire Petit',
        managerEmail: 'claire.petit@reves.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery10.pdf', uploadedAt: '2020-09-16', verified: true }
        ],
        notes: 'Pâtisserie innovante et créative.'
      },
      {
        id: 'bakery11',
        name: 'Le Grenier à Pain',
        email: 'contact@grenier-pain.fr',
        password: 'demo123',
        address: '23 Rue de la Sorbonne',
        city: 'Paris',
        postalCode: '75005',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie étudiante',
        createdAt: '2021-01-25',
        siret: '99900011122233',
        siren: '999000111',
        tvaNumber: 'FR99999900011',
        phone: '+33 1 51 22 33 44',
        managerName: 'Lucas Bernard',
        managerEmail: 'lucas.bernard@grenier-pain.fr',
        verificationStatus: 'pending',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery11.pdf', uploadedAt: '2021-01-23', verified: false }
        ],
        notes: 'En attente de validation.'
      },
      {
        id: 'bakery12',
        name: 'Boulangerie Moderne',
        email: 'contact@moderne.fr',
        password: 'demo123',
        address: '67 Rue de Rivoli',
        city: 'Paris',
        postalCode: '75004',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie moderne',
        createdAt: '2018-12-08',
        siret: '00011122233344',
        siren: '000111222',
        tvaNumber: 'FR00000011122',
        phone: '+33 1 52 33 44 55',
        managerName: 'Emma Dubois',
        managerEmail: 'emma.dubois@moderne.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery12.pdf', uploadedAt: '2018-12-06', verified: true }
        ],
        notes: 'Boulangerie moderne et dynamique.'
      },
      {
        id: 'bakery13',
        name: 'La Tradition',
        email: 'contact@tradition.fr',
        password: 'demo123',
        address: '34 Rue Saint-Antoine',
        city: 'Paris',
        postalCode: '75004',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie traditionnelle',
        createdAt: '2017-05-30',
        siret: '11122233344455',
        siren: '111222333',
        tvaNumber: 'FR11111122233',
        phone: '+33 1 53 44 55 66',
        managerName: 'Antoine Moreau',
        managerEmail: 'antoine.moreau@tradition.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery13.pdf', uploadedAt: '2017-05-28', verified: true }
        ],
        notes: 'Boulangerie traditionnelle réputée.'
      },
      {
        id: 'bakery14',
        name: 'Pâtisserie Fine',
        email: 'contact@fine.fr',
        password: 'demo123',
        address: '78 Boulevard Saint-Germain',
        city: 'Paris',
        postalCode: '75006',
        avatar: getRandomBakeryAvatar(),
        description: 'Pâtisserie fine',
        createdAt: '2019-10-14',
        siret: '22233344455566',
        siren: '222333444',
        tvaNumber: 'FR22222233344',
        phone: '+33 1 54 55 66 77',
        managerName: 'Isabelle Leroy',
        managerEmail: 'isabelle.leroy@fine.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery14.pdf', uploadedAt: '2019-10-12', verified: true }
        ],
        notes: 'Pâtisserie fine très réputée.'
      },
      {
        id: 'bakery15',
        name: 'Le Petit Four',
        email: 'contact@petit-four.fr',
        password: 'demo123',
        address: '56 Rue de Charonne',
        city: 'Paris',
        postalCode: '75011',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie de quartier',
        createdAt: '2020-07-03',
        siret: '33344455566677',
        siren: '333444555',
        tvaNumber: 'FR33333344455',
        phone: '+33 1 55 66 77 88',
        managerName: 'Jean Dupont',
        managerEmail: 'jean.dupont@petit-four.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery15.pdf', uploadedAt: '2020-07-01', verified: true }
        ],
        notes: 'Boulangerie chaleureuse de quartier.'
      },
      {
        id: 'bakery16',
        name: 'Boulangerie Bio',
        email: 'contact@bio-boulange.fr',
        password: 'demo123',
        address: '12 Rue de la Roquette',
        city: 'Paris',
        postalCode: '75011',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie bio',
        createdAt: '2018-02-12',
        siret: '44455566677788',
        siren: '444555666',
        tvaNumber: 'FR44444455566',
        phone: '+33 1 56 77 88 99',
        managerName: 'Marie Rousseau',
        managerEmail: 'marie.rousseau@bio-boulange.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery16.pdf', uploadedAt: '2018-02-10', verified: true }
        ],
        notes: 'Boulangerie bio engagée.'
      },
      {
        id: 'bakery17',
        name: 'La Mie Croustillante',
        email: 'contact@mie-croustillante.fr',
        password: 'demo123',
        address: '89 Avenue de la République',
        city: 'Paris',
        postalCode: '75011',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie artisanale',
        createdAt: '2021-06-20',
        siret: '55566677788899',
        siren: '555666777',
        tvaNumber: 'FR55555566677',
        phone: '+33 1 57 88 99 00',
        managerName: 'Thomas Martin',
        managerEmail: 'thomas.martin@mie-croustillante.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery17.pdf', uploadedAt: '2021-06-18', verified: true }
        ],
        notes: 'Boulangerie artisanale de qualité.'
      },
      {
        id: 'bakery18',
        name: 'Pâtisserie Élégante',
        email: 'contact@elegante.fr',
        password: 'demo123',
        address: '45 Rue de Passy',
        city: 'Paris',
        postalCode: '75016',
        avatar: getRandomBakeryAvatar(),
        description: 'Pâtisserie élégante',
        createdAt: '2017-09-25',
        siret: '66677788899900',
        siren: '666777888',
        tvaNumber: 'FR66666677788',
        phone: '+33 1 58 99 00 11',
        managerName: 'Sophie Bernard',
        managerEmail: 'sophie.bernard@elegante.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery18.pdf', uploadedAt: '2017-09-23', verified: true }
        ],
        notes: 'Pâtisserie élégante et raffinée.'
      },
      {
        id: 'bakery19',
        name: 'Le Four à Bois',
        email: 'contact@four-bois.fr',
        password: 'demo123',
        address: '23 Rue de Turenne',
        city: 'Paris',
        postalCode: '75003',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie au four à bois',
        createdAt: '2019-11-08',
        siret: '77788899900011',
        siren: '777888999',
        tvaNumber: 'FR77777788899',
        phone: '+33 1 59 00 11 22',
        managerName: 'Pierre Lefebvre',
        managerEmail: 'pierre.lefebvre@four-bois.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery19.pdf', uploadedAt: '2019-11-06', verified: true }
        ],
        notes: 'Spécialiste four à bois.'
      },
      {
        id: 'bakery20',
        name: 'Boulangerie du Matin',
        email: 'contact@matin.fr',
        password: 'demo123',
        address: '67 Rue de la Convention',
        city: 'Paris',
        postalCode: '75015',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie du matin',
        createdAt: '2020-04-17',
        siret: '88899900011122',
        siren: '888999000',
        tvaNumber: 'FR88888899900',
        phone: '+33 1 60 11 22 33',
        managerName: 'David Petit',
        managerEmail: 'david.petit@matin.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery20.pdf', uploadedAt: '2020-04-15', verified: true }
        ],
        notes: 'Boulangerie matinale très fréquentée.'
      },
      {
        id: 'bakery21',
        name: 'La Pâte à Tartiner',
        email: 'contact@tartiner.fr',
        password: 'demo123',
        address: '34 Rue de Belleville',
        city: 'Paris',
        postalCode: '75020',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie gourmande',
        createdAt: '2018-08-22',
        siret: '99900011122233',
        siren: '999000111',
        tvaNumber: 'FR99999900011',
        phone: '+33 1 61 22 33 44',
        managerName: 'Julie Moreau',
        managerEmail: 'julie.moreau@tartiner.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery21.pdf', uploadedAt: '2018-08-20', verified: true }
        ],
        notes: 'Boulangerie gourmande et créative.'
      },
      {
        id: 'bakery22',
        name: 'Pâtisserie du Bonheur',
        email: 'contact@bonheur.fr',
        password: 'demo123',
        address: '78 Rue de Vaugirard',
        city: 'Paris',
        postalCode: '75006',
        avatar: getRandomBakeryAvatar(),
        description: 'Pâtisserie du bonheur',
        createdAt: '2019-12-30',
        siret: '00011122233344',
        siren: '000111222',
        tvaNumber: 'FR00000011122',
        phone: '+33 1 62 33 44 55',
        managerName: 'Claire Durand',
        managerEmail: 'claire.durand@bonheur.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery22.pdf', uploadedAt: '2019-12-28', verified: true }
        ],
        notes: 'Pâtisserie joyeuse et accueillante.'
      },
      {
        id: 'bakery23',
        name: 'Le Pain Rustique',
        email: 'contact@rustique.fr',
        password: 'demo123',
        address: '56 Boulevard Voltaire',
        city: 'Paris',
        postalCode: '75011',
        avatar: getRandomBakeryAvatar(),
        description: 'Boulangerie rustique',
        createdAt: '2020-10-05',
        siret: '11122233344455',
        siren: '111222333',
        tvaNumber: 'FR11111122233',
        phone: '+33 1 63 44 55 66',
        managerName: 'Lucas Martin',
        managerEmail: 'lucas.martin@rustique.fr',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'siret', url: '/documents/kbis_bakery23.pdf', uploadedAt: '2020-10-03', verified: true }
        ],
        notes: 'Boulangerie rustique authentique.'
      }
    ]
    bakeries.value = bks
  }

  function login(email: string, password: string) {
    const bakery = bakeries.value.find(b => b.email === email && b.password === password)
    if (bakery) {
      currentBakery.value = bakery
      // Charger les missions et candidatures de cette boulangerie
      loadBakeryData(bakery.id)
      // Sauvegarder après connexion
      saveBakeryDataToStorage()
      return Promise.resolve(bakery)
    }
    return Promise.reject(new Error('Identifiants incorrects'))
  }

  // Initialiser les données depuis localStorage au démarrage
  function initializeBakeryData() {
    loadBakeryDataFromStorage()
    if (monthlyStatsData.value.length === 0) {
      initializeMonthlyStats()
      saveBakeryDataToStorage()
    }
  }

  // Fonctions de sauvegarde/chargement localStorage
  function saveBakeryDataToStorage() {
    if (currentBakery.value) {
      const data = {
        currentBakery: currentBakery.value,
        bakeryMissions: bakeryMissions.value,
        bakeryApplications: bakeryApplications.value,
        monthlyStatsData: monthlyStatsData.value
      }
      localStorage.setItem('choukette_bakery_data', JSON.stringify(data))
    }
  }

  function loadBakeryDataFromStorage() {
    const saved = localStorage.getItem('choukette_bakery_data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        currentBakery.value = data.currentBakery
        bakeryMissions.value = data.bakeryMissions || []
        bakeryApplications.value = data.bakeryApplications || []
        if (data.monthlyStatsData && data.monthlyStatsData.length > 0) {
          monthlyStatsData.value = data.monthlyStatsData
        }
        return true
      } catch (error) {
        console.error('Erreur lors du chargement des données boulangerie:', error)
        localStorage.removeItem('choukette_bakery_data')
      }
    }
    return false
  }

  function clearBakeryDataFromStorage() {
    localStorage.removeItem('choukette_bakery_data')
  }

  function loadBakeryData(bakeryId: string, missionsList: Mission[] = []) {
    // Essayer de charger depuis localStorage
    const loaded = loadBakeryDataFromStorage()
    if (loaded && currentBakery.value?.id === bakeryId) {
      // Données déjà chargées depuis localStorage
      return
    }

    // Sinon, charger/générer les données
    currentBakery.value = bakeries.value.find(b => b.id === bakeryId) || null
    
    // Mock: charger les missions de cette boulangerie
    let filtered = missionsList.filter((m: Mission) => m.bakeryId === bakeryId)
    
    // Si pas assez de missions, créer des missions mock supplémentaires pour la démo
    if (filtered.length < 5) {
      const mockMissions: Mission[] = [
        {
          id: 'bakery-mock-1',
          title: 'Boulanger expérimenté - Remplacement matin',
          description: 'Mission de remplacement matin pour production de pains traditionnels',
          bakeryId: bakeryId,
          bakeryName: currentBakery.value?.name || 'Boulangerie',
          bakeryAddress: currentBakery.value?.address || '',
          bakeryAvatar: currentBakery.value?.avatar,
          type: 'ponctuel',
          position: 'boulanger',
          duration: '1 jour',
          startDate: '2024-02-25',
          schedule: '04h00 - 12h00',
          hourlyRate: 28,
          requirements: { experience: 3, certifications: ['CAP'], specialties: ['Pains traditionnels'] },
          equipment: ['Four', 'Pétrin'],
          status: 'filled',
          applicants: 2,
          location: { address: '', city: 'Paris', postalCode: '75001' },
          createdAt: '2024-02-20'
        },
        {
          id: 'bakery-mock-2',
          title: 'Pâtissier weekend - Événement',
          description: 'Recherche pâtissier pour événement spécial',
          bakeryId: bakeryId,
          bakeryName: currentBakery.value?.name || 'Boulangerie',
          bakeryAddress: currentBakery.value?.address || '',
          bakeryAvatar: currentBakery.value?.avatar,
          type: 'evenement',
          position: 'patissier',
          duration: '2 jours',
          startDate: '2024-03-02',
          schedule: '08h00 - 18h00',
          hourlyRate: 32,
          requirements: { experience: 5, certifications: ['CAP'], specialties: ['Pâtisserie fine'] },
          equipment: ['Four', 'Refroidisseur'],
          status: 'filled',
          applicants: 1,
          location: { address: '', city: 'Paris', postalCode: '75001' },
          createdAt: '2024-02-22'
        },
        {
          id: 'bakery-mock-3',
          title: 'Vendeur/Vendeuse - CDI week-end',
          description: 'Recherche vendeur pour weekend',
          bakeryId: bakeryId,
          bakeryName: currentBakery.value?.name || 'Boulangerie',
          bakeryAddress: currentBakery.value?.address || '',
          bakeryAvatar: currentBakery.value?.avatar,
          type: 'recurrent',
          position: 'vendeur',
          duration: 'Permanent',
          startDate: '2024-03-09',
          schedule: '07h00 - 14h00',
          hourlyRate: 22,
          requirements: { experience: 1, certifications: [], specialties: ['Vente'] },
          equipment: [],
          status: 'open',
          applicants: 3,
          location: { address: '', city: 'Paris', postalCode: '75001' },
          createdAt: '2024-02-18'
        }
      ]
      filtered = [...filtered, ...mockMissions]
    }
    
    bakeryMissions.value = filtered
    
    // Mock: générer des candidatures pour ces missions
    bakeryApplications.value = [
      {
        id: 'app1',
        missionId: '1',
        professionalId: 'pro1',
        professionalName: 'Camille Moreau',
        professionalAvatar: 'boulanger1.jpeg',
        message: 'Intéressé par cette mission, j\'ai 10 ans d\'expérience en levain.',
        status: 'pending',
        appliedAt: '2024-01-20T10:30:00Z'
      },
      {
        id: 'app2',
        missionId: '1',
        professionalId: 'pro3',
        professionalName: 'Omar Bensaïd',
        professionalAvatar: 'boulanger3.jpeg',
        message: 'Disponible ce weekend, très motivé.',
        status: 'pending',
        appliedAt: '2024-01-20T14:15:00Z'
      }
    ]

    // Sauvegarder dans localStorage
    saveBakeryDataToStorage()
  }

  // Init
  if (!bakeries.value.length) generateMockBakeries()
  
  // Initialiser les données depuis localStorage ou créer des stats par défaut
  initializeBakeryData()

  return {
    bakeries,
    currentBakery,
    bakeryMissions,
    bakeryApplications,
    totalMissions,
    openMissions,
    filledMissions,
    totalApplications,
    pendingApplications,
    monthlyStats,
    login,
    loadBakeryData,
    saveBakeryDataToStorage,
    clearBakeryDataFromStorage,
    initializeBakeryData,
    generateMockBakeries
  }
})

