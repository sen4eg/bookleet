import React, { createContext, useContext, useState, useEffect } from 'react';
import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { addRxPlugin } from 'rxdb';

import d from "./data/Drive";
import { useOAuth } from "./OAuthProvider";

addRxPlugin(RxDBJsonDumpPlugin);

const RxDBContext = createContext();

export const useData = () => useContext(RxDBContext);

const dbName = 'bookleet-db';

export const RxDBProvider = ({ children }) => {
    const [database, setDatabase] = useState(null);
    const [syncStatus, setSyncStatus] = useState('idle');
    const [error, setError] = useState(null);
    const { clientId, token, auth_complete } = useOAuth();
    const [databaseReady, setDatabaseReady] = useState(false);

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

        const prepareDatabase = async () => {
            if (!auth_complete || database) return;

            try {
                console.log('Creating database');
                const db = await createRxDatabase({
                    name: dbName,
                    storage: getRxStorageDexie('idb'),
                    multiInstance: false,
                });
                console.log('Database created');

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


    useEffect(() => {
        let mounted = true;

        const syncDatabase = async () => {
            if (!database || !databaseReady) return;

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

                setSyncStatus('synced');
            } catch (error) {
                setError(error);
            }
        };

        syncDatabase();

        return () => {
            mounted = false;
        };
    },[databaseReady]);

    return (
        <RxDBContext.Provider value={{ database, syncStatus, error }}>
            {database ? children : null}
        </RxDBContext.Provider>
    );
};
