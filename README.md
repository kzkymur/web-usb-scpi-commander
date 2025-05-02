# web-usb-scpi-commander

<img width="1251" alt="main-visual" src="https://github.com/user-attachments/assets/5c625c77-cd15-4d7c-b09a-03e1c43c12a4" />

## Site

Open [this site](https://kzkymur.github.io/web-usb-serial-commander/) with Google Chrome.

## about

A Single Page Application (SPA) that communicates with USB devices using SCPI protocol via Web USB API.

### Key Features
- USB Device selection interface
- Two operation modes: Keypress and Schedule
- Configuration persistence through localStorage
- Built with modern web technologies

### Technology Stack
- TypeScript, React, Vite
- Zustand for state management
- Web USB API for device communication
- [@kzkymur/sequencer](https://www.npmjs.com/package/@kzkymur/sequencer) for command scheduling

### Core Components
- Device connection handling (web-usb-scpi.ts)
- Command lifecycle management (command-sender-worker.ts)
- Centralized state store (store/general.ts)
