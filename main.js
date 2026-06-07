const { app, BrowserWindow, shell, Menu, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

// Keep window reference
let mainWindow;

// ─────────────────────────────────────────────
//  AUTO-UPDATE (checks GitHub Releases on startup)
// ─────────────────────────────────────────────
let updatePromptShown = false;

function setupAutoUpdates() {
  // Don't auto-download until we've told the user / they agree implicitly
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', (info) => {
    // A newer version exists on GitHub — it will download in the background
    if (mainWindow) {
      mainWindow.webContents.executeJavaScript(
        "console.log('JoyIT: update available, downloading...');"
      ).catch(() => {});
    }
  });

  autoUpdater.on('update-downloaded', (info) => {
    if (updatePromptShown) return;
    updatePromptShown = true;
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available',
      message: 'A new version of JoyIT Staffing Suite is ready.',
      detail: 'Version ' + (info && info.version ? info.version : '') +
        ' has been downloaded. Restart now to install the update?',
      buttons: ['Restart Now', 'Later'],
      defaultId: 0,
      cancelId: 1
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    }).catch(() => {});
  });

  autoUpdater.on('error', (err) => {
    // Fail silently — never block the app if update check fails (e.g. offline)
    console.log('JoyIT auto-update check skipped:', err && err.message ? err.message : err);
  });

  // Check shortly after launch so it doesn't slow startup
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch(() => {});
  }, 4000);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    icon: path.join(__dirname, 'assets', 'icon.ico'),
    title: 'JoyIT Staffing Intelligence Suite',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    show: false, // Don't show until ready
    backgroundColor: '#f0f4ff',
    autoHideMenuBar: true,
  });

  // Load the app
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Show window when ready (prevents white flash)
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App menu
const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { label: 'Reload', accelerator: 'F5', click: () => mainWindow && mainWindow.reload() },
      { type: 'separator' },
      { label: 'Quit', accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4', click: () => app.quit() }
    ]
  },
  {
    label: 'View',
    submenu: [
      { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', click: () => { if(mainWindow) { const z = mainWindow.webContents.getZoomFactor(); mainWindow.webContents.setZoomFactor(Math.min(z + 0.1, 3)); }}},
      { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', click: () => { if(mainWindow) { const z = mainWindow.webContents.getZoomFactor(); mainWindow.webContents.setZoomFactor(Math.max(z - 0.1, 0.5)); }}},
      { label: 'Reset Zoom', accelerator: 'CmdOrCtrl+0', click: () => mainWindow && mainWindow.webContents.setZoomFactor(1) },
      { type: 'separator' },
      { label: 'Toggle Fullscreen', accelerator: 'F11', click: () => mainWindow && mainWindow.setFullScreen(!mainWindow.isFullScreen()) }
    ]
  },
  {
    label: 'Help',
    submenu: [
      { label: 'About JoyIT Staffing Suite', click: () => {
        dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: 'JoyIT Staffing Intelligence Suite',
          message: 'JoyIT Staffing Intelligence Suite\nVersion 2.0.0',
          detail: 'Built for Joy IT Solutions\nCurrency Converter · Payroll Margin Calculator · World Compliance\n\n© 2026 Joy IT Solutions. All rights reserved.\nProprietary — Internal Use Only.',
          buttons: ['OK']
        });
      }}
    ]
  }
];

app.whenReady().then(() => {
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
  createWindow();
  setupAutoUpdates();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
