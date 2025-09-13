set -e

mongosh -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD <<EOF
use admin
db = db.getSiblingDB('visionarai-one')
db.createUser({
  user: 'visionarai-one',
  pwd:  '$MONGO_USER_PASSWORD',
  roles: [{
    role: 'readWrite',
    db: 'visionarai-one'
  }]
})


EOF
