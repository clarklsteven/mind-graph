import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import StatusBar from "./statusbar";
import { getSettings, verifyVaultPath } from "../api/user";

vi.mock("../api/user", () => ({
    getSettings: vi.fn(),
    verifyVaultPath: vi.fn()
}));

afterEach(() => {
    vi.resetAllMocks();
});

describe("StatusBar", () => {
    it("displays mode and autosave status and shows a green vault indicator for a valid vault", async () => {
        vi.mocked(getSettings).mockResolvedValueOnce({ vaultPath: "/tmp/vault" });
        vi.mocked(verifyVaultPath).mockResolvedValueOnce(true);

        const { container } = render(<StatusBar autoSaveStatus="Ready" mode="select" />);

        expect(screen.getByText("Graph Mode: Select")).toBeInTheDocument();
        expect(screen.getByText("Autosave: Ready")).toBeInTheDocument();

        await waitFor(() => {
            expect(verifyVaultPath).toHaveBeenCalledWith("/tmp/vault");
        });

        expect(container.querySelector("svg")?.outerHTML).toContain("green");
    });

    it("shows a red vault indicator when no vault path is configured", async () => {
        vi.mocked(getSettings).mockResolvedValueOnce({});

        const { container } = render(<StatusBar autoSaveStatus="Saving..." mode="link" />);

        expect(screen.getByText("Graph Mode: Link")).toBeInTheDocument();
        expect(screen.getByText("Autosave: Saving...")).toBeInTheDocument();

        await waitFor(() => {
            expect(getSettings).toHaveBeenCalledTimes(1);
        });

        expect(container.querySelector("svg")?.outerHTML).toContain("red");
    });
});
