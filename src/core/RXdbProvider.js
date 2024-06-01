// RxDBContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { addRxPlugin } from 'rxdb';

import d from "./data/Drive";
import { useOAuth } from "./OAuthProvider";

addRxPlugin(RxDBJsonDumpPlugin);

const RxDBContext = createContext();

export const useRxDB = () => useContext(RxDBContext);

const dbName = 'bookleet-db';

export const RxDBProvider = ({ children }) => {
    const [database, setDatabase] = useState(null);
    const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncingIn', 'synced', 'syncingOut'
    const [error, setError] = useState(null);

    const { clientId, token } = useOAuth();

    async function tryCreateNewBlankDb(onSuccess, onError) {
        if (database != null) {
            try {
                database.destroy();
            } catch (e) {
                console.error(e);
            }
        }
        try {
            const db = await createRxDatabase({
                name: dbName,
                storage: getRxStorageDexie()
            });
            console.log("db :", db);
            setDatabase(db);
            await populateDatabase(db);
            await db.exportJSON().then(async (data) => {
                console.log("DATA", data);
                await d.saveJsonToAppData(data, setError);
            });
            onSuccess();
        } catch (newDbError) {
            onError(newDbError);
        }
    }

    const exportData = async (filename, onSuccess, onError) => {
        // try {
        //     // Implement export functionality
        //     // Example: const data = await database.exportJSON();
        //     // Then save 'data' to a file
        //     onSuccess();
        // } catch (err) {
        //     // If export fails, create a new blank database
        //     await tryCreateNewBlankDb(onSuccess, onError);
        // }
    };

    const importData = async (file, onSuccess, onError) => {
        try {
            onSuccess();
        } catch (err) {
            onError(err);
        }
    };

    async function populateDatabase(db) {
        const todoSchema = {
            version: 0,
            primaryKey: 'id',
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    maxLength: 100 // <- the primary key must have set maxLength
                },
                name: {
                    type: 'string'
                },
                done: {
                    type: 'boolean'
                },
                timestamp: {
                    type: 'string',
                    format: 'date-time'
                }
            },
            required: ['id', 'name', 'done', 'timestamp']
        };
        await db.addCollections({
            tempos: {
                schema: todoSchema
            }
        });
    }

    useEffect(() => {
        async function initializeDatabase() {
            setSyncStatus('syncingIn');
            console.log("INIT");
            d.init(clientId, token);
            const dbson = await d.tryRetrieveDb(e => setError(e));
            console.log("DBSON", dbson);
            if (dbson) {
                try {
                    await tryCreateNewBlankDb(() => { }, () => { });
                    await database.importJSON(dbson);
                    setSyncStatus('synced');
                    return;
                } catch (error) {
                    setError(error);
                }
            }
            await tryCreateNewBlankDb(() => { }, () => { }).then(async () =>{
                // if (database) {
                //     await populateDatabase(database);
                //     await database.exportJSON().then(async (data) => {
                //         console.log("DATA", data);
                //         await d.saveJsonToAppData(data, setError);
                //     });
                //     setSyncStatus('synced');
                // }
            })

        }

        initializeDatabase().then();

        // Clean up function
        return () => {
            if (database) {
                try {
                    database.destroy();
                } catch (e) {
                    console.error(e);
                }
            }
        };
    }, []);

    return (
        <RxDBContext.Provider value={{ database, exportData, importData, syncStatus, error }}>
            {children}
        </RxDBContext.Provider>
    );
};
