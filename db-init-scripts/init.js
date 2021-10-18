print('Start #################################################################');

db = db.getSiblingDB('auth');
db.createUser(
  {
    user: 'uberadmin',
    pwd: 'uberadminpass',
    roles: [{ role: 'readWrite', db: 'auth' }],
  },
);
db.createCollection('users');

print('END #################################################################');