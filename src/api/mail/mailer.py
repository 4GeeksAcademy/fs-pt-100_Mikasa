from flask_mail import Message
from api.mail.mail_config import mail
import os

def send_email(address, token, tipo="reset", username=None):
    try:
        if os.getenv("FLASK_DEBUG") == "1":
            frontend_url = "https://special-chainsaw-7v5vpq6r9q4ghwwrx-3000.app.github.dev/reset"
        else:
            frontend_url = f"{os.getenv('BACKEND_URL')}/reset"

        link = f"{frontend_url}?token={token}"

        if tipo == "invite":
            subject = "Quieres unirte a Mikasa"
            html = f"""
                <p>Hola {username}, te ha invitado a unirte a nuestra plataforma.</p>
                <p><a href="{link}">Haz clic aquí para establecer tu contraseña y comenzar</a></p>
            """
        else:
            subject = "Reset your password"
            html = f"""
                <p>Hola, has solicitado recuperar tu contraseña.</p>
                <p><a href="{link}">Haz clic aquí para resetear tu contraseña</a></p>
            """

        msg = Message(subject, recipients=[address])
        msg.html = html

        mail.send(msg)
        return {'success': True, 'msg': 'Correo enviado exitosamente'}

    except Exception as e:
        return {'success': False, 'msg': f'Error al enviar correo: {str(e)}'}