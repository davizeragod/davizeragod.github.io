<div align="center">
  <img src="https://davizeragod.github.io/recortado.png" alt="Logo" width="160" />

  # 🎯 Valorant Rank Overlay

  **A lightweight, customizable Valorant rank overlay for OBS Studio & Streamlabs.**  
  Display your current Rank, RR, session Win/Loss record, and last match points in real time on your stream!

  [![Live Site](https://img.shields.io/badge/🌐_Overlay_Generator-davizeragod.github.io-6366f1?style=for-the-badge)](https://davizeragod.github.io/)
  [![API Key Guide](https://img.shields.io/badge/🔑_API_Key_Guide-EN_|_PT_|_JP-f59e0b?style=for-the-badge)](https://davizeragod.github.io/key.html)
  [![HenrikDev API](https://img.shields.io/badge/Powered_by-Henrik's_Valorant_API-ef4444?style=for-the-badge)](https://github.com/Henrik-3/unofficial-valorant-api)
</div>

---

## ✨ Features

- 🏆 **Real-Time Rank & RR**: Automatically updates your current rank icon, RR progress bar, and Radiant Leaderboard position.
- 📊 **Session Win / Loss Tracker**: Tracks your competitive wins and losses live during your stream session.
- 📈 **Last Match RR Change**: Shows how much RR you gained or lost in your latest competitive match.
- 🎯 **Extended Stats Mode (`v3`)**: Includes live **K/D** and **HS%** calculations across your competitive matches.
- 🎨 **Fully Customizable**:
  - Solid background color or **100% transparent background**
  - Custom text color
  - Custom background image/GIF via URL
  - Custom side icon/character via URL
  - Option to hide the Win/Loss counter (`swl`)

---

## 🚀 How to Use in OBS Studio

1. Open the generator at **[davizeragod.github.io](https://davizeragod.github.io/)**.
2. Fill in your account details:
   - **Nickname**: Your Riot ID name (e.g., `davizera`)
   - **ID (Tag)**: Your Riot tag without `#` (e.g., `0001`)
   - **API Key**: Your HenrikDev API key *(check the [step-by-step guide here](https://davizeragod.github.io/key.html) in 🇺🇸 / 🇧🇷 / 🇯🇵)*.
   - **Region**: Select your account region (`BR`, `NA`, `EU`, `AP/JP`, `KR`, `LATAM`).
3. *(Optional)* Click **Customize** to tweak colors, transparency, custom background, or custom icon and check the live preview.
4. Click **Copy link to clipboard**.
5. In **OBS Studio**:
   - Add a new **Browser** source.
   - Paste the copied link into the **URL** field.
   - Recommended size: **Width `450` / Height `160`**.

---

## ⚙️ URL Parameters (Advanced)

Both overlay versions ([`v2/main.html`](./v2/main.html) and [`v3/main.html`](./v3/main.html)) can be configured directly via URL query parameters:

| Parameter | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `nmusuario` | ✅ | Riot ID username | `davizera` |
| `idusuario` | ✅ | Riot ID tag (without `#`) | `0001` |
| `regiao` | ✅ | Account region (`BR`, `NA`, `EU`, `AP`, `KR`, `LATAM`) | `BR` |
| `apikey` | ✅ | HenrikDev API Key | `HDEV-xxxx...` |
| `color` | ❌ | Background hex color (without `#`) | `282b30` |
| `fontcolor` | ❌ | Text hex color (without `#`) | `ffffff` |
| `alpha` | ❌ | Transparent background (`ss` = transparent, `nn` = solid) | `ss` |
| `bu` | ❌ | Custom background image URL (URL-encoded) | `https%3A%2F%2F...` |
| `iu` | ❌ | Custom side icon URL (URL-encoded) | `https%3A%2F%2F...` |
| `swl` | ❌ | When present, hides the `Win / Loss` counter | `&swl` |

---

## 📁 Project Structure

```text
├── index.html          # Main landing page (Overlay generator + Live preview)
├── key.html            # Multilingual guide (EN/PT/JP) on how to get an API Key
├── js/
│   ├── main.js         # Generator logic, form validation, and live preview
│   └── key.js          # Translations and steps for the API Key tutorial
├── v2/                 # Standard overlay (Rank, RR, Last Match, and Win/Loss)
│   ├── main.html
│   ├── main.css
│   ├── main.js
│   └── Resources/      # Rank tier icons and visual assets
└── v3/                 # Extended stats overlay (adds K/D and HS%)
    ├── main.html
    ├── main.css
    ├── main.js
    └── Resources/
```

---

## 💜 Credits & Special Thanks

- **Overlay Developer**: [@_davizera](https://twitter.com/_davizera)
- **Homepage Developer**: [@hitoriyama](https://twitch.tv/hitoriyama_san)
- **Icon Artist**: [よわむしとうか (touka3210)](https://www.twitch.tv/touka3210)
- **Valorant Data API**: [Henrik's Unofficial Valorant API](https://github.com/Henrik-3/unofficial-valorant-api)

---

## ⚖️ Legal Disclaimer

This project is a community-made tool and is **not endorsed, certified, or otherwise affiliated with Riot Games, Inc.** or any of its affiliates.

**Valorant** and all associated in-game data, rank icons, art, logos, and trademarks are the property of **Riot Games, Inc.** All rights reserved.

