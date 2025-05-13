from flask import Flask
from routes import route_bp, api_bp  # routes 패키지에서 Blueprint import

app = Flask(__name__)
app.register_blueprint(route_bp)
app.register_blueprint(api_bp)

if __name__ == '__main__':
  app.run(debug=True)