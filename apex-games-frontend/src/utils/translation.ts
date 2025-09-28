// Service de traduction pour les descriptions de jeux
// Utilise l'API Google Translate via une requête HTTP directe

// Types pour l'API Google Translate
type GoogleTranslateResponse = [
    Array<[string, string | null, number | null, number | null]>,
    string | null,
    number | null,
    string | null
];

export const translateGameDescription = async (description: string): Promise<string> => {
    if (!description) return 'Aucune description disponible.';
    
    try {
        // Nettoyer la description
        const cleanDescription = formatGameDescription(description);
        
        // Vérifier si c'est déjà en français
        if (isFrenchText(cleanDescription)) {
            return cleanDescription;
        }
        
        // Limiter la longueur pour éviter les erreurs d'API
        const textToTranslate = cleanDescription.length > 5000 
            ? cleanDescription.substring(0, 5000) + '...'
            : cleanDescription;
        
        // Utiliser l'API Google Translate via une requête HTTP
        const translatedText = await translateText(textToTranslate, 'fr');
        
        return translatedText || cleanDescription;
    } catch (error) {
        console.error('Erreur lors de la traduction:', error);
        // En cas d'erreur, retourner la description nettoyée
        return formatGameDescription(description);
    }
};

// Fonction pour traduire du texte en utilisant l'API Google Translate
const translateText = async (text: string, targetLang: string): Promise<string> => {
    try {
        // URL de l'API Google Translate (version gratuite)
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json() as GoogleTranslateResponse;
        
        // L'API retourne un tableau de tableaux, on extrait le texte traduit
        if (data && data[0] && Array.isArray(data[0])) {
            const translatedText = data[0]
                .map((item) => item[0])
                .filter((item) => item !== null)
                .join('');
            
            return translatedText;
        }
        
        throw new Error('Format de réponse inattendu');
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API de traduction:', error);
        throw error;
    }
};

// Fonction pour détecter si le texte est en français
export const isFrenchText = (text: string): boolean => {
    // Mots français communs pour détecter la langue
    const frenchWords = [
        'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'ou', 'mais', 'donc', 'car',
        'jeu', 'jeux', 'joueur', 'joueurs', 'jouer', 'joué', 'jouée', 'jouées', 'joués',
        'dans', 'sur', 'avec', 'pour', 'par', 'vers', 'chez', 'sans', 'sous', 'entre',
        'aventure', 'action', 'stratégie', 'rôle', 'simulation', 'sport', 'course',
        'combat', 'puzzle', 'plateforme', 'tir', 'survie', 'horreur', 'fantasy',
        'science-fiction', 'historique', 'moderne', 'futuriste', 'médiéval'
    ];
    
    const words = text.toLowerCase().split(/\s+/);
    const frenchWordCount = words.filter(word => frenchWords.includes(word)).length;
    
    // Si plus de 10% des mots sont français, on considère que c'est du français
    return (frenchWordCount / words.length) > 0.1;
};

// Fonction pour nettoyer et formater la description
export const formatGameDescription = (description: string): string => {
    if (!description) return 'Aucune description disponible.';
    
    // Nettoyer le HTML
    let cleanDescription = description.replace(/<[^>]*>/g, '');
    
    // Remplacer les entités HTML
    cleanDescription = cleanDescription
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ');
    
    // Nettoyer les espaces multiples
    cleanDescription = cleanDescription.replace(/\s+/g, ' ').trim();
    
    return cleanDescription;
};
