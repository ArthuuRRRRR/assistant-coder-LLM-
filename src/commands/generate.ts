import * as vscode from 'vscode';
import { OllamaService } from '../services/ollamaService';

export async function generateCommand(service: OllamaService) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const instruction = editor.document.getText(editor.selection);
    if (!instruction) {
        vscode.window.showWarningMessage("Écrivez une instruction et sélectionnez-la !");
        return;
    }

    const response = await service.sendRequest(`Génère le code pour : ${instruction}`);
    if (response) {
        editor.edit(editBuilder => {
            editBuilder.replace(editor.selection, response);
        });
    }
}
