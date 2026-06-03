import { useEffect, useState } from "react";
import { Modal } from "./modal";
import { getSettings, updateSettings, verifyVaultPath } from "../../api/user";
import { asiguraPalette } from "../utils/asigura-palette";
import type { UserSettingsInterface } from "../../../../server/src/model/user-settings";

export function SettingsModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [settings, setSettings] = useState<UserSettingsInterface | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        getSettings().then(settings => {
            setSettings(settings);
        });

    }, [isOpen]);

    const settingsEntries = settings ? Object.entries(settings) : [];

    function splitSettingKey(key: string): string {
        return key
            .replace(/([a-z])([A-Z])/g, "$1 $2") // Split camelCase
            .replace(/_/g, " ") // Replace underscores with spaces
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
    }

    async function handleSaveSettings() {
        // Validate vault path setting
        const vaultPath = settings?.vaultPath as string | undefined;
        let isVaultPathValid = true;
        if (vaultPath) {
            try {
                isVaultPathValid = await verifyVaultPath(vaultPath);
            } catch (error) {
                console.error("Invalid vault path:", error);
                isVaultPathValid = false;
            }
        }
        if (!isVaultPathValid) {
            alert("The provided vault path is invalid. Please check the path and try again.");
            return;
        }
        await updateSettings(settings || {});
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            title="Settings"
            onClose={onClose}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}
            >
                {settings ? (
                    settingsEntries.map(([key, value]) => (
                        <div
                            key={key}
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: "4px"
                            }}
                        >
                            <strong
                                style={{
                                    minWidth: "100px",
                                    padding: "4px"
                                }}
                            >{splitSettingKey(key)}:</strong>
                            <input
                                role="textbox"
                                aria-label={splitSettingKey(key)}
                                type="text"
                                style={{
                                    flex: 1,
                                    padding: "4px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px"
                                }}
                                defaultValue={value as string}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    setSettings(prev => prev ? { ...prev, [key]: newValue } : prev);
                                }}
                            />
                        </div>
                    ))
                ) : (
                    "Loading settings..."
                )}
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: "8px"
                }}
            >
                <button
                    style={{
                        marginTop: "16px",
                        marginLeft: "8px",
                        padding: "8px 16px",
                        backgroundColor: asiguraPalette["asigura-5"],
                        color: asiguraPalette["asigura-10"],
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button
                    style={{
                        marginTop: "16px",
                        padding: "8px 16px",
                        backgroundColor: asiguraPalette["asigura-accent-1"],
                        color: asiguraPalette["asigura-10"],
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                    onClick={handleSaveSettings}
                >
                    Save Settings
                </button>
            </div>
        </Modal>
    );
}