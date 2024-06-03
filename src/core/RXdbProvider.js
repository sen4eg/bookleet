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


    const prepareDatabase = () => {
        if (!database) return;
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
        database.addCollections({
            tempos: {
                schema: todoSchema
            }
        }).then();
    }

    const initializeDatabase = () => {
        d.init(clientId, token, dbName);
        setSyncStatus('syncingIn');

        d.tryRetrieveDb(setError).then((data) => {
                createRxDatabase({
                    name: dbName,
                    storage: getRxStorageDexie('idb'),
                    multiInstance: false,
                }).then((db) => {
                    setDatabase(db);
                    if (!!data){
                        database.importJSON(data);
                    }else {
                        prepareDatabase();
                    }
                    setSyncStatus('synced');
            })});
    }

    const dataChangeCallback = () => {
        setSyncStatus('syncingOut');
        database.dump().then((json) => {
            d.saveJsonToAppData(json, setError, () => {
                setSyncStatus('synced');
            }).then();
        });
    }


    useEffect(() => {
        if (auth_complete) {
            initializeDatabase();
        }

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
        <RxDBContext.Provider value={{ database, datachangeCallback: dataChangeCallback, syncStatus, error }}>
            {children}
        </RxDBContext.Provider>
    );
};
