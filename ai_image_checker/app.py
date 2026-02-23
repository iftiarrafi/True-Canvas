from flask import Flask, request, jsonify
import torch
from torchvision import transforms
from PIL import Image
import io
import torch.nn as nn
from torchvision.models import vit_b_16

app = Flask(__name__)


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def load_model(model_path):
    
    model = vit_b_16(weights=None)  
    
   
    for param in model.parameters():
        param.requires_grad = False
        
    
    for param in model.encoder.layers[-6:].parameters():
        param.requires_grad = True
    
    
    model.heads.head = nn.Identity()
    
    
    enhanced_classifier = nn.Sequential(
        nn.Linear(768, 512),  
        nn.SELU(),
        nn.Dropout(0.7),
        nn.Linear(512, 256),
        nn.SELU(),
        nn.Dropout(0.7),
        nn.Linear(256, 2)  
    )
    
    
    model.heads.head = enhanced_classifier
    
    
    model.load_state_dict(torch.load(model_path, map_location=device))
    model = model.to(device)
    model.eval()
    
    return model

MODEL_PATH = "./fine_tuned_vit_20k.pth"  
model = load_model(MODEL_PATH)


test_transforms = transforms.Compose([
    transforms.Resize((224, 224)), 
    transforms.ToTensor(),  
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])  
])

@app.route('/check_image', methods=['POST'])
def check_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        
        image = Image.open(io.BytesIO(file.read()))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        image_tensor = test_transforms(image).unsqueeze(0).to(device)
        
        
        with torch.no_grad():
            outputs = model(image_tensor)
            _, preds = torch.max(outputs, 1)
        
        
        is_real = bool(preds.item())
        
        return jsonify({
            "is_real": is_real,
            "is_ai_generated": not is_real,
            "message": "AI-generated image detected" if not is_real else "Image appears to be real"
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
