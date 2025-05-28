from flask import Flask, request, jsonify
from db_instructions import Database_Handler
from migrations import migrations

app = Flask(__name__)
db = Database_Handler("./database.db")
db.migrate(migrations)

@app.route("/")
def test():
    print('test')
    db.test()
    return "test"

@app.route("/bills/", methods=['POST'])
def create_bill():
    if request.method == 'POST':
        data = request.get_json()
        try:
            db.insert_bill(data)
            return "complete"
        except:
            return "failed"
    else:
        return "invalid request type"
        

@app.route("/bills/<bill_id>", methods=['GET'])
def get_bill(bill_id):
    data = db.get_one('bill', bill_id)
    response = {'data':{
        "id":data[0],
        "bill_name":data[1],
        "bank_name":data[2],
        "value":data[3]
    }}
    return jsonify(response)





if __name__ == "__main__":
    app.run(debug=True)
