import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Professional {
  id: string
  firstName: string
  lastName: string
  avatar?: string // filename in assets/boulangers or remote url
  specialties: string[]
  domains: string[] // e.g., Viennoiserie, Pâtisserie fine, Pains spéciaux
  yearsExperience: number
  location: { city: string; postalCode: string; address?: string }
  hourlyRate: number
  missionsCompleted: number
  isPremium: boolean
  bio: string
  certifications: string[]
  portfolio?: string[]
  createdAt: string
  experiences?: Array<{
    bakeryName: string
    role: string
    period: string
    city: string
  }>
  // Données admin
  email?: string
  phone?: string
  siret?: string // Si auto-entrepreneur
  status?: 'auto-entrepreneur' | 'interim' | 'salarie'
  verificationStatus?: 'pending' | 'verified' | 'rejected' | 'suspended'
  verificationDocuments?: Array<{
    type: 'identity' | 'diploma' | 'siret' | 'rib' | 'other'
    url: string
    uploadedAt: string
    verified: boolean
    diplomaType?: string // CAP, BP, etc.
    diplomaYear?: number
  }>
  notes?: string // Notes internes admin
  suspendedUntil?: string // Date de fin de suspension
}

// Fonction pour sélectionner un avatar aléatoire
function getRandomProfessionalAvatar(): string {
  const avatars = Array.from({ length: 20 }, (_, i) => `boulanger${i + 1}.jpeg`)
  return avatars[Math.floor(Math.random() * avatars.length)]
}

