from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

from config import Config
from database.db import init_db
from routes.admin_routes import admin_bp
from routes.auth_routes import auth_bp
from routes.task_routes import task_bp


app = Flask(__name__, static_folder="frontend", static_url_path="")
app.config.from_object(Config)

init_db()

CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(task_bp, url_prefix="/api/tasks")
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(admin_bp, url_prefix="/api/admin")


@app.route("/")
def index():
    return send_from_directory("frontend", "index.html")


@app.route("/admin")
def admin_page():
    return send_from_directory("frontend", "admin.html")


@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    app.run(debug=True)
