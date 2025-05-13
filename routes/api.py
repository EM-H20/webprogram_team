# api.py
# API 라우트

from flask import Blueprint, request, jsonify
import json
import os

bp = Blueprint('api', __name__, url_prefix='/api') #모든 API 시작 /api/~~

DATA_FILE = 'data.json'

def load_data():
  global user_id_seq, place_id_seq, plan_id_seq, planitem_id_seq
  if os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
      loaded = json.load(f)
      data = loaded.get('data', {"users": [], "places": [], "plans": []})
      user_id_seq = loaded.get('user_id_seq', 1)
      place_id_seq = loaded.get('place_id_seq', 1)
      plan_id_seq = loaded.get('plan_id_seq', 1)
      planitem_id_seq = loaded.get('planitem_id_seq', 1)
      return data
  else:
    user_id_seq = 1
    place_id_seq = 1
    plan_id_seq = 1
    planitem_id_seq = 1
    return {"users": [], "places": [], "plans": []}

def save_data():
  with open(DATA_FILE, 'w', encoding='utf-8') as f:
    json.dump({
      'data': data,
      'user_id_seq': user_id_seq,
      'place_id_seq': place_id_seq,
      'plan_id_seq': plan_id_seq,
      'planitem_id_seq': planitem_id_seq
    }, f, ensure_ascii=False, indent=2)

data = load_data()

# --- Users ---
@bp.route('/users', methods=['POST'])
def create_user():
  global user_id_seq
  req = request.get_json()
  user = {
    "id": user_id_seq,
    "email": req.get("email"),
    "name": req.get("name"),
    "password": req.get("password")
  }
  data["users"].append(user)
  user_id_seq += 1
  save_data()
  return jsonify(user), 201

@bp.route('/users', methods=['GET'])
def get_users():
  return jsonify(data["users"])

# --- Places ---
@bp.route('/places', methods=['POST'])
def create_place():
  global place_id_seq
  req = request.get_json()
  place = {
    "id": place_id_seq,
    "name": req.get("name"),
    "address": req.get("address"),
    "lat": req.get("lat"),
    "lng": req.get("lng"),
    "category": req.get("category")
  }
  data["places"].append(place)
  place_id_seq += 1
  save_data()
  return jsonify(place), 201

@bp.route('/places', methods=['GET'])
def get_places():
  return jsonify(data["places"])

# --- Plans ---
@bp.route('/plans', methods=['POST']) #아직 안 만듦
def create_plan():
  """
  POST /api/plans

  새 일정(Plan)을 생성합니다.

  Body:
  {
    "userId": int, // 사용자 ID
    "title": string, // 일정 제목
    "startDate": string, // 일정 시작일 (ISO 8601 형식)
    "endDate": string, // 일정 종료일 (ISO 8601 형식)
    "items": [
      {
        "placeId": int, // 장소 ID
        "visitOrder": int, // 방문 순서
        "memo": string // 메모 (선택)
      },
      ...
    ]
  }
  
  Response:
  {
    "id": int, // 일정 ID
    "userId": int, // 사용자 ID
    "title": string, // 일정 제목
    "startDate": string, // 일정 시작일 (ISO 8601 형식)
    "endDate": string, // 일정 종료일 (ISO 8601 형식)
    "items": [
      {
        "id": int, // 일정 아이템 ID
        "placeId": int, // 장소 ID
        "visitOrder": int, // 방문 순서
        "memo": string // 메모 (선택)
      },
      ...
    ]
  }
  """
  global plan_id_seq, planitem_id_seq
  req = request.get_json()
  items = req.get("items", [])
  plan_items = []
  for item in items:
    plan_items.append({
      "id": planitem_id_seq,
      "placeId": item.get("placeId"),
      "visitOrder": item.get("visitOrder"),
      "memo": item.get("memo", "")
    })
    planitem_id_seq += 1
  plan = {
    "id": plan_id_seq,
    "userId": req.get("userId"),
    "title": req.get("title"),
    "startDate": req.get("startDate"),
    "endDate": req.get("endDate"),
    "items": plan_items
  }
  data["plans"].append(plan)
  plan_id_seq += 1
  save_data()
  return jsonify(plan), 201

@bp.route('/plans', methods=['GET'])
def get_plans():
  return jsonify(data["plans"])

# --- 네이버 맵 샘플 엔드포인트 ---
@bp.route('/naver_map')
def naver_map():
  return jsonify({"message": "네이버 맵 API 엔드포인트 샘플"})
