import React, { createContext, useContext, useState, useEffect } from 'react';
import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import {getRxStorageMemory} from 'rxdb/plugins/storage-memory';

import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { addRxPlugin } from 'rxdb';

import d from "./data/Drive";
import { useOAuth } from "./OAuthProvider";

addRxPlugin(RxDBJsonDumpPlugin);

const RxDBContext = createContext(null);

const dbName = 'bookleet-db-v2';

export const RxDBProvider = ({ children }) => {
    const [database, setDatabase] = useState(null);
    const [syncStatus, setSyncStatus] = useState('idle');
    const [error, setError] = useState(null);
    const { clientId, token, auth_complete } = useOAuth();
    const [databaseReady, setDatabaseReady] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [previousData, setPreviousData] = useState(null);

    const setDatabaseSchema = async (db) => {
        const tempBookSchema = {
            version: 0,
            primaryKey: 'id',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    maxLength: 100,
                    primary: true
                },
                title: {
                    type: 'string',
                    maxLength: 100
                },
                author: {
                    type: 'string',
                    maxLength: 100
                },
                genre: {
                    type: 'string',
                    maxLength: 50
                },
                isFavorite: {
                    type: 'boolean'
                },
                status: {
                    type: 'string',
                    enum: ['Red', 'Reading', 'Left aside']
                },
                timestamp: {
                    type: 'string',
                    format: 'date-time'
                }
            },
            required: ['id', 'title', 'author', 'genre', 'isFavorite', 'status', 'timestamp']
        };
        await db.addCollections({
            books: {
                schema: tempBookSchema
            }
        }).then(() => {
            setDatabaseReady(true);
        });
    }

    useEffect(() => {
        let mounted = true;
        if (!auth_complete) return;
        const prepareDatabase = async () => {
            if (!auth_complete || database) return;

            try {
                console.log('Creating database');
                const db = await createRxDatabase({
                    name: dbName,
                    // storage: getRxStorageDexie('idb'),
                    storage: getRxStorageMemory(),
                    multiInstance: false,
                    eventReduce: true
                });
                console.log('Database created', db);

                if (mounted) {
                    setDatabase(db);
                    await setDatabaseSchema(db);
                }
            } catch (error) {
                setError(error);
            }
        };
        d.init(clientId, token, dbName);
        prepareDatabase();

        return () => {
            mounted = false;
        };
    }, [auth_complete, database]);


    const handleDataExport = () => {
        console.log('Change detected');

        if (!database) return;
        setSyncStatus('syncingOut')
        database.exportJSON().then((json) => {
            d.saveJsonToAppData(json,setError, ()=>setSyncStatus('synced'));
            console.log('Exported database', json);
        });

    }

    const setObserver = () => {
        if (!database) return;
        const sub = database.books.$.subscribe((changeEvent) => {
            console.log('Change detected', changeEvent);
            if (previousData && previousData.toJSON() === changeEvent.toJSON()) return;
            handleDataExport();
            setPreviousData(changeEvent);
        });
        setSubscription(sub);
    }

    const removeObserver = () => {
        if (!database || subscription===null) return;
        subscription.unsubscribe();
    }

    useEffect(() => {
        let mounted = true;
        if (!auth_complete) return;
        const syncDatabase = async () => {
            if (!database || !databaseReady) return;
            if (!mounted) return;
            try {
                console.log('Syncing database');
                setSyncStatus('syncingIn');
                const remoteDb = await d.tryRetrieveDb(setError);

                if (remoteDb) {
                    console.log('Remote database found');
                    await database.importJSON(remoteDb).then(() => {setSyncStatus('synced');
                    console.log('Imported remote ddasdasasdatabase');
                    });
                    console.log('Imported remote database');
                } else {
                    console.log('No remote database found');
                }
                console.log('Database synced');
                setObserver();
                setSyncStatus('synced');
            } catch (error) {
                setError(error);
            }
        };
        removeObserver();

        syncDatabase();

        return () => {
            mounted = false;
        };
    },[auth_complete, databaseReady]);
    return (
        <RxDBContext.Provider value={ {database, syncStatus, error} }>
            {children}
        </RxDBContext.Provider>
    );
};

export const useData = () =>{
    const context = useContext(RxDBContext);
    if (!context) {
        throw new Error('useData must be used within an RxDBProvider');
    }
    return context;
}
