// RxDBContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBJsonDumpPlugin } from 'rxdb/plugins/json-dump';
import { addRxPlugin } from 'rxdb';

addRxPlugin(RxDBJsonDumpPlugin);

const RxDBContext = createContext();

export const useRxDB = () => useContext(RxDBContext);

const dbName = 'bookleet-db'

export const RxDBProvider = ({ children }) => {
    const [database, setDatabase] = useState(null);
    const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncingIn', 'synced', 'syncingOut'
    const [error, setError] = useState(null);



    async function tryCreateNewBlankDb(onSuccess, onError) {
        try {
            const db = await createRxDatabase({
                name: dbName,
                storage: getRxStorageDexie()
            });
            setDatabase(db);
            onSuccess(); // Export successful after creating a new database
        } catch (newDbError) {
            onError(newDbError); // If creating new database also fails, report the error
        }
    }

    const exportData = async (filename, onSuccess, onError) => {
        try {
            // Implement export functionality
            // Example: const data = await database.exportJSON();
            // Then save 'data' to a file
            onSuccess();
        } catch (err) {
            // If export fails, create a new blank database
            await tryCreateNewBlankDb(onSuccess, onError);
        }
    };

    const importData = async (file, onSuccess, onError) => {
        try {
            onSuccess();
        } catch (err) {
            onError(err);
        }
    };

    const initializeDatabase = async () => {
        tryCreateNewBlankDb(()=>{}, ()=>{}).then();
    };

    useEffect(() => {


        initializeDatabase().then();

        // Clean up function
        return () => {
            if (database) {
                database.destroy();
            }
        };
    }, [database, initializeDatabase]); // Run only once on component mount

    return (
        <RxDBContext.Provider value={{ database, exportData, importData, syncStatus, error }}>
            {children}
        </RxDBContext.Provider>
    );
};
