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
* [CouchApp](https://github.com/jchris/couchapp) 
* [Node.js](http://nodejs.org/)

Installation procedure
----------------------

    npm install
    docker-compose up -d
    couchapp push app http://127.0.0.1:5984/cassandre

* Change settings in `proxy/app.js`.
* Test the settings (`sudo` is required for port 80):

    sudo npm start
