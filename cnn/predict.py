import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model

# Ukuran gambar sesuai dengan yang digunakan dalam pelatihan
IMG_HEIGHT = 480
IMG_WIDTH = 640

# Memuat model yang sudah dilatih
model = load_model('cnn/best_model_cnn_minyak_goreng.keras')

# Fungsi prediksi untuk gambar baru
def predict_image(framePath):
    frame = image.load_img(framePath, target_size=(IMG_HEIGHT, IMG_WIDTH))
    img_array = image.img_to_array(frame)
    
    # Menambahkan dimensi batch dan normalisasi gambar
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    
    # Melakukan prediksi
    prediction = model.predict(img_array)[0]
    
    # Mendefinisikan nama kelas sesuai dengan label pelatihan
    class_names = ['Curah', 'Kemasan', 'Oplosan']
    
    # Mengambil kelas dengan probabilitas tertinggi
    predicted_index = np.argmax(prediction)
    predicted_percent = prediction[predicted_index]
    predicted_class = class_names[predicted_index]

    return predicted_class, int(predicted_percent*100)
