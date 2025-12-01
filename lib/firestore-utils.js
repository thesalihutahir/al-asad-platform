import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useAuth } from "@/components/AuthContext";

// Utility function to get a safe DB instance
const getDb = () => {
    const { db } = useAuth();
    if (!db) {
        console.warn("Firestore not yet initialized. Please check AuthContext and Firebase setup.");
    }
    return db;
};

// Base path for public collections (Read by all users)
const getPublicCollectionPath = (appId, collectionName) => 
    `artifacts/${appId}/public/data/${collectionName}`;

/**
 * Fetches documents from a public collection.
 * @param {string} collectionName - Name of the collection (e.g., 'news').
 * @param {number} docLimit - Maximum number of documents to fetch.
 * @returns {Promise<Array<Object>>}
 */
const fetchPublicCollection = async (collectionName, docLimit = 10) => {
    const db = getDb();
    const { appId, loading } = useAuth();

    if (!db || loading) {
        // Return empty array if not ready or in loading state
        return [];
    }

    const path = getPublicCollectionPath(appId, collectionName);
    const q = query(
        collection(db, path),
        // NOTE: Sorting is done client-side to avoid index requirement issues.
        limit(docLimit)
    );

    try {
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return data;
    } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        return [];
    }
};

// --- Specific Fetchers ---

export const getNewsArticles = () => fetchPublicCollection('news', 10);
export const getPrograms = () => fetchPublicCollection('programs', 10);
export const getEvents = () => fetchPublicCollection('events', 10);
export const getMultimedia = () => fetchPublicCollection('multimedia', 10);

// Admin / Write Utils (Phase 2 implementation)
export const addDocument = (collectionName, data) => {
    // Phase 2: Implementation of adding a document to a public or private collection
    console.log(`Placeholder: Adding data to ${collectionName}`, data);
};