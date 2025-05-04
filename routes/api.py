# api.py
# API 라우트

from flask import Blueprint, jsonify

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/naver_map')
def naver_map():
  # 실제 네이버 맵 API 연동 예정, 현재는 형식만 작성
  return jsonify({"message": "네이버 맵 API 엔드포인트 샘플"})
