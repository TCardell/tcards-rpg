import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'tests/browser',timeout:60000,workers:1,reporter:'list',
 use:{baseURL:process.env.TCARDS_TEST_ORIGIN??'http://127.0.0.1:3000',launchOptions:{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH},reducedMotion:'reduce'},
 webServer:{command:'npm run dev',url:'http://127.0.0.1:3000',reuseExistingServer:true}
});
