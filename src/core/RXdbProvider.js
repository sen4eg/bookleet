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

export const useData = () => useContext(RxDBContext);

const dbName = 'bookleet-db';

export const RxDBProvider = ({ children }) => {
    const [database, setDatabase] = useState(null);
    const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncingIn', 'synced', 'syncingOut'
    const [error, setError] = useState(null);

    const { clientId, token, auth_complete } = useOAuth();

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
    const initializeDatabase = async () => {
        setSyncStatus('syncingIn');
        console.log("INIT");
        d.init(clientId, token, dbName);
        d.tryRetrieveDb(e => setError(e)).then(dbson => {
            if (dbson) {
                try {
                    tryCreateNewBlankDb(() => { }, () => { }).then(
                        () => {
                            database.importJSON(dbson);
                            setSyncStatus('synced');
                        }
                    )
                    return;
                } catch (error) {
                    setError(error);
                    console.log("AAA", error);
                }
            }
            tryCreateNewBlankDb(() => { }, () => { }).then(async () =>{
                if (database) {
                    await populateDatabase(database);
                    await database.exportJSON().then(async (data) => {
                        console.log("DATA", data);
                        await d.saveJsonToAppData(data, setError);
                    });
                    setSyncStatus('synced');
                }
            })

        })


    }

    useEffect(() => {
        console.log("AUTH COMPLETE", auth_complete);
        if (!auth_complete) {return;}

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
    }, [auth_complete]);

    return (
        <RxDBContext.Provider value={{ database, exportData, importData, syncStatus, error }}>
            {children}
        </RxDBContext.Provider>
    );
};
