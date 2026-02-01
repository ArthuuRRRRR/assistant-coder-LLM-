import * as vscode from 'vscode';
import { OllamaService } from '../services/ollamaService';
import { handleExplain } from '../commands/explainHandler';
import { handleComment } from '../commands/commentHandler';
import { handleGenerate } from '../commands/generateHandler';
import { LLMResponse } from '../commands/llmHelpers'; // Assure-toi que le chemin est bon (helpers ou llmHelpers)

// Interface pour typer les messages venant du HTML
interface ChatMessage {
    type: 'generate' | 'explain' | 'comment';
    value?: string;
}

export class ChatProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'llm-chat-view';
    private _view?: vscode.WebviewView;

    constructor(
        private readonly _extensionUri: vscode.Uri, 
        private readonly _service: OllamaService
    ) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;
        webviewView.webview.options = { enableScripts: true, localResourceRoots: [this._extensionUri] };
        webviewView.webview.html = this._getHtmlForWebview();

        // Écoute des messages venant de la Webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            // On type la donnée reçue
            await this.onMessageReceived(data as ChatMessage);
        });
    }

    private async onMessageReceived(message: ChatMessage) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            this.postMessage("❌ Ouvre un fichier d'abord !");
            return;
        }

        const textSelection = editor.document.getText(editor.selection);

        // Validation : sélection requise pour explain/comment
        if (message.type !== 'generate' && !textSelection) {
            this.postMessage("❌ Sélectionne du code d'abord !");
            return;
        }

        await vscode.window.withProgress(
            {
                location: vscode.ProgressLocation.Notification,
                title: "Assistant IA en cours...",
                cancellable: false
            },
            async () => {
                this.postMessage("⏳ Analyse et génération en cours...");

                try {
                    let result: LLMResponse | undefined;

                    switch (message.type) {
                        case 'explain':
                            result = await handleExplain(textSelection, this._service);
                            break;

                        case 'comment':
                            result = await handleComment(textSelection, this._service);
                            break;

                        case 'generate':
                            result = await handleGenerate(
                                message.value || "",
                                textSelection,
                                this._service
                            );
                            break;
                    }

                    if (!result) {
                        this.postMessage("⚠️ Aucune réponse reçue.");
                        return;
                    }

                    // Affichage de l'explication dans la Webview
                    this.postMessage(result.explanation || "✅ Terminé.");

                    // Insertion / remplacement du code dans l’éditeur
                    if (result.code && result.code.trim().length > 0) {
                        await editor.edit(editBuilder => {
                            if (editor.selection.isEmpty) {
                                editBuilder.insert(editor.selection.active, result.code!);
                            } else {
                                editBuilder.replace(editor.selection, result.code!);
                            }
                        });
                    }

                } catch (e: unknown) {
                    const msg = e instanceof Error ? e.message : "Erreur inconnue";
                    this.postMessage(`❌ ${msg}`);
                }
            }
        );
    }

    private postMessage(text: string) {
        this._view?.webview.postMessage({ type: 'addResponse', value: text });
    }

    private _getHtmlForWebview() {
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: var(--vscode-font-family); padding: 10px; color: var(--vscode-foreground); }
                textarea { width: 100%; height: 80px; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); border-radius: 4px; padding: 6px; resize: vertical; font-family: var(--vscode-editor-font-family); }
                button { width: 100%; margin-top: 8px; padding: 8px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; cursor: pointer; border-radius: 4px; font-weight: 500; }
                button:hover { background: var(--vscode-button-hoverBackground); }
                .btn-secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
                .btn-secondary:hover { background: var(--vscode-button-secondaryHoverBackground); }
                .separator { margin-top: 15px; margin-bottom: 5px; font-weight: bold; font-size: 0.85em; text-transform: uppercase; opacity: 0.7; }
                #response { margin-top: 15px; padding-top: 10px; border-top: 1px solid var(--vscode-panel-border); white-space: pre-wrap; font-size: 0.95em; line-height: 1.5; }
            </style>
        </head>
        <body>
            <div class="separator">Instruction</div>
            <textarea id="promptInput" placeholder="Ex: Fonction Fibonacci..."></textarea>
            <button id="btnGenerate">✨ Générer / Modifier</button>
            <button id="btnExplain" class="btn-secondary">🧠 Expliquer Sélection</button>
            <button id="btnComment" class="btn-secondary">📝 Commenter Sélection</button>
            <div id="response"></div>
            <script>
                const vscode = acquireVsCodeApi();
                document.getElementById('btnGenerate').addEventListener('click', () => { vscode.postMessage({ type: 'generate', value: document.getElementById('promptInput').value }); });
                document.getElementById('btnExplain').addEventListener('click', () => { vscode.postMessage({ type: 'explain' }); });
                document.getElementById('btnComment').addEventListener('click', () => { vscode.postMessage({ type: 'comment' }); });
                window.addEventListener('message', event => { if(event.data.type === 'addResponse') document.getElementById('response').innerHTML = '<strong>🤖 Assistant :</strong><br/>' + event.data.value; });
            </script>
        </body>
        </html>`;
    }
}
