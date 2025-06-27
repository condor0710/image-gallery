# Image Gallery Web App

A Flask web application for uploading, managing, and displaying images with a clean, responsive interface.

## Features

### Core Functionality
- Upload single or multiple images (max 10MB per file)
- Delete images with confirmation
- View all uploaded images in a gallery
- IP-based access control for security

### User Interface
- Clean, modern design with gradient background
- Responsive layout that works on all devices
- Drag and drop file upload
- File preview before upload
- Toast notifications for user feedback
- Loading states and progress indicators

### Technical Features
- Multiple file upload support
- Real-time upload progress tracking
- Automatic gallery refresh
- File size display and validation (10MB limit)
- Error handling and validation
- Secure filename handling

## Installation

### Requirements
- Python 3.7+
- Flask
- python-dotenv

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd image-gallery
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create environment file**
   Create a `.env` file in the project root:
   ```bash
   touch .env
   ```

4. **Configure allowed IPs**
   Add your IP addresses to the `.env` file:
   ```env
   # Security Settings - Add your IP addresses here
   ALLOWED_IPS=127.0.0.1,192.168.1.100,your.public.ip.here
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

## Usage

### Uploading Images
- Click "Choose Files" to select one or more images
- Drag and drop images onto the upload area
- Review selected files in the preview area
- Click "Upload Images" or wait for auto-upload when files are dropped
- Monitor upload progress in real-time
- Files larger than 10MB will be automatically rejected

### Managing Images
- View all uploaded images in the responsive gallery grid
- Click "Delete Image" to remove any image
- Gallery automatically updates after uploads and deletions

### Access Control
The app is restricted to specific IP addresses configured in your `.env` file. Only IPs listed in `ALLOWED_IPS` can access the application.

## Configuration

### Environment Variables (.env file)

Create a `.env` file in your project root with the following variables:

```env
# Security Settings - IMPORTANT: Keep your IP addresses private
ALLOWED_IPS=127.0.0.1,your.ip.address.here,another.ip.here
```

**Important Notes:**
- Separate multiple IP addresses with commas (no spaces)
- Include `127.0.0.1` for local access
- Add your public IP address for external access
- The `.env` file is automatically ignored by git for security


### Supported File Types
Modify `ALLOWED_EXTENSIONS` in `app.py`:
```python
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
```

### Upload Directory
Update `UPLOAD_FOLDER` in `app.py`:
```python
UPLOAD_FOLDER = 'uploads'
```

### File Size Limit
Current limit: 10MB per file (client-side validation)

## API Endpoints

- `GET /` - Main application page
- `GET /gallery` - List all uploaded images
- `POST /upload` - Upload image file
- `DELETE /delete/<filename>` - Delete specific image
- `GET /uploads/<filename>` - Serve uploaded image

## Security Notes

- Development server only - not for production use
- IP whitelisting provides basic access control
- File type validation prevents malicious uploads
- Secure filename handling prevents path traversal
- Environment variables kept in `.env` file (not committed to git)
- 10MB file size limit prevents oversized uploads

## Troubleshooting

### Access Denied Error
If you get "Access denied: IP not allowed":
1. Check your `.env` file exists
2. Verify your IP address is in `ALLOWED_IPS`
3. Restart the application after changing `.env`

### Upload Errors
- Ensure file is under 10MB
- Check file type is supported (png, jpg, jpeg, gif, webp)
- Verify `uploads/` directory exists and is writable

---

Built with Flask, HTML5, CSS3, and JavaScript
