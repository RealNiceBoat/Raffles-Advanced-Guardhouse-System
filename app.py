import uuid
from time import localtime, asctime
from flask import Flask, render_template, request, Response, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_utils import UUIDType
from sqlalchemy_utils.functions import sort_query


app = Flask(__name__)
#username = "web_app"
#password = "iamawebapp"
#host = "localhost"
#port = "5432"
#dbname="visitor_project"
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://%s:%s@%s:%s/%s' % (username, password, host, port, dbname)
db_location = "data.db"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite+pysqlite:///%s' % db_location
db = SQLAlchemy(app)

class Visitor(db.Model):
    uuid = db.Column(UUIDType(binary = False), primary_key = True)
    name = db.Column(db.String(80), nullable = False)
    nric = db.Column(db.String(9), nullable = False)
    phone = db.Column(db.Integer, nullable = False)
    email = db.Column(db.String(256), nullable = False)
    reason = db.Column(db.String(30), nullable = False)
    elab = db.Column(db.String(300), nullable = True)
    time_in = db.Column(db.String(40), nullable = False)
    time_out = db.Column(db.String(40), nullable = True)
    signed_in = db.Column(db.Boolean, nullable = False)

    def __repr__(self):
        return '<Visitor {}>'.format(self.uuid)

def gen(vc):
    while True:
        rval, frame = vc.read()
        _, buffer = cv2.imencode('.jpg',frame)
        yield (b'--frame\r\n' +
               b'Content-Type: image/jpeg\r\n\r\n' +
               buffer.tobytes() +
               b'\r\n')

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        new_visitor = Visitor(uuid = uuid.uuid4(),
                              name = request.form['aname'],
                              nric = request.form['anric'],
                              phone = request.form['aphone'],
                              email = request.form['aemail'],
                              reason = request.form['areason'],
                              elab = request.form['areason2'],
                              time_in = asctime(localtime()),
                              time_out = "---",
                              signed_in = True)
        db.session.add(new_visitor)
        db.session.commit()
        return redirect(url_for('index'))
    else:
        #print(sort_query(Visitor.query,'-signed_in').all())
        return render_template('index.html', visitors = sort_query(Visitor.query,'-signed_out').all())

@app.route('/fonts/<requested>')
@app.route('/fonts/<location>/<requested>')
def rtr_fonts(location=None,requested=None):
    ftype = request.path.split(".")[-1]
    try:
        rdata = open("."+request.path,'rb')
        data = bytes()
        for line in rdata:
            data+=line
    except Exception as e:
        print(e)
        return Response(status='404')
    response = Response(response=data,status='200',mimetype=ftype)
    return response

@app.route('/signout/<uuid:visitor_id>/')
def signout(visitor_id):
    signed_out = Visitor.query.filter_by(uuid = visitor_id).first()
    signed_out.signed_in = False
    signed_out.time_out = asctime(localtime())
    db.session.commit()
    return redirect(url_for('index'))

if __name__ == '__main__':
    db.create_all()
    app.run(debug = False)
