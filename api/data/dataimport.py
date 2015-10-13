#!/usr/bin/python
# -*- coding: utf-8 -*-

import csv, sqlite3, datetime, sys

conn = None

try:

    conn = sqlite3.connect( "registration.db" )
    conn.text_factory = str  #bugger 8-bit bytestrings

    print "** Opening csv file"
    with open('reginfo.csv', 'rb') as csvfile:
        datareader = csv.DictReader(csvfile, delimiter='|')
        cur = conn.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS tb_patrons (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, date TEXT NOT NULL, name1 TEXT NOT NULL, name2 TEXT, email1 TEXT, email2 TEXT, phone1 TEXT, phone2 TEXT, address1 TEXT, address2 TEXT, city TEXT, state TEXT, zip TEXT, ipaddress TEXT)')
        cur.execute('CREATE TABLE IF NOT EXISTS tb_registration (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, patron_id INTEGER NOT NULL, year INTEGER, date TEXT NOT NULL, donation NUMERIC, headcount NUMERIC, message TEXT, ipaddress TEXT)')
        for row in datareader:
            #print (row['id'], row['name1'], row['updateflag']) 
            #id = row['id']
            n1 = row['name1'] 
            n2 = row['name2']
            e1 = row['email1']
            e2 = row['email2']
            p1 = row['phone1']
            p2 = row['phone2']
            a1 = row['address1']
            a2 = row['address2']
            ct = row['city']
            st = row['state']
            zip = row['zip']
            hc = row['headcount']
            dona = row['donation']
            lupdt = row['lastupdate']
            yer = row['year']
            #upfl = row[]
            ipfieldval = "old-id:" + row['id'] + " old-flag:" + row['updateflag']
            print ">> Inserting into tb_patrons - " + ipfieldval
            cur.execute('INSERT INTO tb_patrons (date, name1, name2, email1, email2, phone1, phone2, address1, address2, city, state, zip, ipaddress) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', (lupdt, n1, n2, e1, e2, p1, p1, a1, a2, ct, st, zip, ipfieldval))
            
            #cur.execute('SELECT last_insert_rowid() AS rowid FROM tb_patrons LIMIT 1')
            patid = cur.lastrowid
            print ">> Insert successful. New id - " + str(patid)
            if patid:
                today = datetime.date.today()
                dtstr = today.strftime('%Y%m%d:%H%M%S')
                #ipfieldval= "migration flag:"+ upfl
                print ">>>> Inserting into tb_registration - " + ipfieldval
                cur.execute('INSERT INTO tb_registration (patron_id, year, date, donation, headcount, message, ipaddress) VALUES (?,?,?,?,?,?,?)', (patid, yer, dtstr, dona, hc, ipfieldval, 'migration'))
                print ">>>> Insert successful. Registration year - " + yer
        print ">> Commiting changes..."    
        conn.commit()
        print "** All Done **"
        
except sqlite3.Error, e:
    print "** Error %s:" % e.args[0]
    sys.exit(1)
    
finally:
    if conn:
        conn.close()
        
        
    