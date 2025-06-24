"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Hogar, Finanzas, Pagos, User_pagos, Tareas, Comida, Favoritos_hogar
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import datetime
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from api.mail.mailer import send_email
import random


api = Blueprint('api', __name__)

CORS(api)

@api.route("/users", methods=["GET"])
@jwt_required()
def get_all_users():
    stm = select(User)
    users = db.session.execute(stm).scalars().all()
    return jsonify([u.serialize() for u in users]), 200


@api.route("/users/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    stm = select(User).where(User.id == user_id)
    user = db.session.execute(stm).scalar_one_or_none()
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user.serialize()), 200


@api.route("/users", methods=["POST"])
@jwt_required()
def create_user():
    data = request.get_json()
    try:
        user = User(
            user_name=data.get("user_name"),
            email=data.get("email"),
            password=data.get("password"),
            avatar_url=data.get("avatar_url"),
            favorito_recetas=data.get("favorito_recetas"),
            favorito_peliculas=data.get("favorito_peliculas"),
        )
        db.session.add(user)
        db.session.commit()
        return jsonify(user.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating user"}), 500


@api.route("/users/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    data = request.get_json()
    stm = select(User).where(User.id == user_id)
    user = db.session.execute(stm).scalar_one_or_none()
    if not user:
        return jsonify({"message": "User not found"}), 404
    try:
        user.user_name = data.get("user_name", user.user_name)
        user.email = data.get("email", user.email)
        new_pw = data.get("new_password")
        if new_pw:
            user.password = generate_password_hash(new_pw)
        user.avatar_url = data.get("avatar_url", user.avatar_url)
        if "admin" in data:
            user.admin = bool(data["admin"])
        if "favorito_recetas" in data:
            user.favorito_recetas = data["favorito_recetas"]
        if "deseado_recetas" in data:
            user.deseado_recetas = data["deseado_recetas"]
        if "favorito_peliculas" in data:
            user.favorito_peliculas = data["favorito_peliculas"]
        if "deseado_peliculas" in data:
            user.deseado_peliculas = data["deseado_peliculas"]
        db.session.commit()
        return jsonify(user.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating user"}), 500


@api.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    stm = select(User).where(User.id == user_id)
    user = db.session.execute(stm).scalar_one_or_none()
    if not user:
        return jsonify({"message": "User not found"}), 404
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting user"}), 500


@api.route("/hogares", methods=["GET"])
@jwt_required()
def get_all_hogares():
    stm = select(Hogar)
    hogares = db.session.execute(stm).scalars().all()
    return jsonify([h.serialize() for h in hogares]), 200


@api.route("/hogares/<int:hogar_id>", methods=["GET"])
@jwt_required()
def get_hogar(hogar_id):
    stm = select(Hogar).where(Hogar.id == hogar_id)
    hogar = db.session.execute(stm).scalar_one_or_none()
    if not hogar:
        return jsonify({"message": "Hogar not found"}), 404
    return jsonify(hogar.serialize()), 200


@api.route("/hogares", methods=["POST"])
@jwt_required()
def create_hogar():
    data = request.get_json()
    try:
        user_id = get_jwt_identity()
        hogar = Hogar(
            hogar_name=data.get("hogar_name"),
            user_id=user_id
        )
        db.session.add(hogar)
        db.session.commit()
        return jsonify(hogar.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating hogar"}), 500


@api.route("/hogares/<int:hogar_id>", methods=["PUT"])
@jwt_required()
def update_hogar(hogar_id):
    data = request.get_json()
    stm = select(Hogar).where(Hogar.id == hogar_id)
    hogar = db.session.execute(stm).scalar_one_or_none()
    if not hogar:
        return jsonify({"message": "Hogar not found"}), 404
    try:
        user_id = get_jwt_identity()
        hogar.hogar_name = data.get("hogar_name", hogar.hogar_name)
        hogar.user_id = user_id
        db.session.commit()
        return jsonify(hogar.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating hogar"}), 500


@api.route("/hogares/<int:hogar_id>", methods=["DELETE"])
@jwt_required()
def delete_hogar(hogar_id):
    stm = select(Hogar).where(Hogar.id == hogar_id)
    hogar = db.session.execute(stm).scalar_one_or_none()
    if not hogar:
        return jsonify({"message": "Hogar not found"}), 404
    try:
        db.session.delete(hogar)
        db.session.commit()
        return jsonify({"message": "Hogar deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting hogar"}), 500


@api.route("/finanzas", methods=["GET"])
@jwt_required()
def get_all_finanzas():
    stm = select(Finanzas)
    finanzas = db.session.execute(stm).scalars().all()
    return jsonify([f.serialize() for f in finanzas]), 200


@api.route("/finanzas/<int:finanza_id>", methods=["GET"])
@jwt_required()
def get_finanza(finanza_id):
    stm = select(Finanzas).where(Finanzas.id == finanza_id)
    finanza = db.session.execute(stm).scalar_one_or_none()
    if not finanza:
        return jsonify({"message": "Finanza not found"}), 404
    return jsonify(finanza.serialize()), 200


@api.route("/finanzas", methods=["POST"])
@jwt_required()
def create_finanza():
    data = request.get_json()
    try:
        user_id = get_jwt_identity()
        finanza = Finanzas(
            monto=data.get("monto"),
            user_id=user_id,
            hogar_id=data.get("hogar_id"),
            fecha=data.get("fecha")
        )
        db.session.add(finanza)
        db.session.commit()
        return jsonify(finanza.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating finanza"}), 500


@api.route("/finanzas/<int:finanza_id>", methods=["PUT"])
@jwt_required()
def update_finanza(finanza_id):
    data = request.get_json()
    stm = select(Finanzas).where(Finanzas.id == finanza_id)
    finanza = db.session.execute(stm).scalar_one_or_none()
    if not finanza:
        return jsonify({"message": "Finanza not found"}), 404
    try:
        user_id = get_jwt_identity()
        finanza.monto = data.get("monto", finanza.monto)
        finanza.user_id = user_id
        finanza.hogar_id = data.get("hogar_id", finanza.hogar_id)
        finanza.fecha = data.get("fecha", finanza.fecha)
        db.session.commit()
        return jsonify(finanza.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating finanza"}), 500


@api.route("/finanzas/<int:finanza_id>", methods=["DELETE"])
@jwt_required()
def delete_finanza(finanza_id):
    stm = select(Finanzas).where(Finanzas.id == finanza_id)
    finanza = db.session.execute(stm).scalar_one_or_none()
    if not finanza:
        return jsonify({"message": "Finanza not found"}), 404
    try:
        db.session.delete(finanza)
        db.session.commit()
        return jsonify({"message": "Finanza deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting finanza"}), 500


def parse_fecha(fecha_str):
    try:
        return datetime.strptime(fecha_str, "%Y-%m-%d").date()
    except Exception:
        return None


@api.route("/pagos", methods=["GET"])
@jwt_required()
def get_all_pagos():
    stm = select(Pagos).options(selectinload(
        Pagos.user_pagos).selectinload(User_pagos.user))
    pagos = db.session.execute(stm).scalars().all()

    result = []
    for pago in pagos:
        pago_dict = pago.serialize()
        usuarios = []
        for up in pago.user_pagos:
            usuarios.append({
                "user_pago_id": up.id,
                "user_id": up.user.id,
                "user_name": up.user.user_name,
                "monto_pagar": pago.monto / len(pago.user_pagos) if pago.user_pagos else pago.monto,
                "pagado": up.estado
            })
        pago_dict["usuarios"] = usuarios
        result.append(pago_dict)

    return jsonify(result), 200


@api.route("/pagos/<int:pago_id>", methods=["GET"])
@jwt_required()
def get_pago(pago_id):
    stm = select(Pagos).options(selectinload(Pagos.user_pagos).selectinload(
        User_pagos.user)).where(Pagos.id == pago_id)
    pago = db.session.execute(stm).scalar_one_or_none()

    if not pago:
        return jsonify({"message": "Pago not found"}), 404

    pago_dict = pago.serialize()
    usuarios = []
    for up in pago.user_pagos:
        usuarios.append({
            "user_pago_id": up.id,
            "user_id": up.user.id,
            "user_name": up.user.user_name,
            "monto_pagar": pago.monto / len(pago.user_pagos) if pago.user_pagos else pago.monto,
            "pagado": up.estado
        })
    pago_dict["usuarios"] = usuarios

    return jsonify(pago_dict), 200


@api.route("/pagos", methods=["POST"])
@jwt_required()
def create_pago():
    data = request.get_json()
    compartidos = data.get("compartido_con", [])
    fecha_str = data.get("fecha")
    fecha = parse_fecha(fecha_str) if fecha_str else datetime.utcnow().date()
    fecha_limite_str = data.get("fecha_limite")
    fecha_limite = parse_fecha(fecha_limite_str) if fecha_limite_str else None

    try:
        user_id = get_jwt_identity()
        pago = Pagos(
            tipo=data.get("tipo"),
            monto=data.get("monto"),
            fecha=fecha,
            fecha_limite=fecha_limite,
            descripcion=data.get("descripcion"),
            compartido_con=data.get("compartido_con"),
            categoria=data.get("categoria"),
            frecuencia=data.get("frecuencia"),
            hogar_id=data.get("hogar_id"),
            user_id=user_id
        )
        db.session.add(pago)
        db.session.flush()

        user_pago_creador = User_pagos(
            user_id=user_id,
            pago_id=pago.id,
            hogar_id=pago.hogar_id,
            estado=True
        )
        db.session.add(user_pago_creador)

        for uid in compartidos:
            if uid != user_id:
                existe = db.session.execute(
                select(User_pagos).where(User_pagos.user_id == uid, User_pagos.pago_id == pago.id)
            ).scalar_one_or_none()
            if not existe:
                user_pago = User_pagos(
                user_id=uid,
                pago_id=pago.id,
                hogar_id=pago.hogar_id,
                estado=False
                )
                db.session.add(user_pago)

        db.session.commit()
        return jsonify(pago.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating pago", "error": str(e)}), 500


@api.route("/pagos/<int:pago_id>", methods=["PUT"])
@jwt_required()
def update_pago(pago_id):
    data = request.get_json()
    stm = select(Pagos).where(Pagos.id == pago_id)
    pago = db.session.execute(stm).scalar_one_or_none()
    if not pago:
        return jsonify({"message": "Pago not found"}), 404

    fecha_str = data.get("fecha")
    fecha = parse_fecha(fecha_str) if fecha_str else datetime.utcnow().date()

    fecha_limite_str = data.get("fecha_limite")
    fecha_limite = parse_fecha(
        fecha_limite_str) if fecha_limite_str else pago.fecha_limite
    if fecha_limite_str and not fecha_limite:
        return jsonify({"message": "Fecha límite inválida"}), 400

    try:
        user_id = get_jwt_identity()
        pago.tipo = data.get("tipo", pago.tipo)
        pago.monto = data.get("monto", pago.monto)
        pago.fecha = fecha
        pago.fecha_limite = fecha_limite
        pago.descripcion = data.get("descripcion", pago.descripcion)
        pago.compartido_con = data.get("compartido_con", pago.compartido_con)
        pago.categoria = data.get("categoria", pago.categoria)
        pago.frecuencia = data.get("frecuencia", pago.frecuencia)
        pago.hogar_id = data.get("hogar_id", pago.hogar_id)
        pago.user_id = user_id
        db.session.commit()
        return jsonify(pago.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating pago", "error": str(e)}), 500


@api.route("/pagos/<int:pago_id>", methods=["DELETE"])
@jwt_required()
def delete_pago(pago_id):
    stm = select(Pagos).where(Pagos.id == pago_id)
    pago = db.session.execute(stm).scalar_one_or_none()

    if not pago:
        return jsonify({"message": "Pago not found"}), 404

    try:
        db.session.query(User_pagos).filter_by(pago_id=pago_id).delete()

        db.session.delete(pago)
        db.session.commit()

        return jsonify({"message": "Pago deleted"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error al eliminar el pago: {e}")
        return jsonify({"message": "Error deleting pago", "error": str(e)}), 500


@api.route("/user_pagos", methods=["GET"])
@jwt_required()
def get_all_user_pagos():
    stm = select(User_pagos)
    user_pagos = db.session.execute(stm).scalars().all()
    return jsonify([up.serialize() for up in user_pagos]), 200


@api.route("/user_pagos/<int:user_pago_id>", methods=["GET"])
@jwt_required()
def get_user_pago(user_pago_id):
    stm = select(User_pagos).where(User_pagos.id == user_pago_id)
    user_pago = db.session.execute(stm).scalar_one_or_none()
    if not user_pago:
        return jsonify({"message": "User_pago not found"}), 404
    return jsonify(user_pago.serialize()), 200


@api.route("/user_pagos", methods=["POST"])
@jwt_required()
def create_user_pago():
    data = request.get_json()
    try:
        user_id = get_jwt_identity()
        user_pago = User_pagos(
            user_id=user_id,
            pago_id=data.get("pago_id"),
            estado=data.get("estado")
        )
        db.session.add(user_pago)
        db.session.commit()
        return jsonify(user_pago.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating user_pago"}), 500


@api.route("/user_pagos/<int:user_pago_id>", methods=["PUT"])
@jwt_required()
def update_user_pago(user_pago_id):
    data = request.get_json()

    if not data or "estado" not in data:
        return jsonify({"message": "Estado no proporcionado"}), 400

    stm = select(User_pagos).where(User_pagos.id == user_pago_id)
    user_pago = db.session.execute(stm).scalar_one_or_none()

    if not user_pago:
        return jsonify({"message": "User_pago not found"}), 404

    try:
        user_pago.estado = data["estado"]
        db.session.commit()
        return jsonify(user_pago.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating user_pago", "error": str(e)}), 500


@api.route("/user_pagos/<int:user_pago_id>", methods=["DELETE"])
@jwt_required()
def delete_user_pago(user_pago_id):
    stm = select(User_pagos).where(User_pagos.id == user_pago_id)
    user_pago = db.session.execute(stm).scalar_one_or_none()
    if not user_pago:
        return jsonify({"message": "User_pago not found"}), 404
    try:
        db.session.delete(user_pago)
        db.session.commit()
        return jsonify({"message": "User_pago deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting user_pago"}), 500


@api.route("/tareas", methods=["GET"])
@jwt_required()
def get_all_tareas():
    stm = select(Tareas)
    tareas = db.session.execute(stm).scalars().all()
    return jsonify([t.serialize() for t in tareas]), 200


@api.route("/tareas/<int:tarea_id>", methods=["GET"])
@jwt_required()
def get_tarea(tarea_id):
    stm = select(Tareas).where(Tareas.id == tarea_id)
    tarea = db.session.execute(stm).scalar_one_or_none()
    if not tarea:
        return jsonify({"message": "Tarea not found"}), 404
    return jsonify(tarea.serialize()), 200


@api.route("/tareas", methods=["POST"])
@jwt_required()
def create_tarea():
    data = request.get_json()
    try:
        user_id = get_jwt_identity()
        tarea = Tareas(
            tarea_name=data.get("tarea_name"),
            hogar_id=data.get("hogar_id"),
            user_id=user_id,
            estado=data.get("estado")
        )
        db.session.add(tarea)
        db.session.commit()
        return jsonify(tarea.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating tarea"}), 500


@api.route("/tareas/<int:tarea_id>", methods=["PUT"])
@jwt_required()
def update_tarea(tarea_id):
    data = request.get_json()
    stm = select(Tareas).where(Tareas.id == tarea_id)
    tarea = db.session.execute(stm).scalar_one_or_none()
    if not tarea:
        return jsonify({"message": "Tarea not found"}), 404
    try:
        user_id = get_jwt_identity()
        tarea.tarea_name = data.get("tarea_name", tarea.tarea_name)
        tarea.hogar_id = data.get("hogar_id", tarea.hogar_id)
        tarea.user_id = user_id
        tarea.estado = data.get("estado", tarea.estado)
        db.session.commit()
        return jsonify(tarea.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating tarea"}), 500


@api.route("/tareas/<int:tarea_id>", methods=["DELETE"])
@jwt_required()
def delete_tarea(tarea_id):
    stm = select(Tareas).where(Tareas.id == tarea_id)
    tarea = db.session.execute(stm).scalar_one_or_none()
    if not tarea:
        return jsonify({"message": "Tarea not found"}), 404
    try:
        db.session.delete(tarea)
        db.session.commit()
        return jsonify({"message": "Tarea deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting tarea"}), 500


@api.route("/comida", methods=["GET"])
# @jwt_required()
def get_all_comida():
    stm = select(Comida)
    comida = db.session.execute(stm).scalars().all()
    return jsonify([c.serialize() for c in comida]), 200


@api.route("/comida/<int:comida_id>", methods=["GET"])
# @jwt_required()
def get_comida(comida_id):
    spoon_url = f"https://api.spoonacular.com/recipes/{comida_id}/information"
    params = {
        "apiKey": os.getenv("SPOONACULAR_KEY"),
        "includeNutrition": "false"
    }
    resp = requests.get(spoon_url, params=params)
    resp.raise_for_status()
    return jsonify(resp.json()), 200


@api.route("/comida", methods=["POST"])
# @jwt_required()
def create_comida():
    data = request.get_json()
    try:
        user_id = get_jwt_identity()
        comida = Comida(
            comida_name=data.get("comida_name"),
            descripcion=data.get("descripcion"),
            fecha=data.get("fecha"),
            hogar_id=data.get("hogar_id"),
            user_id=user_id
        )
        db.session.add(comida)
        db.session.commit()
        return jsonify(comida.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating comida"}), 500


@api.route("/comida/<int:comida_id>", methods=["PUT"])
# @jwt_required()
def update_comida(comida_id):
    data = request.get_json()
    stm = select(Comida).where(Comida.id == comida_id)
    comida = db.session.execute(stm).scalar_one_or_none()
    if not comida:
        return jsonify({"message": "Comida not found"}), 404
    try:
        user_id = get_jwt_identity()
        comida.comida_name = data.get("comida_name", comida.comida_name)
        comida.descripcion = data.get("descripcion", comida.descripcion)
        comida.fecha = data.get("fecha", comida.fecha)
        comida.hogar_id = data.get("hogar_id", comida.hogar_id)
        comida.user_id = user_id
        db.session.commit()
        return jsonify(comida.serialize()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating comida"}), 500


@api.route("/comida/<int:comida_id>", methods=["DELETE"])
# @jwt_required()
def delete_comida(comida_id):
    stm = select(Comida).where(Comida.id == comida_id)
    comida = db.session.execute(stm).scalar_one_or_none()
    if not comida:
        return jsonify({"message": "Comida not found"}), 404
    try:
        db.session.delete(comida)
        db.session.commit()
        return jsonify({"message": "Comida deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting comida"}), 500


@api.route("/favoritos_hogar", methods=["GET"])
@jwt_required()
def get_all_favoritos_hogar():
    stm = select(Favoritos_hogar)
    favoritos = db.session.execute(stm).scalars().all()
    return jsonify([f.serialize() for f in favoritos]), 200


@api.route("/favoritos_hogar/<int:favorito_id>", methods=["GET"])
@jwt_required()
def get_favorito_hogar(favorito_id):
    stm = select(Favoritos_hogar).where(Favoritos_hogar.id == favorito_id)
    favorito = db.session.execute(stm).scalar_one_or_none()
    if not favorito:
        return jsonify({"message": "Favorito not found"}), 404
    return jsonify(favorito.serialize()), 200


@api.route("/favoritos_hogar", methods=["POST"])
@jwt_required()
def create_favorito_hogar():
    data = request.get_json()
    try:
        user_id = get_jwt_identity()
        favorito = Favoritos_hogar(
            hogar_id=data.get("hogar_id"),
            user_id=user_id
        )
        db.session.add(favorito)
        db.session.commit()
        return jsonify(favorito.serialize()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating favorito"}), 500


@api.route("/favoritos_hogar/<int:favorito_id>", methods=["DELETE"])
@jwt_required()
def delete_favorito_hogar(favorito_id):
    stm = select(Favoritos_hogar).where(Favoritos_hogar.id == favorito_id)
    favorito = db.session.execute(stm).scalar_one_or_none()
    if not favorito:
        return jsonify({"message": "Favorito not found"}), 404
    try:
        db.session.delete(favorito)
        db.session.commit()
        return jsonify({"message": "Favorito deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting favorito"}), 500


@api.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        invitees = data.pop("otros", [])
        data.pop("repeat_password", None)

        print("Received data:", data)

        if not data.get("user_name") or not data.get("email") or not data.get("password") or not data.get("hogar_name"):
            return jsonify({"error": "Missing one of: user_name, email, password, hogar_name"}), 400

        stm = select(User).where(User.email == data['email'])
        existing_user = db.session.execute(stm).scalars().first()

        if existing_user:
            return jsonify({"error": "Email already taken"}), 400

        hashed_password = generate_password_hash(data['password'])

        new_hogar = Hogar(hogar_name=data["hogar_name"])
        db.session.add(new_hogar)
        db.session.flush()

        new_user = User(
            user_name=data["user_name"],
            email=data["email"],
            password=hashed_password,
            avatar_url=data.get("avatar_url"),
            admin=True,
            favorito_recetas=[],
            favorito_peliculas=[],
            hogar_id=new_hogar.id
        )

        db.session.add(new_user)
        db.session.commit()

        token = create_access_token(identity=str(new_user.id))

        return jsonify({
            "msg": "register ok",
            "token": token,
            "user": new_user.serialize(),
            "hogar": new_hogar.serialize()
        }), 201

    except Exception as e:
        print("Register error:", repr(e))
        db.session.rollback()
        return jsonify({"error": "Something went wrong server-side"}), 500


@api.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Received data:", data)

        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Missing email or password"}), 400

        stm = select(User).where(User.email == data['email'])
        user = db.session.execute(stm).scalars().first()

        if not user:
            return jsonify({"error": "Email not found"}), 404

        if not check_password_hash(user.password, data['password']):
            return jsonify({"success": False, "msg": "email/password wrong"})

        stm2 = select(Hogar).where(Hogar.id == user.hogar_id)
        hogar = db.session.execute(stm2).scalars().first()

        token = create_access_token(identity=str(user.id))

        return jsonify({"msg": "login ok", "token": token, "user": user.serialize(), "hogar": hogar.serialize() if hogar else None}), 200

    except Exception as e:
        print("Login error:", e)
        db.session.rollback()
        return jsonify({"error": "Something went wrong"}), 400


@api.route('/private', methods=['GET'])
@jwt_required()
def get_user_inf():
    try:
        id = get_jwt_identity()

        stm = select(User).where(User.id == id)
        user = db.session.execute(stm).scalar_one_or_none()
        if not user:
            return jsonify({"msg": "What"}), 418

        return jsonify(user.serialize())
    except Exception as e:
        print(e)
        return jsonify({"error": "something went wrong"})


@api.route("/check_mail", methods=['POST'])
def check_mail():
    try:
        data = request.json
        stm = select(User).where(User.email == data['email'])
        user = db.session.execute(stm).scalars().first()
        if not user:
            return jsonify({'success': False, 'msg': 'email not found'}), 404

        token = create_access_token(identity=str(user.id))
        result = send_email(data['email'], token, tipo="reset")

        return jsonify({'success': True, 'token': token, 'email': data['email']}), 200
    except Exception as e:
        return jsonify({'success': False, 'msg': f'something went wrong: {str(e)}'}), 500


@api.route("/send_invitation", methods=["POST"])
def send_invitation():
    try:
        data = request.get_json()
        email = data.get("email")
        inviter_name = data.get("inviterName")
        hogar_id = data.get("hogar_id")
        if not email or not hogar_id or not inviter_name:
            return jsonify({"success": False, "msg": "Faltan datos obligatorios"}), 400
        
        stm = select(User).where(User.email == data['email'])
        user = db.session.execute(stm).scalars().first()

        if not user:
            base_username = email.split("@")[0]
            existing = User.query.filter_by(user_name=base_username).first()
            if existing:
                base_username = f"{base_username}{random.randint(1000, 9999)}"


            user = User(
                email=email,
                user_name=base_username,
                password=generate_password_hash("1234"),
                admin=False,
                hogar_id=hogar_id
            )
            db.session.add(user)
            db.session.commit()

        token = create_access_token(identity=str(user.id))
        result = send_email(email, token, tipo="invite", username=inviter_name)

        if result["success"]:
            return jsonify({"success": True, "msg": "Invitación enviada con éxito"}), 200
        else:
            return jsonify({"success": False, "msg": result["msg"]}), 500

    except Exception as e:
        return jsonify({"success": False, "msg": f"Error interno: {str(e)}"}), 500


@api.route('/mailer/<address>', methods=['POST'])
def handle_mail(address):
    return send_email(address)

@api.route('/password_update', methods=['PUT'])
@jwt_required()
def password_update():
    try:
        data = request.json
        #extraemos el id del token que creamos en la linea 98
        id = get_jwt_identity()
        #buscamos usuario por id
        user = User.query.get(id)
        #actualizamos password del usuario
        user.password = generate_password_hash(data['password'])
        #alacenamos los cambios
        db.session.commit()
        return jsonify({'success': True, 'msg': 'Contraseña actualizada exitosamente, intente iniciar sesion'}), 200
    except Exception as e:
        db.session.rollback()



@api.route("/seed", methods=["POST"])
def seed_info():
        # Crear hogares
        hogares = [
            Hogar(hogar_name="La Casa de Papel ...Higiénico"),
            Hogar(hogar_name="Maria & Lucía"),
        ]
        db.session.add_all(hogares)
        db.session.commit()

        # Crear 5 usuarios
        users = [
            User(user_name="juan", hogar_id=1, email="juan@mail.com", password=generate_password_hash("juan123"), avatar_url="https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg", admin=True, favorito_recetas={}, favorito_peliculas={}),
            User(user_name="ana", hogar_id=1, email="ana@mail.com", password=generate_password_hash("ana123"), avatar_url="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg", admin=False, favorito_recetas={}, favorito_peliculas={}),
            User(user_name="pedro", hogar_id=1, email="pedro@mail.com", password=generate_password_hash("pedro123"), avatar_url="https://images.pexels.com/photos/31517042/pexels-photo-31517042.jpeg", admin=False, favorito_recetas={}, favorito_peliculas={}),
            User(user_name="maria", hogar_id=2, email="maria@mail.com", password=generate_password_hash("maria123"), avatar_url="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg", admin=True, favorito_recetas={}, favorito_peliculas={}),
            User(user_name="lucia", hogar_id=2, email="lucia@mail.com", password=generate_password_hash("lucia123"), avatar_url="https://images.pexels.com/photos/6706847/pexels-photo-6706847.jpeg", admin=True, favorito_recetas={}, favorito_peliculas={}),
        ]
        db.session.add_all(users)
        db.session.commit()


        # Finanzas para cada hogar
        finanzas = [
            Finanzas(monto=1000, user_id=users[0].id, hogar_id=hogares[0].id),
            Finanzas(monto=800, user_id=users[1].id, hogar_id=hogares[1].id),
            Finanzas(monto=600, user_id=users[2].id, hogar_id=hogares[2].id),
            Finanzas(monto=400, user_id=users[3].id, hogar_id=hogares[3].id),
            Finanzas(monto=200, user_id=users[4].id, hogar_id=hogares[4].id),
        ]
        db.session.add_all(finanzas)
        db.session.commit()

        # Pagos para cada hogar
        pagos = [
            Pagos(user_id=users[0].id, hogar_id=hogares[0].id, finanzas_id=finanzas[0].id, monto=200),
            Pagos(user_id=users[1].id, hogar_id=hogares[1].id, finanzas_id=finanzas[1].id, monto=150),
            Pagos(user_id=users[2].id, hogar_id=hogares[2].id, finanzas_id=finanzas[2].id, monto=100),
            Pagos(user_id=users[3].id, hogar_id=hogares[3].id, finanzas_id=finanzas[3].id, monto=50),
            Pagos(user_id=users[4].id, hogar_id=hogares[4].id, finanzas_id=finanzas[4].id, monto=25),
        ]
        db.session.add_all(pagos)
        db.session.commit()

        # User_pagos (cada usuario paga en su hogar)
        user_pagos = [
            User_pagos(user_id=users[0].id, hogar_id=hogares[0].id, pago_id=pagos[0].id, estado=True),
            User_pagos(user_id=users[1].id, hogar_id=hogares[1].id, pago_id=pagos[1].id, estado=False),
            User_pagos(user_id=users[2].id, hogar_id=hogares[2].id, pago_id=pagos[2].id, estado=True),
            User_pagos(user_id=users[3].id, hogar_id=hogares[3].id, pago_id=pagos[3].id, estado=False),
            User_pagos(user_id=users[4].id, hogar_id=hogares[4].id, pago_id=pagos[4].id, estado=True),
        ]
        db.session.add_all(user_pagos)
        db.session.commit()

        # Tareas (algunas cruzadas entre usuarios)
        tareas = [
            Tareas(user_id=users[0].id, done_by=users[1].id, hogar_id=hogares[0].id, tarea="Lavar platos", done=True),
            Tareas(user_id=users[1].id, done_by=users[2].id, hogar_id=hogares[1].id, tarea="Sacar basura", done=False),
            Tareas(user_id=users[2].id, done_by=users[3].id, hogar_id=hogares[2].id, tarea="Barrer", done=True),
            Tareas(user_id=users[3].id, done_by=users[4].id, hogar_id=hogares[3].id, tarea="Cocinar", done=False),
            Tareas(user_id=users[4].id, done_by=users[0].id, hogar_id=hogares[4].id, tarea="Regar plantas", done=True),
        ]
        db.session.add_all(tareas)
        db.session.commit()

        # Comidas
        comidas = [
            Comida(user_id=users[0].id, hogar_id=hogares[0].id, recetas={"nombre": "Paella"}),
            Comida(user_id=users[1].id, hogar_id=hogares[1].id, recetas={"nombre": "Tortilla"}),
            Comida(user_id=users[2].id, hogar_id=hogares[2].id, recetas={"nombre": "Ensalada"}),
            Comida(user_id=users[3].id, hogar_id=hogares[3].id, recetas={"nombre": "Pizza"}),
            Comida(user_id=users[4].id, hogar_id=hogares[4].id, recetas={"nombre": "Empanadas"}),
        ]
        db.session.add_all(comidas)
        db.session.commit()

        # Favoritos_hogar
        favoritos = [
            Favoritos_hogar(user_id=users[0].id, hogar_id=hogares[0].id),
            Favoritos_hogar(user_id=users[1].id, hogar_id=hogares[1].id),
            Favoritos_hogar(user_id=users[2].id, hogar_id=hogares[2].id),
            Favoritos_hogar(user_id=users[3].id, hogar_id=hogares[3].id),
            Favoritos_hogar(user_id=users[4].id, hogar_id=hogares[4].id),
        ]
        db.session.add_all(favoritos)
        db.session.commit()

        print("Datos de prueba insertados correctamente.")

        return jsonify({"success":True})

