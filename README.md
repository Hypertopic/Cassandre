CASSANDRE - Texts archive for qualitative analysis
==================================================

License: [GNU Affero General Public License](http://www.gnu.org/licenses/agpl.html)

Contact: <christophe.lejeune@ulg.ac.be>

Home page: <https://github.com/Hypertopic/Cassandre>

Notice
------

Cassandre is a server software. There is no need to install it on your own computer to use it. The usual way is to be "hosted" by one's own institution (ask your system administrator). If your use cases meet our research interests, we can also host your data on our community server.

Installation requirements
-------------------------

* Git client
* Apache HTTP Server (or equivalent) with PHP and reverse proxy 
* [CouchDB](http://couchdb.apache.org/)
* [CouchApp](https://github.com/jchris/couchapp) 

Installation procedure
----------------------

* Create a database named ``cassandre`` at <http://127.0.0.1:5984/_utils>.

* In any folder:

        git clone git://github.com/Hypertopic/Cassandre.git
        couchapp push http://127.0.0.1:5984/cassandre

* In a Web folder:

        git clone git://github.com/christophe-lejeune/cassandre_2_php.git

* Change ``RewriteBase`` in ``.htaccess`` if the web folder is not the Web root.

