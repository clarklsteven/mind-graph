import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
    testDir: "./tests",
    timeout: 30000,
    expect: {
        timeout: 5000,
    },
    fullyParallel: true,
    use: {
        baseURL: "http://127.0.0.1:4173",
        headless: true,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        video: "retain-on-failure",
        trace: "retain-on-failure",
    },
    projects: [
        {
            name: "chromium",
            use: { browserName: "chromium" },
        },
    ],
    webServer: [
        {
            command: "npm --workspace=server run dev",
            url: "http://127.0.0.1:3000/healthcheck",
            reuseExistingServer: !process.env.CI,
            timeout: 120000,
        },
        {
            command: "npm --workspace=client run build && npm --workspace=client run preview -- --host 127.0.0.1 --port 4173",
            url: "http://127.0.0.1:4173",
            reuseExistingServer: !process.env.CI,
            timeout: 120000,
        },
    ],
    reporter: [["list"], ["html", { open: "never" }]],
};

export default config;
