angular.module('explorer.services.db', [])

.factory('DatiDB', function ($q, $http, $rootScope, $filter, $timeout, $window, Config, Profiling, $ionicLoading, $ionicSlideBoxDelegate) {
  var types = Config.contentTypesList();

  var parseDbRow = function (dbrow) {
    var item = JSON.parse(dbrow.data);

    var dbtype = Config.contentKeyFromDbType(dbrow.type);
    item['dbType'] = dbtype;
    return item;
  };

  var currentSchemaVersion = 0;
  if (localStorage.currentSchemaVersion) currentSchemaVersion = Number(localStorage.currentSchemaVersion);
  //console.log('currentSchemaVersion: ' + currentSchemaVersion);

  var currentDbVersion = 0,
    lastSynced = -1;
  if (currentSchemaVersion == Config.getSchemaVersion()) {
    if (localStorage.currentDbVersion) currentDbVersion = Number(localStorage.currentDbVersion);
    if (localStorage.lastSynced) lastSynced = Number(localStorage.lastSynced);
  }
  //console.log('currentDbVersion: ' + currentDbVersion);
  //console.log('lastSynced: ' + lastSynced);

  /*var localSyncOptions = {
    method: 'GET',
    url: 'data/data.json',
    remote: false
  };*/
  var remoteSyncOptions = {
    method: 'POST',
    url: Config.getSyncURL + currentDbVersion,
    data: '{"updated":{}}',
    remote: true
  };
  console.log('remoteSyncOptions.url: ' + remoteSyncOptions.url);

  var dbObj;

  var dbopenDeferred = $q.defer();
  var dbName = Config.getDbName;
  if (ionic.Platform.isWebView()) {
    //console.log('cordova db...');
    document.addEventListener("deviceready", function () {
      //console.log('cordova db inited...');
      dbObj = window.sqlitePlugin.openDatabase({
        name: dbName,
        bgType: 1,
        skipBackup: true
      });
      dbopenDeferred.resolve(dbObj);
    }, false);
  } else {
    //console.log('web db...');
    dbObj = window.openDatabase(dbName, '1.0', dbName + ' - Percorsi', 5 * 1024 * 1024);
    //    remoteSyncOptions = localSyncOptions;
    dbopenDeferred.resolve(dbObj);
  }
  dbopen = dbopenDeferred.promise;

  var dbDeferred = $q.defer();
  dbopen.then(function (dbObj) {
    if (currentSchemaVersion == 0 || currentSchemaVersion != Config.getSchemaVersion()) {
      console.log('initializing database...');
      dbObj.transaction(function (tx) {
        // if favs schema changes, we need to specify some special changes to perform to upgrade it
        //if (currentSchemaVersion==0) {
        //tx.executeSql('DROP TABLE IF EXISTS Favorites');
        //console.log('favorites table dropped')
        //}
        tx.executeSql('DROP TABLE IF EXISTS ContentObjects');
        console.log('contents table created')
        tx.executeSql('CREATE TABLE IF NOT EXISTS ContentObjects (id text primary key, version integer, type text, data text)');
        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type ON ContentObjects( type )');

        tx.executeSql('CREATE INDEX IF NOT EXISTS co_type_class ON ContentObjects( type )');
      }, function (error) { //error callback
        console.log('cannot initialize db! ')
        console.log(error);
        dbDeferred.reject(error);
      }, function () { //success callback
        currentSchemaVersion = Config.getSchemaVersion();
        localStorage.currentSchemaVersion = currentSchemaVersion;
        localStorage.updatedVersion = true;
        if (currentDbVersion > 0) {
          currentDbVersion = 0;
          localStorage.currentDbVersion = currentDbVersion;
        }

        console.log('db initialized');
        dbDeferred.resolve(dbObj);
      });
    } else {
      //console.log('no need to init database...');
      /*
            dbObj.transaction(function (tx) {
              tx.executeSql("select * from sqlite_master where type='index'", [], function (tx, res) { //success callback
                console.log('database schema following:');
                for (i = 0; i < res.rows.length; i++) console.log(res.rows.item(i).sql);
              }, function (e) { //error callback
                console.log('unable dump table schema 1');
              });
            }, function (e) { //success callback
              console.log('dump table schema ok');
            }, function (e) { //error callback
              console.log('unable dump table schema 2');
            });
      */
      dbDeferred.resolve(dbObj);
    }
  });
  db = dbDeferred.promise;

  var syncinprogress = null;

  return {
    reset: function () {
      if (!ionic.Platform.isWebView() || navigator.connection.type != Connection.NONE) {
        //localStorage.cachedProfile=null;
        localStorage.lastSynced = lastSynced = -1;
      } else {
        console.log('cannot reset db: offline!');
      }
      return this.sync().then(function () {
        console.log('DB reset completed.');
        $ionicSlideBoxDelegate.update();
      }, function () {
        console.log('DB not resetted.');
        $ionicSlideBoxDelegate.update();

      });
    },
    fullreset: function (cb) {
      localStorage.currentDbVersion = currentDbVersion = 0;
      localStorage.cachedProfile = null;
      var loading = $ionicLoading.show({
        template: $filter('translate')('loading'),
        delay: 400,
        duration: Config.loadingOverlayTimeoutMillis()
      });
      return this.reset().then(function () {
        console.log('DB FULL-RESET completed.');
      });
    },
    remotereset: function (cb) {
      localStorage.currentDbVersion = currentDbVersion = 1;
      localStorage.cachedProfile = null;
      var loading = $ionicLoading.show({
        template: $filter('translate')('loading'),
        delay: 400,
        duration: Config.loadingOverlayTimeoutMillis()
      });
      return this.reset().then(function () {
        console.log('DB REMOTE-RESET completed.');
      });
    },
    sync: function () {
      if (syncinprogress != null) {
        //console.log('waiting for previuos sync process to finish...');
        return syncinprogress;
      }
      syncronization = $q.defer();
      syncinprogress = syncronization.promise;
      db.then(function (dbObj) {
        Profiling.start('dbsync');
        if (ionic.Platform.isWebView() && navigator.connection.type == Connection.NONE && currentDbVersion != 0) {
          $ionicLoading.hide();
          console.log('no network connection');
          Profiling._do('dbsync');
          syncinprogress = null;
          syncronization.resolve(currentDbVersion);
        } else {
          var now_as_epoch = parseInt((new Date).getTime() / 1000);
          var to = (lastSynced + Config.syncTimeoutSeconds());
          //console.log('lastSynced='+lastSynced);
          if (lastSynced == -1 || now_as_epoch > to) {
            console.log('currentDbVersion: ' + currentDbVersion);
            if (currentDbVersion == 0) {
              console.log('on first run, skipping sync time tagging to allow real remote sync on next check');
            } else {
              console.log((now_as_epoch - lastSynced) + ' seconds since last syncronization: checking web service...');
              lastSynced = now_as_epoch;
              localStorage.lastSynced = lastSynced;
            }

            var syncingOverlay = $ionicLoading.show({
              template: $filter('translate')('syncing'),
              duration: Config.syncingOverlayTimeoutMillis()
            });

            /*if (currentDbVersion == 0) {
              currentSyncOptions = localSyncOptions;
            } else {
              currentSyncOptions = remoteSyncOptions;
              currentSyncOptions.url = Config.syncUrl() + currentDbVersion;
            }*/
            currentSyncOptions = remoteSyncOptions;
            currentSyncOptions.url = Config.getSyncURL + currentDbVersion;
            console.log('currentSyncOptions: ' + JSON.stringify(currentSyncOptions));

            $http.defaults.headers.common.Accept = 'application/json';
            $http.defaults.headers.post = {
              'Content-Type': 'application/json'
            };
            $http(currentSyncOptions).success(function (data, status, headers, config) {
              //              console.log('successful sync response status: '+status);
              var nextVersion = data.version;
              console.log('nextVersion: ' + nextVersion);
              if (nextVersion > currentDbVersion) {
                var itemsToInsert = [];
                var objsReady = [];

                angular.forEach(types, function (contentTypeClassName, contentTypeKey) {
                  //console.log('INSERTS[' + contentTypeKey + ']: ' + contentTypeClassName);

                  if (!angular.isUndefined(data.updated[contentTypeClassName])) {
                    updates = data.updated[contentTypeClassName];

                    console.log('INSERTS[' + contentTypeKey + ']: ' + updates.length);
                    angular.forEach(updates, function (item, idx) {

                      values = [item.id, item.version, contentTypeClassName, JSON.stringify(item)];
                      itemsToInsert.push(values)
                    });

                  } else {
                    console.log('nothing to update');
                  }

                });

                var insertsPromise = $q.defer();
                var deletionsPromise = $q.defer();

                dbObj.transaction(function (tx) {
                  angular.forEach(itemsToInsert, function (rowData, rowIdx) {
                    tx.executeSql('DELETE FROM ContentObjects WHERE id=?', [rowData[0]], function (tx, res) { //success callback
                      tx.executeSql('INSERT INTO ContentObjects (id, version, type, data) VALUES (?, ?, ?, ?)',
                        rowData,
                        function (tx, res) { //success callback
                          console.log('inserted obj (' + rowData[4] + ') with id: ' + rowData[0]);
                        },
                        function (e) { //error callback
                          console.log('unable to insert obj with id ' + rowData[0] + ': ' + e.message);
                        });
                    }, function (e) { //error callback
                      console.log('unable to delete obj with id ' + rowData[0] + ': ' + e.message);
                    });
                  });
                }, function (err) { //error callback
                  console.log('cannot do inserts: ' + err.message);
                  insertsPromise.reject();
                }, function () { //success callback
                  console.log('inserted');
                  insertsPromise.resolve();
                });

                dbObj.transaction(function (tx) {
                  angular.forEach(types, function (contentTypeClassName, contentTypeKey) {
                    //console.log('DELETIONS[' + contentTypeKey + ']: ' + contentTypeClassName);
                    if (!angular.isUndefined(data.deleted[contentTypeClassName])) {
                      deletions = data.deleted[contentTypeClassName];
                      console.log('DELETIONS[' + contentTypeKey + ']: ' + deletions.length);

                      angular.forEach(deletions, function (item, idx) {
                        //console.log('deleting obj with id: ' + item);
                        tx.executeSql('DELETE FROM ContentObjects WHERE id=?', [item], function (tx, res) { //success callback
                          //console.log('deleted obj with id: ' + item);
                        }, function (e) { //error callback
                          console.log('unable to delete obj with id ' + item + ': ' + e.message);
                        });
                      });
                    } else {
                      console.log('nothing to delete for "' + contentTypeKey + '"');
                    }
                  });
                }, function (err) { //error callback
                  console.log('cannot do deletions: ' + err.message);
                  deletionsPromise.reject();
                }, function () { //success callback
                  console.log('deletions done');
                  deletionsPromise.resolve();
                });

                $q.all([insertsPromise.promise, deletionsPromise.promise]).then(function () {
                  $ionicLoading.hide();
                  currentDbVersion = nextVersion;
                  localStorage.currentDbVersion = currentDbVersion;
                  console.log('synced to version: ' + currentDbVersion);
                  Profiling._do('dbsync');
                  syncinprogress = null;
                  syncronization.resolve(currentDbVersion);
                });

              } else {
                $ionicLoading.hide();
                console.log('local database already up-to-date!');
                Profiling._do('dbsync');
                syncinprogress = null;
                syncronization.resolve(currentDbVersion);
              }
            }).error(function (data, status, headers, config) {
              $ionicLoading.hide();
              console.log('cannot check for new data: network unavailable? (HTTP: ' + status + ')');
              //console.log(status);
              Profiling._do('dbsync');
              syncinprogress = null;
              syncronization.resolve(currentDbVersion);
            });
          } else {
            $ionicLoading.hide();
            //console.log('avoiding too frequent syncronizations. seconds since last one: ' + (now_as_epoch - lastSynced));
            Profiling._do('dbsync');
            syncinprogress = null;
            syncronization.resolve(currentDbVersion);
          }
        }
      });
      return syncronization.promise;
    },
    getAllCategories: function () {
      console.log('DatiDB.getCategories()');
      return this.sync().then(function (dbVersion) {
        Profiling.start('getCategories');
        var loading = $ionicLoading.show({
          template: $filter('translate')('loading'),
          delay: 600,
          duration: Config.loadingOverlayTimeoutMillis()
        });

        var dbitem = $q.defer();
        var lista = [];
        dbObj.transaction(function (tx) {
          var qParams = [types['path']];
          var dbQuery = 'SELECT * ' +
            ' FROM ContentObjects c WHERE c.type=?';
          //console.log('dbQuery: ' + dbQuery);
          //console.log('qParams: ' + qParams);
          //console.log('DatiDB.getObj("' + dbname + '", "' + objId + '"); dbQuery launched...');
          tx.executeSql(dbQuery, qParams, function (tx2, results) {
            //console.log('DatiDB.getObj("' + dbname + '", "' + objId + '"); dbQuery completed');
            var resultslen = results.rows.length;
            if (resultslen > 0) {
              for (var i = 0; i < resultslen; i++) {
                var item = results.rows.item(i);
                lista.push(parseDbRow(item));
              }
              Profiling._do('dbgetobj', 'list');
              dbitem.resolve(lista);
            } else {
              console.log('not found!');
              Profiling._do('getCategories', 'sql empty');
              dbitem.reject('not found!');
            }
          }, function (tx2, err) {
            $ionicLoading.hide();
            console.log('error: ' + err);
            Profiling._do('getCategories', 'sql error');
            dbitem.reject(err);
          });
        }, function (error) { //error callback
          $ionicLoading.hide();
          console.log('db.getCategories() ERROR: ' + error);
          Profiling._do('getCategories', 'tx error');
          dbitem.reject(error);
        }, function () { //success callback
          $ionicLoading.hide();
          Profiling._do('getCategories', 'tx success');
        });

        return dbitem.promise;
      });
    }
  }
})
