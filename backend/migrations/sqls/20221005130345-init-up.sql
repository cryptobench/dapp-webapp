/* TODO */
CREATE TABLE users (
   id TEXT primary key,
   login TEXT not null,
   name TEXT not null
);

CREATE TABLE dapp (
   appId TEXT primary key,
   userId TEXT not null,
   appStoreId TEXT not null,
   createdAt TEXT not null
);