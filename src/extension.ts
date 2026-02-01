import * as vscode from 'vscode';
import { OllamaService } from './services/ollamaService';
import { ChatProvider } from './ui/chatProvider';
import { handleExplain } from './commands/explainHandler';
import { handleGenerate } from './commands/generateHandler';

export function activate(context: vscode.ExtensionContext) {
    const ollamaService = new OllamaService();

    // 🔹 Webview (Sidebar Chat)
    const chatProvider = new ChatProvider(context.extensionUri, ollamaService);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(ChatProvider.viewType, chatProvider)
    );

    // 🔹 Commande : Générer du code
    context.subscriptions.push(
        vscode.commands.registerCommand('llm.generate', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) return;

            const selection = editor.document.getText(editor.selection);
            if (!selection) {
                vscode.window.showWarningMessage("Sélectionnez une instruction ou du code.");
                return;
            }

            try {
                const result = await handleGenerate(selection, "", ollamaService);
                if (result.code) {
                    editor.edit(editBuilder => {
                        editBuilder.replace(editor.selection, result.code!);
                    });
                }
                if (result.explanation) {
                    vscode.window.showInformationMessage(result.explanation);
                }
            } catch (e) {
                vscode.window.showErrorMessage("Erreur lors de la génération du code.");
            }
        })
    );

    // 🔹 Commande : Expliquer le code
    context.subscriptions.push(
        vscode.commands.registerCommand('llm.explain', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) return;

            const selection = editor.document.getText(editor.selection);
            if (!selection) {
                vscode.window.showWarningMessage("Sélectionnez du code à expliquer.");
                return;
            }

            try {
                const result = await handleExplain(selection, ollamaService);
                vscode.window.showInformationMessage(result.explanation, { modal: true });
            } catch (e) {
                vscode.window.showErrorMessage("Erreur lors de l’explication du code.");
            }
        })
    );
}

export function deactivate() {}