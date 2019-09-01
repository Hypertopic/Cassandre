CASSANDRE - Diary for qualitative analysis
==========================================

License: [GNU Affero General Public License](http://www.gnu.org/licenses/agpl.html)

Contact: <christophe.lejeune@uliege.be>

Home page: <https://github.com/Hypertopic/Cassandre>

Notice
------

Cassandre is a server software. There is no need to install it on your own computer to use it. The usual way is to be "hosted" by one's own institution (ask your system administrator). If your use cases meet our research interests, we can also host your data on our community server.

Installation requirements
-------------------------

* [Docker Engine](https://docs.docker.com/install/)

Installation procedure
----------------------

    docker-compose up -d running_infrastructure
    docker-compose run --rm push_app

Two services are now available:

- Cassandre user interface at <http://localhost/>,
- CouchDB administration interface at <http://localhost:5984/_utils/> (that should be kept accessible only to system administrators).

Authentication settings
-----------------------

### CouchDB authentication

If you want users to be managed by CouchDB:

1. Go to the CouchDB administration interface.
2. Create a database named '_users'.
3. In this database, create a user document. For example:

```json
{
    "_id": "org.couchdb.user:alice",
    "name": "alice",
    "type": "user",
    "roles": [],
    "password": "myGreatPassword"
}
```
