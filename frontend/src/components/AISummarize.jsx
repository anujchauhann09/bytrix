import { useState } from 'react';
import { UploadNavbar } from './UploadNavbar';
import { UploadBox } from './UploadBox';
import { Brain, Copy, RotateCcw } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export function AISummarize() {
  const { isDark, toggleTheme } = useTheme();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState(null);

  const parseSummaryToParagraphs = (summaryText) => {
    const paragraphs = summaryText
      .split(/\n\n+/)
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0);
    
    return paragraphs;
  };

  const summaryToPlainText = (summaryText) => {
    return summaryText
      .replace(/\n\n+/g, '\n\n') 
      .trim();
  };

  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setSummary(null);
    setIsProcessing(true);

    try {
      const response = await api.summarizeFile(file);
      
      if (response && response.data && response.data.summary) {
        const summaryText = response.data.summary;
        const paragraphs = parseSummaryToParagraphs(summaryText);
        
        const wordCount = summaryText.split(/\s+/).filter(word => word.length > 0).length;
        
        setSummary({
          paragraphs: paragraphs,
          originalText: summaryText,
          fileName: file.name,
          fileSize: file.size,
          wordCount: wordCount
        });
        
        toast.success('Document summarized successfully!');
      } else {
        throw new Error('No summary data received from server');
      }
    } catch (error) {
      console.error('Summarization error:', error);
      toast.error(error.message || 'Failed to summarize document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setSummary(null);
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
        currentPage="ai" 
        onThemeToggle={toggleTheme} 
        isDark={isDark} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <h1 className="text-3xl">AI Document Summarizer</h1>
            </div>
            <p className="text-muted-foreground">
              Upload your PDF and get an intelligent summary with key points and insights.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <UploadBox
                onFileUpload={handleFileUpload}
                isProcessing={isProcessing}
                acceptedTypes=".pdf,.docx,.doc,.txt,.rtf"
              />
            </div>

            {summary && (
              <div className="bg-card border rounded-lg overflow-hidden">
                <div className="bg-muted/50 px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg flex items-center space-x-2">
                      <Brain className="w-5 h-5 text-primary" />
                      <span>AI Summary</span>
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{summary.wordCount.toLocaleString()} words</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Summary Paragraphs */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Summary</h4>
                      <button
                        onClick={() => copyToClipboard(summary.originalText)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Copy summary"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      {summary.paragraphs.map((paragraph, index) => (
                        <div key={index} className="bg-muted/30 rounded-lg p-4">
                          <p className="text-muted-foreground leading-relaxed text-sm">
                            {paragraph}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <button
                      onClick={() => copyToClipboard(summary.originalText)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Full Summary</span>
                    </button>
                    
                    <button
                      onClick={resetUpload}
                      className="flex items-center justify-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Summarize Another Document</span>
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