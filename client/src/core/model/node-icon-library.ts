export class NodeIconLibrary {
    private static icons: Record<string, string> = {
        theory: "T",
        domain: "D",
        mechanism: "⚙",
        enabler: "E",
        constraint: "!",
        tool: "⌘",
        principle: "△",
        outcome: "◎",
        grouping: "□",
        graph_question: "?",
        graph_action: "→",
        untyped: "•",
    };

    static getIcon(iconId?: string): string {
        if (!iconId) {
            return this.icons["untyped"];
        }
        return this.icons[iconId] || this.icons["untyped"];
    }
}
