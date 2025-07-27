import { useState } from 'react';
import { UploadNavbar } from './UploadNavbar';
import { UploadBox } from './UploadBox';
import { Download, FileText, Image, Volume2, Video } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export function Compress() {
  const { isDark, toggleTheme } = useTheme();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFile, setProcessedFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const getFileTypeIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['pdf'].includes(extension)) return FileText;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension)) return Image;
    if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(extension)) return Volume2;
    if (['mp4', 'avi', 'mkv', 'mov', 'wmv'].includes(extension)) return Video;
    
    return FileText;
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setProcessedFile(null);
    setDownloadUrl(null);
  };

  const handleCompress = async () => {
    if (!uploadedFile) {
      toast.error('Please upload a file first');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await api.compressFile(uploadedFile);
      
      if (response && response.data) {
        const { 
          download_url, 
          original_filename, 
          compressed_filename, 
          original_size, 
          compressed_size, 
          compression_ratio 
        } = response.data;

        const reducedPercentage = Math.round(((original_size - compressed_size) / original_size) * 100);
        
        setProcessedFile({
          name: compressed_filename,
          originalSize: original_size,
          compressedSize: compressed_size,
          reducedPercentage: reducedPercentage
        });
        setDownloadUrl(download_url);
        toast.success('File compressed successfully!');
      } else {
        throw new Error('No compression data received from server');
      }
    } catch (error) {
      console.error('Compression error:', error);
      toast.error(error.message || 'Compression failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) {
      toast.error('Download URL not available');
      return;
    }

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = processedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Download started!');
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setProcessedFile(null);
    setDownloadUrl(null);
    setIsProcessing(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background">
      <UploadNavbar 
        currentPage="compress" 
        onThemeToggle={toggleTheme} 
        isDark={isDark} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl mb-4">File Compression</h1>
            <p className="text-muted-foreground">
              Reduce file size while maintaining quality. Supports PDF, images, audio, and video files.
            </p>
          </div>

          <div className="space-y-6">
            <UploadBox
              onFileUpload={handleFileUpload}
              isProcessing={isProcessing}
              acceptedTypes=".pdf,.jpg,.jpeg,.png,.gif,.webp,.bmp,.mp3,.wav,.flac,.aac,.ogg,.mp4,.avi,.mkv,.mov,.wmv"
            />

            {uploadedFile && !processedFile && (
              <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const IconComponent = getFileTypeIcon(uploadedFile.name);
                      return <IconComponent className="w-8 h-8 text-primary" />;
                    })()}
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(uploadedFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCompress}
                    disabled={isProcessing}
                    className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Compressing...</span>
                      </>
                    ) : (
                      <>
                        <span>Compress File</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {processedFile && (
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg mb-4">Compression Complete!</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {(() => {
                        const IconComponent = getFileTypeIcon(processedFile.name);
                        return <IconComponent className="w-8 h-8 text-primary" />;
                      })()}
                      <div>
                        <p className="font-medium">{processedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(processedFile.compressedSize)} 
                          <span className="ml-2 text-green-600">
                            ({processedFile.reducedPercentage}% smaller)
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">Original Size</p>
                      <p className="font-medium">{formatFileSize(processedFile.originalSize)}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <p className="text-muted-foreground">Compressed Size</p>
                      <p className="font-medium">{formatFileSize(processedFile.compressedSize)}</p>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleDownload}
                      className="flex-1 flex items-center justify-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Compressed File</span>
                    </button>
                    
                    <button
                      onClick={resetUpload}
                      className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      Upload New File
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}