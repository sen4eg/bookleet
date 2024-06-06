import { v4 as uuidv4 } from 'uuid';
import {addRxPlugin} from "rxdb";
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);

// i've inicialy made brand new fresh ecmascript version with classes, which seemed to me more classy
// but since it's required by project declaration to use this kind of flow here we go:


let EntityManager = {};

// Entity Constructor Function
EntityManager.Entity = function(collectionName, data, primaryKey = "id") {
    this.collectionName = collectionName;
    this.data = data;
    this.primaryKey = primaryKey;
};

EntityManager.Entity.prototype.prepareData = function() {
    const data = this.data;
    let preparedData = { ...data };
    if (data[this.primaryKey] === undefined) {
        preparedData[this.primaryKey] = uuidv4();
    }
    preparedData.timestamp = new Date().toISOString();
    this.data = preparedData;
    return preparedData;
};

EntityManager.Entity.prototype.persist = async function(db) {
    await db.collections[this.collectionName].insert(this.prepareData());
};

EntityManager.Entity.prototype.update = async function(db) {
    if (this.data[this.primaryKey] && db.collections[this.collectionName]) {
        const record = await EntityManager.Entity.find(db, this.collectionName, this.data[this.primaryKey]);
        if (record) {
            await record.update({ $set: this.prepareData() });
        }
    }
};

EntityManager.Entity.prototype.delete = async function(db) {
    if (this.data[this.primaryKey] && db.collections[this.collectionName]) {
        const record = await EntityManager.Entity.find(db, this.collectionName, this.data[this.primaryKey]);
        if (record) {
            await record.remove();
        }
    }
};

EntityManager.Entity.findAll = async function(db, collectionName) {
    const collection = db.collections[collectionName];
    if (!collection) return [];
    return await collection.find().exec();
};

EntityManager.Entity.find = async function(db, collectionName, id) {
    if (!db.collections[collectionName]) return null;
    const results = await db.collections[collectionName].find().where("id").eq(id).exec();
    return results[0] || null;
};

// Book Constructor Function
EntityManager.Book = function(data) {
    EntityManager.Entity.call(this, "books", data);
};

// Set up inheritance from Entity
EntityManager.Book.prototype = Object.create(EntityManager.Entity.prototype);
EntityManager.Book.prototype.constructor = EntityManager.Book;

export { EntityManager };


// i'll keep this who whichever person may need this in ecma
// In theory this should be well expandable for using subtables and doing various joins
// The real purpose of this is of course is mandatory oop :>
//
// // Abstract Entity Class
// class Entity {
//     constructor(collectionName, data, primaryKey = "id") {
//         this.collectionName = collectionName;
//         this.data = data;
//         this.primaryKey = primaryKey;
//     }
//
//     prepareData() {
//         const data = this.data;
//         let preparedData = { ...data };
//         if (data[this.primaryKey] === undefined) {
//             preparedData[this.primaryKey] = uuidv4();
//         }
//         preparedData.timestamp = new Date().toISOString();
//         this.data = preparedData;
//         return preparedData;
//     }
//
//     async persist(db) {
//
//         await db.collections[this.collectionName].insert(this.prepareData());
//     }
//
//     async update(db) {
//         if (this.data[this.primaryKey] && db.collections[this.collectionName]) {
//             const record = await Entity.find(db, this.collectionName, this.data[this.primaryKey]);
//             if (record) {
//                 await record.update({ $set: this.prepareData() });
//             }
//         }
//     }
//
//     async delete(db) {
//         if (this.data[this.primaryKey] && db.collections[this.collectionName]) {
//             const record = await Entity.find(db, this.collectionName, this.data[this.primaryKey]);
//             if (record) {
//                 await record.remove();
//             }
//         }
//     }
//
//     static async findAll(db, collectionName) {
//         const collection = db[collectionName];
//
//         if (!!!collection) return [];
//         return await collection.find().exec();
//     }
//
//     static async find(db, collectionName, id) {
//         if (!db.collections[collectionName]) return null;
//         const results = await db.collections[collectionName].find().where("id").eq(id).exec();
//         return results[0] || null;
//     }
// }
//
//
// // Book Entity Class
// class Book extends Entity {
//     constructor(data) {
//         super("books", data);
//     }
// }
//
//
// export { Entity, Book };