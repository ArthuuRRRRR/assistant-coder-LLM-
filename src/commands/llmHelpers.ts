export interface LLMResponse {
    code?: string;
    explanation: string;
}

export function parseLLMResponse(raw: string): LLMResponse {
    try {
        const jsonString = raw.replace(/``````/g, '').trim();
        return JSON.parse(jsonString);
    } catch (e) {
        // Fallback si le JSON est cassé
        return { explanation: raw };
    }
}

export const JSON_SYSTEM_PROMPT = `
IMPORTANT : Tu dois répondre UNIQUEMENT au format JSON strict.
Structure attendue :
{
    "code": "Le code complet ici (échappé proprement)",
    "explanation": "Ton explication ici"
}
Ne mets aucun texte avant ou après le JSON.
`;
