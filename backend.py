from flask import Flask, request, jsonify
from PIL import Image
import base64
from flask_cors import CORS
from flask_cors import cross_origin
import io
from io import BytesIO
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input

app = Flask(__name__)
CORS(app)
# Load your trained model
model = load_model('xray_model13.h5')

# Define the allowed file extensions
ALLOWED_EXTENSIONS = {'jpeg', 'jpg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
    print("before json check")
    if 'file' not in request.files:
        print("file not found")
        return jsonify({'error': 'No file in the request'})

    print("file check success")
    # base64_image = request.json['base64']
    # print("check 1")
    # # base64_image = base64_image.split(',')[1]
    
    # #img_bytes = BytesIO(base64.b64decode(base64_image))
    # print("check 2")
    # image_data = base64.decodebytes(bytes(base64_image, "utf-8"))
    # print("check 3")
    # print(image_data)
    file = request.files['file']
    image=Image.open(file)
    print("check1")
    # image = Image.open(io.BytesIO(image_data))

    # print(image)
        # Assuming your model expects a certain input shape, adjust it accordingly  
    image = image.resize((224, 224))
    print("check2")
    img_array = np.array(image)
    print("check3")
    if len(img_array.shape) == 2:
        img_array = np.stack((img_array,) * 3, axis=-1)
    print("check3")
    img_array = img_array / 255.0
    print(img_array)
    image_array = np.expand_dims(img_array, axis=0)
    print("check 7")
    print(img_array)
    prediction = model.predict(image_array)
    print("predicted")
    print(prediction[0][0])

    # Assuming binary classification
    if prediction[0][0] > 0.5:
        return("Highly likely to be Pneumonia infected.")
    else:
        return("Healthy lungs.")
    # result = {'prediction' : 'PNEUMONIA' if prediction[0][0] > 0.5 else 'NORMAL'}
    
    # print(result)
    # return jsonify({'data': result})

if __name__ == '__main__':
    app.run(debug=True)
