import { describe, it, expect, vi, afterEach } from "vitest";
import { getSettings, updateSettings, verifyVaultPath } from "./user";

afterEach(() => {
    vi.restoreAllMocks();
});

describe("client/api/user", () => {
    it("fetches settings and returns the settings payload", async () => {
        const expectedSettings = { vaultPath: "/tmp/vault", theme: "dark" };
        const fetchMock = vi.fn().mockResolvedValue({
            json: vi.fn().mockResolvedValue({ settings: expectedSettings })
        });

        vi.stubGlobal("fetch", fetchMock);

        const actual = await getSettings();

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/user/settings");
        expect(actual).toEqual(expectedSettings);
    });

    it("posts updated settings to the server", async () => {
        const newSettings = { vaultPath: "/tmp/new-vault" };
        const fetchMock = vi.fn().mockResolvedValue({});

        vi.stubGlobal("fetch", fetchMock);

        await updateSettings(newSettings);

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/user/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newSettings)
        });
    });

    it("verifies the vault path and returns the validity flag", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            json: vi.fn().mockResolvedValue({ isValid: true })
        });

        vi.stubGlobal("fetch", fetchMock);

        const result = await verifyVaultPath("/tmp/vault");

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/user/settings/verify-vault-path", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ vaultPath: "/tmp/vault" })
        });
        expect(result).toBe(true);
    });
});
