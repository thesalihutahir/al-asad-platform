// lib/firestore-utils.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc, setLogLevel, query, limit } from 'firebase/firestore';

// --- Global Firebase Variables (Mandatory Canvas Environment Variables) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};

// Initialize Firebase App and Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Set logging level to debug for development (optional, but good practice)
setLogLevel('debug');

/**
 * Creates a reference path for public data collections.
 * Public data is accessible to anyone.
 * @param {string} collectionName - The name of the collection (e.g., 'news', 'programs').
 * @returns {string} The full Firestore path.
 */
const getPublicCollectionPath = (collectionName) => {
    return `artifacts/${appId}/public/data/${collectionName}`;
};

/**
 * Generic function to fetch all documents from a public collection.
 * @param {string} collectionName - The name of the collection to fetch.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of documents, including their Firestore ID.
 */
const fetchPublicCollection = async (collectionName) => {
    try {
        const path = getPublicCollectionPath(collectionName);
        const q = query(collection(db, path));
        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Sort the data by a 'date' or 'timestamp' field if available, for now, we return as is.
        return data;
    } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        // Return an empty array on error to prevent application crash
        return [];
    }
};

// =========================================================================
// PHASE 1: CORE CONTENT FETCHING FUNCTIONS
// =========================================================================

// --- Existing Functions (from previous steps) ---

export const getNewsArticles = () => fetchPublicCollection('news');
export const getPrograms = () => fetchPublicCollection('programs');
export const getEvents = () => fetchPublicCollection('events');

// Placeholder for getting a single document (e.g., for a detail page)
export const getDocumentById = async (collectionName, docId) => {
    try {
        const path = getPublicCollectionPath(collectionName);
        const docRef = doc(db, path, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.warn(`No document found with ID: ${docId} in collection ${collectionName}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching document by ID ${docId}:`, error);
        return null;
    }
};


// =========================================================================
// PHASE 1: MULTIMEDIA LIBRARY FUNCTIONS (NEW)
// =========================================================================

/**
 * Fetches all video data from the 'multimedia_videos' collection.
 * Expected document structure: { title, url (YouTube/Vimeo link), description, date }
 */
export const getMultimediaVideos = () => fetchPublicCollection('multimedia_videos');

/**
 * Fetches all audio data from the 'multimedia_audios' collection.
 * Expected document structure: { title, url (Podcast/MP3 link), description, speaker, duration }
 */
export const getMultimediaAudios = () => fetchPublicCollection('multimedia_audios');

/**
 * Fetches all photo gallery data from the 'multimedia_galleries' collection.
 * Expected document structure: { title, description, date, photos: [{ url, caption }, ...] }
 */
export const getMultimediaGalleries = () => fetchPublicCollection('multimedia_galleries');

// =========================================================================
// PHASE 1: DONATION UTILITY (EXISTING)
// =========================================================================

/**
 * Fetches the latest donation tiers/options.
 * @returns {Promise<Array<Object>>}
 */
export const getDonationTiers = async () => {
    try {
        const path = getPublicCollectionPath('donation_tiers');
        const q = query(collection(db, path), limit(1)); // Assuming we only need one document listing all tiers
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Assuming the tier list is stored in a field called 'tiers' in the single document
            const docData = querySnapshot.docs[0].data();
            return docData.tiers || []; 
        }
        
        console.warn("No donation tiers document found.");
        return [];

    } catch (error) {
        console.error("Error fetching donation tiers:", error);
        return [];
    }
};