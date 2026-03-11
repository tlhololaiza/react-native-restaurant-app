# Firebase & Firestore Setup Guide

## Overall Progress: 70% Complete ██████████░░░░░

| Step                                              | Status       | %   |
| ------------------------------------------------- | ------------ | --- |
| Firebase project created                          | ✅ Done      | 10% |
| Firebase SDK installed                            | ✅ Done      | 10% |
| Firebase config added (`.env`)                    | ✅ Done      | 10% |
| Firebase client initialized (`firebaseClient.ts`) | ✅ Done      | 10% |
| App services wired to Firebase Auth + Firestore   | ✅ Done      | 10% |
| Firebase Auth — Enable Email/Password sign-in     | ❌ Remaining | 10% |
| Create Firestore Database                         | ❌ Remaining | 15% |
| Set Firestore security rules                      | ❌ Remaining | 15% |

---

## Step 1 — Enable Email/Password Authentication (10%)

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Select your project **foodhub-fe8b2**
3. In the left sidebar click **Build → Authentication**
4. Click the **Get started** button (first time only)
5. Under the **Sign-in method** tab, click **Email/Password**
6. Toggle **Enable** to ON
7. Click **Save**

---

## Step 2 — Create the Firestore Database (15%)

1. In the left sidebar click **Build → Firestore Database**
2. Click **Create database**
3. Choose a **starting mode**:
   - Select **Start in production mode** (recommended — you will add rules in Step 3)
   - _(or "test mode" for quick local testing — rules expire after 30 days)_
4. Click **Next**
5. Choose a **Cloud Firestore location** (pick the region closest to your users, e.g. `europe-west1` or `us-central1`)
   - ⚠️ This cannot be changed later
6. Click **Enable**
7. Wait for provisioning to complete — you will see an empty database with no collections

---

## Step 3 — Set Firestore Security Rules (15%)

After the database is created, click the **Rules** tab and replace the default rules with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read and write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Food items are public menu data — anyone can read, only authenticated users can write (for seeding)
    match /foods/{foodId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Users can only read and write their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.uid;
    }
  }
}
```

Click **Publish** to apply the rules.

---

## What happens automatically once Firestore is live

- When a user **registers**, the app writes their profile to `users/{uid}` in Firestore
- When a user **logs in**, the app reads their profile from `users/{uid}`
- When a user **updates their profile**, the app updates the `users/{uid}` document
- Auth state is managed by Firebase (persists across app restarts)

---

## Quick Checklist

- [ ] Email/Password sign-in enabled in Firebase Console
- [ ] Firestore Database created
- [ ] Security rules published
- [ ] Test register + login in the app
- [ ] Confirm user document appears in Firestore Console under `users/`
