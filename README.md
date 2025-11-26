# Al-Asad Education Foundation Platform

A modern digital platform for the Al Asad Education Foundation, designed to deliver multimedia daawah content, foundation updates, scholarship applications, volunteer onboarding, and donation services in one integrated ecosystem. The project aims to grow into a mobile app and web platform that connects supporters, students, and the wider community.

## Vision

The goal is to create a unified platform where:
- Followers can access videos, audios, pictures, announcements, tafsir sessions, and daawah content.
- Donors can support the foundation with structured donation options.
- Applicants can apply for scholarships or foundation programs.
- Volunteers can join through a verified onboarding flow.
- Admins can manage all multimedia and program content through a secure dashboard.

## Tech Stack

The project is being built using:
- **Next.js 14** (App Router)
- **Firebase Authentication** (admin and role-based access)
- **Firebase Firestore** (data storage)
- **Firebase Storage** (image, audio, video upload)
- **Firebase Hosting** (deployment)
- **TailwindCSS** (styling)
- **Custom brand fonts** (Agency for headings, Lato for body)
- **Arabic fonts** (Tajawal and TradArabicUnicode for Qur'an or Arabic interfaces)

All content is structured to prepare this project for future transition into a mobile app using Flutter.

## Folder Structure

```
al-asad-platform/
│
├── public/
│   ├── hero.png
│   ├── logo.png
│   ├── favicon.ico
│   └── fonts/ (Agency, Lato, Tajawal, TradArabic)
│
├── src/
│   ├── app/
│   │   ├── home/
│   │   ├── multimedia/
│   │   ├── donations/
│   │   ├── scholarships/
│   │   ├── volunteer/
│   │   ├── admin/
│   │   └── api/
│   ├── components/
│   └── lib/
│
└── README.md
```

## Branding

**Primary Color:** #d17600  
**Secondary Colors:** #432e16, #655037, #ffffff  

**Fonts:**  
- Headings: Agency  
- Body: Lato  
- Arabic Text: Tajawal and TradArabicUnicode  

All fonts are stored in `public/fonts/`.

## Firebase Configuration

To run the project locally, create a `.env.local` file in the root directory with the following fields:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

You will obtain these values from your Firebase Console under  
**Project settings > General > Your apps**.

## Installing Dependencies

Run the following inside your project folder:

```
npm install
```

## Running the Development Server

```
npm run dev
```

Your development server will start at:

```
http://localhost:3000
```

## Deployment

Once everything is configured:

```
firebase deploy
```

Firebase Hosting will provide a live production URL.

## Contribution

This project is under active development by Al-Asad Education Foundation.  
Contributions are welcome, especially in UI design, Next.js structure, and Flutter integration.

---

For questions, improvements, or guidance, feel free to contribute or reach out.
