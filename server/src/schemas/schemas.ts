import type { GraphInterpretation } from "../../../client/src/core/model/graph-interpretation";
import type { UserSettingsInterface } from "../model/user-settings";
import { UserSettings } from "../user/user-settings";
import fs from "fs";

export class Schemas {
    private userSettings: UserSettings;

    constructor() {
        this.userSettings = new UserSettings();
    }

    async createSchema(schema: GraphInterpretation): Promise<GraphInterpretation | null> {
        const settings = this.userSettings.getSettings();
        // Check for vault path existence, and whether there is already a schema with the given name
        // If not, create a new schema file with the given name and return a GraphInterpretation object
        if (settings.vaultPath) {
            const schemaName = schema.label.replace(/\s+/g, "-");
            const schemaDirectory = `${settings.vaultPath}/Mind Graphs/Flexible Schemas`;
            const schemaPath = `${schemaDirectory}/${schemaName}.json`;
            if (!fs.existsSync(schemaPath)) {
                fs.mkdirSync(schemaDirectory, { recursive: true });
                fs.writeFileSync(schemaPath, JSON.stringify(schema));
                return schema;
            }
        }
        return null;
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