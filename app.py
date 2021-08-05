from flask import Flask, jsonify, render_template
from dotenv import load_dotenv
from os import environ
from flask_sqlalchemy import SQLAlchemy


load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DATABASE_URI')

# database setup
db = SQLAlchemy(app)



class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String)


@app.route('/aboutus')
def aboutus():
    return render_template("aboutus.html")


@app.route('/')
def index():
    return render_template("index.html")

@app.route('/resources')
def resources():
    return render_template("resources.html")   

@app.route('/visualizations')
def visualizations():
    return render_template("visualizations.html")


@app.route('/d3viz')
def d3viz():
    return render_template("d3viz.html")

@app.route('/map')
@app.route('/map/<year>')
def map(year="2019"):
    if year == "2019":
        unselected_year="2018"
    else:
        unselected_year="2019"
    return render_template("ImTheMap.html",selected_year=year,unselected_year=unselected_year)

@app.route('/api/notes/postgres')
def note_postgres():
    notes = db.session.query(Note)
    data = []

    for note in notes:
        data.append({
            "id": note.id,
            "content": note.content
        })

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)