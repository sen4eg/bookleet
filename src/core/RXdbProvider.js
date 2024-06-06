import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createRxDatabase } from 'rxdb';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { addRxPlugin } from 'rxdb';

import d from "./data/Drive";
import { useOAuth } from "./OAuthProvider";
import { debugLog } from "./utils";

addRxPlugin(RxDBJsonDumpPlugin);

const RxDBContext = createContext(null);

const dbName = 'bookleet-db-v3';

export const RxDBProvider = ({ children }) => {
    const [database, setDatabase] = useState(null);
    const [syncStatus, setSyncStatus] = useState('idle');
    const [error, setError] = useState(null);
    const { clientId, token, auth_complete, isOnline } = useOAuth();
    const [databaseReady, setDatabaseReady] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [previousData, setPreviousData] = useState(null);
    const [remoteDb, setRemoteDb] = useState(null);
    const isSyncingInRef = useRef(false); // Ref to track sync-in state

    const setDatabaseSchema = async (db) => {
        const tempBookSchema = {
            version: 0,
            primaryKey: 'id',
            type: 'object',
            properties: {
                id: { type: 'string', maxLength: 100, primary: true },
                title: { type: 'string', maxLength: 100 },
                author: { type: 'string', maxLength: 100 },
                genre: { type: 'string', maxLength: 50 },
                isFavorite: { type: 'boolean' },
                status: { type: 'string', enum: ['Red', 'Reading', 'Left aside'] },
                timestamp: { type: 'string', format: 'date-time' }
            },
            required: ['id', 'title', 'author', 'genre', 'isFavorite', 'status', 'timestamp']
        };

        await db.addCollections({ books: { schema: tempBookSchema } });
        setDatabaseReady(true);
    };

    useEffect(() => {
        if (!auth_complete || database) return;

        const prepareDatabase = async () => {
            try {
                debugLog('Creating database');
                const db = await createRxDatabase({
                    name: dbName,
                    storage: getRxStorageMemory(),
                    multiInstance: false,
                    eventReduce: true
                });
                debugLog('Database created', db);

                setDatabase(db);
                await setDatabaseSchema(db);
            } catch (error) {
                setError(error);
            }
        };

        d.init(clientId, token, dbName);
        prepareDatabase();
    }, [auth_complete, clientId, database, token]);

    const handleDataExport = async () => {
        if (!database) return;

        setSyncStatus('syncingOut');
        try {
            const json = await database.exportJSON();
            await d.saveJsonToAppData(json, setError, () => setSyncStatus('synced'));
            debugLog('Exported database', json);
        } catch (error) {
            setError(error);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const setObserver = () => {
        if (!database || subscription) return;

        const sub = database.books.$.subscribe((changeEvent) => {
            debugLog('Change detected', changeEvent);
            if (previousData && previousData.toJSON() === changeEvent.toJSON()) return;
            handleDataExport();
            setPreviousData(changeEvent);
        });

        setSubscription(sub);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const removeObserver = () => {
        if (subscription) {
            subscription.unsubscribe();
            setSubscription(null);
        }
    };

    useEffect(() => {
        if (!auth_complete || !databaseReady || !!remoteDb) return;

        const syncDatabase = async () => {
            if (isSyncingInRef.current) return; // Prevent concurrent sync-in operations

            isSyncingInRef.current = true;
            try {
                debugLog('Syncing database');
                setSyncStatus('syncingIn');
                const received = await d.tryRetrieveDb(setError);

                if (received) {
                    debugLog('Remote database found');
                    setRemoteDb(received);
                    await database.importJSON(received);
                    debugLog('Imported remote database');
                } else {
                    debugLog('No remote database found');
                }

                setObserver();
                setSyncStatus('synced');
            } catch (error) {
                setError(error);
            } finally {
                isSyncingInRef.current = false;
            }
        };

        removeObserver();
        syncDatabase();

        return () => {
            removeObserver();
        };
        // eslint-disable-next-line
    }, [auth_complete, databaseReady ]);

    useEffect(() => {
        if (!isOnline) return;
        if (syncStatus === 'syncingOut'){
            handleDataExport();
        }
        // eslint-disable-next-line
    }, [isOnline]);

    return (
        <RxDBContext.Provider value={{ database, syncStatus, error }}>
            {children}
        </RxDBContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(RxDBContext);
    if (!context) {
        throw new Error('useData must be used within an RxDBProvider');
    }
    return context;
};
