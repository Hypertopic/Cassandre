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

    export COUCHDB_USER="TO_BE_CHANGED"
    export COUCHDB_PASSWORD="TO_BE_CHANGED"
    docker compose up --detach

Two services are now available:

- Cassandre user interface at <http://localhost/>,
- CouchDB administration interface at <http://localhost:5984/_utils/> (that should be kept accessible only to system administrators).

Security settings
-----------------

By default, users are managed both by CouchDB and LDAP.

1. In CouchDB, [create an administrator account](http://localhost:5984/_utils/#createAdmin).
2. In CouchDB, [create a database](http://localhost:5984/_utils/#/_all_dbs) named `_users`.
3. Create an empty `{"_id": "_security"}` object into `_users` database.
4. Choose a password and set in as the `secret` in `conf/couchdb.ini` and `conf/aaaforrest.yml`.
5. Set LDAP settings to fit your own LDAP server.

You can [create a user account](http://localhost/register/) from Cassandre.
