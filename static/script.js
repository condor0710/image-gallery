// Notification system
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Show file preview
function showFilePreview(files) {
    const filePreview = document.getElementById('filePreview');
    
    if (!files || files.length === 0) {
        filePreview.classList.remove('show');
        return;
    }
    
    const fileList = Array.from(files).map(file => `
        <div class="file-item">
            <span class="file-icon">📷</span>
            <span>${file.name}</span>
            <span>(${formatFileSize(file.size)})</span>
        </div>
    `).join('');
    
    filePreview.innerHTML = `
        <h4>Selected Files (${files.length}):</h4>
        <div class="file-list">
            ${fileList}
        </div>
    `;
    
    filePreview.classList.add('show');
}

// Upload function
async function upload() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;

    if (!files || files.length === 0) {
        showNotification('Please select at least one file to upload.', 'error');
        return;
    }

    // Hide file preview during upload
    document.getElementById('filePreview').classList.remove('show');

    // Show loading state
    const uploadBtn = document.querySelector('.upload-btn');
    const originalText = uploadBtn.textContent;
    uploadBtn.textContent = `Uploading ${files.length} file${files.length > 1 ? 's' : ''}...`;
    uploadBtn.disabled = true;

    let successCount = 0;
    let errorCount = 0;
    const totalFiles = files.length;

    try {
        // Upload files one by one
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Update button text to show progress
            uploadBtn.textContent = `Uploading ${i + 1}/${totalFiles}...`;

            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    successCount++;
                } else {
                    errorCount++;
                    console.error(`Failed to upload ${file.name}:`, result.error);
                }
            } catch (error) {
                errorCount++;
                console.error(`Error uploading ${file.name}:`, error);
            }
        }

        // Show final results
        if (successCount === totalFiles) {
            showNotification(`All ${totalFiles} image${totalFiles > 1 ? 's' : ''} uploaded successfully!`, 'success');
        } else if (successCount > 0) {
            showNotification(`${successCount} of ${totalFiles} images uploaded successfully. ${errorCount} failed.`, 'info');
        } else {
            showNotification(`Failed to upload any images. Please try again.`, 'error');
        }

        // Clear file input and refresh gallery
        fileInput.value = '';
        await loadGallery();

    } catch (error) {
        console.error('Upload error:', error);
        showNotification('Upload failed. Please check your connection and try again.', 'error');
    } finally {
        // Reset button state
        uploadBtn.textContent = originalText;
        uploadBtn.disabled = false;
    }
}

// Delete image function
async function deleteImage(filename) {
    if (!confirm('Are you sure you want to delete this image?')) {
        return;
    }

    try {
        const response = await fetch('/delete/' + filename, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showNotification('Image deleted successfully!', 'success');
            await loadGallery(); // Refresh gallery
        } else {
            showNotification(result.error || 'Delete failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showNotification('Delete failed. Please check your connection and try again.', 'error');
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Load gallery function
async function loadGallery() {
    const gallery = document.getElementById('gallery');
    
    try {
        // Show loading state
        gallery.innerHTML = '<div class="loading">Loading images...</div>';

        const response = await fetch('/gallery');
        const result = await response.json();

        if (response.ok) {
            const images = result.images || [];
            
            if (images.length === 0) {
                gallery.innerHTML = `
                    <div class="empty-gallery">
                        <h3>No images yet</h3>
                        <p>Upload your first image to get started!</p>
                    </div>
                `;
            } else {
                gallery.innerHTML = images.map(image => `
                    <div class="gallery-item">
                        <img src="${image.url}" alt="${image.filename}" loading="lazy">
                        <div class="gallery-item-info">
                            <div class="gallery-item-title">${image.filename}</div>
                            <div class="gallery-item-size">${formatFileSize(image.size)}</div>
                            <button class="delete-btn" onclick="deleteImage('${image.filename}')">
                                Delete Image
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        } else {
            gallery.innerHTML = `
                <div class="empty-gallery">
                    <h3>Error loading images</h3>
                    <p>${result.error || 'Please try refreshing the page.'}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Gallery loading error:', error);
        gallery.innerHTML = `
            <div class="empty-gallery">
                <h3>Connection Error</h3>
                <p>Unable to load images. Please check your connection and try again.</p>
            </div>
        `;
    }
}

// Initialize app when page loads
window.onload = function() {
    loadGallery();
    
    // Add drag and drop functionality
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.querySelector('.upload-area');
    
    // Add file selection listener
    fileInput.addEventListener('change', function() {
        showFilePreview(this.files);
    });
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    uploadArea.addEventListener('drop', handleDrop, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight(e) {
        uploadArea.style.border = '2px dashed #667eea';
        uploadArea.style.background = '#f0f4ff';
    }
    
    function unhighlight(e) {
        uploadArea.style.border = '';
        uploadArea.style.background = '';
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            fileInput.files = files;
            showFilePreview(files);
            
            // Show preview of selected files
            const fileNames = Array.from(files).map(f => f.name).join(', ');
            showNotification(`${files.length} file${files.length > 1 ? 's' : ''} selected: ${fileNames}`, 'info');
            
            // Auto-upload when files are dropped
            setTimeout(() => upload(), 1000);
        }
    }
};
