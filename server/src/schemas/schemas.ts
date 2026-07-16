import type { GraphInterpretation } from "../../../client/src/core/model/graph-interpretation";
import type { UserSettingsInterface } from "../model/user-settings";
import { UserSettings } from "../user/user-settings";
import fs from "fs";

export class Schemas {
    private userSettings: UserSettings;

    constructor() {
        this.userSettings = new UserSettings();
    }

    async getSchemas(): Promise<GraphInterpretation[]> {
        let schemaList: string[] = [];
        const schemas: GraphInterpretation[] = [];
        const settings: UserSettingsInterface = await this.userSettings.getSettings();
        if (!settings.vaultPath) {
            return [];
        }
        else {
            const schemasPath = `${settings.vaultPath}/Mind Graphs/Flexible Schemas`;
            if (fs.existsSync(schemasPath) && fs.lstatSync(schemasPath).isDirectory()) {
                schemaList = fs.readdirSync(schemasPath).filter(file => fs.lstatSync(`${schemasPath}/${file}`).isFile());
            }
        }
        for (const schemaName of schemaList) {
            const schemaPath = `${settings.vaultPath}/Mind Graphs/Flexible Schemas/${schemaName}`;
            try {
                const schemaData = fs.readFileSync(schemaPath, "utf-8");
                const schemaJson: GraphInterpretation = JSON.parse(schemaData);
                schemas.push(schemaJson as GraphInterpretation);
            } catch (error) {
                console.error(`Error reading or parsing schemna file ${schemaPath}:`, error);
            }
        }
        return schemas;
    }

    async getSchema(name: string): Promise<GraphInterpretation | null> {
        let schema: GraphInterpretation | null = null;
        const settings: UserSettingsInterface = await this.userSettings.getSettings();
        if (!settings.vaultPath) {
            return schema;
        }
        else {
            const schemasPath = `${settings.vaultPath}/Mind Graphs/Flexible Schemas`;
            if (fs.existsSync(schemasPath) && fs.lstatSync(schemasPath).isDirectory()) {
                const schemaPath = `${settings.vaultPath}/Mind Graphs/Flexible Schemas/${name}`;
                try {
                    const schemaData = fs.readFileSync(schemaPath, "utf-8");
                    schema = JSON.parse(schemaData);
                } catch (error) {
                    console.error(`Error reading or parsing schemna file ${schemaPath}:`, error);
                }
            }
            return schema;
        }
    }
}