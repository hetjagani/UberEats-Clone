print('Start #################################################################');

db = db.getSiblingDB('auth');
db.createUser({
  user: 'uberadmin',
  pwd: 'uberadminpass',
  roles: [{ role: 'readWrite', db: 'auth' }],
});
db.createCollection('users');

db = db.getSiblingDB('restaurant');
db.createUser({
  user: 'uberadmin',
  pwd: 'uberadminpass',
  roles: [{ role: 'readWrite', db: 'restaurant' }],
});
db.createCollection('restaurants');

db = db.getSiblingDB('customer');
db.createUser({
  user: 'uberadmin',
  pwd: 'uberadminpass',
  roles: [{ role: 'readWrite', db: 'customer' }],
});
db.createCollection('customers');

db = db.getSiblingDB('order');
db.createUser({
  user: 'uberadmin',
  pwd: 'uberadminpass',
  roles: [{ role: 'readWrite', db: 'order' }],
});
db.createCollection('orders');

db = db.getSiblingDB('auth_test');
db.createUser({
  user: 'uberadmin',
  pwd: 'uberadminpass',
  roles: [{ role: 'readWrite', db: 'auth_test' }],
});
db.createCollection('users');

db = db.getSiblingDB('restaurant_test');
db.createUser({
  user: 'uberadmin',
  pwd: 'uberadminpass',
  roles: [{ role: 'readWrite', db: 'restaurant_test' }],
});
db.createCollection('restaurants');

db = db.getSiblingDB('customer_test');
db.createUser({
  user: 'uberadmin',
  pwd: 'uberadminpass',
  roles: [{ role: 'readWrite', db: 'customer_test' }],
});
db.createCollection('customers');

db = db.getSiblingDB('order_test');
db.createUser({
  user: 'uberadmin',
  pwd: 'uberadminpass',
  roles: [{ role: 'readWrite', db: 'order_test' }],
});
db.createCollection('orders');

print('END #################################################################');
