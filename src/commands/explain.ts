import * as vscode from 'vscode';
import { OllamaService } from '../services/ollamaService';

export async function explainCommand(service: OllamaService) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const text = editor.document.getText(editor.selection);
    if (!text) {
        vscode.window.showWarningMessage("Sélectionnez du code à expliquer !");
        return;
    }

    const response = await service.sendRequest(`Explique ce code brièvement :\n${text}`);
    if (response) {
        // Amélioration UX : Afficher dans un canal de sortie ou un panneau dédié serait mieux, 
        // mais pour l'instant la modal est ok.
        vscode.window.showInformationMessage(response, { modal: true });
    }
}
