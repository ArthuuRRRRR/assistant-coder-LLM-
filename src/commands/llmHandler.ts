// src/commands/llmHelpers.ts
export interface LLMResponse {
    code?: string;
    explanation: string;
}

export function parseLLMResponse(raw: string): LLMResponse {
    try {
        const jsonString = raw.replace(/``````/g, '').trim();
        return JSON.parse(jsonString);
    } catch {
        return { explanation: raw }; // Fallback
    }
}

export const JSON_SYSTEM_PROMPT = `
FORMAT DE RÉPONSE ATTENDU (JSON STRICT) :
{
    "code": "Le code ici",
    "explanation": "L'explication ici"
}
`;
