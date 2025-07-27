import { Header } from '@/components/Header.jsx';
import { Hero } from '@/components/Hero.jsx';
import { Section } from '@/components/Section.jsx';
import { FeatureCard } from '@/components/FeatureCard.jsx';
import { Footer } from '@/components/Footer.jsx';
import Link from 'next/link';
import { 
  FileText, 
  Image, 
  Volume2, 
  Video, 
  FileSpreadsheet, 
  FilePen,
  Presentation,
  Brain,
  Cpu
} from 'lucide-react';

export default function App() {
  const compressFeatures = [
    { icon: FileText, title: 'Compress PDF', description: 'Reduce PDF file size while maintaining quality' },
    { icon: Image, title: 'Compress Image', description: 'Optimize images for web and storage' },
    { icon: Volume2, title: 'Compress Audio', description: 'Compress audio files without losing quality' },
    { icon: Video, title: 'Compress Video', description: 'Reduce video file size efficiently' },
  ];

  const convertFeatures = [
    { icon: FileText, title: 'Convert to PDF', description: 'Convert documents to PDF format' },
    { icon: FilePen, title: 'Convert to DOCX', description: 'Convert files to Word documents' },
    { icon: FileSpreadsheet, title: 'Convert to XLSX', description: 'Convert data to Excel spreadsheets' },
    { icon: Presentation, title: 'Convert to ODT', description: 'Convert content to OpenDocument format' },
    // { icon: FileSpreadsheet, title: 'Convert to CSV', description: 'Export data to comma-separated values' },
    // { icon: Cpu, title: 'Batch Convert', description: 'Process multiple files at once' },
  ];

  const aiFeatures = [
    { icon: Brain, title: 'AI Summarizer', description: 'Get intelligent summaries of your documents' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        
        <Section title="Compress">
          {compressFeatures.map((feature, index) => (
            <Link key={index} href="/compress" className="block">
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                onClick={() => {}}
              />
            </Link>
          ))}
        </Section>

        <div className="bg-muted/30">
          <Section title="Convert">
            {convertFeatures.map((feature, index) => (
              <Link key={index} href="/convert" className="block">
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  onClick={() => {}}
                />
              </Link>
            ))}
          </Section>
        </div>

        <Section title="AI">
          <div className="col-span-1 md:col-span-2 lg:col-span-4 max-w-sm mx-auto">
            {aiFeatures.map((feature, index) => (
              <Link key={index} href="/ai/summarize" className="block">
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  onClick={() => {}}
                />
              </Link>
            ))}
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
