import { v4 as uuidv4 } from 'uuid';
import {addRxPlugin} from "rxdb";
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);
// In theory this should be well expandable for using subtables and doing various joins
// The real purpose of this is of course is mandatory oop :>

// Abstract Entity Class
class Entity {
    constructor(collectionName, data, primaryKey = "id") {
        this.collectionName = collectionName;
        this.data = data;
        this.primaryKey = primaryKey;
    }

    prepareData() {
        const data = this.data;
        let preparedData = { ...data };
        if (data[this.primaryKey] === undefined) {
            preparedData[this.primaryKey] = uuidv4();
        }
        this.data = preparedData;
        return preparedData;
    }

    async persist(db) {

        await db.collections[this.collectionName].insert(this.prepareData());
    }

    async update(db) {
        if (this.data[this.primaryKey] && db.collections[this.collectionName]) {
            const record = await Entity.find(db, this.collectionName, this.data[this.primaryKey]);
            if (record) {
                await record.update({ $set: this.data });
            }
        }
    }

    async delete(db) {
        if (this.data[this.primaryKey] && db.collections[this.collectionName]) {
            const record = await Entity.find(db, this.collectionName, this.data[this.primaryKey]);
            if (record) {
                await record.remove();
            }
        }
    }

    static async findAll(db, collectionName) {
        const collection = db[collectionName];

        if (!!!collection) return [];
        return await collection.find().exec();
    }

    static async find(db, collectionName, id) {
        if (!db.collections[collectionName]) return null;
        const results = await db.collections[collectionName].find().where("id").eq(id).exec();
        return results[0] || null;
    }
}


// Book Entity Class
class Book extends Entity {
    constructor(data) {
        super("books", data);
    }
}


export { Entity, Book };