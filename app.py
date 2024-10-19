from flask import Flask, Response, render_template, jsonify
import cv2
import datetime
from cnn import predict
import subprocess

# Inisialisasi kamera
camera = cv2.VideoCapture(0)  # Gunakan 0 untuk kamera USB atau '/dev/video0' untuk Raspberry Pi Camera

def generate_frames():
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

def detect():
    success, frame = camera.read()
    if success:
        detection = predict.predict_image(frame)

    return jsonify(detection=detection)

def index():
    return render_template('index.html')

def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

def kill_browser():
    try:
        # Menjalankan perintah dengan subprocess
        result = subprocess.run(
            ["taskkill", "/F", "/IM", "chrome.exe"],
            #["pkill", "chromium"],
            capture_output=True,
            text=True,
            check=True  # Ini akan mengangkat exception jika perintah gagal
        )
        return jsonify({'message': 'Berhasil menutup aplikasi!'}), 200
    except subprocess.CalledProcessError as e:
        print(f"Status keluar: {e.returncode}")
        return jsonify({'message': str(e.stderr.strip())}), 500
    except FileNotFoundError:
        return jsonify({'message': "Perintah tidak ditemukan!"}), 500
    
def capture():
    success, frame = camera.read()
    if success:
        # Membuat nama file dengan timestamp
        filename = f"captured_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        cv2.imwrite(filename, frame)  # Menyimpan gambar ke file
        return f"Image saved as {filename}", 200
    return "Failed to capture image", 500

app = Flask(__name__)
app.add_url_rule('/', 'index', index)
app.add_url_rule('/video_feed', 'video_feed', video_feed)
app.add_url_rule('/capture', 'capture', capture)
app.add_url_rule('/detect', 'detect', detect)
app.add_url_rule('/kill_browser', 'kill_browser', kill_browser, methods=['POST'])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
