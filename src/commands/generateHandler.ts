import { OllamaService } from '../services/ollamaService';
import { JSON_SYSTEM_PROMPT, parseLLMResponse, LLMResponse } from './llmHelpers';

export async function handleGenerate(instruction: string, textSelection: string, service: OllamaService): Promise<LLMResponse> {
    let userRequest = "";
    if (instruction && textSelection) {
        userRequest = `Instruction: ${instruction}\n\nContexte (Code): ${textSelection}`;
    } else if (instruction) {
        userRequest = instruction;
    } else {
        userRequest = `Améliore ce code : ${textSelection}`;
    }

    const prompt = `
    Tu es un assistant de coding expert.
    Génère ou modifie le code selon la demande.
    Renvoie le code complet prêt à être inséré.
    
    ${JSON_SYSTEM_PROMPT}
    
    DEMANDE : ${userRequest}`;

    const response = await service.sendRequest(prompt);
    if (!response) throw new Error("Pas de réponse du modèle.");
    
    return parseLLMResponse(response);
}
