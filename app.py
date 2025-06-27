from flask import Flask, request, send_from_directory, jsonify
from werkzeug.utils import secure_filename
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Config from environment variables
ALLOWED_IPS = os.environ.get('ALLOWED_IPS', '127.0.0.1').split(',')


UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create upload folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# check file extension
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_client_ip():
    x_forwarded_for = request.headers.get('X-Forwarded-For')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.remote_addr

# IP Whitelisting
@app.before_request
def limit_remote_addr():
    client_ip = get_client_ip()
    if client_ip not in ALLOWED_IPS:
        return "Access denied: IP not allowed.", 403

# Gallery route - list all uploaded images
@app.route('/gallery', methods=['GET'])
def get_gallery():
    try:
        files = []
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            if allowed_file(filename):
                files.append({
                    'filename': filename,
                    'url': f'/uploads/{filename}',
                    'size': os.path.getsize(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                })
        return jsonify({'images': files})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Upload route
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return jsonify({
            'success': True,
            'message': 'File uploaded successfully',
            'filename': filename,
            'url': f'/uploads/{filename}'
        }), 200
    return jsonify({'error': 'Invalid file type'}), 400

# Delete route
@app.route('/delete/<filename>', methods=['DELETE'])
def delete_file(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(filename))
    if os.path.exists(filepath):
        os.remove(filepath)
        return jsonify({'success': True, 'message': 'File deleted successfully'}), 200
    return jsonify({'error': 'File not found'}), 404

# Serve uploaded images
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Serve home page
@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    app.run()