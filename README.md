# Image Gallery Web App

A Flask web application for uploading, managing, and displaying images with a clean, responsive interface.

## Features

### Core Functionality
- Upload single or multiple images
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
- File size display
- Error handling and validation
- Secure filename handling

## Installation

### Requirements
- Python 3.7+
- Flask


## Usage

### Uploading Images
- Click "Choose Files" to select one or more images
- Drag and drop images onto the upload area
- Review selected files in the preview area
- Click "Upload Images" or wait for auto-upload when files are dropped
- Monitor upload progress in real-time

### Managing Images
- View all uploaded images in the responsive gallery grid
- Click "Delete Image" to remove any image
- Gallery automatically updates after uploads and deletions

### Access Control
The app is restricted to specific IP addresses configured in your `.env` file.

## API Endpoints

- `GET /` - Main application page
- `GET /gallery` - List all uploaded images
- `POST /upload` - Upload image file
- `DELETE /delete/<filename>` - Delete specific image
- `GET /uploads/<filename>` - Serve uploaded image

## Configuration

### IP Whitelist
Modify `ALLOWED_IPS` in `app.py`:
```

### Supported File Types
Change `ALLOWED_EXTENSIONS` in `app.py`:
```

### Upload Directory
Update `UPLOAD_FOLDER` in `app.py`:
```

## Security Notes

- Development server only - not for production use
- IP whitelisting provides basic access control
- File type validation prevents malicious uploads
- Secure filename handling prevents path traversal

---

Built with Flask, HTML5, CSS3, and JavaScript
