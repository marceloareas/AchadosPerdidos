from flask import Flask, request, jsonify
from .controllers.MatchController import match_bp
from dotenv import load_dotenv
import os

def create_app():
    app = Flask(__name__)
    
    @app.before_request
    def verify_api_key():
        
        request_api_key = request.headers.get("X-API-KEY")
        excepted_api_key = os.getenv("MATCH_API_KEY")

        if not request_api_key or request_api_key != excepted_api_key:
            return jsonify({"erro": "Acesso não autorizado!"}), 401

    app.register_blueprint(match_bp, url_prefix='/llm/match')

    return app