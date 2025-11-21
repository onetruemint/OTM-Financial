'use client';

import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Upload, X, Loader2, Check } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspectRatio?: 'square' | 'video' | 'wide';
}

export interface ImageUploadRef {
  confirmPending: () => Promise<{ success: boolean; url?: string; error?: string }>;
  hasPending: () => boolean;
}

const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(({
  value,
  onChange,
  folder = 'otm-financial',
  label = 'Image',
  aspectRatio = 'wide',
}, ref) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[2/1]',
  };

  const uploadFile = async (file: File): Promise<{ success: boolean; url?: string; error?: string }> => {
    setError('');
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.url);
      clearPending();
      return { success: true, url: data.url };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const clearPending = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPendingFile(null);
    setPreviewUrl('');
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    confirmPending: async () => {
      if (pendingFile) {
        return await uploadFile(pendingFile);
      }
      return { success: true, url: value };
    },
    hasPending: () => !!pendingFile,
  }));

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview
    const url = URL.createObjectURL(file);
    setPendingFile(file);
    setPreviewUrl(url);
    setError('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    // Only handle if it's a file drag
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Allowed: JPEG, PNG, GIF, WebP');
      return;
    }

    // Create local preview
    const url = URL.createObjectURL(file);
    setPendingFile(file);
    setPreviewUrl(url);
    setError('');
  };

  const handleConfirm = async () => {
    if (pendingFile) {
      await uploadFile(pendingFile);
    }
  };

  const handleCancel = () => {
    clearPending();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  // Show pending preview (not yet uploaded)
  if (previewUrl && pendingFile) {
    return (
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          {label}
        </label>

        <div className={`relative ${aspectClasses[aspectRatio]} w-full max-w-md rounded-lg overflow-hidden bg-mint`}>
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover"
          />

          {isUploading ? (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 size={32} className="text-white animate-spin" />
            </div>
          ) : (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-sm mb-2 truncate">{pendingFile.name}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex items-center gap-1 px-3 py-1.5 bg-dark-green hover:bg-green text-black text-sm font-medium rounded-lg transition-colors"
                >
                  <Check size={16} />
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-dark-red mt-2">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-black mb-1">
        {label}
      </label>

      {value ? (
        <div className={`relative ${aspectClasses[aspectRatio]} w-full max-w-md rounded-lg overflow-hidden bg-mint`}>
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`${aspectClasses[aspectRatio]} w-full max-w-md rounded-lg border-2 border-dashed ${
            isDragging
              ? 'border-dark-blue bg-blue/50'
              : 'border-dark-blue/30 hover:border-dark-blue/50 bg-mint'
          } flex flex-col items-center justify-center cursor-pointer transition-colors`}
        >
          {isUploading ? (
            <>
              <Loader2 size={32} className="text-dark-blue/50 animate-spin mb-2" />
              <p className="text-sm text-black/50">Uploading...</p>
            </>
          ) : (
            <>
              <Upload size={32} className="text-dark-blue/50 mb-2" />
              <p className="text-sm text-black/50">
                {isDragging ? 'Drop image here' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-xs text-black/30 mt-1">JPEG, PNG, GIF, WebP (max 5MB)</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-dark-red mt-2">{error}</p>
      )}

      {/* Fallback URL input */}
      <div className="mt-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL"
          className="w-full max-w-md px-3 py-1.5 text-sm rounded-lg bg-white border border-dark-blue/30 focus:border-dark-blue focus:outline-none text-black"
        />
      </div>
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;
