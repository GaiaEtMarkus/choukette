import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Importer toutes les images de boulangeries
const bakeryImages = import.meta.glob('@/assets/boulangeries/*.jpeg', { eager: true, import: 'default' }) as Record<string, string>
const bakeryImagePaths = Object.values(bakeryImages)

// Fonction pour obtenir une image variée basée sur l'index
function getBakeryImage(index: number): string {
  return bakeryImagePaths[index % bakeryImagePaths.length] || bakeryImagePaths[0]
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  authorAvatar?: string
  publishedAt: string
  category: 'technique' | 'business' | 'recettes' | 'tendances' | 'conseils' | 'actualites'
  tags: string[]
  imageUrl: string
  readTime: number // en minutes
  views?: number
  featured?: boolean
}

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<BlogPost[]>([])

  // Catégories disponibles
  const categories = [
    { id: 'technique', label: 'Technique', icon: '🔧' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'recettes', label: 'Recettes', icon: '🍞' },
    { id: 'tendances', label: 'Tendances', icon: '📈' },
    { id: 'conseils', label: 'Conseils', icon: '💡' },
    { id: 'actualites', label: 'Actualités', icon: '📰' },
  ]

  // Générer des articles de blog mock
  function generateMockPosts() {
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: 'Les secrets du levain naturel : maîtrisez la fermentation',
        excerpt: 'Découvrez les techniques essentielles pour créer et entretenir un levain naturel de qualité, avec des conseils pratiques pour obtenir des pains aux saveurs authentiques.',
        content: `
          <h2>Introduction au levain naturel</h2>
          <p>Le levain naturel est l'âme de la boulangerie artisanale. Contrairement à la levure de boulangerie, le levain est une culture vivante de micro-organismes qui transforme la farine en un produit fermenté unique.</p>
          
          <h3>Les bases du levain</h3>
          <p>Pour créer un levain, vous avez besoin de trois éléments essentiels : de la farine, de l'eau et du temps. La fermentation naturelle se développe grâce aux bactéries lactiques et aux levures sauvages présentes dans l'environnement et la farine.</p>
          
          <h3>Étapes de création</h3>
          <ol>
            <li><strong>Jour 1</strong> : Mélangez 50g de farine complète avec 50g d'eau tiède. Couvrez et laissez reposer 24h à température ambiante (20-22°C).</li>
            <li><strong>Jour 2</strong> : Ajoutez 50g de farine et 50g d'eau. Mélangez bien et laissez reposer encore 24h.</li>
            <li><strong>Jour 3-5</strong> : Répétez le processus quotidiennement. Vous devriez voir des bulles apparaître et sentir une odeur légèrement acide.</li>
            <li><strong>Jour 6+</strong> : Votre levain est prêt quand il double de volume en 4-6 heures après rafraîchissement.</li>
          </ol>
          
          <h3>Entretien du levain</h3>
          <p>Un levain bien entretenu peut vivre indéfiniment. Rafraîchissez-le régulièrement (tous les jours si vous l'utilisez quotidiennement, ou une fois par semaine si vous le conservez au réfrigérateur).</p>
          
          <h3>Conseils d'expert</h3>
          <p>La température est cruciale : un levain trop chaud développera une acidité excessive, tandis qu'un levain trop froid sera lent. Trouvez l'équilibre parfait pour votre environnement de travail.</p>
        `,
        author: 'Marie Dubois',
        authorAvatar: 'https://i.pravatar.cc/150?img=12',
        publishedAt: '2024-01-15T10:00:00Z',
        category: 'technique',
        tags: ['levain', 'fermentation', 'pains naturels', 'technique'],
        imageUrl: getBakeryImage(0),
        readTime: 8,
        views: 1245,
        featured: true
      },
      {
        id: '2',
        title: 'Comment optimiser votre rentabilité en boulangerie artisanale',
        excerpt: 'Stratégies concrètes pour améliorer vos marges sans compromettre la qualité : gestion des stocks, optimisation des prix, réduction du gaspillage.',
        content: `
          <h2>Les enjeux de rentabilité en boulangerie</h2>
          <p>La boulangerie artisanale fait face à des défis économiques croissants : hausse des matières premières, concurrence des grandes surfaces, attentes des consommateurs en matière de qualité et de prix.</p>
          
          <h3>1. Optimisation des coûts matières premières</h3>
          <p>Négociez avec vos fournisseurs, achetez en gros quand c'est possible, et privilégiez les circuits courts pour réduire les intermédiaires. Un groupement d'achat avec d'autres artisans peut aussi faire la différence.</p>
          
          <h3>2. Réduction du gaspillage</h3>
          <p>Analysez vos ventes pour ajuster vos productions. Utilisez les invendus intelligemment : pains rassis pour chapelure, viennoiseries pour puddings. Le zéro déchet est aussi un argument commercial fort.</p>
          
          <h3>3. Valorisation de votre savoir-faire</h3>
          <p>Ne sous-estimez pas la valeur de votre travail artisanal. Communiquez sur vos techniques, vos ingrédients de qualité, votre temps de fermentation. Les clients sont prêts à payer pour l'authenticité.</p>
        `,
        author: 'Pierre Martin',
        authorAvatar: 'https://i.pravatar.cc/150?img=33',
        publishedAt: '2024-01-12T14:30:00Z',
        category: 'business',
        tags: ['rentabilité', 'gestion', 'business', 'stratégie'],
        imageUrl: getBakeryImage(1),
        readTime: 6,
        views: 892
      },
      {
        id: '3',
        title: 'Recette : Le pain de campagne traditionnel parfait',
        excerpt: 'Une recette détaillée étape par étape pour réaliser un pain de campagne aux saveurs authentiques, avec tous les secrets de pétrissage et de cuisson.',
        content: `
          <h2>Ingrédients (pour 2 pains)</h2>
          <ul>
            <li>500g de farine T65</li>
            <li>350g d'eau</li>
            <li>10g de sel</li>
            <li>100g de levain naturel (ou 5g de levure fraîche)</li>
            <li>50g de farine complète (optionnel)</li>
          </ul>
          
          <h2>Préparation</h2>
          <h3>Étape 1 : L\'autolyse</h3>
          <p>Mélangez la farine et l'eau. Laissez reposer 30 minutes à 1 heure. Cette étape permet au gluten de se développer naturellement.</p>
          
          <h3>Étape 2 : Le pétrissage</h3>
          <p>Ajoutez le sel et le levain. Pétrissez pendant 10-15 minutes jusqu'à obtenir une pâte lisse et élastique. La fenêtre : étirez un morceau de pâte, elle doit être translucide sans se déchirer.</p>
          
          <h3>Étape 3 : Le pointage</h3>
          <p>Première fermentation : 2-3 heures à température ambiante, avec un rabat toutes les heures. La pâte doit doubler de volume.</p>
          
          <h3>Étape 4 : Le façonnage</h3>
          <p>Dégazez délicatement, façonnez vos pains en boules puis en bâtards. Laissez reposer 15 minutes avant le façonnage final.</p>
          
          <h3>Étape 5 : L\'apprêt</h3>
          <p>Deuxième fermentation : 1h30 à 2h30 selon la température. Le test de la pression : appuyez légèrement, l'empreinte doit se remonter lentement.</p>
          
          <h3>Étape 6 : La cuisson</h3>
          <p>Préchauffez votre four à 250°C avec une lèchefrite remplie d'eau. Enfournez, baissez à 230°C après 10 minutes. Cuisez 35-40 minutes total. Vapeur les 15 premières minutes pour une croûte parfaite.</p>
        `,
        author: 'Sophie Laurent',
        authorAvatar: 'https://i.pravatar.cc/150?img=45',
        publishedAt: '2024-01-10T09:15:00Z',
        category: 'recettes',
        tags: ['recette', 'pain de campagne', 'tradition', 'levain'],
        imageUrl: getBakeryImage(2),
        readTime: 12,
        views: 2156,
        featured: true
      },
      {
        id: '4',
        title: 'Les tendances 2024 : ce qui va marquer la boulangerie',
        excerpt: 'Découvrez les nouvelles tendances qui façonnent le secteur : produits bio, farines anciennes, zéro déchet, et nouvelles attentes des consommateurs.',
        content: `
          <h2>Les grandes tendances 2024</h2>
          <p>Le secteur de la boulangerie évolue rapidement, porté par de nouvelles attentes consommateurs et des enjeux environnementaux croissants.</p>
          
          <h3>1. Le retour aux farines anciennes</h3>
          <p>Les consommateurs recherchent l'authenticité. Les farines de variétés anciennes (épeautre, petit épeautre, seigle, blés anciens) connaissent un véritable engouement. Ces farines offrent des saveurs complexes et une meilleure digestibilité.</p>
          
          <h3>2. Le bio et le local</h3>
          <p>Plus qu'une tendance, c'est devenu une exigence pour beaucoup. Les boulangeries qui s'approvisionnent localement et en bio voient leur clientèle augmenter significativement.</p>
          
          <h3>3. Le zéro déchet</h3>
          <p>Les clients sont sensibles à l'impact environnemental. Valoriser les invendus, proposer des emballages réutilisables, communiquer sur vos efforts écologiques : autant d'atouts commerciaux.</p>
          
          <h3>4. L\'expérience client</h3>
          <p>Au-delà du produit, c'est l'expérience qui compte. Ateliers, visites de fournil, transparence sur les processus : créez du lien avec vos clients.</p>
        `,
        author: 'Lucas Bernard',
        authorAvatar: 'https://i.pravatar.cc/150?img=20',
        publishedAt: '2024-01-08T16:45:00Z',
        category: 'tendances',
        tags: ['tendances', '2024', 'bio', 'durable'],
        imageUrl: getBakeryImage(3),
        readTime: 5,
        views: 678
      },
      {
        id: '5',
        title: '10 conseils pour réussir votre première mission en intérim',
        excerpt: 'Guide pratique pour les professionnels qui débutent dans l\'intérim boulangerie : comment s\'intégrer rapidement, gérer le stress, et faire bonne impression.',
        content: `
          <h2>Conseils pour réussir votre première mission</h2>
          <p>Démarrer une mission en intérim peut être stressant, surtout si c'est votre première expérience. Voici nos conseils pour mettre toutes les chances de votre côté.</p>
          
          <h3>1. Arrivez en avance</h3>
          <p>Présentez-vous 15 minutes avant l'heure prévue. Cela montre votre professionnalisme et vous laisse le temps de vous familiariser avec les lieux.</p>
          
          <h3>2. Observez avant d\'agir</h3>
          <p>Chaque boulangerie a ses méthodes. Prenez le temps d'observer les gestes, les processus, les habitudes de l'équipe avant de proposer vos propres techniques.</p>
          
          <h3>3. Posez des questions</h3>
          <p>Mieux vaut demander que de faire une erreur. Les équipes apprécient les professionnels qui cherchent à comprendre leur fonctionnement.</p>
          
          <h3>4. Respectez les protocoles</h3>
          <p>Hygiène, sécurité, organisation : respectez scrupuleusement les règles de l'établissement, même si elles diffèrent de vos habitudes.</p>
          
          <h3>5. Montrez votre polyvalence</h3>
          <p>Proposez votre aide sur différentes tâches. Un professionnel polyvalent est toujours apprécié et a plus de chances d'être réengagé.</p>
          
          <h3>6. Communiquez efficacement</h3>
          <p>Informez l'équipe de vos actions, signalez les problèmes rapidement, partagez vos observations constructives.</p>
          
          <h3>7. Gardez une attitude positive</h3>
          <p>Même dans les moments difficiles, restez professionnel et positif. Votre attitude influence l'ambiance de travail.</p>
          
          <h3>8. Documentez votre travail</h3>
          <p>Notez les recettes spécifiques, les températures, les temps de fermentation. Ces informations vous seront utiles si vous revenez.</p>
          
          <h3>9. Créez du lien</h3>
          <p>Intéressez-vous à l'équipe, partagez vos expériences, créez des relations professionnelles. Le réseau est précieux dans ce métier.</p>
          
          <h3>10. Demandez un retour</h3>
          <p>En fin de mission, demandez un feedback constructif. Cela montre votre volonté de progresser et peut vous aider à améliorer vos futures missions.</p>
        `,
        author: 'Camille Moreau',
        authorAvatar: 'https://i.pravatar.cc/150?img=47',
        publishedAt: '2024-01-05T11:20:00Z',
        category: 'conseils',
        tags: ['intérim', 'conseils', 'débutant', 'professionnel'],
        imageUrl: getBakeryImage(4),
        readTime: 7,
        views: 1432
      },
      {
        id: '6',
        title: 'Nouvelle réglementation : ce qui change en 2024',
        excerpt: 'Mise à jour sur les nouvelles normes sanitaires, les obligations légales, et les changements réglementaires qui impactent les boulangeries artisanales.',
        content: `
          <h2>Les changements réglementaires 2024</h2>
          <p>Plusieurs évolutions réglementaires impactent le secteur de la boulangerie cette année. Voici ce qu'il faut retenir.</p>
          
          <h3>Nouvelles normes sanitaires</h3>
          <p>Les contrôles sanitaires se renforcent. Les boulangeries doivent désormais tenir un registre détaillé des températures de stockage et de cuisson. Les formations HACCP deviennent obligatoires pour tous les employés.</p>
          
          <h3>Obligations d\'affichage</h3>
          <p>L'affichage de l'origine des farines est maintenant obligatoire. Les clients doivent pouvoir identifier la provenance des matières premières utilisées.</p>
          
          <h3>Réglementation sur les additifs</h3>
          <p>Certains additifs sont désormais interdits dans le pain de tradition française. Vérifiez la composition de vos préparations pour rester conforme.</p>
          
          <h3>Nouvelles règles pour l\'intérim</h3>
          <p>Les missions d'intérim en boulangerie doivent désormais respecter des durées maximales renforcées. Les contrats doivent être plus détaillés sur les conditions de travail.</p>
        `,
        author: 'Thomas Durand',
        authorAvatar: 'https://i.pravatar.cc/150?img=15',
        publishedAt: '2024-01-03T08:00:00Z',
        category: 'actualites',
        tags: ['réglementation', '2024', 'normes', 'légal'],
        imageUrl: getBakeryImage(5),
        readTime: 4,
        views: 567
      },
      {
        id: '7',
        title: 'Maîtriser la température : la clé de la réussite',
        excerpt: 'Comprendre l\'impact de la température sur la fermentation, le développement du gluten, et la qualité finale de vos produits. Guide complet avec conseils pratiques.',
        content: `
          <h2>L'importance de la température</h2>
          <p>La température est l'un des paramètres les plus critiques en boulangerie. Une mauvaise gestion peut ruiner des heures de travail.</p>
          
          <h3>Température de l'eau</h3>
          <p>L'eau doit être ajustée pour obtenir une température de pâte finale idéale (22-24°C). Formule : Température eau = (Température finale × 3) - (Température farine + Température ambiante + Friction du pétrissage).</p>
          
          <h3>Température de fermentation</h3>
          <p>La fermentation est optimale entre 22°C et 26°C. En dessous, elle ralentit. Au-dessus, elle accélère mais peut développer une acidité excessive.</p>
          
          <h3>Température de cuisson</h3>
          <p>Chaque produit a sa température idéale : 250-260°C pour les pains croustillants, 180-200°C pour les viennoiseries. La vapeur initiale est cruciale pour le développement de la croûte.</p>
        `,
        author: 'Marie Dubois',
        authorAvatar: 'https://i.pravatar.cc/150?img=12',
        publishedAt: '2023-12-28T10:30:00Z',
        category: 'technique',
        tags: ['technique', 'température', 'fermentation', 'cuisson'],
        imageUrl: getBakeryImage(6),
        readTime: 6,
        views: 934
      },
      {
        id: '8',
        title: 'Développer votre présence digitale : guide pour boulangeries',
        excerpt: 'Stratégies pour utiliser les réseaux sociaux, créer un site web efficace, et développer votre e-réputation. Le digital au service de l\'artisanat.',
        content: `
          <h2>Pourquoi être présent sur le digital ?</h2>
          <p>Les clients recherchent les boulangeries en ligne avant de se déplacer. Une présence digitale bien gérée peut considérablement augmenter votre clientèle.</p>
          
          <h3>Les réseaux sociaux</h3>
          <p>Instagram est roi pour les boulangeries. Partagez vos créations, vos coulisses, vos recettes. Montrez l'humain derrière le produit. 2-3 posts par semaine suffisent pour maintenir l'engagement.</p>
          
          <h3>Un site web simple mais efficace</h3>
          <p>Vous n'avez pas besoin d'un site complexe. Les essentiels : horaires, adresse, quelques photos, et surtout, un moyen de contact. Un site responsive est indispensable (la majorité des recherches se font sur mobile).</p>
          
          <h3>Google My Business</h3>
          <p>Inscrivez-vous gratuitement. C'est votre première vitrine en ligne. Les avis clients sont cruciaux : encouragez vos clients satisfaits à laisser un avis.</p>
        `,
        author: 'Pierre Martin',
        authorAvatar: 'https://i.pravatar.cc/150?img=33',
        publishedAt: '2023-12-25T14:00:00Z',
        category: 'business',
        tags: ['digital', 'marketing', 'réseaux sociaux', 'e-réputation'],
        imageUrl: getBakeryImage(7),
        readTime: 5,
        views: 721
      },
      {
        id: '9',
        title: 'Recette : Croissants au beurre AOP - la méthode française',
        excerpt: 'Recette complète et détaillée pour réaliser des croissants parfaits, avec toutes les techniques de détrempe, tourrage, et cuisson.',
        content: `
          <h2>Ingrédients (pour 12 croissants)</h2>
          <h3>Détrempe</h3>
          <ul>
            <li>500g de farine T45</li>
            <li>50g de sucre</li>
            <li>10g de sel</li>
            <li>25g de beurre fondu</li>
            <li>250g d'eau</li>
            <li>10g de levure fraîche</li>
          </ul>
          
          <h3>Beurre de tourage</h3>
          <ul>
            <li>280g de beurre AOP (82% MG)</li>
          </ul>
          
          <h2>Préparation</h2>
          <h3>Étape 1 : La détrempe</h3>
          <p>Mélangez tous les ingrédients sauf le beurre. Pétrissez 5 minutes. Ajoutez le beurre fondu. Laissez reposer 1h au frais.</p>
          
          <h3>Étape 2 : Le tourrage</h3>
          <p>Abaissez la détrempe en rectangle. Placez le beurre de tourage au centre. Pliez en portefeuille simple (3 tours). Réservez 1h au frais. Répétez pour un double tour (2 tours). Réservez encore 1h.</p>
          
          <h3>Étape 3 : Le façonnage</h3>
          <p>Abaissez à 4mm d'épaisseur. Découpez des triangles. Roulez en commençant par la base. Formez le croissant caractéristique.</p>
          
          <h3>Étape 4 : L\'apprêt</h3>
          <p>Laissez lever 2h30 à 25°C. Les croissants doivent doubler de volume.</p>
          
          <h3>Étape 5 : La cuisson</h3>
          <p>Dorez à l'œuf. Cuisez 15-18 minutes à 200°C. Le beurre doit suinter légèrement, signe d'une cuisson parfaite.</p>
        `,
        author: 'Sophie Laurent',
        authorAvatar: 'https://i.pravatar.cc/150?img=45',
        publishedAt: '2023-12-22T09:00:00Z',
        category: 'recettes',
        tags: ['recette', 'croissants', 'viennoiseries', 'beurre AOP'],
        imageUrl: getBakeryImage(8),
        readTime: 15,
        views: 1890
      },
      {
        id: '10',
        title: 'Le pain sans gluten : défis et opportunités',
        excerpt: 'Exploration du marché du sans gluten en boulangerie : techniques, ingrédients alternatifs, et opportunités commerciales pour les artisans.',
        content: `
          <h2>Le marché du sans gluten</h2>
          <p>Le marché du sans gluten représente une opportunité croissante. De plus en plus de clients recherchent des alternatives, que ce soit pour des raisons médicales ou par choix alimentaire.</p>
          
          <h3>Les farines alternatives</h3>
          <p>Riz, sarrasin, châtaigne, quinoa, amande : chaque farine apporte ses propres caractéristiques. Les mélanges sont souvent nécessaires pour obtenir une texture satisfaisante.</p>
          
          <h3>Les défis techniques</h3>
          <p>Sans gluten, pas de réseau élastique. Il faut compenser avec des gommes (xanthane, guar) et adapter les techniques de pétrissage et de fermentation.</p>
          
          <h3>La contamination croisée</h3>
          <p>Pour les clients cœliaques, la contamination est un risque réel. Il faut un espace dédié, des outils séparés, et une formation rigoureuse de l'équipe.</p>
        `,
        author: 'Lucas Bernard',
        authorAvatar: 'https://i.pravatar.cc/150?img=20',
        publishedAt: '2023-12-20T13:15:00Z',
        category: 'tendances',
        tags: ['sans gluten', 'tendances', 'technique', 'marché'],
        imageUrl: getBakeryImage(9),
        readTime: 6,
        views: 456
      },
      {
        id: '11',
        title: 'Comment négocier vos tarifs en intérim boulangerie',
        excerpt: 'Guide pratique pour les professionnels : comment valoriser votre expertise, négocier des tarifs justes, et éviter les pièges courants.',
        content: `
          <h2>Valoriser votre expertise</h2>
          <p>Votre tarif doit refléter votre expérience, vos compétences, et la valeur que vous apportez. Ne sous-estimez pas votre travail.</p>
          
          <h3>Facteurs à considérer</h3>
          <ul>
            <li><strong>Expérience</strong> : Plus vous avez d'années d'expérience, plus votre tarif peut être élevé.</li>
            <li><strong>Spécialités</strong> : Les compétences rares (pâtisserie fine, viennoiseries complexes) se valorisent mieux.</li>
            <li><strong>Certifications</strong> : CAP, BP, formations spécialisées justifient des tarifs plus élevés.</li>
            <li><strong>Urgence</strong> : Les missions de dernière minute peuvent être facturées avec une majoration.</li>
            <li><strong>Durée</strong> : Les missions longues peuvent être négociées avec un tarif préférentiel mais garanti.</li>
          </ul>
          
          <h3>Connaître le marché</h3>
          <p>Renseignez-vous sur les tarifs pratiqués dans votre région. Les grandes villes offrent généralement des tarifs plus élevés que les zones rurales.</p>
          
          <h3>Négocier intelligemment</h3>
          <p>Présentez votre valeur : portfolio, certifications, avis clients. Soyez ferme mais flexible. Proposez des packages (missions récurrentes à tarif préférentiel).</p>
        `,
        author: 'Camille Moreau',
        authorAvatar: 'https://i.pravatar.cc/150?img=47',
        publishedAt: '2023-12-18T10:45:00Z',
        category: 'conseils',
        tags: ['intérim', 'tarifs', 'négociation', 'conseils'],
        imageUrl: getBakeryImage(10),
        readTime: 5,
        views: 1123
      },
      {
        id: '12',
        title: 'Choukette lance sa nouvelle fonctionnalité : sélection directe',
        excerpt: 'Les boulangeries peuvent désormais choisir directement leurs artisans favoris. Découvrez comment cette fonctionnalité révolutionne la mise en relation.',
        content: `
          <h2>Une nouvelle ère pour la mise en relation</h2>
          <p>Choukette évolue pour offrir encore plus de flexibilité et de contrôle aux boulangeries partenaires.</p>
          
          <h3>Comment ça fonctionne ?</h3>
          <p>Les boulangeries peuvent maintenant créer une liste de professionnels favoris. Lorsqu'une mission est publiée, ces artisans sont notifiés en priorité et peuvent postuler directement.</p>
          
          <h3>Les avantages</h3>
          <ul>
            <li><strong>Gain de temps</strong> : Plus besoin de parcourir toutes les candidatures, vous contactez directement vos artisans de confiance.</li>
            <li><strong>Qualité garantie</strong> : Vous travaillez avec des professionnels que vous connaissez et appréciez.</li>
            <li><strong>Réactivité</strong> : Les artisans favoris sont alertés en premier, garantissant une réponse rapide.</li>
          </ul>
          
          <h3>Pour les artisans</h3>
          <p>Être ajouté aux favoris d'une boulangerie est un gage de confiance et augmente vos chances de missions récurrentes.</p>
        `,
        author: 'Équipe Choukette',
        authorAvatar: 'https://i.pravatar.cc/150?img=1',
        publishedAt: '2023-12-15T08:00:00Z',
        category: 'actualites',
        tags: ['choukette', 'nouveauté', 'fonctionnalité', 'mise à jour'],
        imageUrl: getBakeryImage(11),
        readTime: 3,
        views: 2341,
        featured: true
      },
      {
        id: '13',
        title: 'Les différents types de pétrissage : quelle méthode choisir ?',
        excerpt: 'Comparaison des méthodes de pétrissage : pétrissage intensif, amélioré, autolyse. Avantages et inconvénients de chaque technique.',
        content: `
          <h2>Les méthodes de pétrissage</h2>
          <p>Le pétrissage est une étape cruciale qui détermine la structure finale de votre pain. Chaque méthode a ses avantages.</p>
          
          <h3>Pétrissage intensif</h3>
          <p>Pétrissage long et énergique. Avantages : développement optimal du gluten, pâte très lisse. Inconvénients : risque de sur-pétrissage, saveurs moins développées.</p>
          
          <h3>Pétrissage amélioré</h3>
          <p>Méthode classique avec arrêts. Avantages : équilibre entre développement et préservation des saveurs. Inconvénients : nécessite de l'expérience pour maîtriser les temps.</p>
          
          <h3>Autolyse</h3>
          <p>Repos de la farine et de l'eau avant ajout du sel et du levain. Avantages : développement naturel du gluten, meilleures saveurs, moins de pétrissage nécessaire. Inconvénients : allonge le temps de préparation.</p>
        `,
        author: 'Marie Dubois',
        authorAvatar: 'https://i.pravatar.cc/150?img=12',
        publishedAt: '2023-12-12T11:30:00Z',
        category: 'technique',
        tags: ['technique', 'pétrissage', 'méthodes', 'gluten'],
        imageUrl: getBakeryImage(12),
        readTime: 7,
        views: 678
      },
      {
        id: '14',
        title: 'Créer une boulangerie éco-responsable : guide pratique',
        excerpt: 'Stratégies concrètes pour réduire l\'impact environnemental de votre boulangerie : énergie, déchets, approvisionnement durable.',
        content: `
          <h2>L'éco-responsabilité en boulangerie</h2>
          <p>Les consommateurs sont de plus en plus sensibles à l'impact environnemental. Une boulangerie éco-responsable est aussi une boulangerie rentable.</p>
          
          <h3>Optimisation énergétique</h3>
          <p>Remplacer les fours anciens par des modèles performants peut réduire la consommation de 30%. Programmer les cuissons pour éviter les pics de consommation.</p>
          
          <h3>Gestion des déchets</h3>
          <p>Zéro déchet : valoriser tous les invendus. Compost pour les déchets organiques. Emballages réutilisables ou biodégradables.</p>
          
          <h3>Approvisionnement durable</h3>
          <p>Privilégier les circuits courts, les farines bio, les producteurs locaux. Réduire les intermédiaires diminue aussi les coûts.</p>
        `,
        author: 'Pierre Martin',
        authorAvatar: 'https://i.pravatar.cc/150?img=33',
        publishedAt: '2023-12-10T15:20:00Z',
        category: 'business',
        tags: ['éco-responsable', 'durable', 'environnement', 'business'],
        imageUrl: getBakeryImage(13),
        readTime: 6,
        views: 445
      },
      {
        id: '15',
        title: 'Recette : Baguette tradition française - le secret des boulangers',
        excerpt: 'Recette complète de la baguette tradition, avec tous les secrets de fermentation, façonnage, et cuisson pour obtenir la croûte croustillante et la mie alvéolée parfaites.',
        content: `
          <h2>Ingrédients (pour 4 baguettes)</h2>
          <ul>
            <li>500g de farine T65</li>
            <li>350g d'eau</li>
            <li>10g de sel</li>
            <li>5g de levure fraîche (ou 100g de levain)</li>
          </ul>
          
          <h2>Préparation</h2>
          <h3>Étape 1 : Autolyse (30 min)</h3>
          <p>Mélangez farine et eau. Laissez reposer 30 minutes. Cette étape développe le gluten naturellement.</p>
          
          <h3>Étape 2 : Pétrissage</h3>
          <p>Ajoutez sel et levure. Pétrissez 8-10 minutes jusqu'à obtenir une pâte lisse et élastique.</p>
          
          <h3>Étape 3 : Pointage (2h)</h3>
          <p>Première fermentation à température ambiante. Rabattez toutes les heures.</p>
          
          <h3>Étape 4 : Façonnage</h3>
          <p>Divisez en 4 pâtons de 250g. Préformez en boudins, laissez reposer 15 min, puis façonnez en baguettes de 60cm.</p>
          
          <h3>Étape 5 : Apprêt (1h30)</h3>
          <p>Deuxième fermentation. Les baguettes doivent doubler de volume.</p>
          
          <h3>Étape 6 : Scarification et cuisson</h3>
          <p>Scarifiez en 5 coups de lame. Cuisez 20-25 min à 250°C avec vapeur les 10 premières minutes.</p>
        `,
        author: 'Sophie Laurent',
        authorAvatar: 'https://i.pravatar.cc/150?img=45',
        publishedAt: '2023-12-08T09:30:00Z',
        category: 'recettes',
        tags: ['recette', 'baguette', 'tradition', 'français'],
        imageUrl: getBakeryImage(14),
        readTime: 10,
        views: 1678
      },
      {
        id: '16',
        title: 'Les nouvelles attentes des consommateurs en 2024',
        excerpt: 'Analyse des évolutions comportementales : transparence, qualité, local, expérience. Comment s\'adapter pour rester compétitif.',
        content: `
          <h2>Les nouvelles attentes consommateurs</h2>
          <p>Les attentes évoluent rapidement. Les boulangeries qui s'adaptent gagnent en compétitivité.</p>
          
          <h3>Transparence totale</h3>
          <p>Les clients veulent savoir d'où viennent les ingrédients, comment sont fabriqués les produits, quelles sont les valeurs de l'entreprise.</p>
          
          <h3>Qualité premium</h3>
          <p>La qualité prime sur le prix pour beaucoup. Les clients sont prêts à payer plus pour des produits authentiques et de qualité.</p>
          
          <h3>Expérience client</h3>
          <p>Au-delà du produit, c'est l'expérience qui compte : accueil, conseil, ambiance, relation humaine.</p>
          
          <h3>Digital et praticité</h3>
          <p>Commande en ligne, click & collect, paiement sans contact : le digital devient indispensable.</p>
        `,
        author: 'Lucas Bernard',
        authorAvatar: 'https://i.pravatar.cc/150?img=20',
        publishedAt: '2023-12-05T14:00:00Z',
        category: 'tendances',
        tags: ['consommateurs', 'tendances', '2024', 'marketing'],
        imageUrl: getBakeryImage(15),
        readTime: 5,
        views: 789
      },
      {
        id: '17',
        title: 'Gérer le stress en boulangerie : conseils pour les professionnels',
        excerpt: 'Techniques et stratégies pour gérer la pression, les horaires décalés, et maintenir un équilibre vie pro / vie perso dans ce métier exigeant.',
        content: `
          <h2>Le stress en boulangerie</h2>
          <p>Les horaires décalés, la pression de la production, les deadlines : le métier de boulanger peut être stressant. Voici comment mieux gérer.</p>
          
          <h3>Organisation et préparation</h3>
          <p>Une bonne organisation réduit le stress. Préparez vos listes, vos recettes, vos outils la veille. Anticipez les problèmes.</p>
          
          <h3>Gestion du sommeil</h3>
          <p>Les horaires décalés perturbent le sommeil. Créez une routine : chambre noire, température fraîche, pas d'écrans avant de dormir.</p>
          
          <h3>Exercice et alimentation</h3>
          <p>L'activité physique régulière réduit le stress. Mangez équilibré malgré les horaires. Évitez l'excès de caféine.</p>
          
          <h3>Communication</h3>
          <p>Parlez de vos difficultés avec votre équipe, votre famille, ou un professionnel. Le stress partagé est un stress réduit.</p>
        `,
        author: 'Camille Moreau',
        authorAvatar: 'https://i.pravatar.cc/150?img=47',
        publishedAt: '2023-12-03T10:15:00Z',
        category: 'conseils',
        tags: ['stress', 'bien-être', 'conseils', 'santé'],
        imageUrl: getBakeryImage(16),
        readTime: 5,
        views: 623
      },
      {
        id: '18',
        title: 'Choukette atteint 1000 professionnels inscrits !',
        excerpt: 'Milestone important pour la plateforme : plus de 1000 professionnels certifiés rejoignent Choukette. Retour sur cette croissance exceptionnelle.',
        content: `
          <h2>Un cap important</h2>
          <p>Choukette franchit une étape majeure avec plus de 1000 professionnels inscrits sur la plateforme.</p>
          
          <h3>Une croissance rapide</h3>
          <p>En moins d'un an, Choukette est devenue la référence pour la mise en relation en boulangerie. Cette croissance témoigne de la confiance des professionnels.</p>
          
          <h3>Des profils variés</h3>
          <p>Boulangers, pâtissiers, tourneurs, vendeurs : tous les métiers de la boulangerie sont représentés. Des profils juniors aux experts avec 20+ ans d'expérience.</p>
          
          <h3>Merci à la communauté</h3>
          <p>Cette réussite est celle de toute la communauté Choukette : professionnels, boulangeries, et équipe. Merci pour votre confiance !</p>
        `,
        author: 'Équipe Choukette',
        authorAvatar: 'https://i.pravatar.cc/150?img=1',
        publishedAt: '2023-12-01T08:00:00Z',
        category: 'actualites',
        tags: ['choukette', 'actualité', 'milestone', 'croissance'],
        imageUrl: getBakeryImage(17),
        readTime: 2,
        views: 3124,
        featured: true
      },
      {
        id: '19',
        title: 'Les farines : comprendre les types et leurs usages',
        excerpt: 'Guide complet des différents types de farines (T45, T55, T65, T80, T110, T150) : caractéristiques, usages, et conseils pour choisir la bonne farine.',
        content: `
          <h2>Comprendre les types de farines</h2>
          <p>Le "T" suivi d'un nombre indique le taux de cendres (minéraux) restant après combustion. Plus le nombre est élevé, plus la farine est complète.</p>
          
          <h3>T45 - Farine blanche</h3>
          <p>La plus raffinée. Idéale pour pâtisseries, viennoiseries, brioches. Texture fine, saveur neutre.</p>
          
          <h3>T55 - Farine blanche standard</h3>
          <p>La plus courante. Parfaite pour pains blancs, pâtes à pizza. Équilibre entre raffinement et saveur.</p>
          
          <h3>T65 - Farine bise</h3>
          <p>Légèrement complète. Idéale pour pains de campagne, baguettes tradition. Saveur plus prononcée.</p>
          
          <h3>T80 - Farine semi-complète</h3>
          <p>Pour pains complets légers. Plus de fibres, saveur rustique.</p>
          
          <h3>T110 - Farine complète</h3>
          <p>Pour pains complets. Riche en fibres, saveur prononcée.</p>
          
          <h3>T150 - Farine intégrale</h3>
          <p>La plus complète. Pour pains intégraux. Texture dense, saveur très prononcée.</p>
        `,
        author: 'Marie Dubois',
        authorAvatar: 'https://i.pravatar.cc/150?img=12',
        publishedAt: '2023-11-28T11:00:00Z',
        category: 'technique',
        tags: ['farine', 'technique', 'ingrédients', 'guide'],
        imageUrl: getBakeryImage(18),
        readTime: 8,
        views: 1456
      },
      {
        id: '20',
        title: 'Fidéliser vos clients : stratégies pour boulangeries',
        excerpt: 'Techniques éprouvées pour créer du lien, développer la fidélité, et transformer vos clients occasionnels en clients réguliers.',
        content: `
          <h2>La fidélisation client</h2>
          <p>Un client fidèle vaut 5 fois plus qu'un nouveau client. La fidélisation est un investissement rentable.</p>
          
          <h3>Connaître vos clients</h3>
          <p>Apprenez les prénoms, les préférences, les habitudes. La relation humaine fait la différence.</p>
          
          <h3>Programme de fidélité</h3>
          <p>Carte de fidélité, points, réductions : les programmes de fidélité fonctionnent. Adaptez-les à votre clientèle.</p>
          
          <h3>Communication régulière</h3>
          <p>Newsletter, réseaux sociaux, affichage : restez présent dans l'esprit de vos clients. Annoncez vos nouveautés, vos événements.</p>
          
          <h3>Service exceptionnel</h3>
          <p>Un sourire, un conseil, une attention : le service fait souvent la différence. Formez votre équipe à l'accueil client.</p>
        `,
        author: 'Pierre Martin',
        authorAvatar: 'https://i.pravatar.cc/150?img=33',
        publishedAt: '2023-11-25T13:30:00Z',
        category: 'business',
        tags: ['fidélisation', 'clients', 'marketing', 'business'],
        imageUrl: getBakeryImage(19),
        readTime: 5,
        views: 567
      }
    ]

    // Sauvegarder dans localStorage
    const stored = localStorage.getItem('choukette_blog_posts')
    if (!stored) {
      posts.value = mockPosts
      localStorage.setItem('choukette_blog_posts', JSON.stringify(mockPosts))
    } else {
      posts.value = JSON.parse(stored)
    }
  }

  // Computed properties
  const sortedPosts = computed(() => {
    return [...posts.value].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  })

  const featuredPosts = computed(() => {
    return sortedPosts.value.filter(post => post.featured)
  })

  const latestPost = computed(() => {
    return sortedPosts.value[0] || null
  })

  const postsByCategory = computed(() => {
    return (category: string) => {
      return sortedPosts.value.filter(post => post.category === category)
    }
  })

  // Fonctions
  function getPostById(id: string): BlogPost | undefined {
    return posts.value.find(post => post.id === id)
  }

  function incrementViews(postId: string) {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      post.views = (post.views || 0) + 1
      localStorage.setItem('choukette_blog_posts', JSON.stringify(posts.value))
    }
  }

  // Initialiser les données
  generateMockPosts()

  return {
    posts,
    categories,
    sortedPosts,
    featuredPosts,
    latestPost,
    postsByCategory,
    getPostById,
    incrementViews,
    generateMockPosts
  }
})

