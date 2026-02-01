import { OllamaService } from '../services/ollamaService';
import { JSON_SYSTEM_PROMPT, parseLLMResponse, LLMResponse } from './llmHelpers';

export async function handleComment(textSelection: string, service: OllamaService): Promise<LLMResponse> {
    const prompt = `
    Tu es un expert en documentation de code.
    Ta mission : Ajouter des commentaires pertinents et des docstrings.
    RÈGLE D'OR : NE CHANGE PAS LA LOGIQUE DU CODE. NE RENOMME RIEN.
    Renvoie le code complet modifié.
    
    ${JSON_SYSTEM_PROMPT}
    
    CODE À COMMENTER :
    ${textSelection}`;

    const response = await service.sendRequest(prompt);
    if (!response) throw new Error("Pas de réponse du modèle.");
    
    return parseLLMResponse(response);
}
