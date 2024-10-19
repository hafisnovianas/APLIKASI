import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model

# Ukuran gambar sesuai dengan yang digunakan dalam pelatihan
IMG_HEIGHT = 480
IMG_WIDTH = 640

# Memuat model yang sudah dilatih
model = load_model('cnn/best_model_cnn_minyak_goreng_BAGUS.keras')

# Fungsi prediksi untuk gambar baru
def predict_image(frame):
    img_array = image.img_to_array(frame)
    
    # Menambahkan dimensi batch dan normalisasi gambar
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    
    # Melakukan prediksi
    prediction = model.predict(img_array)
    
    # Mendefinisikan nama kelas sesuai dengan label pelatihan
    class_names = ['Curah', 'Kemasan', 'Oplosan']
    
    # Mengambil kelas dengan probabilitas tertinggi
    predicted_class = class_names[np.argmax(prediction)]
    
    return predicted_class
