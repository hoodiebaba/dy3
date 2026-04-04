from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)

socketio = SocketIO()
socketio.init_app(app, cors_allowed_origins="*")

@socketio.on('siteanalytics')
def handle_siteanalytics(message):
    print(f"siteanalytics: {message}")

if __name__ == '__main__':
    socketio.run(app, debug=True,port=8096)