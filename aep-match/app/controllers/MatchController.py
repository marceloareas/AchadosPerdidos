from flask import Blueprint, request, jsonify
from ..services.MatchService import MatchService
from dotenv import load_dotenv
import os

match_bp = Blueprint('match_bp', __name__)

match_service = MatchService()

@match_bp.route('/encontrar', methods=['POST'])
def encontrar_possiveis_matches():
    data = request.get_json()

    if not data or 'item_pivo' not in data or 'itens_target' not in data:
        return jsonify({"erro": "JSON inválido."}), 400

    try:
        resultados = match_service.find_matches(
            item_pivo=data['item_pivo'],
            itens_target=data['itens_target'],
            limite=data.get('limite', 8.0)
        )

        return jsonify(resultados), 200
    
    except Exception as e:
        return jsonify({"erro": f"Ocorreu um erro interno: {str(e)}"}), 500