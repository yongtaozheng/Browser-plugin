//数据库操作
class DataBase{
    constructor(dbConfig){
        for(let key in dbConfig){
            this[key] = dbConfig[key];
        }
        this.db = '';
    }
    /**
     * 打开数据库
     * @param {object} dbName 数据库的名字
     * @param {string} storeName 仓库名称
     * @param {string} version 数据库的版本
     * @return {object} 该函数会返回一个数据库实例
     */
    openDB(dbName,storeName, version = 1) {
        return new Promise((resolve, reject) => {
        //  兼容浏览器
        var indexedDB =
            window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB ||
            window.msIndexedDB;
        let db;
        // 打开数据库，若没有则会创建
        const request = indexedDB.open(dbName, version);
        // 数据库打开成功回调
        request.onsuccess = function (event) {
            db = event.target.result; // 数据库对象
            myConsole("数据库打开成功");
            resolve(db);
        };
        // 数据库打开失败的回调
        request.onerror = function (event) {
            myConsole("数据库打开报错");
        };
        // 数据库有更新时候的回调
        request.onupgradeneeded = function (event) {
            // 数据库创建或升级的时候会触发
            myConsole("onupgradeneeded");
            db = event.target.result; // 数据库对象
            var objectStore;
            // 创建存储库
            objectStore = db.createObjectStore(storeName, {
            keyPath: "id", // 这是主键
            // autoIncrement: true // 实现自增
            });
            // 创建索引，在后面查询数据的时候可以根据索引查
            objectStore.createIndex("link", "link", { unique: false }); 
            objectStore.createIndex("sequenceId", "sequenceId", { unique: false });
            objectStore.createIndex("messageType", "messageType", {
            unique: false,
            });
        };
        });
    }
    /**
     * 新增数据
     * @param {object} db 数据库实例
     * @param {string} storeName 仓库名称
     * @param {string} data 数据
     */
    addData(db, storeName, data) {
        var request = db
        .transaction([storeName], "readwrite") // 事务对象 指定表格名称和操作模式（"只读"或"读写"）
        .objectStore(storeName) // 仓库对象
        .add(data);
    
        request.onsuccess = function (event) {
            myConsole("数据写入成功");
        };
    
        request.onerror = function (event) {
            myConsole("数据写入失败");
        };
    }
    /**
     * 通过主键读取数据
     * @param {object} db 数据库实例
     * @param {string} storeName 仓库名称
     * @param {string} key 主键值
     */
    getDataByKey(db, storeName, key) {
        return new Promise((resolve) => {
        var transaction = db.transaction([storeName]); // 事务
        var objectStore = transaction.objectStore(storeName); // 仓库对象
        var request = objectStore.get(key); // 通过主键获取数据
    
        request.onerror = function (event) {
            myConsole("事务失败");
        };
    
        request.onsuccess = function (event) {
            // console.log("主键查询结果: ", request.result);
            resolve(request.result);
        };
        });
    }
    /**
     * 更新数据
     * @param {object} db 数据库实例
     * @param {string} storeName 仓库名称
     * @param {object} data 数据
     */
    updateDB(db,storeName, data) {
        console.log(db,storeName,data);
        var request = db
        .transaction([storeName], "readwrite") // 事务对象
        .objectStore(storeName) // 仓库对象
        .put(data);
    
        request.onsuccess = function () {
        //   console.log("数据更新成功");
        };
    
        request.onerror = function () {
        //   console.log("数据更新失败");
        };
    }
    
    setDb(db){
        this.db = db;
    }
    dbGet(key){
        return this.getDataByKey(this.db, this.tableName, key);
    };
    dbUpdate(id,data){
        this.updateDB(this.db, this.tableName, {
            id:id,
            data:data
        });
    };
    dbAdd(data,id){
        this.addData(this.db, this.tableName, {
            id:id,
            data:data
        });
    };
}