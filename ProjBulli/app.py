import sqlite3
import json
import os
from flask import Flask, render_template, request, url_for, flash, redirect, abort, jsonify
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = '/Users/cstragey/desktop/ProjectBillboard/ProjBulli/static/images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your secret key'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn



@app.route('/home/')
def home():
    return render_template('base.html')

@app.route('/')
@app.route('/process', methods=['POST']) 
def process(): 
   # data = request.get_json() # retrieve the data sent from JavaScript 
    # process the data using Python code 
    if request.method == "POST":
        output = request.get_json()

        temp = json.dumps(output)

        result = json.loads(temp)

        post_id = result['pid']
        pos1 = result['value1']
        pos2 = result['value2']
        width = result['width']
        height = result['height']

        conn = get_db_connection()

        conn.execute("UPDATE posts SET val1 = (?) WHERE id= (?)", (pos1, post_id))
        conn.execute("UPDATE posts SET val2 = (?) WHERE id= (?)", (pos2, post_id))
        conn.execute("UPDATE posts SET pwidth = (?) WHERE id= (?)", (width, post_id))
        conn.execute("UPDATE posts SET pheight = (?) WHERE id= (?)", (height, post_id))
        
   
        conn.commit()
        conn.close()

    return render_template("posts.html")

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

@app.route('/create/', methods=['GET', 'POST'])  
def create():
    if request.method == 'POST':
        conn = get_db_connection()
        conn.execute('INSERT INTO posts (val1, val2) VALUES (?, ?)', (100, 100))
        conn.commit()
        conn.close()
        return render_template('posts.html')
    

    
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@app.route('/upload/', methods=["POST"])
def upload():
    file = request.files['inputFile']
    text = request.form['inputText']
    size = request.form['inputSize']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        file_database = file.filename
        conn = get_db_connection()
        conn.execute('INSERT INTO posts (val1, val2, picture, content, psize) VALUES (?, ?, ?, ?, ?)', (100, 500, file_database, text, size))
        conn.commit()
        conn.close()
    else:
        conn = get_db_connection()
        conn.execute('INSERT INTO posts (val1, val2, content) VALUES (?, ?, ?)', (100, 500, text ))
        conn.commit()
        conn.close()
    return redirect("/")


@app.route('/deletepost/', methods=["POST"])
def deletepost():
    
    if request.method == "POST":
        output = request.get_json()

        temp = json.dumps(output)

        result = json.loads(temp)

        post_id = result['pid']

        conn = get_db_connection()

        conn.execute("DELETE FROM posts WHERE id= (?)", (post_id,))
   
        conn.commit()
        conn.close()
        return render_template('posts.html')
    