export const useProfessionalsStore = defineStore('professionals', () => {
  const professionals = ref<Professional[]>([])

  const premiumProfessionals = computed(() => professionals.value.filter(p => p.isPremium))

  function generateMockProfessionals() {
    const pros: Professional[] = [
      {
        id: 'pro1',
        firstName: 'Camille',
        lastName: 'Moreau',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Pains de tradition française', 'Levain naturel'],
        domains: ['Pain et viennoiserie', 'Fournil traditionnel'],
        yearsExperience: 10,
        location: { city: 'Paris', postalCode: '75011', address: '45 Rue de la République, 75011 Paris' },
        hourlyRate: 29,
        missionsCompleted: 140,
        isPremium: true,
        bio: 'Boulanger spécialisé levain et farines anciennes, avec une approche très technique des fermentations lentes (pétrissages doux, pointage cuve/bac, apprêts contrôlés). Je pilote des productions quotidiennes importantes en garantissant une signature aromatique claire, une mie alvéolée et une croûte chantante. Sens aigu de l\'organisation: plan de four, rotations en boutique, suivi des stocks et des fiches techniques. Habitué aux audits hygiène, je documente mes paramètres (températures, hydratations) et j\'accompagne les équipes dans la montée en compétences. J\'ai à cœur de transmettre une méthode de travail claire et reproductible pour que l\'exigence reste compatible avec la cadence. J\'ai mené plusieurs chantiers d\'amélioration continue (réduction des pertes, standardisation des protocoles) avec impact direct sur la qualité et la marge.',
        certifications: ['CAP Boulanger', 'BP Boulanger'],
        experiences: [
          { bakeryName: 'Boulangerie du Canal', role: 'Chef de fournil', period: '2022–2024', city: 'Paris' },
          { bakeryName: 'Le Grenier Bio', role: 'Boulanger', period: '2019–2022', city: 'Montreuil' },
          { bakeryName: 'Maison Martin', role: 'Second de fournil', period: '2016–2019', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'camille.moreau@example.fr',
        phone: '+33 6 12 34 56 78',
        siret: '12345678901234',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'identity', url: '/documents/cni_camille_moreau.pdf', uploadedAt: '2020-01-15', verified: true },
          { type: 'diploma', url: '/documents/cap_boulanger_camille.pdf', uploadedAt: '2020-01-15', verified: true, diplomaType: 'CAP Boulanger', diplomaYear: 2014 },
          { type: 'diploma', url: '/documents/bp_boulanger_camille.pdf', uploadedAt: '2020-01-15', verified: true, diplomaType: 'BP Boulanger', diplomaYear: 2016 },
          { type: 'siret', url: '/documents/siret_camille.pdf', uploadedAt: '2020-01-15', verified: true },
          { type: 'rib', url: '/documents/rib_camille.pdf', uploadedAt: '2020-01-15', verified: true }
        ],
        notes: 'Excellent professionnel, très apprécié par les boulangeries. Tous les documents vérifiés.'
      },
      {
        id: 'pro2',
        firstName: 'Sofiane',
        lastName: 'Leroux',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Entremets modernes', 'Glaçage miroir', 'Dressages'],
        domains: ['Pâtisserie fine'],
        yearsExperience: 8,
        location: { city: 'Paris', postalCode: '75007', address: '12 Rue de Varenne, 75007 Paris' },
        hourlyRate: 34,
        missionsCompleted: 96,
        isPremium: true,
        bio: 'Pâtissier boutique et restaurant, orienté entremets modernes, tartes fines et dressages minute. Maîtrise des textures (mousses, croustillants, inserts calibrés), des courbes de température et des finitions (glaçage miroir tendu, velours homogène). Créatif mais rigoureux, je construis des cartes saisonnières optimisées en coût matière, je standardise les process et je forme les équipes sur les points critiques (hygiène, congélation/décongélation, tenue au transport). Habitué aux délais courts pour événements et hôtels, avec un niveau de finition constant. Mise en place de fiches techniques chiffrées et d\'un contrôle qualité à chaque étape.',
        certifications: ['CAP Pâtissier', 'BTM Pâtissier'],
        experiences: [
          { bakeryName: 'Salon Sucré', role: 'Chef pâtissier', period: '2021–2024', city: 'Paris' },
          { bakeryName: 'Éclats de Sucre', role: 'Pâtissier', period: '2018–2021', city: 'Boulogne' },
          { bakeryName: 'Hôtel Marceau', role: 'Chef de partie pâtisserie', period: '2016–2018', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'sofiane.leroux@example.fr',
        phone: '+33 6 98 76 54 32',
        siret: '98765432109876',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'identity', url: '/documents/cni_sofiane_leroux.pdf', uploadedAt: '2019-03-10', verified: true },
          { type: 'diploma', url: '/documents/cap_patissier_sofiane.pdf', uploadedAt: '2019-03-10', verified: true, diplomaType: 'CAP Pâtissier', diplomaYear: 2016 },
          { type: 'diploma', url: '/documents/btm_patissier_sofiane.pdf', uploadedAt: '2019-03-10', verified: true, diplomaType: 'BTM Pâtissier', diplomaYear: 2018 },
          { type: 'siret', url: '/documents/siret_sofiane.pdf', uploadedAt: '2019-03-10', verified: true }
        ],
        notes: 'Pâtissier talentueux, très créatif. Documents complets et vérifiés.'
      },
      {
        id: 'pro3',
        firstName: 'Omar',
        lastName: 'Bensaïd',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Viennoiserie pur beurre', 'Tourage'],
        domains: ['Tournier/Tourier'],
        yearsExperience: 6,
        location: { city: 'Paris', postalCode: '75009' },
        hourlyRate: 28,
        missionsCompleted: 74,
        isPremium: false,
        bio: 'Tourier spécialisé en feuilletage pur beurre: détrempes précises, beurrage régulier, tours simples/doubles au bon tempo. Excellent contrôle des températures pâte/beurre selon saison, optimisation des temps de repos pour un feuilletage net et un développement régulier. Expérience sur gros volumes nocturnes, standards stricts de calibrage et de cuisson, et mise en place efficace pour maintenir une cadence constante sans compromettre la qualité. Je transmets des astuces simples pour gagner en régularité sur des équipes mixtes (confirmés/débutants).',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'La Feuilletée', role: 'Tourier', period: '2020–2024', city: 'Paris' },
          { bakeryName: 'Maison des Viennoiseries', role: 'Aide tourier', period: '2018–2020', city: 'Saint-Denis' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro4',
        firstName: 'Lino',
        lastName: 'Dupuis',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Pains du monde', 'Ciabatta', 'Focaccia'],
        domains: ['Pain et viennoiserie', 'Pains du monde'],
        yearsExperience: 7,
        location: { city: 'Boulogne-Billancourt', postalCode: '92100' },
        hourlyRate: 30,
        missionsCompleted: 68,
        isPremium: false,
        bio: 'Panification italienne et pains du monde: hydratations élevées, maturations longues au froid, manipulation délicate des pâtes pour préserver les alvéoles. Expertise ciabatta/focaccia (huile d’olive, bassinage) et pains spéciaux. Focalisation sur la digestibilité et le goût, tout en tenant des cadences régulières. Travail d’équipe, adaptation aux contraintes d’espace et de matériel, respect des contrôles et des standards maison. J’ai structuré des protocoles clairs pour stabiliser la qualité malgré les variations climatiques, et optimisé la planification pour réduire les temps morts.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'Forno Paris', role: 'Boulanger', period: '2021–2024', city: 'Paris' },
          { bakeryName: 'Pane e Amore', role: 'Aide boulanger', period: '2017–2021', city: 'Paris' },
          { bakeryName: 'Casa Pane', role: 'Boulanger', period: '2015–2017', city: 'Rome' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro5',
        firstName: 'Victor',
        lastName: 'Rossi',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Sans gluten', 'Farines alternatives'],
        domains: ['Spécialisations techniques'],
        yearsExperience: 9,
        location: { city: 'Vincennes', postalCode: '94300' },
        hourlyRate: 35,
        missionsCompleted: 82,
        isPremium: true,
        bio: 'Spécialiste farines alternatives (riz, sarrasin, maïs) et environnement 100% sans gluten. Je mets en œuvre des protocoles stricts anti-contamination (circuit matières, bacs, fours, outils dédiés). Développement de recettes pains/viennoiseries sans gluten au rendu gourmand et texture agréable, avec focus conservation et transport. Capable de former les équipes et de rédiger des procédures claires et applicables en production. Objectif: offrir une expérience comparable aux produits classiques pour une clientèle exigeante.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'Grain Libre', role: 'Chef de production', period: '2020–2024', city: 'Paris' },
          { bakeryName: 'Sans-G', role: 'Boulanger', period: '2016–2020', city: 'Paris' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro6',
        firstName: 'Nino',
        lastName: 'Bernard',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Pâtisserie classique', 'Tartes', 'Choux'],
        domains: ['Pâtisserie'],
        yearsExperience: 6,
        location: { city: 'Paris', postalCode: '75012' },
        hourlyRate: 27,
        missionsCompleted: 58,
        isPremium: false,
        bio: 'Pâtissier polyvalent orienté classiques français: tartes (fonçage, cuisson à blanc, appareils), choux (pochage régulier, glaçages), entremets à la carte. Organisation du labo, respect des courbes de température et finitions propres sont mes priorités. Je m’intègre facilement dans une équipe et je partage des astuces pour gagner en régularité sur des productions quotidiennes. J’ai rationalisé des gammes pour réduire les ruptures et fluidifier la mise en vitrine.',
        certifications: ['CAP Pâtissier'],
        experiences: [
          { bakeryName: 'Classiques Gourmands', role: 'Pâtissier', period: '2021–2024', city: 'Vincennes' },
          { bakeryName: 'Maison Dupont', role: 'Commis pâtisserie', period: '2019–2021', city: 'Paris' },
          { bakeryName: 'Pâtisserie du Parc', role: 'Apprenti pâtissier', period: '2018–2019', city: 'Paris' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro7',
        firstName: 'Hugo',
        lastName: 'Petit',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Viennoiserie', 'Tourage', 'Brioches feuilletées'],
        domains: ['Tournier/Tourier'],
        yearsExperience: 5,
        location: { city: 'Saint-Denis', postalCode: '93200' },
        hourlyRate: 26,
        missionsCompleted: 52,
        isPremium: false,
        bio: 'Tourier attentif à la régularité des tours et au respect des repos. Je veille au contrôle des températures pâte/beurre et à la tenue des produits au four. Je sais adapter les grammages et la pousse pour tenir des pics de production en restant constant sur l’aspect et le goût.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'La Mie Dorée', role: 'Tourier', period: '2022–2024', city: 'Paris' },
          { bakeryName: 'Atelier Viennois', role: 'Aide tourier', period: '2019–2022', city: 'Saint-Denis' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro8',
        firstName: 'Mounir',
        lastName: 'Robert',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Pains spéciaux', 'Bio', 'Farines anciennes'],
        domains: ['Pain et viennoiserie'],
        yearsExperience: 7,
        location: { city: 'Paris', postalCode: '75014' },
        hourlyRate: 30,
        missionsCompleted: 61,
        isPremium: true,
        bio: 'Boulanger orienté bio et terroir: farines anciennes, levain, fermentation longue au froid. Je travaille en lien avec des meuniers locaux et je documente les paramètres pour stabiliser la qualité malgré les variations de matières premières. J’aime développer des gammes saisonnières autour des céréales et j’ai mené des tests comparatifs pour ajuster les hydratations et les temps de pousse selon les lots.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'Graines & Levains', role: 'Boulanger', period: '2020–2024', city: 'Boulogne' },
          { bakeryName: 'La Meule Bio', role: 'Boulanger', period: '2016–2020', city: 'Paris' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro9',
        firstName: 'Arthur',
        lastName: 'Richard',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Four à bois', 'Tradition'],
        domains: ['Pain et viennoiserie'],
        yearsExperience: 11,
        location: { city: 'Nogent-sur-Marne', postalCode: '94130' },
        hourlyRate: 33,
        missionsCompleted: 120,
        isPremium: true,
        bio: 'Spécialiste four à bois: allumage, gestion de la braise, chargement à la pelle, coups de buée alternatifs. Je sais lire la coloration pour restituer une croûte chantante et un goût typique. J’organise mon plan de cuisson pour tenir la cadence de la boutique du matin en garantissant des standards élevés.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'Au Feu de Bois', role: 'Chef fournier', period: '2021–2024', city: 'Nogent' },
          { bakeryName: 'Le Four des Halles', role: 'Fournier', period: '2015–2021', city: 'Paris' },
          { bakeryName: 'Boulangerie des Arts', role: 'Boulanger', period: '2010–2015', city: 'Paris' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro10',
        firstName: 'Sofiane',
        lastName: 'Durand',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Pâtisserie fine', 'Entremets', 'Dressages minute'],
        domains: ['Pâtisserie'],
        yearsExperience: 9,
        location: { city: 'Paris', postalCode: '75006' },
        hourlyRate: 34,
        missionsCompleted: 88,
        isPremium: true,
        bio: 'Pâtissier de restaurant et boutique: dressages minute, textures contrastées et finitions haut de gamme. Je construis des cartes équilibrées en coût et en complexité, tout en assurant un rendu visuel irréprochable. Pédagogie et sens du détail sont mes marqueurs. J’ai mis en place des contrôles finaux systématiques (brillance, tenue, coupe) et un plan de formation des nouveaux entrants.',
        certifications: ['CAP Pâtissier', 'BTM Pâtissier'],
        experiences: [
          { bakeryName: 'La Table Sucrée', role: 'Chef de partie', period: '2020–2024', city: 'Paris' },
          { bakeryName: 'Bistrot Étoilé', role: 'Pâtissier', period: '2017–2020', city: 'Paris' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro11',
        firstName: 'Yanis',
        lastName: 'Dubois',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Baguette tradition', 'Organisation fournil'],
        domains: ['Pain et viennoiserie'],
        yearsExperience: 8,
        location: { city: 'Paris', postalCode: '75020' },
        hourlyRate: 28,
        missionsCompleted: 90,
        isPremium: false,
        bio: 'Boulanger orienté tradition, rigoureux sur les grammages, les temps et la coloration. Je structure le plan de four pour éviter les goulets d’étranglement et je communique efficacement avec la vente sur les rotations. Je m’adapte rapidement aux équipements.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'La Fournée', role: 'Boulanger', period: '2019–2024', city: 'Paris' },
          { bakeryName: 'Boulange 20e', role: 'Boulanger', period: '2016–2019', city: 'Paris' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro12',
        firstName: 'Clément',
        lastName: 'Morel',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Viennoiserie', 'Brioches', 'Feuilletage'],
        domains: ['Tournier/Tourier'],
        yearsExperience: 4,
        location: { city: 'Paris', postalCode: '75005' },
        hourlyRate: 25,
        missionsCompleted: 40,
        isPremium: false,
        bio: 'Tourier soigneux et régulier. Je sécurise les temps de repos, j’ajuste les tours selon la saison et je veille à l’uniformité des calibres. Je tiens la cadence sans sacrifier le feuilletage ni la cuisson. J’ai mis en place des fiches de contrôle pour stabiliser les apprêts et réduire les variations entre opérateurs.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'Artisan Boulanger', role: 'Tourier', period: '2022–2024', city: 'Paris' },
          { bakeryName: 'Maison Fradin', role: 'Aide tourier', period: '2020–2022', city: 'Paris' },
          { bakeryName: 'La Brioche Dorée', role: 'Tourier', period: '2019–2020', city: 'Paris' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro13',
        firstName: 'Mehdi',
        lastName: 'Fournier',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Levain', 'Pains anciens'],
        domains: ['Pain et viennoiserie'],
        yearsExperience: 12,
        location: { city: 'Paris', postalCode: '75003' },
        hourlyRate: 31,
        missionsCompleted: 150,
        isPremium: true,
        bio: 'Boulanger senior, levain et farines anciennes, très à l’aise sur la stabilisation des process. Je documente finement les paramètres et j’encadre les équipes pour faire monter la qualité sur la durée. Je sais gérer les pics et les imprévus sans dégrader le rendu.',
        certifications: ['CAP Boulanger', 'BP Boulanger'],
        experiences: [
          { bakeryName: 'Tradition & Levain', role: 'Chef de fournil', period: '2020–2024', city: 'Paris' },
          { bakeryName: 'Le Vieux Levain', role: 'Boulanger', period: '2015–2020', city: 'Paris' },
          { bakeryName: 'Au Pain d’Antan', role: 'Boulanger', period: '2012–2015', city: 'Paris' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro14',
        firstName: 'Ilyes',
        lastName: 'Girard',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Pains bio', 'Graines', 'Autolyse'],
        domains: ['Pain et viennoiserie'],
        yearsExperience: 6,
        location: { city: 'Paris', postalCode: '75017' },
        hourlyRate: 29,
        missionsCompleted: 60,
        isPremium: false,
        bio: 'Boulanger bio, très sensible aux matières premières et au terroir. Je mets en place autolyses et fermentations lentes pour des pains digestes et aromatiques. Je communique avec les meuniers pour ajuster les protocoles selon les récoltes et je maintiens un journal de production pour ancrer les bonnes pratiques dans l’équipe.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'Bio & Graines', role: 'Boulanger', period: '2021–2024', city: 'Paris' },
          { bakeryName: 'Le Moulin Vert', role: 'Boulanger', period: '2018–2021', city: 'Paris' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro15',
        firstName: 'Paul',
        lastName: 'Bonnet',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Tourage', 'Croissants', 'Pains au chocolat'],
        domains: ['Tournier/Tourier'],
        yearsExperience: 7,
        location: { city: 'Paris', postalCode: '75015' },
        hourlyRate: 27,
        missionsCompleted: 72,
        isPremium: false,
        bio: 'Tourier méticuleux, constant sur les grammages et la pousse. J’ajuste les repos pour optimiser le feuilletage et je veille à des cuissons régulières. Je sais former rapidement un binôme pour fluidifier la prod.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'Beurre & Feuilletage', role: 'Tourier', period: '2020–2024', city: 'Paris' },
          { bakeryName: 'La Viennoise', role: 'Tourier', period: '2017–2020', city: 'Paris' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro16',
        firstName: 'Léo',
        lastName: 'Lambert',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Entremets', 'Glaçage miroir', 'Velours'],
        domains: ['Pâtisserie'],
        yearsExperience: 6,
        location: { city: 'Paris', postalCode: '75016' },
        hourlyRate: 32,
        missionsCompleted: 66,
        isPremium: true,
        bio: 'Pâtissier orienté finition haut de gamme. Je sécurise des glaçages tendus sans bulles, des velours homogènes et des décors nets. Je standardise les recettes pour gagner en régularité et en vitesse d’exécution. Mise en place de contrôles visuels stricts et de gabarits pour assurer une constance parfaite en vitrine.',
        certifications: ['CAP Pâtissier'],
        experiences: [
          { bakeryName: 'Pâtisserie Élégante', role: 'Pâtissier', period: '2021–2024', city: 'Paris' },
          { bakeryName: 'Maison des Délices', role: 'Pâtissier', period: '2018–2021', city: 'Paris' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro17',
        firstName: 'Noah',
        lastName: 'Fontaine',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Pains du monde', 'Hydratations élevées'],
        domains: ['Pain et viennoiserie'],
        yearsExperience: 5,
        location: { city: 'Paris', postalCode: '75011' },
        hourlyRate: 27,
        missionsCompleted: 50,
        isPremium: false,
        bio: 'Boulanger ouvert sur les pains internationaux: ciabatta, focaccia, bagels, pita. Je maîtrise les hydratations élevées et la manipulation douce pour préserver les alvéoles. Je documente mes ajustements pour faire monter la régularité.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'Four des Mondes', role: 'Boulanger', period: '2022–2024', city: 'Paris' },
          { bakeryName: 'Boulangerie Roma', role: 'Boulanger', period: '2019–2022', city: 'Paris' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro18',
        firstName: 'Maël',
        lastName: 'Carpentier',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Traiteur boulanger', 'Sandwicherie', 'Quiches'],
        domains: ['Traiteur boulanger'],
        yearsExperience: 6,
        location: { city: 'Paris', postalCode: '75116' },
        hourlyRate: 26,
        missionsCompleted: 62,
        isPremium: false,
        bio: 'Production salée: bases de quiches, appareils, pâtons pizza, mise en place sandwicherie. Je gère les pics de midi avec une organisation fluide et des standards constants sur la température de service et la tenue. J’ai rationalisé les gammes pour limiter la casse et mis en place un protocole de remontée en température sécurisé.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'Salé & Gourmand', role: 'Chef salé', period: '2021–2024', city: 'Paris' },
          { bakeryName: 'Le Comptoir Salé', role: 'Adjoint chef salé', period: '2018–2021', city: 'Paris' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro19',
        firstName: 'Jules',
        lastName: 'Renaud',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Sans gluten', 'Process qualité'],
        domains: ['Spécialisations techniques'],
        yearsExperience: 7,
        location: { city: 'Sceaux', postalCode: '92330' },
        hourlyRate: 33,
        missionsCompleted: 70,
        isPremium: true,
        bio: 'Référent qualité en environnement sans gluten: écriture de procédures, formation des équipes, contrôles anti-contamination. Mon objectif est de délivrer un produit sûr et gourmand, avec une texture agréable et une conservation réaliste pour la vente.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'Grain Libre', role: 'Référent qualité', period: '2020–2024', city: 'Paris' },
          { bakeryName: 'Sans-G', role: 'Boulanger', period: '2017–2020', city: 'Paris' }
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: 'pro20',
        firstName: 'Amine',
        lastName: 'Bougheraba',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Chef de fournil', 'Plan de four', 'Encadrement'],
        domains: ['Pain et viennoiserie'],
        yearsExperience: 13,
        location: { city: 'Saint-Denis', postalCode: '93200' },
        hourlyRate: 36,
        missionsCompleted: 180,
        isPremium: true,
        bio: 'Chef de fournil expérimenté: planification des productions, gestion du plan de four, coordination avec la boutique et encadrement des équipes. Je structure les process pour tenir des cadences élevées sans perdre la signature maison. J’interviens aussi en formation pour stabiliser la qualité sur la durée. J’ai conduit des projets d’optimisation (planning, ordonnancement, approvisionnements) avec des gains mesurés sur la régularité et les coûts.',
        certifications: ['CAP Boulanger', 'BP Boulanger'],
        experiences: [
          { bakeryName: 'Maison Chabrier', role: 'Chef de fournil', period: '2021–2024', city: 'Paris' },
          { bakeryName: 'Atelier des Saveurs', role: 'Boulanger', period: '2017–2021', city: 'Paris' },
          { bakeryName: 'Maison Delacroix', role: 'Boulanger', period: '2014–2017', city: 'Paris' }
        ],
        createdAt: new Date().toISOString()
      },
      // Professionnels supplémentaires (20+)
      {
        id: 'pro21',
        firstName: 'Raphaël',
        lastName: 'Garnier',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Boulangerie tradition', 'Viennoiserie'],
        domains: ['Pain et viennoiserie'],
        yearsExperience: 6,
        location: { city: 'Paris', postalCode: '75013' },
        hourlyRate: 28,
        missionsCompleted: 65,
        isPremium: false,
        bio: 'Boulanger traditionnel, rigoureux sur les process et la qualité. Je maîtrise les fermentations longues et les techniques artisanales.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'La Tradition', role: 'Boulanger', period: '2020–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'raphael.garnier@example.fr',
        phone: '+33 6 11 22 33 44',
        siret: '11122233344455',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'identity', url: '/documents/cni_raphael.pdf', uploadedAt: '2020-01-10', verified: true },
          { type: 'diploma', url: '/documents/cap_raphael.pdf', uploadedAt: '2020-01-10', verified: true, diplomaType: 'CAP Boulanger', diplomaYear: 2018 }
        ]
      },
      {
        id: 'pro22',
        firstName: 'Maxime',
        lastName: 'Lemaire',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Pâtisserie', 'Entremets'],
        domains: ['Pâtisserie'],
        yearsExperience: 5,
        location: { city: 'Paris', postalCode: '75010' },
        hourlyRate: 30,
        missionsCompleted: 48,
        isPremium: false,
        bio: 'Pâtissier créatif, spécialisé en entremets et desserts modernes. Je maîtrise les textures et les finitions haut de gamme.',
        certifications: ['CAP Pâtissier'],
        experiences: [
          { bakeryName: 'Pâtisserie Fine', role: 'Pâtissier', period: '2021–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'maxime.lemaire@example.fr',
        phone: '+33 6 22 33 44 55',
        siret: '22233344455566',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'identity', url: '/documents/cni_maxime.pdf', uploadedAt: '2021-01-15', verified: true }
        ]
      },
      {
        id: 'pro23',
        firstName: 'Alexandre',
        lastName: 'Roux',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Tourage', 'Viennoiserie'],
        domains: ['Tournier/Tourier'],
        yearsExperience: 4,
        location: { city: 'Paris', postalCode: '75018' },
        hourlyRate: 26,
        missionsCompleted: 42,
        isPremium: false,
        bio: 'Tourier spécialisé en viennoiserie pur beurre. Je maîtrise les tours et la manipulation des pâtes feuilletées.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'La Croûte Dorée', role: 'Tourier', period: '2022–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'alexandre.roux@example.fr',
        phone: '+33 6 33 44 55 66',
        status: 'auto-entrepreneur',
        verificationStatus: 'pending'
      },
      {
        id: 'pro24',
        firstName: 'Nicolas',
        lastName: 'Blanc',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Boulangerie', 'Levain'],
        domains: ['Pain et viennoiserie'],
        yearsExperience: 8,
        location: { city: 'Paris', postalCode: '75012' },
        hourlyRate: 31,
        missionsCompleted: 95,
        isPremium: true,
        bio: 'Boulanger spécialisé en levain naturel et farines anciennes. Je maîtrise les fermentations longues et les techniques artisanales.',
        certifications: ['CAP Boulanger', 'BP Boulanger'],
        experiences: [
          { bakeryName: 'Le Fournil Artisanal', role: 'Chef de fournil', period: '2020–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'nicolas.blanc@example.fr',
        phone: '+33 6 44 55 66 77',
        siret: '33344455566677',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified',
        verificationDocuments: [
          { type: 'identity', url: '/documents/cni_nicolas.pdf', uploadedAt: '2020-01-20', verified: true },
          { type: 'diploma', url: '/documents/cap_nicolas.pdf', uploadedAt: '2020-01-20', verified: true, diplomaType: 'CAP Boulanger', diplomaYear: 2016 }
        ]
      },
      {
        id: 'pro25',
        firstName: 'Baptiste',
        lastName: 'Moreau',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Pâtisserie', 'Glaçage'],
        domains: ['Pâtisserie'],
        yearsExperience: 7,
        location: { city: 'Paris', postalCode: '75014' },
        hourlyRate: 32,
        missionsCompleted: 78,
        isPremium: true,
        bio: 'Pâtissier expert en glaçage miroir et finitions haut de gamme. Je maîtrise les techniques modernes de pâtisserie.',
        certifications: ['CAP Pâtissier', 'BTM Pâtissier'],
        experiences: [
          { bakeryName: 'Pâtisserie Royale', role: 'Chef pâtissier', period: '2021–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'baptiste.moreau@example.fr',
        phone: '+33 6 55 66 77 88',
        siret: '44455566677788',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified'
      },
      {
        id: 'pro26',
        firstName: 'Théo',
        lastName: 'Garcia',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Viennoiserie', 'Brioches'],
        domains: ['Tournier/Tourier'],
        yearsExperience: 5,
        location: { city: 'Paris', postalCode: '75016' },
        hourlyRate: 27,
        missionsCompleted: 55,
        isPremium: false,
        bio: 'Tourier spécialisé en brioches et viennoiserie. Je maîtrise les techniques de pousse et de cuisson.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'Boulangerie du Quartier', role: 'Tourier', period: '2021–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'theo.garcia@example.fr',
        phone: '+33 6 66 77 88 99',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified'
      },
      {
        id: 'pro27',
        firstName: 'Julien',
        lastName: 'Petit',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Boulangerie bio', 'Farines anciennes'],
        domains: ['Pain et viennoiserie'],
        yearsExperience: 9,
        location: { city: 'Paris', postalCode: '75019' },
        hourlyRate: 30,
        missionsCompleted: 88,
        isPremium: true,
        bio: 'Boulanger bio spécialisé en farines anciennes et techniques artisanales. Je maîtrise les fermentations longues.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'Boulangerie Bio', role: 'Boulanger', period: '2020–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'julien.petit@example.fr',
        phone: '+33 6 77 88 99 00',
        siret: '55566677788899',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified'
      },
      {
        id: 'pro28',
        firstName: 'Adrien',
        lastName: 'Martinez',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Pâtisserie', 'Entremets'],
        domains: ['Pâtisserie'],
        yearsExperience: 6,
        location: { city: 'Paris', postalCode: '75020' },
        hourlyRate: 29,
        missionsCompleted: 62,
        isPremium: false,
        bio: 'Pâtissier créatif, spécialisé en entremets et desserts modernes. Je maîtrise les textures et les finitions.',
        certifications: ['CAP Pâtissier'],
        experiences: [
          { bakeryName: 'Pâtisserie des Rêves', role: 'Pâtissier', period: '2021–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'adrien.martinez@example.fr',
        phone: '+33 6 88 99 00 11',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified'
      },
      {
        id: 'pro29',
        firstName: 'Florian',
        lastName: 'Simon',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Boulangerie', 'Tradition'],
        domains: ['Pain et viennoiserie'],
        yearsExperience: 7,
        location: { city: 'Paris', postalCode: '75015' },
        hourlyRate: 29,
        missionsCompleted: 75,
        isPremium: false,
        bio: 'Boulanger traditionnel, rigoureux sur les process et la qualité. Je maîtrise les techniques artisanales.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'La Maison du Pain', role: 'Boulanger', period: '2020–2024', city: 'Boulogne' }
        ],
        createdAt: new Date().toISOString(),
        email: 'florian.simon@example.fr',
        phone: '+33 6 99 00 11 22',
        siret: '66677788899900',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified'
      },
      {
        id: 'pro30',
        firstName: 'Quentin',
        lastName: 'Michel',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Tourage', 'Feuilletage'],
        domains: ['Tournier/Tourier'],
        yearsExperience: 5,
        location: { city: 'Paris', postalCode: '75017' },
        hourlyRate: 28,
        missionsCompleted: 58,
        isPremium: false,
        bio: 'Tourier spécialisé en feuilletage pur beurre. Je maîtrise les tours et la manipulation des pâtes.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'Le Four à Bois', role: 'Tourier', period: '2021–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'quentin.michel@example.fr',
        phone: '+33 6 00 11 22 33',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified'
      },
      {
        id: 'pro31',
        firstName: 'Matthieu',
        lastName: 'Laurent',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Pâtisserie', 'Gâteaux'],
        domains: ['Pâtisserie'],
        yearsExperience: 8,
        location: { city: 'Paris', postalCode: '75011' },
        hourlyRate: 33,
        missionsCompleted: 92,
        isPremium: true,
        bio: 'Pâtissier expert en gâteaux et desserts classiques. Je maîtrise les techniques traditionnelles et modernes.',
        certifications: ['CAP Pâtissier', 'BTM Pâtissier'],
        experiences: [
          { bakeryName: 'Pâtisserie Élégante', role: 'Chef pâtissier', period: '2020–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'matthieu.laurent@example.fr',
        phone: '+33 6 11 22 33 44',
        siret: '77788899900011',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified'
      },
      {
        id: 'pro32',
        firstName: 'Fabien',
        lastName: 'Philippe',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Boulangerie', 'Viennoiserie'],
        domains: ['Pain et viennoiserie'],
        yearsExperience: 6,
        location: { city: 'Paris', postalCode: '75013' },
        hourlyRate: 28,
        missionsCompleted: 68,
        isPremium: false,
        bio: 'Boulanger polyvalent, spécialisé en pains et viennoiserie. Je maîtrise les techniques artisanales.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'Boulangerie du Matin', role: 'Boulanger', period: '2021–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'fabien.philippe@example.fr',
        phone: '+33 6 22 33 44 55',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified'
      },
      {
        id: 'pro33',
        firstName: 'Romain',
        lastName: 'Bernard',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Pâtisserie', 'Tartes'],
        domains: ['Pâtisserie'],
        yearsExperience: 5,
        location: { city: 'Paris', postalCode: '75008' },
        hourlyRate: 30,
        missionsCompleted: 52,
        isPremium: false,
        bio: 'Pâtissier spécialisé en tartes et desserts classiques. Je maîtrise les techniques de fonçage et de cuisson.',
        certifications: ['CAP Pâtissier'],
        experiences: [
          { bakeryName: 'Pâtisserie du Bonheur', role: 'Pâtissier', period: '2021–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'romain.bernard@example.fr',
        phone: '+33 6 33 44 55 66',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified'
      },
      {
        id: 'pro34',
        firstName: 'Sébastien',
        lastName: 'Robin',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Boulangerie', 'Levain'],
        domains: ['Pain et viennoiserie'],
        yearsExperience: 10,
        location: { city: 'Paris', postalCode: '75012' },
        hourlyRate: 32,
        missionsCompleted: 110,
        isPremium: true,
        bio: 'Boulanger senior spécialisé en levain naturel. Je maîtrise les fermentations longues et les techniques artisanales.',
        certifications: ['CAP Boulanger', 'BP Boulanger'],
        experiences: [
          { bakeryName: 'Le Pain Rustique', role: 'Chef de fournil', period: '2020–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'sebastien.robin@example.fr',
        phone: '+33 6 44 55 66 77',
        siret: '88899900011122',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified'
      },
      {
        id: 'pro35',
        firstName: 'Vincent',
        lastName: 'Henry',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Tourage', 'Croissants'],
        domains: ['Tournier/Tourier'],
        yearsExperience: 4,
        location: { city: 'Paris', postalCode: '75009' },
        hourlyRate: 26,
        missionsCompleted: 45,
        isPremium: false,
        bio: 'Tourier spécialisé en croissants et viennoiserie pur beurre. Je maîtrise les tours et la manipulation.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'La Pâte à Tartiner', role: 'Tourier', period: '2022–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'vincent.henry@example.fr',
        phone: '+33 6 55 66 77 88',
        status: 'auto-entrepreneur',
        verificationStatus: 'pending'
      },
      {
        id: 'pro36',
        firstName: 'Guillaume',
        lastName: 'Rousseau',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Pâtisserie', 'Entremets'],
        domains: ['Pâtisserie'],
        yearsExperience: 7,
        location: { city: 'Paris', postalCode: '75007' },
        hourlyRate: 31,
        missionsCompleted: 82,
        isPremium: true,
        bio: 'Pâtissier expert en entremets et desserts modernes. Je maîtrise les textures et les finitions haut de gamme.',
        certifications: ['CAP Pâtissier'],
        experiences: [
          { bakeryName: 'Pâtisserie Fine', role: 'Chef pâtissier', period: '2020–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'guillaume.rousseau@example.fr',
        phone: '+33 6 66 77 88 99',
        siret: '99900011122233',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified'
      },
      {
        id: 'pro37',
        firstName: 'Antoine',
        lastName: 'David',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Boulangerie', 'Tradition'],
        domains: ['Pain et viennoiserie'],
        yearsExperience: 6,
        location: { city: 'Paris', postalCode: '75014' },
        hourlyRate: 29,
        missionsCompleted: 70,
        isPremium: false,
        bio: 'Boulanger traditionnel, rigoureux sur les process et la qualité. Je maîtrise les techniques artisanales.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'Le Petit Four', role: 'Boulanger', period: '2021–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'antoine.david@example.fr',
        phone: '+33 6 77 88 99 00',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified'
      },
      {
        id: 'pro38',
        firstName: 'Jérémy',
        lastName: 'Bertrand',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Viennoiserie', 'Brioches'],
        domains: ['Tournier/Tourier'],
        yearsExperience: 5,
        location: { city: 'Paris', postalCode: '75016' },
        hourlyRate: 27,
        missionsCompleted: 60,
        isPremium: false,
        bio: 'Tourier spécialisé en brioches et viennoiserie. Je maîtrise les techniques de pousse et de cuisson.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'La Mie Croustillante', role: 'Tourier', period: '2021–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'jeremy.bertrand@example.fr',
        phone: '+33 6 88 99 00 11',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified'
      },
      {
        id: 'pro39',
        firstName: 'Damien',
        lastName: 'Nguyen',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Pâtisserie', 'Glaçage'],
        domains: ['Pâtisserie'],
        yearsExperience: 8,
        location: { city: 'Paris', postalCode: '75019' },
        hourlyRate: 32,
        missionsCompleted: 85,
        isPremium: true,
        bio: 'Pâtissier expert en glaçage miroir et finitions haut de gamme. Je maîtrise les techniques modernes.',
        certifications: ['CAP Pâtissier'],
        experiences: [
          { bakeryName: 'Pâtisserie Royale', role: 'Chef pâtissier', period: '2020–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'damien.nguyen@example.fr',
        phone: '+33 6 99 00 11 22',
        siret: '00011122233344',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified'
      },
      {
        id: 'pro40',
        firstName: 'Kevin',
        lastName: 'Girard',
        avatar: getRandomProfessionalAvatar(),
        specialties: ['Boulangerie', 'Levain'],
        domains: ['Pain et viennoiserie'],
        yearsExperience: 7,
        location: { city: 'Paris', postalCode: '75020' },
        hourlyRate: 30,
        missionsCompleted: 75,
        isPremium: false,
        bio: 'Boulanger spécialisé en levain naturel et farines anciennes. Je maîtrise les fermentations longues.',
        certifications: ['CAP Boulanger'],
        experiences: [
          { bakeryName: 'Le Pain de la Terre', role: 'Boulanger', period: '2020–2024', city: 'Paris' }
        ],
        createdAt: new Date().toISOString(),
        email: 'kevin.girard@example.fr',
        phone: '+33 6 00 11 22 33',
        siret: '11122233344455',
        status: 'auto-entrepreneur',
        verificationStatus: 'verified'
      }
    ]

    professionals.value = pros
  }

  // init
  if (!professionals.value.length) generateMockProfessionals()

  function getProfessionalById(id: string) {
    return professionals.value.find(p => p.id === id)
  }

  return {
    professionals,
    premiumProfessionals,
    generateMockProfessionals,
    getProfessionalById,
  }
})


