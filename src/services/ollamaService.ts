import * as vscode from 'vscode';

export class OllamaService {
    
    private get config() {
        return vscode.workspace.getConfiguration('llmAssistant');
    }

    public async sendRequest(prompt: string): Promise<string> {
        const model = this.config.get<string>('model') || 'qwen3-coder:480b';
        const url = this.config.get<string>('url') || 'https://ollama.com';
        const apiKey = this.config.get<string>('apiKey') || '';

        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };
        if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

        const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;

        try {
            const response = await fetch(`${baseUrl}/api/chat`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    model,
                    messages: [{ role: 'user', content: prompt }],
                    stream: false,
                    options: { temperature: 0.3 }
                })
            });

            if (!response.ok) {
                throw new Error(`Erreur API LLM (HTTP ${response.status})`);
            }

            const data = await response.json() as any;
            const content = data.message?.content;

            if (!content) {
                throw new Error("Réponse vide du modèle.");
            }

            return content;

        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur inconnue";
            vscode.window.showErrorMessage(`LLM Assistant : ${message}`);
            throw err;
        }
    }
}