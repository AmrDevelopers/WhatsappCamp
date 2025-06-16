import React, { useState, useRef } from 'react';
import { Upload, X, Image, Video, FileText, Loader } from 'lucide-react';
import { uploadAPI } from '../services/api';

interface MediaUploadProps {
  onUpload: (url: string, type: string) => void;
  currentMedia?: { url: string; type: string };
  accept?: string;
  maxSize?: number; // in MB
}

const MediaUpload: React.FC<MediaUploadProps> = ({ 
  onUpload, 
  currentMedia, 
  accept = "image/*,video/*,.pdf,.doc,.docx",
  maxSize = 10 
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadAPI.uploadSingle(formData);
      onUpload(response.data.url, response.data.type);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeMedia = () => {
    onUpload('', '');
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="w-6 h-6" />;
      case 'video': return <Video className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-4">
      {currentMedia?.url ? (
        <div className="relative">
          {currentMedia.type === 'image' ? (
            <div className="relative">
              <img
                src={`http://localhost:3001${currentMedia.url}`}
                alt="Uploaded media"
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
              <button
                onClick={removeMedia}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : currentMedia.type === 'video' ? (
            <div className="relative">
              <video
                src={`http://localhost:3001${currentMedia.url}`}
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
                controls
              />
              <button
                onClick={removeMedia}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-300">
              <div className="flex items-center space-x-3">
                {getMediaIcon(currentMedia.type)}
                <span className="text-sm font-medium text-gray-700">Document attached</span>
              </div>
              <button
                onClick={removeMedia}
                className="p-1 text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver 
              ? 'border-emerald-500 bg-emerald-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader className="w-8 h-8 text-emerald-600 animate-spin mb-2" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop a file here, or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500">
                Supports images, videos, and documents up to {maxSize}MB
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default MediaUpload;