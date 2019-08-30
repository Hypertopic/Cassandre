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

* Git client
* [Docker Engine](https://docs.docker.com/install/)

Installation procedure
----------------------

    docker-compose up -d
    docker pull benel/couchapp
    docker run --rm -v "$(pwd)"/app:/app --network cassandre_default benel/couchapp push . http://cassandre_couchdb_1:5984/cassandre

Two services are now available:

- Cassandre user interface at <http://localhost/>,
- CouchDB administration interface at <http://localhost:5984/_utils/> (that should be kept accessible only to system administrators).
