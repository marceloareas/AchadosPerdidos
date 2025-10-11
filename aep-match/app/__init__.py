from flask import Flask
from .controllers.MatchController import match_bp

def create_app():
    app = Flask(__name__)
    
    app.register_blueprint(match_bp, url_prefix='/llm/match')

    return app