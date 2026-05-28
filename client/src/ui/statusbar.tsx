import { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { getSettings, verifyVaultPath } from "../api/user";
import type { UserSettingsInterface } from "../../../server/src/model/user-settings";

export default function StatusBar() {
    const [isVaultAvailable, setIsVaultAvailable] = useState(false);

    useEffect(() => {
        async function loadVaultStatus() {
            try {
                const settings: UserSettingsInterface = await getSettings();
                const vaultPath = settings?.vaultPath;

                if (!vaultPath) {
                    setIsVaultAvailable(false);
                    return;
                }

                const result = await verifyVaultPath(vaultPath);
                setIsVaultAvailable(result);
            } catch (error) {
                console.error("Error checking vault status:", error);
                setIsVaultAvailable(false);
            }
        }

        loadVaultStatus();
    }, []);

    return (
        <div className="status-bar">
            <span>
                Vault:{" "}
                {isVaultAvailable ? (
                    <Circle size={12} color="green" fill="green" />
                ) : (
                    <Circle size={12} color="red" fill="red" />
                )}
            </span>
        </div>
    );
}