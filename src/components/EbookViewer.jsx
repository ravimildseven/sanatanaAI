import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, ExternalLink } from 'lucide-react';
import { stories } from '../data/stories';

export default function EbookViewer() {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [viewMode, setViewMode] = React.useState('ebook');

  const sacredTexts = [
    {
      title: 'साधना संग्रह',
      subtitle: '॥ श्री गणेशाय नमः ॥',
      content: [
        {
          sanskrit: 'यद्वाचो निःसृतं शास्त्रं यद्वाचः श्रुतिसम्मतम्।\nतद्वाचो गुरुमूलं हि तस्मै श्रीगुरवे नमः॥',
          english: 'The scriptures that emerge from speech, the knowledge that is in harmony with the Vedas - their root lies in the words of the Guru. I bow to that revered Guru.'
        }
      ]
    },
    {
      title: 'Chapter One',
      subtitle: 'अथ प्रथमोऽध्यायः',
      content: [
        {
          sanskrit: 'गुरुब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः।\nगुरुः साक्षात् परब्रह्म तस्मै श्रीगुरवे नमः॥',
          english: 'Guru is Brahma, Guru is Vishnu, Guru is Lord Maheshwara. Guru is verily the Supreme Brahman. Salutations to that Guru.'
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            setViewMode('ebook');
            setCurrentPage(0);
          }}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            viewMode === 'ebook' ? 'bg-orange-100 text-orange-700' : 'bg-white text-gray-600'
          }`}
        >
          <BookOpen size={20} />
          <span>Sacred Texts</span>
        </button>
        <button
          onClick={() => {
            setViewMode('stories');
            setCurrentPage(0);
          }}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            viewMode === 'stories' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600'
          }`}
        >
          <BookOpen size={20} />
          <span>Krishna's Stories</span>
        </button>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 ring-1 ring-gray-900/5 shadow-lg">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl p-8 shadow-inner min-h-[70vh] relative"
        >
          {viewMode === 'ebook' ? (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 text-gray-900">{sacredTexts[currentPage].title}</h1>
                <div className="text-2xl mb-4 text-gray-700">{sacredTexts[currentPage].subtitle}</div>
                <div className="h-px w-24 mx-auto bg-orange-200 mb-8"></div>
              </div>

              <div className="prose prose-lg prose-orange mx-auto">
                {sacredTexts[currentPage].content.map((section, idx) => (
                  <div key={idx} className="mb-8">
                    <div className="text-xl font-sanskrit leading-relaxed mb-4 text-gray-800">
                      {section.sanskrit.split('\n').map((line, i) => (
                        <div key={i} className="mb-2">{line}</div>
                      ))}
                    </div>
                    <div className="text-lg text-gray-600 italic">
                      {section.english}
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="p-2 rounded-full bg-orange-100 text-orange-700 disabled:opacity-50"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(sacredTexts.length - 1, currentPage + 1))}
                  disabled={currentPage === sacredTexts.length - 1}
                  className="p-2 rounded-full bg-orange-100 text-orange-700 disabled:opacity-50"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto text-center">
              <div className="mb-12">
                <h1 className="text-4xl font-bold mb-4 text-gray-900">Krishna's Stories</h1>
                <p className="text-xl text-gray-600">Discover the divine tales of Lord Krishna</p>
              </div>

              <div className="space-y-8">
                <a
                  href="https://g.co/gemini/share/192e180867ff"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
                      <h2 className="text-2xl font-semibold text-gray-900">Read Krishna's Story</h2>
                    </div>
                    <ExternalLink className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-gray-600 text-left">
                    Experience the divine story of Lord Krishna, beautifully crafted with AI assistance.
                    Click to read in Google Gemini's immersive story format.
                  </p>
                </a>

                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">About this Story</h3>
                  <p className="text-gray-600">
                    This story is presented in Google Gemini's native format to preserve its original styling and interactive elements.
                    Click the card above to read the full story in a new tab.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
