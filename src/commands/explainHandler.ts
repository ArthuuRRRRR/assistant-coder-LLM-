import { OllamaService } from '../services/ollamaService';
import { JSON_SYSTEM_PROMPT, parseLLMResponse, LLMResponse } from './llmHelpers';

export async function handleExplain(textSelection: string, service: OllamaService): Promise<LLMResponse> {
    const prompt = `
    Tu es un pédagogue expert en programmation.
    Explique ce code de manière claire et concise.
    
    ${JSON_SYSTEM_PROMPT}
    
    CODE À EXPLIQUER :
    ${textSelection}`;

    const response = await service.sendRequest(prompt);
    if (!response) throw new Error("Pas de réponse du modèle.");
    
    return parseLLMResponse(response);
}
