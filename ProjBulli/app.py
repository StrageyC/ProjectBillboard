import sqlite3
import json
from flask import Flask, render_template, request, url_for, flash, redirect, abort, jsonify

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn



@app.route('/home/')
def home():
    return render_template('base.html')


@app.route('/process', methods=['POST']) 
def process(): 
   # data = request.get_json() # retrieve the data sent from JavaScript 
    # process the data using Python code 

    output = request.get_json()

    temp = json.dumps(output)

    result = json.loads(temp)

    post_id = result['pid']
    pos1 = result['value1']
    pos2 = result['value2']

    conn = get_db_connection()

    conn.execute("UPDATE posts SET val1 = (?) WHERE id= (?)", (pos1, post_id))
    conn.execute("UPDATE posts SET val2 = (?) WHERE id= (?)", (pos2, post_id))
   
    conn.commit()
    conn.close()

    return output

@app.route('/')
@app.route('/give')
def give():
    conn = get_db_connection()
    conn.close()

    return render_template('posts.html')

@app.route('/returning')
def returning():

    conn = get_db_connection()
    lists = conn.execute('SELECT * FROM posts').fetchall()
    results = lists 
    results = [tuple(row) for row in results]
    temp = json.dumps(results)
    conn.close()
    return temp

@app.route('/postdata/')
def postdata():
    conn = get_db_connection()
    lists = conn.execute('SELECT id FROM posts').fetchall()
    results = lists 
    results = [tuple(row) for row in results]
    temp = json.dumps(results)
    conn.close()
    return temp

  
# conn.execute('INSERT INTO posts (val1, val2 ) VALUES (?,?)', (pos1pos2))