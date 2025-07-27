import { useState } from 'react';
import { UploadNavbar } from './UploadNavbar';
import { UploadBox } from './UploadBox';
import { Download, FileText, FileSpreadsheet, Presentation } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export function Convert() {
  const { isDark, toggleTheme } = useTheme();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedFile, setConvertedFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);

  const getConversionOptions = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    const conversions = {
      'docx': [
        { value: 'pdf', label: 'PDF Document', icon: FileText },
        { value: 'odt', label: 'OpenDocument Text', icon: FileText },
        { value: 'txt', label: 'Plain Text', icon: FileText },
        { value: 'html', label: 'HTML Document', icon: FileText }
      ],
      'odt': [
        { value: 'docx', label: 'Word Document', icon: FileText },
        { value: 'pdf', label: 'PDF Document', icon: FileText }
      ],
      'pptx': [
        { value: 'pdf', label: 'PDF Document', icon: FileText },
        { value: 'odp', label: 'OpenDocument Presentation', icon: Presentation }
      ],
      'xlsx': [
        { value: 'pdf', label: 'PDF Document', icon: FileText },
        { value: 'csv', label: 'CSV File', icon: FileSpreadsheet },
        { value: 'ods', label: 'OpenDocument Spreadsheet', icon: FileSpreadsheet }
      ],
      'ods': [
        { value: 'pdf', label: 'PDF Document', icon: FileText },
        { value: 'xlsx', label: 'Excel Spreadsheet', icon: FileSpreadsheet }
      ],
      'rtf': [
        { value: 'pdf', label: 'PDF Document', icon: FileText },
        { value: 'odt', label: 'OpenDocument Text', icon: FileText }
      ],
      'txt': [
        { value: 'pdf', label: 'PDF Document', icon: FileText },
        { value: 'odt', label: 'OpenDocument Text', icon: FileText }
      ],
      'csv': [
        { value: 'ods', label: 'OpenDocument Spreadsheet', icon: FileSpreadsheet },
        { value: 'xlsx', label: 'Excel Spreadsheet', icon: FileSpreadsheet },
        { value: 'pdf', label: 'PDF Document', icon: FileText }
      ],
      'pdf': [
        { value: 'docx', label: 'Word Document', icon: FileText }
      ]
    };

    return conversions[extension] || [];
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    setSelectedFormat('');
    setConvertedFile(null);
    setDownloadUrl(null);
  };

  const handleConvert = async () => {
    if (!selectedFormat) {
      toast.error('Please select an output format');
      return;
    }

    if (!uploadedFile) {
      toast.error('Please upload a file first');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await api.convertFile(uploadedFile, selectedFormat);
      
      if (response && response.data && response.data.download_url) {
        const baseName = uploadedFile.name.replace(/\.[^.]+$/, '');
        setConvertedFile({
          name: `${baseName}.${selectedFormat}`,
          format: selectedFormat.toUpperCase(),
          originalFormat: uploadedFile.name.split('.').pop()?.toUpperCase()
        });
        setDownloadUrl(response.data.download_url);
        toast.success('File converted successfully!');
      } else {
        throw new Error('No download URL received from server');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error(error.message || 'Conversion failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = convertedFile.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started!');
    } else {
      toast.error('Download URL not available');
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setSelectedFormat('');
    setConvertedFile(null);
    setDownloadUrl(null);
    setIsProcessing(false);
  };

  const conversionOptions = uploadedFile ? getConversionOptions(uploadedFile.name) : [];

  return (
    <div className="min-h-screen bg-background">
      <UploadNavbar 
        currentPage="convert" 
        onThemeToggle={toggleTheme} 
        isDark={isDark} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl mb-4">File Conversion</h1>
            <p className="text-muted-foreground">
              Convert between different file formats. Upload your file and choose the output format.
            </p>
          </div>

          <div className="space-y-6">
            <UploadBox
              onFileUpload={handleFileUpload}
              isProcessing={isProcessing}
              success={convertedFile !== null}
              acceptedTypes=".docx,.odt,.pptx,.xlsx,.ods,.rtf,.txt,.csv,.pdf"
            />

            {uploadedFile && conversionOptions.length > 0 && !convertedFile && (
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg mb-4">Choose Output Format</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {conversionOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedFormat(option.value)}
                      className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                        selectedFormat === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      <option.icon className="w-6 h-6 text-primary" />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>



                <button
                  onClick={handleConvert}
                  disabled={!selectedFormat || isProcessing}
                  className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? 'Converting...' : 'Start Conversion'}
                </button>
              </div>
            )}

            {uploadedFile && conversionOptions.length === 0 && (
              <div className="bg-card border rounded-lg p-6 text-center">
                <p className="text-muted-foreground">
                  File format not supported for conversion. Please upload a different file.
                </p>
              </div>
            )}

            {convertedFile && (
              <div className="bg-card border rounded-lg p-6">
                <h3 className="text-lg mb-4">Conversion Complete!</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium">{convertedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Converted from {convertedFile.originalFormat} to {convertedFile.format}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleDownload}
                      className="flex-1 flex items-center justify-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Converted File</span>
                    </button>
                    
                    <button
                      onClick={resetUpload}
                      className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      Convert Another File
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