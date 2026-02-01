import * as vscode from 'vscode';

export class LLMSidebarProvider implements vscode.TreeDataProvider<SidebarItem> {
    
    getTreeItem(element: SidebarItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: SidebarItem): Thenable<SidebarItem[]> {
        if (element) {
            return Promise.resolve([]); // Pas d'enfants pour l'instant (liste plate)
        } else {
            // C'est ici qu'on définit les items de la liste
            return Promise.resolve([
                new SidebarItem("Générer du Code", "llm.generate", "Génère le code depuis la sélection", new vscode.ThemeIcon("code")),
                new SidebarItem("Expliquer le Code", "llm.explain", "Explique la sélection", new vscode.ThemeIcon("comment-discussion")),
                // Tu pourrais ajouter d'autres commandes ici (ex: Documentation)
            ]);
        }
    }
}

class SidebarItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly commandId: string,
        public readonly tooltip: string,
        public readonly iconPath: vscode.ThemeIcon
    ) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.tooltip = tooltip;
        this.command = {
            command: commandId,
            title: label
        };
    }
}
