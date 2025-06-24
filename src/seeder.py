from api.models import db, User, Hogar, Finanzas, Pagos, User_pagos, Tareas, Comida, Favoritos_hogar
from flask import Flask
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from app import app
from werkzeug.security import generate_password_hash


def seed():
    with app.app_context():
        db.drop_all()
        db.create_all()

        # Crear hogares, cada uno con un usuario diferente
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

if __name__ == "__main__":
    seed()