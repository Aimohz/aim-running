# 🏃 AiM — Return to Running & 52-Week Half Marathon Dashboard

**AiM** is a cross-device training dashboard designed for runners returning to running or starting from zero mileage with a 1-year goal of finishing a **Half Marathon (21.1 km)** safely and injury-free.

---

## 🌟 Key Features

1. **5-Phase Milestone-Driven Roadmap:**
   - **Phase 1: Habit & Walk-Run Base** (Weeks 1–8) $\rightarrow$ Unlock gate: 20 min continuous jog.
   - **Phase 2: 5K Consolidation & Durability** (Weeks 9–18) $\rightarrow$ Unlock gate: 5.0 km continuous run.
   - **Phase 3: 10K Endurance Foundation** (Weeks 19–32) $\rightarrow$ Unlock gate: 10.0 km run + 4 weeks of 20+ km volume.
   - **Phase 4: Half Marathon Peak Build** (Weeks 33–48) $\rightarrow$ Unlock gate: 18.0 km long run.
   - **Phase 5: Taper & Race Day Celebration** (Weeks 49–52) $\rightarrow$ 21.1 km finish line!

2. **10% Safe Workload Rule & Injury Prevention:**
   - Automatically monitors your week-over-week mileage.
   - Flags an alert whenever weekly mileage exceeds previous week by $>10\%$.
   - Tracks post-run soreness ratings ($0–10$) and hotspot locations (calves, shins, knees, IT band).

3. **Fitbit & Activity Ingestion:**
   - **Drag & Drop TCX / GPX:** Export directly from Fitbit web and drop into AiM—no API keys or developer accounts needed.
   - **Fitbit $\rightarrow$ Strava Auto-Sync:** Works seamlessly with the free [strava.fitbit.com](https://strava.fitbit.com) sync.
   - **Quick Manual Logger:** 20-second entry with auto pace calculation and shoe selection.

4. **Heart Rate Zone Analytics (Zones 1–5):**
   - Automatically partitions your running time based on your max heart rate.
   - Visual guidance emphasizing the **80/20 polarized principle** (keeping 80% in Zone 2).

5. **Running Shoe Mileage Wear Tracker:**
   - Tracks accumulated mileage on each pair of running shoes with color-coded wear bars and retirement warnings at 80% and 100%.

6. **100% Free Cross-Device Cloud Sync:**
   - **Instant Offline & Local Storage:** Works out of the box with zero setup.
   - **1-Click Google Drive / OneDrive Backup:** Download full `.json` snapshots with one click.
   - **Free Supabase PostgreSQL Sync:** Connect your free Supabase project for real-time background sync between phone and laptop.

---

## 🚀 How to Run Locally

```bash
# Navigate to project folder
cd C:\Users\Almoh\.gemini\antigravity\scratch\aim

# Install dependencies (already completed)
npm install

# Start local server
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

## 📱 How to Deploy to Your Phone & Laptop for Free

### Step 1: Push to GitHub
1. Create a repository on [github.com](https://github.com) named `aim-running`.
2. In this folder run:
```bash
git init
git add .
git commit -m "Initial AiM Running app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aim-running.git
git push -u origin main
```

### Step 2: Deploy on Vercel (100% Free)
1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click **"Add New Project"** $\rightarrow$ select `aim-running`.
3. Click **"Deploy"** (takes ~30 seconds).
4. You will get a free live URL: `https://aim-running.vercel.app`.

### Step 3: Add to Your Phone Home Screen (PWA)
1. Open your Vercel URL on your phone's browser (Safari or Chrome).
2. Tap the **Share / Menu** icon $\rightarrow$ tap **"Add to Home Screen"**.
3. AiM will now open as a standalone app on your phone with the AiM running icon!
