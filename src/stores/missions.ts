import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Mission {
  id: string
  title: string
  description: string
  bakeryId: string
  bakeryName: string
  bakeryAddress: string
  bakeryAvatar?: string
  type: 'ponctuel' | 'recurrent' | 'urgence' | 'evenement'
  position: 'boulanger' | 'patissier' | 'vendeur' | 'tourneur'
  duration: string
  startDate: string
  endDate?: string
  schedule: string
  hourlyRate: number
  requirements: {
    experience: number
    certifications: string[]
    specialties: string[]
  }
  equipment: string[]
  status: 'open' | 'filled' | 'completed' | 'cancelled'
  applicants: number
  location: {
    address: string
    city: string
    postalCode: string
    coordinates?: { lat: number; lng: number }
  }
  createdAt: string
  urgency?: 'immediate' | 'same-day' | 'within-week'
}

export interface Application {
  id: string
  missionId: string
  professionalId: string
  professionalName: string
  professionalAvatar?: string
  message: string
  proposedRate?: number
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn'
  appliedAt: string
}

export const useMissionsStore = defineStore('missions', () => {
  const missions = ref<Mission[]>([])
  const applications = ref<Application[]>([])
  const isLoading = ref(false)

  // Computed properties
  const openMissions = computed(() => 
    missions.value.filter(mission => mission.status === 'open')
  )
  
  const urgentMissions = computed(() => 
    openMissions.value.filter(mission => mission.urgency && ['immediate', 'same-day'].includes(mission.urgency))
  )

  const missionsByType = computed(() => {
    return openMissions.value.reduce((acc, mission) => {
      if (!acc[mission.type]) acc[mission.type] = []
      acc[mission.type].push(mission)
      return acc
    }, {} as Record<string, Mission[]>)
  })

  // Actions
  function generateMockMissions() {
    const mockMissions: Mission[] = [
      {
        id: '1',
        title: 'Boulanger expérimenté - Remplacement weekend',
        description: 'Remplacement au fournil sur un volume soutenu le weekend. Vous prenez en charge l’ensemble du process: préparation du levain chef (rafraîchis, suivi température et acidité), pétrissages adaptés en fonction des farines et de la météo (pointage/pousse), façonnages réguliers des baguettes tradition, pains de campagne et pains spéciaux. Vous organisez les fournées, anticipez les rotations en boutique, gérez précisément les coups de buée et la coloration. La qualité attendue: croûte chantante, mie bien alvéolée, profils aromatiques nets. Vous travaillez en binôme avec le fournier pour sécuriser la cadence sans sacrifier la régularité. Rigueur HACCP, traçabilité et nettoyage du poste en fin de service.',
        bakeryId: 'bakery1',
        bakeryName: 'Boulangerie du Moulin',
        bakeryAddress: '23 Rue de Rivoli, 75001 Paris',
        bakeryAvatar: 'boulangerie1.jpeg',
        type: 'ponctuel',
        position: 'boulanger',
        duration: '2 jours',
        startDate: '2024-01-27',
        endDate: '2024-01-28',
        schedule: '05h00 - 13h00',
        hourlyRate: 28,
        requirements: {
          experience: 3,
          certifications: ['CAP Boulanger'],
          specialties: ['Boulangerie artisanale', 'Viennoiserie']
        },
        equipment: ['Four à sole', 'Pétrin spirale', 'Chambre de fermentation'],
        status: 'open',
        applicants: 5,
        location: {
          address: '23 Rue de Rivoli',
          city: 'Paris',
          postalCode: '75001',
          coordinates: { lat: 48.8606, lng: 2.3376 }
        },
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'URGENT - Pâtissier pour mariage demain',
        description: 'Intervention express pour finaliser des entremets et un wedding cake de haut niveau. Vous réalisez inserts (fruit/chocolat), montages soignés, glaçages miroir ultra lisses et finitions florales/dorures. Vous maîtrisez les textures (mousses aérées, croustillants réguliers), connaissez les courbes de température et les temps de cristallisation. Objectif: rendu visuel irréprochable, tenue au transport, découpe nette et expérience gustative équilibrée. Vous savez prioriser, travailler proprement, briefer la vente sur les conditions de conservation et l’assemblage final si nécessaire.',
        bakeryId: 'bakery2',
        bakeryName: 'Pâtisserie Délices',
        bakeryAddress: '45 Avenue des Champs-Élysées, 75008 Paris',
        bakeryAvatar: 'boulangerie2.jpeg',
        type: 'urgence',
        position: 'patissier',
        duration: '1 jour',
        startDate: '2024-01-21',
        schedule: '08h00 - 18h00',
        hourlyRate: 35,
        requirements: {
          experience: 5,
          certifications: ['CAP Pâtissier', 'BTM Pâtissier'],
          specialties: ['Pâtisserie française traditionnelle', 'Décoration/wedding cake']
        },
        equipment: ['Four ventilé', 'Tempéreuse chocolat', 'Matériel décoration'],
        status: 'open',
        applicants: 2,
        location: {
          address: '45 Avenue des Champs-Élysées',
          city: 'Paris',
          postalCode: '75008',
          coordinates: { lat: 48.8698, lng: 2.3076 }
        },
        createdAt: new Date().toISOString(),
        urgency: 'same-day'
      },
      {
        id: '3',
        title: 'Vendeur/Vendeuse - CDI week-end',
        description: 'Week-end en boutique: accueil chaleureux, conseil sur pains/viennoiseries/pâtisseries, mise en avant des produits de saison. Encaissement, réassort régulier, mise en vitrine esthétique, respect hygiène/traçabilité. Sens du relationnel pour fidéliser et augmenter le panier moyen.',
        bakeryId: 'bakery3',
        bakeryName: 'La Mie Dorée',
        bakeryAddress: '12 Place Saint-Germain, 75006 Paris',
        bakeryAvatar: 'boulangerie3.jpeg',
        type: 'recurrent',
        position: 'vendeur',
        duration: 'Tous les week-ends',
        startDate: '2024-02-01',
        schedule: '07h00 - 14h00',
        hourlyRate: 22,
        requirements: {
          experience: 1,
          certifications: [],
          specialties: ['Vente', 'Accueil clientèle']
        },
        equipment: ['Caisse enregistreuse', 'Balance', 'Vitrine réfrigérée'],
        status: 'open',
        applicants: 8,
        location: {
          address: '12 Place Saint-Germain',
          city: 'Paris',
          postalCode: '75006',
          coordinates: { lat: 48.8534, lng: 2.3354 }
        },
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        title: 'Tourneur - Production nocturne',
        description: 'Production nocturne en viennoiserie: détrempes, beurrage, tours réguliers, façonnages (croissants, pains au chocolat, chaussons, brioches). Contrôle des températures beurre/pâte, pousse/apprêt maîtrisés, cuissons homogènes. Organisation du plan de travail pour volumes importants.',
        bakeryId: 'bakery4',
        bakeryName: 'Artisan Boulanger',
        bakeryAddress: '8 Rue Mouffetard, 75005 Paris',
        bakeryAvatar: 'boulangerie4.jpeg',
        type: 'ponctuel',
        position: 'tourneur',
        duration: '5 jours',
        startDate: '2024-01-25',
        endDate: '2024-01-29',
        schedule: '02h00 - 08h00',
        hourlyRate: 26,
        requirements: {
          experience: 4,
          certifications: ['CAP Boulanger'],
          specialties: ['Façonnage', 'Pains spéciaux']
        },
        equipment: ['Diviseuse', 'Façonneuse', 'Chambre de pousse'],
        status: 'open',
        applicants: 3,
        location: {
          address: '8 Rue Mouffetard',
          city: 'Paris',
          postalCode: '75005',
          coordinates: { lat: 48.8426, lng: 2.3488 }
        },
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        title: 'Boulanger levain - Remplacement matin',
        description: 'Poste focalisé sur le levain naturel (rafraîchis quotidiens, suivi pH/arômes), pétrissages doux (spirale/bassinage), pointage en cuve et en bac selon le planning. Vous façonnez baguette tradition, pains anciens (épeautre, seigle) et gammes rustiques en respectant les grammages et les temps de détente. Vous ajustez hydratation, temps et températures pour garantir une signature aromatique et une conservation optimales. Vous documentez vos paramètres, appliquez HACCP et laissez un poste propre, rangé, opérationnel pour l’équipe suivante.',
        bakeryId: 'bakery5',
        bakeryName: 'Le Levain Parisien',
        bakeryAddress: '5 Rue Oberkampf, 75011 Paris',
        bakeryAvatar: 'boulangerie5.jpeg',
        type: 'ponctuel',
        position: 'boulanger',
        duration: '3 jours',
        startDate: '2024-02-10',
        schedule: '04h30 - 12h30',
        hourlyRate: 29,
        requirements: {
          experience: 4,
          certifications: ['CAP Boulanger'],
          specialties: ['Levain naturel', 'Pains anciens']
        },
        equipment: ['Four à sole', 'Bassinage', 'Chambre de pousse'],
        status: 'open',
        applicants: 1,
        location: { address: '5 Rue Oberkampf', city: 'Paris', postalCode: '75011' },
        createdAt: new Date().toISOString()
      },
      {
        id: '6',
        title: 'Pâtisserie moderne - entremets et glaçage miroir',
        description: 'Production d’entremets modernes exigeants: réalisation de biscuits moelleux, croustillants stables, mousses aérées, inserts calibrés (fruit, praliné, chocolat). Vous gérez les températures au degré près, travaillez au pistolet pour les velours, réalisez des glaçages miroir brillants sans bulles. Finitions précises (spirales, quenelles, décors chocolat), régularité des tailles et respect des plans de production. Créativité bienvenue pour déclinaisons saisonnières et optimisation des rendements sans perdre en qualité.',
        bakeryId: 'bakery6',
        bakeryName: 'Maison Sucrée',
        bakeryAddress: '18 Rue du Bac, 75007 Paris',
        bakeryAvatar: 'boulangerie6.jpeg',
        type: 'ponctuel',
        position: 'patissier',
        duration: '1 semaine',
        startDate: '2024-02-15',
        schedule: '06h00 - 14h00',
        hourlyRate: 32,
        requirements: {
          experience: 3,
          certifications: ['CAP Pâtissier'],
          specialties: ['Pâtisserie moderne', 'Glaçage miroir']
        },
        equipment: ['Cellule de refroidissement', 'Tempéreuse chocolat'],
        status: 'open',
        applicants: 4,
        location: { address: '18 Rue du Bac', city: 'Paris', postalCode: '75007' },
        createdAt: new Date().toISOString()
      },
      {
        id: '7',
        title: 'Viennoiserie artisanale - feuilletage pur beurre',
        description: 'Feuilletage pur beurre: détrempes, beurrage uniforme, tours simples/doubles. Façonnages réguliers, apprêts maîtrisés, cuissons homogènes. Optimisation des repos et des grammages pour une qualité constante sur tous les produits.',
        bakeryId: 'bakery7',
        bakeryName: 'La Feuilletée',
        bakeryAddress: '9 Rue Lafayette, 75009 Paris',
        bakeryAvatar: 'boulangerie7.jpeg',
        type: 'recurrent',
        position: 'tourneur',
        duration: 'Tous les lundis et mardis',
        startDate: '2024-02-05',
        schedule: '03h30 - 10h30',
        hourlyRate: 27,
        requirements: {
          experience: 2,
          certifications: ['CAP Boulanger'],
          specialties: ['Viennoiserie', 'Tourage']
        },
        equipment: ['Laminoir', 'Chambre de pousse'],
        status: 'open',
        applicants: 3,
        location: { address: '9 Rue Lafayette', city: 'Paris', postalCode: '75009' },
        createdAt: new Date().toISOString()
      },
      {
        id: '8',
        title: 'Vente en boutique - accueil premium',
        description: 'Accueil premium, conseils personnalisés (dégustation/conservation), encaissement fluide, gestion des flux de midi. Mise en rayon soignée, contrôle DLC et traçabilité, prise de commandes (téléphone/click&collect).',
        bakeryId: 'bakery8',
        bakeryName: 'Champs Gourmands',
        bakeryAddress: '120 Av. Victor Hugo, 75016 Paris',
        bakeryAvatar: 'boulangerie8.jpeg',
        type: 'ponctuel',
        position: 'vendeur',
        duration: '10 jours',
        startDate: '2024-02-20',
        schedule: '10h00 - 19h00',
        hourlyRate: 21,
        requirements: {
          experience: 1,
          certifications: [],
          specialties: ['Accueil', 'Vente']
        },
        equipment: ['Caisse', 'Balance'],
        status: 'open',
        applicants: 6,
        location: { address: '120 Av. Victor Hugo', city: 'Paris', postalCode: '75016' },
        createdAt: new Date().toISOString()
      },
      {
        id: '9',
        title: 'Boulangerie bio - pains anciens',
        description: 'Gamme pains anciens en farines bio (épeautre, seigle, blés anciens) avec forte exigence sur l’authenticité. Vous mettez en œuvre autolyses, levain, fermentations longues au froid et façonnages en bannetons. Vous ajustez l’acidité et la force de la pâte pour obtenir un développement de mie harmonieux et une croûte bien développée. Vous êtes sensible aux profils de farines, échangez avec les meuniers et respectez les engagements qualité de la maison (bio, circuits courts, traçabilité).',
        bakeryId: 'bakery9',
        bakeryName: 'Graines & Levains',
        bakeryAddress: '3 Rue de la République, 92100 Boulogne-Billancourt',
        bakeryAvatar: 'boulangerie9.jpeg',
        type: 'evenement',
        position: 'boulanger',
        duration: '2 semaines',
        startDate: '2024-03-01',
        schedule: '05h00 - 12h00',
        hourlyRate: 30,
        requirements: {
          experience: 4,
          certifications: ['CAP Boulanger'],
          specialties: ['Pains anciens', 'Bio']
        },
        equipment: ['Four à sole', 'Banneton'],
        status: 'open',
        applicants: 2,
        location: { address: '3 Rue de la République', city: 'Boulogne-Billancourt', postalCode: '92100' },
        createdAt: new Date().toISOString()
      },
      {
        id: '10',
        title: 'Pâtisserie classique - tartes & choux',
        description: 'Tartes & choux: fonçage et cuisson à blanc, appareils (crème d’amande/pâtissière/citron), pochage régulier, glaçages brillants. Finitions propres, calibres réguliers, organisation frigo positif/négatif, hygiène irréprochable.',
        bakeryId: 'bakery10',
        bakeryName: 'Classiques Gourmands',
        bakeryAddress: '22 Rue de Paris, 94300 Vincennes',
        bakeryAvatar: 'boulangerie10.jpeg',
        type: 'recurrent',
        position: 'patissier',
        duration: 'Chaque samedi',
        startDate: '2024-03-05',
        schedule: '06h00 - 14h00',
        hourlyRate: 26,
        requirements: {
          experience: 2,
          certifications: ['CAP Pâtissier'],
          specialties: ['Pâtisserie classique']
        },
        equipment: ['Four ventilé'],
        status: 'open',
        applicants: 5,
        location: { address: '22 Rue de Paris', city: 'Vincennes', postalCode: '94300' },
        createdAt: new Date().toISOString()
      },
      {
        id: '11',
        title: 'Nuit - fournier expérimenté',
        description: 'Fournier nuit: chauffe, chargement/pelage, coups de buée, lecture de coloration. Synchronisation avec façonnage, cadence soutenue, sécurité du poste four. Respect des timings pour l’ouverture boutique.',
        bakeryId: 'bakery11',
        bakeryName: 'La Fournée',
        bakeryAddress: '14 Rue de Belleville, 75020 Paris',
        bakeryAvatar: 'boulangerie11.jpeg',
        type: 'ponctuel',
        position: 'boulanger',
        duration: '1 semaine',
        startDate: '2024-03-12',
        schedule: '01h00 - 07h00',
        hourlyRate: 31,
        requirements: {
          experience: 5,
          certifications: ['CAP Boulanger'],
          specialties: ['Cuisson', 'Gestion de cadence']
        },
        equipment: ['Four à sole'],
        status: 'open',
        applicants: 1,
        location: { address: '14 Rue de Belleville', city: 'Paris', postalCode: '75020' },
        createdAt: new Date().toISOString()
      },
      {
        id: '12',
        title: 'Assistant vente - renfort midi',
        description: 'Rush de midi: prise de commandes sandwicherie, encaissement rapide et exact, réassort vitrine salée/sucrée, maintien propreté comptoir/salle. Gestion du stress et sens du service indispensables.',
        bakeryId: 'bakery12',
        bakeryName: 'Au Blé d’Or',
        bakeryAddress: '7 Rue Danton, 75006 Paris',
        bakeryAvatar: 'boulangerie12.jpeg',
        type: 'urgence',
        position: 'vendeur',
        duration: '3 jours',
        startDate: '2024-02-01',
        schedule: '11h00 - 15h00',
        hourlyRate: 23,
        requirements: {
          experience: 1,
          certifications: [],
          specialties: ['Vente', 'Relation client']
        },
        equipment: ['Caisse'],
        status: 'open',
        applicants: 7,
        location: { address: '7 Rue Danton', city: 'Paris', postalCode: '75006' },
        createdAt: new Date().toISOString(),
        urgency: 'immediate'
      },
      {
        id: '13',
        title: 'Boulangerie traditionnelle française - fournil levain',
        description: 'Mission cœur tradition avec exigence de constance. Vous pilotez rafraîchis de levain, adaptez les pétrissages aux farines et à la météo, façonnez à la main (baguette tradition, pains de campagne), gérez la fermentation lente (T° pièce/hygrométrie) et les apprêts. Vous suivez les fiches techniques, remontez les écarts, et sécurisez des fournées régulières en coordination avec la boutique (prévisions, rotations, pics).',
        bakeryId: 'bakery13',
        bakeryName: 'Tradition & Levain',
        bakeryAddress: '4 Rue Rambuteau, 75003 Paris',
        bakeryAvatar: 'boulangerie13.jpeg',
        type: 'ponctuel',
        position: 'boulanger',
        duration: '10 jours',
        startDate: '2024-03-18',
        schedule: '04h00 - 12h00',
        hourlyRate: 30,
        requirements: {
          experience: 3,
          certifications: ['CAP Boulanger'],
          specialties: ['Pains de tradition française', 'Fournil traditionnel']
        },
        equipment: ['Four à sole', 'Banneton'],
        status: 'open',
        applicants: 2,
        location: { address: '4 Rue Rambuteau', city: 'Paris', postalCode: '75003' },
        createdAt: new Date().toISOString()
      },
      {
        id: '14',
        title: 'Pains spéciaux bio - farines anciennes',
        description: 'Pains spéciaux bio: farines anciennes (épeautre/seigle), graines/céréales, levain chef certifié bio. Protocoles lents, gestion pointages/pousses pour maximiser goût et conservation. Lien avec meuniers locaux, exigence qualité.',
        bakeryId: 'bakery14',
        bakeryName: 'Bio & Graines',
        bakeryAddress: '12 Rue des Ternes, 75017 Paris',
        bakeryAvatar: 'boulangerie14.jpeg',
        type: 'recurrent',
        position: 'boulanger',
        duration: 'Tous les jeudis et vendredis',
        startDate: '2024-03-07',
        schedule: '05h00 - 12h30',
        hourlyRate: 31,
        requirements: {
          experience: 3,
          certifications: ['CAP Boulanger'],
          specialties: ['Boulangerie bio', 'Pains spéciaux']
        },
        equipment: ['Four à sole', 'Chambre de pousse'],
        status: 'open',
        applicants: 4,
        location: { address: '12 Rue des Ternes', city: 'Paris', postalCode: '75017' },
        createdAt: new Date().toISOString()
      },
      {
        id: '15',
        title: 'Viennoiserie - tourage pur beurre',
        description: 'Viennoiserie: détrempes/beurrage, tours réguliers, façonnages croissants/pains choco/chaussons, brioches feuilletées. Contrôle T° pâte/beurre, optimisation repos, maîtrise des apprêts pour un feuilletage idéal.',
        bakeryId: 'bakery15',
        bakeryName: 'Beurre & Feuilletage',
        bakeryAddress: '8 Rue du Commerce, 75015 Paris',
        bakeryAvatar: 'boulangerie15.jpeg',
        type: 'ponctuel',
        position: 'tourneur',
        duration: '2 semaines',
        startDate: '2024-03-11',
        schedule: '03h30 - 10h30',
        hourlyRate: 28,
        requirements: {
          experience: 2,
          certifications: ['CAP Boulanger'],
          specialties: ['Travail des pâtes levées feuilletées', 'Viennoiserie']
        },
        equipment: ['Laminoir', 'Chambre de pousse'],
        status: 'open',
        applicants: 5,
        location: { address: '8 Rue du Commerce', city: 'Paris', postalCode: '75015' },
        createdAt: new Date().toISOString()
      },
      {
        id: '16',
        title: 'Pâtisserie fine - entremets et gâteaux de voyage',
        description: 'Pâtisserie fine orientée boutique premium et restauration à emporter: biscuits moelleux structurés, croustillants techniques résistants au temps, mousses légères et stables. Inserts calibrés et réguliers, glaçages miroir tendus et velours homogènes. Vous tenez un poste propre, organisez vos frigos (positif/négatif), documentez vos températures et respectez strictement les temps de cristallisation et de repos.',
        bakeryId: 'bakery16',
        bakeryName: 'Pâtisserie Élégante',
        bakeryAddress: '3 Rue de Passy, 75016 Paris',
        bakeryAvatar: 'boulangerie16.jpeg',
        type: 'evenement',
        position: 'patissier',
        duration: '1 semaine',
        startDate: '2024-03-25',
        schedule: '06h00 - 14h00',
        hourlyRate: 34,
        requirements: {
          experience: 4,
          certifications: ['CAP Pâtissier'],
          specialties: ['Pâtisserie fine', 'Glaçage miroir']
        },
        equipment: ['Cellule de refroidissement', 'Tempéreuse'],
        status: 'open',
        applicants: 2,
        location: { address: '3 Rue de Passy', city: 'Paris', postalCode: '75016' },
        createdAt: new Date().toISOString()
      },
      {
        id: '17',
        title: 'Pains du monde - ciabatta & focaccia',
        description: 'Panification italienne: hydratations élevées, huile d’olive, maturations longues au froid. Façonnages délicats (ciabatta/focaccia) pour préserver alvéoles. Cuissons donnant croûte fine et mie très ouverte.',
        bakeryId: 'bakery17',
        bakeryName: 'Four des Mondes',
        bakeryAddress: '21 Rue Oberkampf, 75011 Paris',
        bakeryAvatar: 'boulangerie17.jpeg',
        type: 'ponctuel',
        position: 'boulanger',
        duration: '6 jours',
        startDate: '2024-03-05',
        schedule: '05h00 - 12h00',
        hourlyRate: 29,
        requirements: {
          experience: 2,
          certifications: [],
          specialties: ['Pains du monde']
        },
        equipment: ['Four ventilé'],
        status: 'open',
        applicants: 1,
        location: { address: '21 Rue Oberkampf', city: 'Paris', postalCode: '75011' },
        createdAt: new Date().toISOString()
      },
      {
        id: '18',
        title: 'Traiteur boulanger - quiches & pizzas',
        description: 'Pôle salé: bases de quiches, appareils, fonçage/cuits, pâtons pizza (pointage/apprêt), garnitures équilibrées. Mise en place sandwicherie, gestion des flux midi, contrôle qualité et températures de service.',
        bakeryId: 'bakery18',
        bakeryName: 'Salé & Gourmand',
        bakeryAddress: '5 Rue de la Pompe, 75116 Paris',
        bakeryAvatar: 'boulangerie18.jpeg',
        type: 'recurrent',
        position: 'boulanger',
        duration: 'Lundis, mercredis, vendredis',
        startDate: '2024-03-04',
        schedule: '07h00 - 15h00',
        hourlyRate: 25,
        requirements: {
          experience: 2,
          certifications: [],
          specialties: ['Traiteur boulanger', 'Sandwicherie']
        },
        equipment: ['Four ventilé'],
        status: 'open',
        applicants: 6,
        location: { address: '5 Rue de la Pompe', city: 'Paris', postalCode: '75116' },
        createdAt: new Date().toISOString()
      },
      {
        id: '19',
        title: 'Sans gluten - farines alternatives',
        description: 'Atelier 100% sans gluten: maîtrise des farines alternatives (riz, sarrasin, maïs), des liants (psyllium, gomme xanthane) et des hydratations spécifiques. Vous appliquez des protocoles dédiés pour éviter toute contamination croisée (circuit matières, bacs, ustensiles, fours). Objectif: pains et viennoiseries sans gluten à la texture agréable, goût gourmand et bonne conservation, avec fiches techniques documentées.',
        bakeryId: 'bakery19',
        bakeryName: 'Grain Libre',
        bakeryAddress: '10 Rue Houdan, 92330 Sceaux',
        bakeryAvatar: 'boulangerie19.jpeg',
        type: 'ponctuel',
        position: 'boulanger',
        duration: '8 jours',
        startDate: '2024-03-20',
        schedule: '05h30 - 12h30',
        hourlyRate: 32,
        requirements: {
          experience: 3,
          certifications: [],
          specialties: ['Boulangerie sans gluten']
        },
        equipment: ['Four ventilé'],
        status: 'open',
        applicants: 2,
        location: { address: '10 Rue Houdan', city: 'Sceaux', postalCode: '92330' },
        createdAt: new Date().toISOString()
      },
      {
        id: '20',
        title: 'Four à bois - cuisson traditionnelle',
        description: 'Four à bois: allumage et maintien de la braise, gestion de la sole, coups de buée alternatifs. Chargement à la pelle, rotation des pièces, surveillance de coloration. Goût typique et croûte chantante attendus.',
        bakeryId: 'bakery20',
        bakeryName: 'Au Feu de Bois',
        bakeryAddress: '2 Rue de Paris, 94130 Nogent-sur-Marne',
        bakeryAvatar: 'boulangerie20.jpeg',
        type: 'evenement',
        position: 'boulanger',
        duration: '4 jours',
        startDate: '2024-04-02',
        schedule: '03h30 - 11h30',
        hourlyRate: 33,
        requirements: {
          experience: 4,
          certifications: ['CAP Boulanger'],
          specialties: ['Four à bois']
        },
        equipment: ['Four à bois'],
        status: 'open',
        applicants: 1,
        location: { address: '2 Rue de Paris', city: 'Nogent-sur-Marne', postalCode: '94130' },
        createdAt: new Date().toISOString()
      },
      {
        id: '21',
        title: 'Pâtisserie de restaurant - dressages minute',
        description: 'Pâtisserie de restaurant: dressages minute à l’assiette, contrastes chaud/froid et croquant/fondant, sauces et crèmes montées. Coordination avec le passe et respect du timing service, sens artistique exigé.',
        bakeryId: 'bakery21',
        bakeryName: 'La Table Sucrée',
        bakeryAddress: '6 Rue de l’Odéon, 75006 Paris',
        bakeryAvatar: 'boulangerie21.jpeg',
        type: 'ponctuel',
        position: 'patissier',
        duration: '9 jours',
        startDate: '2024-03-28',
        schedule: '12h00 - 22h00',
        hourlyRate: 36,
        requirements: {
          experience: 5,
          certifications: ['CAP Pâtissier'],
          specialties: ['Pâtisserie de restaurant']
        },
        equipment: ['Batteur', 'Plaques froides'],
        status: 'open',
        applicants: 3,
        location: { address: '6 Rue de l’Odéon', city: 'Paris', postalCode: '75006' },
        createdAt: new Date().toISOString()
      },
      {
        id: '22',
        title: 'Bagels & pita - pains du monde salés',
        description: 'Bagels & pita: façonnage précis, pochage avant cuisson pour brillance, pâtes pita très hydratées pour poches régulières. Ligne sandwicherie propre/rapide, gestion des flux et de la fraîcheur sur la journée.',
        bakeryId: 'bakery22',
        bakeryName: 'World Bakery',
        bakeryAddress: '18 Rue Jean Jaurès, 93200 Saint-Denis',
        bakeryAvatar: 'boulangerie22.jpeg',
        type: 'recurrent',
        position: 'boulanger',
        duration: 'Tous les week-ends',
        startDate: '2024-04-06',
        schedule: '06h00 - 14h30',
        hourlyRate: 27,
        requirements: {
          experience: 2,
          certifications: [],
          specialties: ['Pains du monde', 'Sandwicherie']
        },
        equipment: ['Four ventilé'],
        status: 'open',
        applicants: 4,
        location: { address: '18 Rue Jean Jaurès', city: 'Saint-Denis', postalCode: '93200' },
        createdAt: new Date().toISOString()
      }
    ]

    missions.value = mockMissions
  }

  function applyToMission(missionId: string, professionalId: string, professionalName: string, message: string, proposedRate?: number) {
    const application: Application = {
      id: Math.random().toString(36).substr(2, 9),
      missionId,
      professionalId,
      professionalName,
      message,
      proposedRate,
      status: 'pending',
      appliedAt: new Date().toISOString()
    }

    applications.value.push(application)
    
    // Incrémenter le nombre de candidatures
    const mission = missions.value.find(m => m.id === missionId)
    if (mission) {
      mission.applicants += 1
    }

    return application
  }

  function getMissionById(id: string) {
    return missions.value.find(mission => mission.id === id)
  }

  function getApplicationsForMission(missionId: string) {
    return applications.value.filter(app => app.missionId === missionId)
  }

  function searchMissions(filters: {
    position?: string
    type?: string
    location?: string
    minRate?: number
    maxRate?: number
    urgentOnly?: boolean
  }) {
    let filtered = openMissions.value

    if (filters.position) {
      filtered = filtered.filter(m => m.position === filters.position)
    }
    if (filters.type) {
      filtered = filtered.filter(m => m.type === filters.type)
    }
    if (filters.location) {
      filtered = filtered.filter(m => m.location.city.toLowerCase().includes(filters.location!.toLowerCase()))
    }
    if (filters.minRate) {
      filtered = filtered.filter(m => m.hourlyRate >= filters.minRate!)
    }
    if (filters.maxRate) {
      filtered = filtered.filter(m => m.hourlyRate <= filters.maxRate!)
    }
    if (filters.urgentOnly) {
      filtered = filtered.filter(m => m.urgency)
    }

    return filtered
  }

  // Initialize with mock data
  generateMockMissions()

  return {
    missions,
    applications,
    isLoading,
    openMissions,
    urgentMissions,
    missionsByType,
    applyToMission,
    getMissionById,
    getApplicationsForMission,
    searchMissions,
    generateMockMissions
  }
}) 